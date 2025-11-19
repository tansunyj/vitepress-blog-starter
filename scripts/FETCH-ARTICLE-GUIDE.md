# 文章爬取工具使用指南

## 📖 功能介绍

这是一个命令行工具，可以从微信公众号、个人博客等网站爬取文章内容，并自动转换为Markdown格式，保存到指定的文章分类目录中。

### ✨ 主要功能

- ✅ **自动爬取** - 输入URL即可爬取文章内容
- ✅ **HTML转Markdown** - 自动将HTML转换为规范的Markdown格式
- ✅ **图片下载** - 自动下载文章中的所有图片到本地
- ✅ **Frontmatter生成** - 自动生成符合博客规范的文章头部信息
- ✅ **分类管理** - 支持选择或自定义文章分类
- ✅ **标签系统** - 支持添加多个标签
- ✅ **交互式界面** - 友好的命令行交互体验

---

## 🚀 快速开始

### 1. 确保依赖已安装

```bash
pnpm install
```

### 2. 运行爬取工具

```bash
pnpm fetch
```

### 3. 按照提示操作

工具会依次询问：
1. **文章URL** - 输入要爬取的文章链接
2. **文章分类** - 选择1-9或输入自定义分类
3. **文章标签** - 输入标签，用逗号分隔

---

## 📝 使用示例

### 示例1：爬取微信公众号文章

```bash
# 1. 运行命令
pnpm fetch

# 2. 输入URL
📌 请输入文章URL: https://mp.weixin.qq.com/s/xxxxxxxx

# 3. 等待爬取（会显示进度）
🔍 开始爬取文章...
📡 正在获取页面内容...
📝 正在解析文章内容...
  标题: 如何使用AI提升工作效率
  作者: 杰哥
  日期: 2025-11-17
🖼️  正在处理图片...
  ✓ 图片下载成功: image-1.jpg
  ✓ 图片下载成功: image-2.jpg
📄 正在转换为Markdown...

# 4. 选择分类
📂 请选择文章分类:
  1. blog/tutorials (教程)
  2. blog/freebies (白嫖指南)
  3. blog/recommendations (推荐)
  ...
请选择 (1-9): 1

# 5. 输入标签
🏷️  请输入文章标签 (用逗号分隔): AI,教程,工作效率

# 6. 完成！
✅ 文章爬取成功！
📄 文件名: 如何使用AI提升工作效率-1700000000.md
📂 保存路径: f:\...\docs\posts\blog\tutorials\如何使用AI提升工作效率-1700000000.md
🖼️  下载图片: 2 张
📝 字数统计: 5000 字符
```

### 示例2：爬取普通网页文章

```bash
pnpm fetch

# 输入任何包含文章内容的网页URL
📌 请输入文章URL: https://example.com/article/12345

# 后续步骤相同...
```

---

## 📂 分类说明

### 预设分类列表

| 编号 | 分类路径 | 说明 | 适用场景 |
|------|---------|------|---------|
| 1 | `blog/tutorials` | 教程 | 技术教程、操作指南 |
| 2 | `blog/freebies` | 白嫖指南 | 免费资源、薅羊毛 |
| 3 | `blog/recommendations` | 推荐 | 产品推荐、工具分享 |
| 4 | `vpn-proxy/tutorial` | VPN教程 | 科学上网教程 |
| 5 | `vpn-proxy/free-nodes` | 免费节点 | VPN节点分享 |
| 6 | `ai/tools` | AI工具 | AI工具介绍 |
| 7 | `ai/tutorial` | AI教程 | AI使用教程 |
| 8 | `resources/quark` | 夸克资料 | 网盘资源分享 |
| 9 | **自定义** | 自定义分类 | 其他分类 |

### 自定义分类

选择 `9` 后，可以输入自定义分类路径，例如：
- `blog/news` - 新闻
- `tech/review` - 技术评测
- `life/travel` - 旅行日记

---

## 🏷️ 标签使用建议

### 标签格式

- 使用**逗号**或**中文逗号**分隔
- 自动去除首尾空格
- 如果不输入，默认添加"默认"标签

### 标签示例

```
✅ 正确：AI,教程,工作效率
✅ 正确：AI, 教程, 工作效率
✅ 正确：AI，教程，工作效率
❌ 错误：AI 教程 工作效率 (没有分隔符)
```

### 常用标签推荐

**VPN相关：**
- VPN, 科学上网, 翻墙, 节点, 机场

**AI相关：**
- AI, ChatGPT, Midjourney, 提示词, 大模型

**博客相关：**
- 教程, 技巧, 推荐, 工具, 资源

**其他：**
- 效率, 开发, 设计, 运维

---

## 📁 文件保存规则

### 文件命名

格式：`标题-时间戳.md`

示例：`如何使用AI提升工作效率-1700000000.md`

### 保存位置

```
docs/posts/
└── [分类路径]/
    └── [文章文件].md

示例：
docs/posts/blog/tutorials/如何使用AI提升工作效率-1700000000.md
```

### 图片保存

```
docs/public/images/articles/
└── [文章标题]-[序号].[扩展名]

示例：
docs/public/images/articles/如何使用AI提升工作效率-1.jpg
docs/public/images/articles/如何使用AI提升工作效率-2.png
```

---

## 📄 生成的Markdown格式

### Frontmatter头部

```markdown
---
title: 文章标题
description: 文章标题（同title）
date: 2025-11-17
author: 杰哥
category: 教程
tags:
  - AI
  - 教程
  - 工作效率
---
```

