# 杰哥的技术小站 | VitePress Blog Starter

<p align="center">
  <img src="./docs/public/images/banner.png" alt="Banner" width="800">
</p>

<p align="center">
  <strong>基于 VitePress 构建的现代化个人博客系统</strong>
</p>

<p align="center">
  专注于科学上网、AI工具、免费资源分享的技术博客 | 开箱即用 | SEO完善
</p>

<p align="center">
  <a href="https://github.com/tansunyj/vitepress-blog-starter">
    <img src="https://img.shields.io/github/stars/tansunyj/vitepress-blog-starter?style=social" alt="GitHub stars">
  </a>
  <a href="https://github.com/tansunyj/vitepress-blog-starter/blob/main/LICENSE">
    <img src="https://img.shields.io/badge/license-MIT-blue.svg" alt="License">
  </a>
  <a href="https://github.com/tansunyj/vitepress-blog-starter">
    <img src="https://img.shields.io/badge/VitePress-1.6.3-brightgreen.svg" alt="VitePress">
  </a>
</p>

---

## 🎉 为什么选择这个博客系统？

### 🚀 真正的开箱即用

- ✅ **克隆即用** - 无需复杂配置，3分钟启动博客
- ✅ **SEO预配置** - GA4、AdSense、Search Console已集成
- ✅ **关键词库** - 500+精选SEO关键词，直接导入SEMrush
- ✅ **Sitemap自动生成** - 每次构建自动更新sitemap.xml
- ✅ **完整文档** - CONFIGURATION.md详细配置指南

### 📊 SEO优化到位

- 🔍 **完整Meta标签** - title、description、keywords、og、twitter
- 🤖 **搜索引擎友好** - robots.txt、sitemap.xml
- 📈 **流量追踪** - Google Analytics (GA4)
- 💰 **广告准备** - Google AdSense预配置
- 🎯 **关键词研究** - 提供VPN、AI、资源等领域关键词库

### 🎨 现代化UI设计

- 🌟 **精美卡片** - 圆角、阴影、悬停动画
- 🎭 **Banner横幅** - 可自定义的首页大图
- 🏷️ **智能标签** - OR逻辑筛选，快速查找
- 📱 **响应式** - 完美适配PC/平板/手机
- 🎯 **易定制** - CSS变量系统，一键换主题

### ⚡ 开发体验优秀

- 🔥 **热更新** - 修改即刷新，秒速预览
- 🛠️ **TypeScript** - 类型安全，减少错误
- 📦 **pnpm** - 快速安装，节省空间
- 🧹 **自动清理** - 一键清理缓存脚本
- 📝 **Markdown** - 专注内容创作

---

## 📑 目录

