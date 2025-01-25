// 1. 首先定义 HTML 模板
const HTML = `
<!DOCTYPE html>
<html lang="zh">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>SYSTEM_TITLE</title>
    FAVICON_PLACEHOLDER
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/easymde/dist/easymde.min.css">
    <script src="https://cdn.jsdelivr.net/npm/easymde/dist/easymde.min.js"></script>
    <style>
        :root {
            --bg-image: BACKGROUND_IMAGE_PLACEHOLDER;
            --title-color: TITLE_COLOR;
            --title-shadow-color: TITLE_SHADOW_COLOR;
        }
        
        body {
            margin: 0;
            padding: 20px;
            min-height: 100vh;
            background: var(--bg-image) no-repeat center center fixed;
            background-size: cover;
            font-family: 'Arial', sans-serif;
        }
        
        /* 只在明确没有背景图片时才应用渐变效果 */
        body.no-bg {
            background: linear-gradient(-45deg,
                #FF416C, #FF4B2B, #4ECDC4, #556270,
                #FF851B, #7928CA, #FF0080, #FFD700
            );
            background-size: 400% 400%;
            animation: gradientBG 20s ease infinite;
        }
        
        @keyframes gradientBG {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
        }
        
        .container {
            max-width: 800px;
            margin: 0 auto;
            background: rgba(255, 255, 255, 0.1);  // 改为微量白色透明背景
            padding: 30px;
            border-radius: 15px;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
            backdrop-filter: blur(10px);
            border: 1px solid rgba(255, 255, 255, 0.2);
        }
        
        h1 {
            text-align: center;
            color: var(--title-color);
            margin-bottom: 30px;
            font-size: 2.5em;
            font-weight: bold;
            text-shadow: 2px 2px 4px var(--title-shadow-color);
            background: linear-gradient(to right, var(--title-color), #ffd700);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            padding: 10px 0;
        }
        
        .form-group {
            margin-bottom: 20px;        /* 表单组之间的间距 */
            max-width: 100%;            /* 限制最大宽度 */
            opacity: 0.95;              /* 略微降低不透明度 */
        }
        
        label {
            display: block;
            margin-bottom: 6px;
            color: var(--text-color);
            font-size: 14px;
            text-shadow: 0 1px 2px var(--text-shadow-color);
        }
        
        input[type="email"], 
        input[type="text"],
        select,
        .preview-container,
        .CodeMirror {
            width: 100%;
            padding: 12px 15px;
            height: 45px;
            font-size: 16px;
            background: rgba(255, 255, 255, 0.1) !important;
            backdrop-filter: blur(8px);
            border: 1px solid rgba(255, 255, 255, 0.2);
            border-radius: 8px;
            color: var(--text-color);
            transition: all 0.3s ease;
            box-sizing: border-box;
        }
        
        /* 统一所有输入框的样式 */
        #to, #subject, #fromPrefix, #domainSelect {
            background: rgba(255, 255, 255, 0.08) !important;  // 降低透明度
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);        // 柔和的阴影
            backdrop-filter: blur(10px);
        }
        
        /* 输入框悬停效果 */
        input:hover, select:hover {
            background: rgba(255, 255, 255, 0.12) !important;
            border-color: rgba(255, 255, 255, 0.3);
        }
        
        /* 输入框聚焦效果 */
        input:focus, select:focus {
            background: rgba(255, 255, 255, 0.15) !important;
            border-color: rgba(255, 255, 255, 0.4);
            outline: none;
            box-shadow: 0 0 15px rgba(255, 255, 255, 0.1);
        }
        
        .domain-input {
            display: flex;
            gap: 15px;                  // 增加间距
            align-items: center;
        }
        
        .domain-input input {
            flex: 2;                    // 发件人前缀占更多空间
        }
        
        .domain-input select {
            flex: 1;                    // 域名选择器占较少空间
            min-width: 150px;           // 最小宽度
            height: 50px;               // 与输入框同高
            padding: 0 20px;            // 调整内边距
        }
        
        #subject {
            width: 100%;
            height: 50px;               // 与其他输入框同高
            margin-bottom: 10px;
        }
        
        button {
            width: 100%;
            padding: 15px;
            background: linear-gradient(45deg, rgba(255, 255, 255, 0.2), rgba(255, 255, 255, 0.1));
            border: 2px solid rgba(255, 255, 255, 0.2);
            border-radius: 8px;
            color: white;
            font-size: 18px;
            cursor: pointer;
            transition: all 0.3s ease;
            backdrop-filter: blur(8px);
        }
        
        button:hover {
            transform: translateY(-2px);
            background: linear-gradient(45deg, rgba(255, 255, 255, 0.3), rgba(255, 255, 255, 0.2));
            box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
        }
        
        .success-message {
            position: fixed;
            top: 20px;
            left: 50%;
            transform: translateX(-50%);
            background: #4CAF50;
            color: white;
            padding: 15px 30px;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
            display: none;
            z-index: 1000;
        }
        
        .editor-container {
            display: flex;
            gap: 20px;
            margin-top: 20px;
            min-height: 300px;
            position: relative;  /* 添加相对定位 */
            overflow: hidden;    /* 防止溢出 */
        }
        
        .editor-wrapper {
            flex: 1;
            display: flex;
            flex-direction: column;
            min-width: 0;        /* 防止flex子项溢出 */
            width: calc(50% - 10px); /* 固定宽度为容器的一半减去gap的一半 */
        }
        
        .preview-container {
            flex: 1;
            width: calc(50% - 10px); /* 固定宽度为容器的一半减去gap的一半 */
            min-width: 0;        /* 防止flex子项溢出 */
            padding: 20px;
            background: rgba(255, 255, 255, 0.08);
            backdrop-filter: blur(10px);
            border: 1px solid rgba(255, 255, 255, 0.2);
            border-radius: 8px;
            overflow-y: auto;
            min-height: 300px;
            height: 500px;
            color: var(--text-color);
            resize: none;        /* 禁用单独的resize */
        }
        
        /* 预览内容样式 */
        .preview-container h1,
        .preview-container h2,
        .preview-container h3 {
            color: var(--text-color);
            margin-top: 1em;
            margin-bottom: 0.5em;
        }
        
        .preview-container p {
            margin: 1em 0;
            line-height: 1.6;
        }
        
        .preview-container code {
            background: rgba(255, 255, 255, 0.1);
            padding: 2px 4px;
            border-radius: 4px;
        }
        
        .CodeMirror {
            flex: 1;
            border-radius: 8px;
            min-height: 300px !important;
            height: 500px !important;
            background: rgba(255, 255, 255, 0.08) !important;
            backdrop-filter: blur(10px);
            border: 1px solid rgba(255, 255, 255, 0.2);
            color: var(--text-color) !important;
            resize: vertical;    /* 只允许垂直方向调整大小 */
            overflow-y: auto;
            width: 100% !important; /* 确保宽度填满父容器 */
        }
        
        .preview-container::-webkit-resizer,
        .CodeMirror::-webkit-resizer {
            background-color: rgba(255, 255, 255, 0.1);
            border-radius: 0 0 8px 0;
        }
        
        ::placeholder {
            color: var(--text-color);
            opacity: 0.5;
            font-size: 14px;
        }
    </style>
</head>
<body>
    <script>
        // 检查是否有背景图片
        const hasBackgroundImage = getComputedStyle(document.documentElement)
            .getPropertyValue('--bg-image')
            .includes('url');
            
        // 只有在确实没有背景图片时才添加 no-bg 类
        if (!hasBackgroundImage) {
            document.body.classList.add('no-bg');
        }
    </script>
    <div class="container">
        <h1>SYSTEM_TITLE</h1>
        <div class="success-message" id="successMessage">发送成功！</div>
        
        <form id="emailForm">
            <div class="form-group">
                <label>收件人邮箱</label>
                <input type="email" id="to" required>
            </div>
            
            <div class="form-group">
                <label>发件人名称</label>
                <div class="domain-input">
                    <input type="text" id="fromPrefix" placeholder="输入发件人前缀">
                    <select id="domainSelect"></select>
                </div>
            </div>
            
            <div class="form-group">
                <label>邮件主题</label>
                <input type="text" id="subject" required>
            </div>
            
            <div class="form-group">
                <label>邮件内容</label>
                <div class="editor-container">
                    <div class="editor-wrapper">
                        <textarea id="editor"></textarea>
                    </div>
                    <div class="preview-container"></div>
                </div>
            </div>
            
            <button type="submit">发送邮件</button>
        </form>
    </div>
    
    <script>
        // 初始化编辑器
        const easyMDE = new EasyMDE({
            element: document.getElementById('editor'),
            autofocus: true,
            spellChecker: false,
            status: false,
            toolbar: false,  // 禁用工具栏
            autoDownloadFontAwesome: false,
            previewRender: function(plainText) {
                return this.parent.markdown(plainText);
            }
        });
        
        // 获取预览容器
        const previewContainer = document.querySelector('.preview-container');
        
        // 设置实时预览
        easyMDE.codemirror.on('change', () => {
            const content = easyMDE.value();
            previewContainer.innerHTML = easyMDE.markdown(content);
        });

        // 初始预览
        window.addEventListener('load', () => {
            updatePreview();
            loadDomains();
        });
        
        // 确保编辑器和预览区域高度同步
        const observer = new ResizeObserver(entries => {
            for (let entry of entries) {
                if (entry.target.classList.contains('CodeMirror')) {
                    previewContainer.style.height = entry.contentRect.height + 'px';
                }
            }
        });
        
        // 开始观察编辑器高度变化
        window.addEventListener('load', () => {
            const codeMirror = document.querySelector('.CodeMirror');
            if (codeMirror) {
                observer.observe(codeMirror);
            }
        });

        async function loadDomains() {
            const response = await fetch('/api/domains');
            const domains = await response.json();
            const select = document.getElementById('domainSelect');
            domains.forEach(domain => {
                const option = document.createElement('option');
                option.value = domain;
                option.textContent = domain;
                select.appendChild(option);
            });
        }

        document.getElementById('emailForm').addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const data = {
                to: document.getElementById('to').value,
                from: document.getElementById('fromPrefix').value + '@' + document.getElementById('domainSelect').value,
                subject: document.getElementById('subject').value,
                html: easyMDE.markdown(easyMDE.value())
            };
            
            try {
                const response = await fetch('/api/send', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(data)
                });
                
                if (response.ok) {
                    const successMessage = document.getElementById('successMessage');
                    successMessage.style.display = 'block';
                    setTimeout(() => {
                        successMessage.style.display = 'none';
                    }, 1000);
                } else {
                    alert('发送失败：' + (await response.text()));
                }
            } catch (error) {
                alert('发送失败：' + error.message);
            }
        });

        loadDomains();
    </script>
</body>
</html>`;

