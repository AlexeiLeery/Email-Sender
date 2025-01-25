let editor;
let isPreviewMode = false;

// 初始化编辑器
document.addEventListener('DOMContentLoaded', () => {
    editor = new EasyMDE({
        element: document.getElementById('emailContent'),
        spellChecker: false,
        autofocus: true,
        placeholder: '在此输入邮件内容...',
        toolbar: [
            'bold', 'italic', 'heading', '|',
            'quote', 'code', 'unordered-list', 'ordered-list', '|',
            'link', 'image', '|',
            'preview', 'side-by-side', 'fullscreen'
        ]
    });
});

// 登录功能
async function login() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    try {
        const response = await fetch('/api/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, password })
        });

        if (response.ok) {
            document.getElementById('loginForm').classList.add('hidden');
            document.getElementById('emailForm').classList.remove('hidden');
            loadDomains();
        } else {
            alert('用户名或密码错误！');
        }
    } catch (error) {
        alert('登录失败，请重试！');
    }
}

// 加载域名列表
async function loadDomains() {
    try {
        const response = await fetch('/api/domains');
        const domains = await response.json();
        const select = document.getElementById('domainSelect');
        select.innerHTML = domains.map(domain => 
            `<option value="${domain}">${domain}</option>`
        ).join('');
    } catch (error) {
        alert('加载域名列表失败！');
    }
}

// 切换预览模式
function togglePreview() {
    const previewContainer = document.getElementById('previewContainer');
    isPreviewMode = !isPreviewMode;
    
    if (isPreviewMode) {
        const content = editor.markdown(editor.value());
        document.getElementById('previewContent').innerHTML = content;
        previewContainer.classList.remove('hidden');
    } else {
        previewContainer.classList.add('hidden');
    }
}

// 发送邮件
async function sendEmail() {
    const prefix = document.getElementById('emailPrefix').value;
    const domain = document.getElementById('domainSelect').value;
    const subject = document.getElementById('subject').value;
    const to = document.getElementById('to').value;
    const content = editor.value();

    if (!prefix || !domain || !subject || !to || !content) {
        alert('请填写所有必填字段！');
        return;
    }

    try {
        const response = await fetch('/api/send', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                from: `${prefix}@${domain}`,
                to,
                subject,
                content
            })
        });

        if (response.ok) {
            showSuccess();
            clearForm();
        } else {
            alert('发送失败，请重试！');
        }
    } catch (error) {
        alert('发送失败，请重试！');
    }
}

// 显示成功消息
function showSuccess() {
    const message = document.getElementById('successMessage');
    message.classList.remove('hidden');
    setTimeout(() => {
        message.classList.add('hidden');
    }, 1000);
}

// 清空表单
function clearForm() {
    document.getElementById('emailPrefix').value = '';
    document.getElementById('subject').value = '';
    document.getElementById('to').value = '';
    editor.value('');
} 