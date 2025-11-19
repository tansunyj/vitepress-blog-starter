# 🛠️ 管理工具使用手册

欢迎使用VitePress博客管理工具！这是一套完整的CMS后台管理系统。

---

## 📋 **功能清单**

### ✅ **已完成功能**

#### **1. Markdown编辑器** ✏️
**访问地址：** `/tools/editor`

**核心功能：**
- ✅ 草稿箱系统（按年/月分组显示，最新在上）
- ✅ 已发布文章列表
- ✅ 图片上传（3种方式：工具栏、粘贴、拖拽）
- ✅ 图片自动管理（草稿→发布时自动处理）
- ✅ 文档树导航
- ✅ 文件搜索过滤
- ✅ 实时预览
- ✅ 快捷键支持（`Ctrl+S` 保存草稿）

**工作流程：**
```
1. 点击"新增" → 创建新草稿
2. 编辑内容（可上传图片）
3. 点击"保存草稿" → 保存到 drafts/articles/
4. 点击"发布" → 选择目标目录 → 图片自动复制+路径替换
```

---

#### **2. 文章爬取工具** 📝
**访问地址：** `/tools/fetch`

**功能：**
- 爬取网页文章并转换为Markdown
- 自动下载图片到本地
- 支持自定义元信息

---

#### **3. 导航菜单管理** 🗂️
**访问地址：** `/tools/menu-manager`

**功能：**
- ✅ 可视化展示菜单树
- ✅ 编辑菜单（名称、链接）
- ✅ 添加/删除菜单项
- ✅ 支持二级菜单
- ✅ 保护系统菜单（标记🔒不可编辑）

**注意：**
- 修改后需点击"保存配置"
- 保存后需重启开发服务器生效（`pnpm dev`）
- "管理工具"菜单不可编辑（系统保护）

---

#### **4. 网站配置管理** ⚙️
**访问地址：** `/tools/site-config`

**功能：**
- ✅ 编辑网站名称
- ✅ 编辑网站描述（SEO）
- ✅ Banner配置说明
- ✅ 页脚配置说明

**注意：**
- 网站名称和描述可直接修改
- Banner/页脚需手动编辑对应文件：
  - Banner: `docs/.vitepress/theme/components/Banner.vue`
  - 页脚: `docs/.vitepress/config.mts`

---

## 🚀 **快速开始**

### **前置要求**
1. 确保后端API服务已启动：
```bash
node scripts/fetch-server.js
```

2. 确保开发服务器已启动：
```bash
pnpm dev
```

3. 访问管理工具：
```
http://localhost:5173
点击导航栏"🛠️ 管理工具"
```

---

## 📂 **目录结构**

```
vitepress-blog-starter/
├── drafts/                      # 草稿箱
│   ├── articles/                # 草稿文章
│   │   └── draft-xxx.md
│   ├── images/                  # 草稿图片
│   │   └── draft-xxx/
│   └── README.md
├── docs/
│   ├── .vitepress/
│   │   ├── config.mts           # VitePress配置
│   │   └── theme/
│   │       └── components/
│   │           └── tools/       # 管理工具组件
│   │               ├── MarkdownEditor.vue
│   │               ├── MenuManager.vue
│   │               └── SiteConfig.vue
│   ├── posts/                   # 正式文章
│   ├── public/
│   │   └── images/              # 正式图片
│   └── tools/                   # 工具页面
│       ├── editor.md
│       ├── menu-manager.md
│       └── site-config.md
└── scripts/
    └── fetch-server.js          # 后端API服务
```

---

## 🎯 **使用场景**

### **场景1：写一篇新文章**
1. 打开 `/tools/editor`
2. 点击"新增"
3. 编辑内容，上传图片
4. "保存草稿"（可多次保存）
5. 完成后点击"发布"
6. 选择发布目录（如：`blog/tutorials`）
7. 确认发布 → 图片自动处理

### **场景2：修改网站名称**
1. 打开 `/tools/site-config`
2. 修改"网站名称"和"网站描述"
3. 点击"保存配置"
4. 重启开发服务器

### **场景3：添加新菜单**
1. 打开 `/tools/menu-manager`
2. 点击"添加一级菜单"
3. 输入菜单名称和链接
4. 点击"保存配置"
5. 重启开发服务器

---

## ⚡ **快捷键**

| 快捷键 | 功能 | 页面 |
|--------|------|------|
| `Ctrl+S` | 保存草稿 | Markdown编辑器 |
| `Ctrl+V` | 粘贴图片（自动上传） | Markdown编辑器 |

---

## 🔧 **API接口文档**

### **草稿管理**
```
GET  /api/draft/list              # 获取草稿列表
GET  /api/draft/read?file=xxx.md  # 读取草稿
POST /api/draft/save              # 保存草稿
POST /api/draft/publish           # 发布草稿
DELETE /api/draft/delete          # 删除草稿
```

### **图片上传**
```
POST /api/draft/upload-image       # 表单上传
POST /api/draft/upload-image-base64 # Base64上传
```

### **配置管理**
```
GET  /api/config/menus  # 读取菜单
POST /api/config/menus  # 保存菜单
GET  /api/config/site   # 读取网站配置
POST /api/config/site   # 保存网站配置
```

---

## ❓ **常见问题**

### **Q: 图片上传失败？**
**A:** 检查：
1. 后端服务是否启动
2. 是否已先保存草稿（生成草稿ID）
3. 文件大小是否超过10MB
4. 文件格式是否支持

### **Q: 菜单修改后不生效？**
**A:** 需要重启开发服务器：
```bash
Ctrl+C  # 停止服务
pnpm dev  # 重新启动
```

### **Q: 草稿在哪里？**
**A:** 草稿保存在 `drafts/articles/` 目录

### **Q: 发布后图片找不到？**
**A:** 检查图片是否已复制到 `docs/public/images/[category]/`

---

## 📊 **功能完成度**

```
✅ 草稿箱系统          100% (9/9)
✅ 图片管理            100% (5/5)
✅ 编辑器功能          100% (7/7)
✅ 导航菜单管理        100% (6/6)
✅ 网站配置管理        100% (4/4)

总体完成度：31/31 = 100%
```

---

## 🎉 **更新日志**

### **v1.0.0** - 2025-11-18
- ✅ 完成草稿箱系统
- ✅ 完成图片上传功能
- ✅ 完成导航菜单管理
- ✅ 完成网站配置管理
- ✅ 优化草稿按日期分组显示
- ✅ 调整按钮顺序（新增→打开→保存→发布）

---

## 💡 **技术栈**

- **前端框架：** Vue 3 + VitePress
- **编辑器：** md-editor-v3
- **后端：** Express.js
- **文件上传：** Multer
- **样式：** CSS Variables + Scoped CSS

---

## 📞 **需要帮助？**

如有问题，请查看：
1. 控制台错误信息
2. 后端服务日志
3. `drafts/README.md` 草稿箱说明
4. 本文档常见问题部分

---

**🎊 恭喜！所有管理工具已经全部就绪！开始享受便捷的博客管理体验吧！**