### 文章内容

- 自动转换HTML为Markdown
- 保留标题层级（#、##、###）
- 保留**粗体**、*斜体*
- 保留链接 `[文字](URL)`
- 保留图片 `![描述](路径)`
- 保留代码块
- 保留列表（有序、无序）
- 保留引用块

---

## 🎯 支持的网站

### ✅ 完全支持

- **微信公众号** - `mp.weixin.qq.com`
- **知乎专栏** - `zhuanlan.zhihu.com`
- **CSDN** - `blog.csdn.net`
- **简书** - `jianshu.com`
- **掘金** - `juejin.cn`
- **个人博客** - 大部分基于Hexo、Hugo、WordPress的博客

### ⚠️ 部分支持

- 带有复杂JavaScript渲染的网站
- 需要登录才能查看的文章
- 有反爬虫机制的网站

### ❌ 不支持

- 付费墙保护的内容
- 视频网站（只支持文章类内容）
- 需要验证码的网站

---

## 🔧 手动编辑

爬取完成后，建议手动检查和编辑：

### 检查清单

- ✅ **标题格式** - 是否需要调整
- ✅ **图片显示** - 检查图片是否正常
- ✅ **内容完整** - 是否有遗漏内容
- ✅ **格式规范** - Markdown格式是否正确
- ✅ **链接有效** - 外部链接是否可访问
- ✅ **标签准确** - 标签是否合适
- ✅ **日期正确** - 发布日期是否准确

### 常见调整

1. **添加封面图**
```markdown
---
cover: /images/cover.jpg
---
```

2. **调整描述**
```markdown
---
description: 更详细的文章描述，用于SEO
---
```

3. **添加关键词**
```markdown
---
keywords:
  - AI工具
  - 效率提升
---
```

---

## ❓ 常见问题

### Q1: 爬取失败怎么办？

**可能原因：**
1. URL格式错误
2. 网络连接问题
3. 网站有反爬虫机制
4. 文章需要登录查看

**解决方案：**
- 检查URL是否完整且正确
- 尝试更换网络环境
- 尝试在浏览器中手动复制HTML
- 使用浏览器插件辅助

### Q2: 图片无法下载？

**可能原因：**
1. 图片URL失效
2. 图片需要特殊权限
3. 网络超时

**解决方案：**
- 脚本会保留原URL作为fallback
- 可以手动下载图片后替换路径
- 检查图片是否有防盗链

### Q3: 转换后的Markdown格式不对？

**解决方案：**
- 手动编辑文件调整格式
- 检查是否有特殊HTML标签
- 可以在`fetch-article.js`中自定义转换规则

### Q4: 如何修改默认作者？

编辑 `scripts/fetch-article.js` 文件：

```javascript
const CONFIG = {
  defaultAuthor: '你的名字', // 修改这里
  // ...
}
```

### Q5: 如何添加新的分类？

在运行时选择 `9 (自定义分类)`，或直接在代码中添加：

```javascript
const categoryMap = {
  // ... 现有分类
  10: 'your-new-category/subcategory',
}
```

---

## 🛠️ 高级配置

### 修改配置

编辑 `scripts/fetch-article.js` 文件顶部的 `CONFIG` 对象：

```javascript
const CONFIG = {
  // 图片保存目录
  imageDir: path.join(__dirname, '../docs/public/images/articles'),
  
  // 文章保存目录
  postsBaseDir: path.join(__dirname, '../docs/posts'),
  
  // 默认作者
  defaultAuthor: '杰哥',
  
  // User-Agent
  userAgent: 'Mozilla/5.0...',
}
```

### 自定义转换规则

在 `fetchArticle` 函数中的 `turndownService` 部分添加自定义规则：

```javascript
// 自定义规则示例
turndownService.addRule('yourRule', {
  filter: 'div', // 目标HTML标签
  replacement: (content) => {
    return content // 转换逻辑
  },
})
```

---

## 💡 使用技巧

### 技巧1：批量爬取

可以创建一个包含多个URL的文本文件，编写批处理脚本：

```javascript
// batch-fetch.js
const urls = [
  'https://example.com/article1',
  'https://example.com/article2',
  // ...
]

for (const url of urls) {
  // 调用爬取函数
}
```

### 技巧2：设置文章模板

修改 frontmatter 模板，添加更多字段：

```javascript
const frontmatter = `---
title: ${title}
description: ${title}
date: ${publishTime}
author: ${author}
category: ${category}
cover: /images/default-cover.jpg  // 默认封面
keywords:
  - 默认关键词
tags:
${tags.map(tag => `  - ${tag}`).join('\n')}
---
`
```

### 技巧3：图片CDN加速

修改图片下载逻辑，将图片上传到CDN：

```javascript
async function downloadImage(url, filename) {
  // 下载图片
  // 上传到CDN
  // 返回CDN URL
}
```

---

## 📚 相关文档

- [VitePress 官方文档](https://vitepress.dev/)
- [Markdown 语法指南](https://markdown.com.cn/)
- [项目 README.md](../README.md)
- [配置指南 CONFIGURATION.md](../CONFIGURATION.md)

---

## 🤝 反馈与建议

如果遇到问题或有改进建议，欢迎反馈！

- QQ群：[749827914](https://qm.qq.com/q/rvVkbpLGlc)
- Telegram：[杰哥的技术小站](https://t.me/jerry_tech_club)
- GitHub Issues

---

**最后更新时间**：2025-11-17
