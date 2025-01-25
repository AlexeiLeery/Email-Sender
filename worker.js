// 处理请求的主函数
export default {
    async fetch(request, env) {
        try {
            const url = new URL(request.url);
            
            // 静态文件服务
            if (request.method === 'GET' && !url.pathname.startsWith('/api/')) {
                return await handleStaticFile(url.pathname);
            }

            // API 路由
            if (url.pathname.startsWith('/api/')) {
                // 登录接口不需要验证
                if (url.pathname === '/api/login') {
                    return await handleLogin(request, env);
                }

                // 验证其他 API 请求
                const isAuthenticated = await authenticate(request, env);
                if (!isAuthenticated) {
                    return new Response('Unauthorized', { status: 401 });
                }

                switch (url.pathname) {
                    case '/api/domains':
                        return await handleGetDomains(env);
                    case '/api/send':
                        return await handleSendEmail(request, env);
                    default:
                        return new Response('Not Found', { status: 404 });
                }
            }

            return new Response('Not Found', { status: 404 });
        } catch (error) {
            return new Response('Internal Server Error', { status: 500 });
        }
    }
};

// 处理静态文件
async function handleStaticFile(pathname) {
    const files = {
        '/': 'index.html',
        '/index.html': 'index.html',
        '/style.css': 'style.css',
        '/script.js': 'script.js'
    };

    const filename = files[pathname] || pathname;
    const contentTypes = {
        '.html': 'text/html',
        '.css': 'text/css',
        '.js': 'application/javascript'
    };

    const ext = filename.substring(filename.lastIndexOf('.'));
    const contentType = contentTypes[ext] || 'text/plain';

    try {
        const response = await fetch(`https://raw.githubusercontent.com/your-repo/${filename}`);
        const content = await response.text();
        return new Response(content, {
            headers: { 'Content-Type': contentType }
        });
    } catch {
        return new Response('Not Found', { status: 404 });
    }
}

// 处理登录请求
async function handleLogin(request, env) {
    const { username, password } = await request.json();
    const storedUsername = await env.KV.get('username');
    const storedPassword = await env.KV.get('password');

    if (username === storedUsername && password === storedPassword) {
        const token = generateToken();
        await env.KV.put(`token:${token}`, 'valid', { expirationTtl: 3600 });
        return new Response(JSON.stringify({ token }), {
            headers: { 'Content-Type': 'application/json' }
        });
    }

    return new Response('Invalid credentials', { status: 401 });
}

// 获取域名列表
async function handleGetDomains(env) {
    const domains = [];
    let cursor = null;
    do {
        const list = await env.KV.list({ prefix: 'domain_', cursor });
        for (const key of list.keys) {
            if (key.name.startsWith('domain_')) {
                const domain = await env.KV.get(key.name);
                domains.push(domain);
            }
        }
        cursor = list.cursor;
    } while (cursor);

    return new Response(JSON.stringify(domains), {
        headers: { 'Content-Type': 'application/json' }
    });
}

// 处理发送邮件
async function handleSendEmail(request, env) {
    const { from, to, subject, content } = await request.json();
    const domain = from.split('@')[1];
    
    // 获取对应的 Resend API key
    const domainNumber = await getDomainNumber(domain, env);
    if (!domainNumber) {
        return new Response('Domain not found', { status: 400 });
    }
    
    const apiKey = await env.KV.get(`resend_api_${domainNumber}`);
    if (!apiKey) {
        return new Response('API key not found', { status: 400 });
    }

    try {
        const response = await fetch('https://api.resend.com/emails', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                from,
                to,
                subject,
                html: convertMarkdownToHtml(content)
            })
        });

        if (!response.ok) {
            throw new Error('Failed to send email');
        }

        return new Response('Email sent successfully', { status: 200 });
    } catch (error) {
        return new Response('Failed to send email', { status: 500 });
    }
}

// 验证请求
async function authenticate(request, env) {
    const authHeader = request.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return false;
    }

    const token = authHeader.substring(7);
    const isValid = await env.KV.get(`token:${token}`);
    return !!isValid;
}

// 获取域名对应的编号
async function getDomainNumber(domain, env) {
    let cursor = null;
    do {
        const list = await env.KV.list({ prefix: 'domain_', cursor });
        for (const key of list.keys) {
            const value = await env.KV.get(key.name);
            if (value === domain) {
                return key.name.split('_')[1];
            }
        }
        cursor = list.cursor;
    } while (cursor);
    return null;
}

// 生成随机 token
function generateToken() {
    return Array.from(crypto.getRandomValues(new Uint8Array(32)))
        .map(b => b.toString(16).padStart(2, '0'))
        .join('');
}

// 将 Markdown 转换为 HTML
function convertMarkdownToHtml(markdown) {
    // 这里可以使用 marked 或其他 Markdown 解析库
    // 为了简单起见，这里返回原始内容
    return markdown;
} 