- [✨ 特性](#-特性)
- [📦 技术栈](#-技术栈)
- [🚀 快速开始](#-快速开始)
- [📝 新增/修改文章](#-新增修改文章)
- [🎯 导航菜单配置](#-导航菜单配置)
- [📂 侧边栏配置](#-侧边栏配置)
- [🎨 样式主题定制](#-样式主题定制)
- [🏗️ 项目结构](#️-项目结构)
- [🛠️ 开发命令](#️-开发命令)
- [🚀 部署指南](#-部署指南)
- [💡 常见问题](#-常见问题)

---

## ✨ 特性

- 🚀 **VitePress** - 基于 Vite 的静态站点生成器，极速构建
- 🎨 **UnoCSS** - 即时按需的原子化 CSS 引擎
- 📝 **Markdown** - 完整的 Markdown 支持，包含 frontmatter
- 🔍 **SEO 优化** - 内置完整的 SEO meta 标签支持
- 🎯 **分类管理** - 自动根据文件夹路径生成分类
- 👤 **作者系统** - 支持多作者文章管理
- 📱 **响应式设计** - 完美支持移动端和平板
- 🔧 **自定义组件** - 丰富的自定义 Vue 组件
- 🎭 **Banner横幅** - 可自定义的首页横幅
- 🏷️ **标签系统** - 文章标签分类和筛选
- 📊 **SEO完善** - 支持GA4、AdSense、Search Console、sitemap
- 🤖 **爬虫友好** - robots.txt、sitemap.xml自动生成
- ⚙️ **开箱即用** - 预配置所有SEO工具，只需填入你的ID

---

## 📦 技术栈

| 技术 | 版本 | 说明 |
|------|------|------|
| **VitePress** | 1.6.3 | 静态站点生成器 |
| **Vue** | 3.5.13 | 前端框架 |
| **UnoCSS** | 65.4.3 | CSS 原子化引擎 |
| **TypeScript** | 5.7.3 | 类型支持 |
| **pnpm** | 9.15.3 | 包管理器 |
| **Vite** | 最新 | 构建工具 |

---

## 🚀 快速开始

### 📋 前置要求

确保你的环境满足以下要求：

- **Node.js**: >= 18.0.0
- **pnpm**: >= 9.0.0 (推荐使用 pnpm)
- **Git**: 用于版本控制

### 📥 安装步骤

#### 1. 克隆项目

```bash
git clone https://github.com/tansunyj/vitepress-blog-starter.git
cd vitepress-blog-starter
```

#### 2. 安装依赖

```bash
pnpm install
```

> 如果没有安装 pnpm，请先运行：`npm install -g pnpm`

#### 3. 启动开发服务器

```bash
pnpm dev
```

启动成功后，访问：`http://localhost:5173`

#### 4. 配置SEO和Google服务（推荐）

本项目已预配置所有SEO工具，**只需替换ID即可使用**！

查看 **[CONFIGURATION.md](./CONFIGURATION.md)** 获取详细配置指南：

**必须配置项：**
- 🌐 **网站域名** - 替换 `yourdomain.com` 为你的实际域名
- 📊 **Google Analytics (GA4)** - 替换测量ID `G-XXXXXXXXXX`
- 💰 **Google AdSense** - 替换发布商ID `ca-pub-XXXXXXXXXXXXXXXX`
- 🔍 **Google Search Console** - 添加你的验证码

**可选配置项：**
- 百度站长验证
- 网站图标和Banner
- 页脚信息

**SEO文件位置：**
- `docs/public/robots.txt` - 搜索引擎爬虫规则（已创建）
- `docs/public/sitemap.xml` - 网站地图（构建时自动生成）
- `docs/public/ads.txt` - AdSense验证（已创建）
- `docs/.vitepress/config.mts` - SEO meta标签配置

**SEO关键词库：**
- `seo/` 文件夹包含500+精选关键词，可直接导入SEMrush查询

---

## 📝 新增/修改文章

### 📂 文章目录结构

所有文章都存放在 `docs/posts/` 目录下，按照以下结构组织：

```
docs/posts/
├── vpn-proxy/           # 🚀 网络加速
│   ├── free-nodes/      #   ├─ 每日免费节点
│   ├── tutorial/        #   ├─ VPN教程
│   └── airport-review/  #   └─ 机场测评
├── ai/                  # 🤖 AI人工智能
│   ├── tools/           #   ├─ AI工具
│   ├── prompts/         #   ├─ 提示词库
│   ├── tutorial/        #   ├─ AI教程
│   ├── advanced/        #   ├─ 高手进阶
│   ├── llm/             #   ├─ 大模型
│   └── workflow/        #   └─ AI工作流
├── blog/                # 📚 博客
│   ├── tutorials/       #   ├─ 教程
│   ├── freebies/        #   ├─ 白嫖指南
│   └── recommendations/ #   └─ 推荐
└── resources/           # 📦 资源宝库
    ├── quark/           #   ├─ 夸克资料
    └── learning-materials/ #└─ 学习资料
```

### ✍️ 文章格式规范

每篇文章都是一个 `.md` 文件，必须包含 frontmatter 头部信息：

#### 基础模板

```markdown
---
title: 文章标题（必填，用于SEO和显示）
description: 文章描述（必填，用于SEO和卡片展示）
date: 2024-01-01（必填，文章日期，格式：YYYY-MM-DD）
author: 杰哥（必填，作者名称）
category: 教程（可选，分类标签）
tags:（可选，标签数组）
  - VPN
  - 科学上网
cover: /images/cover.jpg（可选，封面图片）
---

# 文章标题

这里开始写文章内容...
```

#### 完整 SEO 模板

如果你想要更好的 SEO 效果，使用完整模板：

```markdown
---
title: 2024年最佳免费VPN节点推荐 | 科学上网完全指南
description: 详细介绍2024年最新免费VPN节点获取方法，包括V2Ray、Shadowsocks等协议配置教程。
keywords:
  - 免费VPN
  - 科学上网
  - V2Ray节点
date: 2024-01-01
author: 杰哥
category: 教程
tags:
  - VPN
  - V2Ray
  - Shadowsocks
cover: /images/vpn-cover.jpg
canonical: https://your-domain.com/posts/vpn-proxy/tutorial/article
og:image: /images/vpn-og.jpg
twitter:card: summary_large_image
---

# 文章内容开始...
```

### 📋 Frontmatter 字段说明

| 字段 | 必填 | 说明 | 示例 |
|------|------|------|------|
| `title` | ✅ | 文章标题，用于页面标题和卡片显示 | `2024年最佳VPN推荐` |
| `description` | ✅ | 文章描述，用于SEO和卡片摘要 | `详细介绍最新免费VPN节点获取方法` |
| `date` | ✅ | 发布日期，格式：YYYY-MM-DD | `2024-01-01` |
| `author` | ✅ | 作者名称，需在 `docs/blog/authors/` 中存在 | `杰哥` |
| `category` | ❌ | 文章分类 | `教程` |
| `tags` | ❌ | 标签数组 | `['VPN', '科学上网']` |
| `cover` | ❌ | 封面图片路径 | `/images/cover.jpg` |
| `keywords` | ❌ | SEO关键词数组 | `['免费VPN', 'V2Ray']` |
| `canonical` | ❌ | 规范链接 | `https://domain.com/post` |
| `og:image` | ❌ | Open Graph 图片 | `/images/og.jpg` |
| `twitter:card` | ❌ | Twitter 卡片类型 | `summary_large_image` |

### 🎯 添加新文章的步骤

#### 步骤 1: 选择分类目录

根据文章主题，在 `docs/posts/` 下选择或创建对应的分类文件夹。

#### 步骤 2: 创建 Markdown 文件

在分类文件夹下创建 `.md` 文件，文件名建议使用英文：

```bash
# 例如：创建一篇VPN教程
docs/posts/vpn-proxy/tutorial/v2ray-setup-guide.md
```

#### 步骤 3: 添加 Frontmatter

复制上面的模板，填写文章信息：

```markdown
---
title: V2Ray 完整配置指南
description: 从零开始学习 V2Ray 的安装、配置和使用，包含详细的图文教程。
date: 2024-11-16
author: 杰哥
category: 教程
tags:
  - V2Ray
  - 科学上网
  - 教程
---
```

#### 步骤 4: 编写文章内容

在 frontmatter 后开始编写 Markdown 内容：

```markdown
# V2Ray 完整配置指南

## 什么是 V2Ray？

V2Ray 是一个...

## 安装步骤

### 1. 下载客户端

...
```

#### 步骤 5: 预览文章

保存文件后，开发服务器会自动刷新，访问对应的 URL 预览文章。

---

## 🏗️ 项目结构

```
vitepress-blog-starter/
├── docs/                          # 文档根目录
│   ├── .vitepress/                # VitePress 配置目录
│   │   ├── config.mts             # 核心配置文件（导航、SEO等）
│   │   ├── theme/                 # 主题配置
│   │   │   ├── components/        # 自定义组件
│   │   │   │   └── blog/          # 博客相关组件
│   │   │   │       ├── Post.vue           # 文章卡片
│   │   │   │       ├── Posts.vue          # 文章列表
│   │   │   │       ├── PostDetail.vue     # 文章详情
│   │   │   │       ├── CategoryPosts.vue  # 分类文章列表
│   │   │   │       └── PostAuthor.vue     # 作者信息
│   │   │   ├── composables/       # 可组合函数
│   │   │   │   ├── posts.data.ts         # 文章数据加载
│   │   │   │   ├── authors.data.ts       # 作者数据加载
│   │   │   │   ├── usePosts.ts           # 文章hooks
│   │   │   │   └── useAuthors.ts         # 作者hooks
│   │   │   ├── custom.css         # 自定义样式
│   │   │   └── index.ts           # 主题入口
│   │   ├── cache/                 # 构建缓存（自动生成）
│   │   ├── dist/                  # 构建输出（自动生成）
│   │   └── .temp/                 # 临时文件（自动生成）
│   ├── posts/                     # 文章目录 ⭐
│   │   ├── vpn-proxy/             # 网络加速分类
│   │   ├── ai/                    # AI 分类
│   │   ├── blog/                  # 博客分类
│   │   └── resources/             # 资源分类
│   ├── blog/                      # 博客系统
│   │   ├── posts/                 # 博客文章
│   │   ├── authors/               # 作者信息
│   │   └── index.md               # 博客首页
│   ├── about/                     # 关于页面
│   ├── public/                    # 静态资源
│   │   ├── images/                # 图片资源
│   │   ├── robots.txt             # 爬虫规则
│   │   ├── sitemap.xml            # 网站地图（自动生成）
│   │   └── ads.txt                # AdSense验证
│   └── index.md                   # 网站首页
├── scripts/                       # 脚本目录
│   └── generate-sitemap.js        # Sitemap自动生成脚本
├── seo/                           # SEO关键词库 ⭐
│   ├── vpn-keywords.txt           # VPN关键词（180+）
│   ├── ai-keywords.txt            # AI关键词（200+）
│   ├── blog-keywords.txt          # 博客关键词（150+）
│   ├── all-keywords.txt           # 汇总（530+）
│   ├── keyword-tracker-template.md # 数据追踪模板
│   └── README.md                  # 使用指南
├── clean.ps1                      # 缓存清理脚本
├── package.json                   # 项目配置
├── pnpm-lock.yaml                 # 依赖锁定文件
├── CONFIGURATION.md               # 配置指南（SEO、Google服务等）
├── SEO-FIELDS.md                  # SEO 字段说明文档
├── STRUCTURE.md                   # 项目结构文档
└── README.md                      # 本文件
```

---

## 🎯 导航菜单配置

导航菜单位于网站顶部，在 `docs/.vitepress/config.mts` 的 `nav()` 函数中配置。

### 📍 配置文件位置

```
docs/.vitepress/config.mts  →  nav() 函数
```

### 🔧 基本结构

```typescript
function nav() {
  return [
    {
      text: '🚀 菜单名称',               // 顶部导航显示的文字
      activeMatch: '/posts/category/',   // 激活高亮的路径匹配
      items: [                           // 下拉子菜单
        { text: '子菜单1', link: '/posts/category/sub1/' },
        { text: '子菜单2', link: '/posts/category/sub2/' },
      ],
    },
    {
      text: 'ℹ️ 单页面',                 // 无下拉的单个链接
      link: '/about/',
    },
  ]
}
```

### ✅ 添加新的导航菜单

#### 步骤 1：编辑 config.mts

打开 `docs/.vitepress/config.mts`，找到 `nav()` 函数，添加新菜单：

```typescript
function nav() {
  return [
    // ... 现有菜单

    // 添加新菜单
    {
      text: '📖 文档',                   // 菜单名称（支持emoji）
      activeMatch: '/posts/docs/',       // 路径匹配规则
      items: [
        { text: '快速开始', link: '/posts/docs/quick-start/' },
        { text: 'API参考', link: '/posts/docs/api/' },
        { text: '常见问题', link: '/posts/docs/faq/' },
      ],
    },
  ]
}
```

#### 步骤 2：创建对应文件夹

```bash
# 创建分类目录
mkdir docs/posts/docs
mkdir docs/posts/docs/quick-start
mkdir docs/posts/docs/api
mkdir docs/posts/docs/faq
```

#### 步骤 3：创建列表页

在每个子分类下创建 `index.md`：

```bash
# docs/posts/docs/quick-start/index.md
---
title: 快速开始
description: <strong>📖 新手指南</strong> | 从零开始学习使用本系统
---

<CategoryPosts />
```

### 🎨 菜单配置说明

| 字段 | 必填 | 说明 | 示例 |
|------|------|------|------|
| `text` | ✅ | 菜单显示文字 | `'🚀 网络加速'` |
| `link` | ❌ | 单页面链接（无下拉菜单时使用） | `'/about/'` |
| `items` | ❌ | 下拉子菜单数组 | `[{text,link}]` |
| `activeMatch` | ❌ | 高亮激活规则（正则） | `'/posts/vpn-proxy/'` |

### 💡 实用技巧

**1. 使用 Emoji 图标**
```typescript
text: '🚀 网络加速'  // 让菜单更生动
```

**2. activeMatch 激活规则**
```typescript
activeMatch: '/posts/ai/'  // 访问/posts/ai/*都会高亮这个菜单
```

**3. 外部链接**
```typescript
{ 
  text: 'GitHub', 
  link: 'https://github.com/your-repo',
  target: '_blank'  // 新标签打开
}
```

---

## 📂 侧边栏配置

侧边栏显示在页面左侧，在 `docs/.vitepress/config.mts` 中配置。

### 📍 配置文件位置

```
docs/.vitepress/config.mts  →  sidebar 对象 + sidebarXXX() 函数
```

### 🔧 基本结构

```typescript
// 1. 在 themeConfig 中注册侧边栏
themeConfig: {
  sidebar: {
    '/posts/vpn-proxy/': sidebarVpn(),    // VPN分类使用sidebarVpn
    '/posts/ai/': sidebarAi(),            // AI分类使用sidebarAi
    '/about/': sidebarAbout(),            // 关于页面使用sidebarAbout
  },
}

// 2. 定义侧边栏函数
function sidebarVpn() {
  return [
    {
      text: '🚀 网络加速',                 // 侧边栏分组标题
      collapsed: false,                    // 是否折叠（false=展开）
      items: [
        { text: '每日免费节点', link: '/posts/vpn-proxy/free-nodes/' },
        { text: 'VPN教程', link: '/posts/vpn-proxy/tutorial/' },
        { text: '机场测评', link: '/posts/vpn-proxy/airport-review/' },
      ],
    },
  ]
}
```

### ✅ 添加新的侧边栏

#### 步骤 1：在 sidebar 中注册

打开 `docs/.vitepress/config.mts`，找到 `sidebar` 对象：

```typescript
sidebar: {
  '/posts/vpn-proxy/': sidebarVpn(),
  '/posts/ai/': sidebarAi(),
  '/posts/blog/': sidebarBlog(),
  '/posts/resources/': sidebarResources(),
  '/about/': sidebarAbout(),

  // 添加新的侧边栏
  '/posts/docs/': sidebarDocs(),         // 新增文档侧边栏
},
```

#### 步骤 2：创建侧边栏函数

在 config.mts 文件末尾添加函数：

```typescript
function sidebarDocs() {
  return [
    {
      text: '📖 文档',
      collapsed: false,                   // false = 默认展开
      items: [
        { text: '快速开始', link: '/posts/docs/quick-start/' },
        { text: 'API参考', link: '/posts/docs/api/' },
        { text: '常见问题', link: '/posts/docs/faq/' },
      ],
    },
  ]
}
```

#### 步骤 3：添加子菜单

如果需要多级菜单：

```typescript
function sidebarDocs() {
  return [
    {
      text: '📖 基础文档',
      collapsed: false,
      items: [
        { text: '快速开始', link: '/posts/docs/quick-start/' },
        { text: '安装指南', link: '/posts/docs/installation/' },
      ],
    },
    {
      text: '📚 进阶文档',              // 第二个分组
      collapsed: true,                  // 默认折叠
      items: [
        { text: 'API参考', link: '/posts/docs/api/' },
        { text: '插件开发', link: '/posts/docs/plugins/' },
      ],
    },
  ]
}
```

### 🎨 侧边栏配置说明

| 字段 | 必填 | 说明 | 示例 |
|------|------|------|------|
| `text` | ✅ | 分组标题 | `'📖 文档'` |
| `collapsed` | ❌ | 是否折叠（默认false） | `true` / `false` |
| `items` | ✅ | 子菜单数组 | `[{text,link}]` |
| `activeMatch` | ❌ | 高亮激活规则 | `'/posts/docs/'` |

### 💡 侧边栏技巧

**1. 自动高亮当前页面**
VitePress会自动高亮当前访问的链接，无需额外配置。

**2. 多级侧边栏**
```typescript
{
  text: '分组1',
  items: [
    { text: '子菜单1', link: '/path1/' },
    { 
      text: '子菜单2（带子项）',
      items: [
        { text: '子子菜单1', link: '/path2/sub1/' },
        { text: '子子菜单2', link: '/path2/sub2/' },
      ]
    },
  ],
}
```

**3. 控制展开/折叠**
```typescript
collapsed: false  // 默认展开
collapsed: true   // 默认折叠
```

---

## 🎨 样式主题定制

所有样式配置集中在 `docs/.vitepress/theme/custom.css` 文件中。

### 📍 配置文件位置

```
docs/.vitepress/theme/custom.css  →  CSS变量定义区域
```

### 🎨 核心CSS变量

```css
:root {
  /* ===== 主题颜色 ===== */
  --vp-c-brand: #3b82f6;              /* 主题色（蓝色） */
  --vp-c-brand-light: #60a5fa;        /* 浅色主题色 */
  --vp-c-brand-dark: #2563eb;         /* 深色主题色 */

  /* ===== 布局尺寸 ===== */
  --site-max-width: 1200px;           /* 网站最大宽度 */
  --site-padding-x: 32px;             /* 左右内边距 */
  --site-padding-y: 32px;             /* 上下内边距 */

  /* ===== Banner横幅 ===== */
  --banner-height: 400px;             /* Banner高度 */
  --banner-title-size: 3rem;          /* 标题字号 */

  /* ===== 卡片样式 ===== */
  --card-radius: 12px;                /* 圆角大小 */
  --card-shadow: 0 2px 8px rgba(0,0,0,0.1);  /* 阴影 */

  /* ===== 字体系统 ===== */
  --font-family-base: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  --font-size-base: 16px;             /* 基础字号 */
}
```

### ✏️ 常用定制

#### 1. 修改主题颜色

```css
:root {
  /* 改为紫色主题 */
  --vp-c-brand: #8b5cf6;
  --vp-c-brand-light: #a78bfa;
  --vp-c-brand-dark: #7c3aed;
}
```

#### 2. 调整网站宽度

```css
:root {
  /* 改为更宽的布局 */
  --site-max-width: 1400px;
  --site-padding-x: 48px;
}
```

#### 3. 自定义Banner

```css
:root {
  /* 更高的Banner */
  --banner-height: 500px;
  --banner-title-size: 4rem;
}
```

#### 4. 修改卡片样式

```css
:root {
  /* 更大的圆角和阴影 */
  --card-radius: 16px;
  --card-shadow: 0 4px 16px rgba(0,0,0,0.15);
}
```

#### 5. 字体定制

```css
:root {
  /* 使用自定义字体 */
  --font-family-base: 'Helvetica Neue', Arial, sans-serif;
  --font-size-base: 18px;
}
```

### 🎯 样式结构

custom.css 分为8个章节：

1. **CSS变量定义** - 所有可配置的主题参数
2. **全局布局样式** - 页面容器和对齐
3. **VitePress默认样式覆盖** - 覆盖框架默认样式
4. **文章卡片样式** - 首页卡片外观
5. **Banner样式** - 首页横幅
6. **导航栏样式** - 顶部导航
7. **搜索框样式** - 搜索功能
8. **响应式适配** - 移动端适配

### 💡 定制技巧

**1. 快速预览**
修改CSS后保存，浏览器会自动刷新预览。

**2. 只修改变量**
推荐只修改`:root`中的CSS变量，不要直接修改样式规则。

**3. 响应式断点**
```css
@media (max-width: 768px) {  /* 平板 */
  :root {
    --site-padding-x: 16px;
  }
}

@media (max-width: 480px) {  /* 手机 */
  :root {
    --site-padding-x: 12px;
  }
}
```

**4. 查看完整变量列表**
打开 `custom.css` 文件顶部查看所有可配置变量。

---

## 🛠️ 开发命令

### 开发服务器

```bash
# 启动开发服务器
pnpm dev

# 或使用 npm
npm run dev
```

访问：`http://localhost:5173`

### 构建生产版本

```bash
# 构建静态文件
pnpm build

# 或使用 npm
npm run build
```

构建输出：`docs/.vitepress/dist/`

### 预览生产版本

```bash
# 预览构建结果
pnpm serve

# 或使用 npm
npm run serve
```

访问：`http://localhost:4173`

### 生成Sitemap

自动生成sitemap.xml：

```bash
# 手动生成sitemap
pnpm sitemap

# 或在构建时自动生成（已配置prebuild钩子）
pnpm build
```

生成的文件：`docs/public/sitemap.xml`

### 文章爬取工具 🆕

从微信公众号等平台爬取文章并转换为Markdown：

```bash
# 启动文章爬取工具
pnpm fetch
```

**功能特点：**
- ✅ 支持微信公众号、知乎、CSDN等平台
- ✅ 自动下载文章中的图片到本地
- ✅ HTML转Markdown格式
- ✅ 自动生成Frontmatter头部
- ✅ 交互式选择分类和标签
- ✅ 一键保存到指定目录

**详细使用教程：** [scripts/FETCH-ARTICLE-GUIDE.md](./scripts/FETCH-ARTICLE-GUIDE.md)

### 清理缓存

如果遇到构建问题，运行清理脚本：

```bash
# 清理缓存并重新构建
pnpm clean:build

# 或只清理缓存
pnpm clean
```

清理的目录：
- `docs/.vitepress/.temp/`
- `docs/.vitepress/cache/`
- `docs/.vitepress/dist/`

---

## 🚀 部署指南

### 部署到 Vercel（推荐）

#### 1. 推送代码到 GitHub

```bash
git add .
git commit -m "Initial commit"
git push origin main
```

#### 2. 导入到 Vercel

1. 访问 [vercel.com](https://vercel.com)
2. 点击 "Import Project"
3. 选择你的 GitHub 仓库
4. 配置构建设置：
   - **Framework Preset**: VitePress
   - **Build Command**: `pnpm build`
   - **Output Directory**: `docs/.vitepress/dist`
   - **Install Command**: `pnpm install`

#### 3. 部署完成

Vercel 会自动部署，每次推送代码都会触发自动部署。

### 部署到 Netlify

#### 1. 创建 `netlify.toml`

在项目根目录创建配置文件：

```toml
[build]
  command = "pnpm build"
  publish = "docs/.vitepress/dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

#### 2. 部署到 Netlify

1. 访问 [netlify.com](https://netlify.com)
2. 拖拽 `docs/.vitepress/dist` 文件夹到网站
3. 或连接 GitHub 仓库自动部署

### 部署到 GitHub Pages

#### 1. 创建部署脚本

创建 `.github/workflows/deploy.yml`：

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - uses: pnpm/action-setup@v2
        with:
          version: 9
      
      - uses: actions/setup-node@v3
        with:
          node-version: 18
          cache: pnpm
      
      - run: pnpm install
      - run: pnpm build
      
      - uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: docs/.vitepress/dist
```

#### 2. 配置 base 路径

编辑 `docs/.vitepress/config.mts`：

```typescript
export default defineConfig({
  base: '/vitepress-blog-starter/', // 改为你的GitHub仓库名
  // ...其他配置
})
```

#### 3. 推送代码

```bash
git add .
git commit -m "Add GitHub Actions"
git push
```

部署完成后访问：`https://tansunyj.github.io/vitepress-blog-starter/`

---

## 💡 常见问题

### ❓ 构建时出现 "Cannot read properties of undefined (reading 'author')" 警告

**原因**：某些文章缺少 `author` 字段。

**解决方案**：
1. 确保所有 `.md` 文章都包含 `author: 杰哥` 字段
2. 运行清理命令：`pnpm clean:build`
3. 这些警告不影响构建结果，可以忽略

### ❓ 文章没有显示在列表中

**检查清单**：
1. ✅ 确保文章包含完整的 frontmatter（title、description、date、author）
2. ✅ 文件路径是否正确（在 `docs/posts/` 目录下）
3. ✅ frontmatter 格式是否正确（使用 `---` 包围）
4. ✅ 日期格式是否正确（YYYY-MM-DD）
5. ✅ 清理缓存后重新构建

### ❓ 修改配置后没有生效

**解决方案**：
1. 停止开发服务器（Ctrl + C）
2. 运行清理命令：`pnpm clean`
3. 重新启动：`pnpm dev`

### ❓ 图片无法显示

**检查清单**：
1. ✅ 图片是否放在 `docs/public/` 目录下
2. ✅ 路径是否以 `/` 开头（如：`/images/pic.jpg`）
3. ✅ 图片文件名是否正确（区分大小写）

### ❓ 如何修改网站宽度？

编辑 `docs/.vitepress/theme/custom.css`：

```css
:root {
  --site-max-width: 1400px;  /* 修改这个值 */
}
```

### ❓ 如何添加新的分类？

1. 在 `docs/posts/` 下创建新文件夹
2. 在 `docs/.vitepress/config.mts` 中添加导航和侧边栏配置
3. 创建 `index.md` 文件，使用 `<CategoryPosts />` 组件

---

## 📚 相关文档

- [VitePress 官方文档](https://vitepress.dev/)
- [UnoCSS 文档](https://unocss.dev/)
- [Vue 3 文档](https://cn.vuejs.org/)
- [Markdown 语法](https://markdown.com.cn/)
- [SEO-FIELDS.md](./SEO-FIELDS.md) - SEO 字段完整说明
- [STRUCTURE.md](./STRUCTURE.md) - 项目结构详细说明

---

## 🤝 贡献指南

欢迎提交 Issue 和 Pull Request！

### 提交代码

1. Fork 本仓库
2. 创建特性分支：`git checkout -b feature/amazing-feature`
3. 提交更改：`git commit -m 'Add some amazing feature'`
4. 推送分支：`git push origin feature/amazing-feature`
5. 提交 Pull Request

---

## 📄 许可证

MIT License

---

## 👨‍💻 作者

**杰哥**

- GitHub：[@tansunyj](https://github.com/tansunyj)
- QQ群：[749827914](https://qm.qq.com/q/rvVkbpLGlc)
- Telegram：[杰哥的技术小站](https://t.me/jerry_tech_club)

---

## ⭐ Star History

如果这个项目对你有帮助，请给一个 ⭐️ Star！

---

**最后更新时间**：2025-11-17
