# Email-Sender
基于Cloudflare Workers和Resend API（发送邮件）的无限域名邮箱
## 注册Resend
点击前往[官网](https://resend.com/，因为过于简单所以略去注册过程
## 添加域名解析记录
点击Domain，然后点击Add Domain，依次将解析记录添加到Cloudflare中

![image](https://github.com/user-attachments/assets/c4cda7b4-fe36-47f1-bfc3-cae49a25ff34)
![image](https://github.com/user-attachments/assets/70675c4a-148e-41a8-8209-69209d9f70ea)
## 创建Cloudflare Workers项目
将本项目的workers.js中的代码复制粘贴到workers项目中
## 创建KV空间
KV空间命名**email-sender**
## 绑定KV空间
绑定的KV空间也命名为**email-sender**
## 添加环境变量
| 环境变量名称             | 值 |
|----------------------|----|
| BACKGROUND_IMAGE     |背景图片URL|
| DOMAIN_1             |自定义发信域名后缀1|
| FAVICON_URL          |浏览器标签页图片URL|
| PASSWORD             |访问页面密码|
| RESEND_API_1         |Resend API 1（对应DOMAIN_1）|
| SYSTEM_TITLE         |优先系统标题|
| TEXT_COLOR           |除标题外文本字体颜色，如：#222222|
| TEXT_SHADOW_COLOR    |除标题外文本字体阴影颜色，如：rgba(180, 180, 180, 0.25)|
| TITLE_COLOR          |标题文本字体颜色，如：#222222|
| TITLE_SHADOW_COLOR   |标题文本字体阴影颜色，如：rgba(180, 180, 180, 0.25)|
| USERNAME             |访问页面用户名|
## 绑定自定义域
通过自定义域访问自建的Email-Sender系统