// 2. 处理请求的函数
async function handleRequest(request, env) {
    const url = new URL(request.url);
    
    // 基本认证
    const auth = request.headers.get('Authorization');
    if (!auth) {
        return new Response('Unauthorized', {
            status: 401,
            headers: {
                'WWW-Authenticate': 'Basic realm="Secure Area"'
            }
        });
    }
    
    const [username, password] = atob(auth.split(' ')[1]).split(':');
    if (username !== env.USERNAME || password !== env.PASSWORD) {
        return new Response('Unauthorized', { status: 401 });
    }
    
    // 1. 获取所有域名和API配置
    function getDomainConfigs(env) {
        const configs = [];
        let index = 1;
        
        while (true) {
            const domain = env[`DOMAIN_${index}`];
            const api = env[`RESEND_API_${index}`];
            
            if (!domain || !api) break;
            
            configs.push({
                domain: domain,
                api: api
            });
            
            index++;
        }
        
        return configs;
    }

    // 2. 处理域名API请求
    if (url.pathname === '/api/domains') {
        const configs = getDomainConfigs(env);
        const domains = configs.map(config => config.domain);
        return new Response(JSON.stringify(domains), {
            headers: {
                'Content-Type': 'application/json',
                'Cache-Control': 'no-cache'
            }
        });
    }

    // 3. 处理发送邮件请求
    if (url.pathname === '/api/send' && request.method === 'POST') {
        try {
            const data = await request.json();
            const domain = data.from.split('@')[1];
            
            // 查找对应的API key
            const configs = getDomainConfigs(env);
            const config = configs.find(c => c.domain === domain);
            
            if (!config) {
                return new Response('Domain not configured', { status: 400 });
            }

            const response = await fetch('https://api.resend.com/emails', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${config.api}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    from: data.from,
                    to: data.to,
                    subject: data.subject,
                    html: data.html
                })
            });

            if (!response.ok) {
                const error = await response.text();
                return new Response(`Failed to send email: ${error}`, { 
                    status: response.status 
                });
            }

            return new Response('Email sent successfully');
        } catch (error) {
            return new Response(`Error: ${error.message}`, { status: 500 });
        }
    }

    // 4. 替换变量
    let processedHTML = HTML;
    
    // 替换系统标题
    processedHTML = processedHTML.replaceAll(
        'SYSTEM_TITLE',
        env.SYSTEM_TITLE || '邮件发送系统'
    );
    
    // 替换标题颜色
    processedHTML = processedHTML.replaceAll(
        'TITLE_COLOR',
        env.TITLE_COLOR || '#FFD700'
    );
    
    // 替换标题阴影颜色
    processedHTML = processedHTML.replaceAll(
        'TITLE_SHADOW_COLOR',
        env.TITLE_SHADOW_COLOR || 'rgba(0, 0, 0, 0.3)'
    );
    
    // 替换 favicon
    if (env.FAVICON_URL) {
        processedHTML = processedHTML.replace(
            'FAVICON_PLACEHOLDER',
            `<link rel="icon" href="${env.FAVICON_URL}">`
        );
    } else {
        processedHTML = processedHTML.replace('FAVICON_PLACEHOLDER', '');
    }
    
    // 替换背景图片
    if (env.BACKGROUND_IMAGE) {
        processedHTML = processedHTML.replace(
            '--bg-image: BACKGROUND_IMAGE_PLACEHOLDER',
            `--bg-image: url('${env.BACKGROUND_IMAGE}')`
        );
    } else {
        // 当没有背景图片时，添加 no-bg 类到 body
        processedHTML = processedHTML.replace(
            '<body>',
            '<body class="no-bg">'
        );
        processedHTML = processedHTML.replace(
            '--bg-image: BACKGROUND_IMAGE_PLACEHOLDER',
            '--bg-image: none'
        );
    }
    
    // 5. 返回处理后的 HTML
    return new Response(processedHTML, {
        headers: { 'Content-Type': 'text/html' }
    });
}

// 6. 导出处理函数
export default {
    async fetch(request, env, ctx) {
        return handleRequest(request, env);
    }
}; 
