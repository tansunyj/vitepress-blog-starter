# 📝 配置指南

本项目已集成所有常用的SEO和分析工具，开箱即用。部署前只需替换相关ID即可。

---

## 🔧 必须配置的项目

### 1. 网站域名
**文件**: `docs/.vitepress/config.mts`

```typescript
export default defineConfig({
  title: '杰哥的技术小站',  // ← 修改为你的网站名称
  description: '...',        // ← 修改为你的网站描述
  // ...
})
```

---

### 2. Google Analytics (GA4)
**文件**: `docs/.vitepress/config.mts` 第28-33行

```typescript
// Google Analytics (GA4) - 替换为你的测量ID
['script', { async: '', src: 'https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX' }],
['script', {}, `
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-XXXXXXXXXX');  // ← 替换为你的GA4测量ID
`],
```

**如何获取GA4测量ID**:
1. 访问 https://analytics.google.com/
2. 创建账号 → 创建媒体资源 → 创建数据流
3. 复制"衡量ID"（格式：G-XXXXXXXXXX）

---

### 3. Google AdSense
**文件**: `docs/.vitepress/config.mts` 第35-39行

```typescript
// Google AdSense - 替换为你的发布商ID
['script', {
  async: '',
  src: 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-XXXXXXXXXXXXXXXX',
  //                                                                          ↑ 替换为你的发布商ID
  crossorigin: 'anonymous',
}],
```

**文件**: `docs/public/ads.txt`

```txt
google.com, pub-XXXXXXXXXXXXXXXX, DIRECT, f08c47fec0942fa0
             ↑ 替换为你的发布商ID
```

**如何获取AdSense发布商ID**:
1. 访问 https://www.google.com/adsense/
2. 注册账号 → 添加网站
3. 获取代码中的 `ca-pub-XXXXXXXXXXXXXXXX`

---

### 4. Google Search Console验证
**文件**: `docs/.vitepress/config.mts` 第41行

```typescript
// Google Search Console验证 - 替换为你的验证码
['meta', { name: 'google-site-verification', content: 'your-verification-code-here' }],
                                                       ↑ 替换为你的验证码
```

**验证方法1（推荐）- HTML标记验证**:
1. 访问 https://search.google.com/search-console
2. 添加资源 → 选择"网址前缀"
3. 选择"HTML标记"验证方式
4. 复制 `content` 值到config.mts

**验证方法2 - HTML文件验证**:
1. Search Console会给你一个HTML文件（如 `google123456.html`）
2. 下载该文件，放到 `docs/public/` 目录下
3. 部署后访问 `https://yourdomain.com/google123456.html` 验证

---

### 5. robots.txt和sitemap
**文件**: `docs/public/robots.txt` 第6行

```txt
Sitemap: https://yourdomain.com/sitemap.xml
          ↑ 替换为你的域名
```

**sitemap自动生成**（可选）:
```bash
npm install -D vitepress-plugin-sitemap
```

然后在 `docs/.vitepress/config.mts` 添加:
```typescript
import { withSitemap } from 'vitepress-plugin-sitemap'

export default withSitemap(defineConfig({
  // ...
}), {
  hostname: 'https://yourdomain.com'  // ← 你的域名
})
```

---

### 6. 百度站长验证（可选）
**文件**: `docs/.vitepress/config.mts` 第44行

取消注释并替换验证码:
```typescript
['meta', { name: 'baidu-site-verification', content: 'code-xxxxx' }],
                                                      ↑ 替换为百度验证码
```

**如何获取**:
1. 访问 https://ziyuan.baidu.com/
2. 添加网站 → 选择"HTML标签验证"
3. 复制 `content` 值

---

## 🎨 可选配置

### 1. 网站图标
**文件**: `docs/public/images/favicon.png`

替换为你自己的图标（建议尺寸：180x180px）

---

### 2. Banner图片
**文件**: `docs/public/images/banner.png`

替换为你自己的横幅图片（建议尺寸：1440x500px）

**修改Banner文字**:
```typescript
// 文件: docs/.vitepress/config.mts 第72行
blog: {
  title: '欢迎来到杰哥的技术小站',  // ← 修改Banner标题
  description: '',
  banner: '/images/banner.png',
},
```

---

### 3. 页脚信息
**文件**: `docs/.vitepress/config.mts` 第50-53行

```typescript
footer: {
  message: '杰哥的技术小站',      // ← 修改页脚文字
  copyright: 'Copyright © 2025 杰哥',  // ← 修改版权信息
},
```

---

### 4. 社交媒体链接
**文件**: `docs/.vitepress/config.mts` 第20-21行

```typescript
['meta', { name: 'twitter:site', content: '@jiegejishu' }],  // ← 修改Twitter账号
```

---

## ✅ 部署清单

部署前确保已完成:

- [ ] 替换所有 `G-XXXXXXXXXX` 为真实的GA4测量ID
- [ ] 替换所有 `ca-pub-XXXXXXXXXXXXXXXX` 为真实的AdSense ID
- [ ] 替换 `your-verification-code-here` 为真实的验证码
- [ ] 修改 `docs/public/robots.txt` 中的域名
- [ ] 修改 `docs/public/ads.txt` 中的发布商ID
- [ ] 替换网站图标和Banner图片
- [ ] 修改网站名称、描述、页脚信息
- [ ] 修改Banner标题文字

---

## 📚 其他说明

### 文章编写
直接在 `docs/posts/` 目录下创建分类文件夹和Markdown文件即可。

示例结构:
```
docs/posts/
├── vpn-proxy/
│   ├── free-nodes/
│   │   └── 2024-11-18-免费节点.md
│   └── tutorial/
│       └── seo-guide.md
└── ai/
    └── tools/
        └── chatgpt.md
```

### Markdown前置数据
每篇文章顶部需要包含:
```yaml
---
title: 文章标题
date: 2024-11-18
tags: [标签1, 标签2]
author: 作者名
cover: 封面图片URL
---
```

---

## 🚀 部署

1. 构建:
```bash
npm run build
```

2. 预览:
```bash
npm run preview
```

3. 部署到GitHub Pages/Netlify/Vercel等平台

---

## 📞 支持

如有问题，请查看项目README.md或提交Issue。
