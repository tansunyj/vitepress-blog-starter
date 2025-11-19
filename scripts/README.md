# Scripts 脚本说明

本目录包含博客系统的实用脚本工具。

## 📜 脚本列表

### 1. generate-sitemap.js - Sitemap生成器

**功能：** 自动生成sitemap.xml文件

**使用：**
```bash
pnpm sitemap
```

**说明：**
- 每次 `pnpm build` 时自动运行
- 扫描所有文章和页面
- 生成 `docs/public/sitemap.xml`

---

### 2. fetch-article.js - 文章爬取工具 🆕

**功能：** 从微信公众号等平台爬取文章并转换为Markdown

**使用：**
```bash
pnpm fetch
```

**主要特性：**
- ✅ 自动爬取文章内容
- ✅ HTML转Markdown
- ✅ 图片自动下载到本地
- ✅ 自动生成Frontmatter
- ✅ 分类管理
- ✅ 标签系统
- ✅ 交互式界面

**详细文档：** [FETCH-ARTICLE-GUIDE.md](./FETCH-ARTICLE-GUIDE.md)

**快速示例：**
```bash
# 1. 运行命令
pnpm fetch

# 2. 输入文章URL
📌 请输入文章URL: https://mp.weixin.qq.com/s/xxxxxxxx

# 3. 选择分类 (1-9)
请选择文章分类: 1

# 4. 输入标签
🏷️ 请输入文章标签: AI,教程,效率

# 5. 完成！文章已保存
```

**支持的网站：**
- 微信公众号 (mp.weixin.qq.com)
- 知乎专栏 (zhuanlan.zhihu.com)
- CSDN (blog.csdn.net)
- 简书 (jianshu.com)
- 掘金 (juejin.cn)
- 大部分个人博客

---

## 🔧 开发新脚本

### 脚本模板

```javascript
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// 你的脚本逻辑
async function main() {
  console.log('脚本开始执行...')
  // ...
}

main()
```

### 添加到package.json

```json
{
  "scripts": {
    "your-script": "node scripts/your-script.js"
  }
}
```

---

## 📚 相关文档

- [文章爬取工具详细指南](./FETCH-ARTICLE-GUIDE.md)
- [项目README](../README.md)
- [配置指南](../CONFIGURATION.md)

---

**最后更新时间**：2025-11-17
