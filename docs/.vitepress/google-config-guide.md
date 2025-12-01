# Google 服务配置指南

## 📂 配置文件架构（单一配置源）

本项目采用**单一配置源**架构，确保配置的一致性：

### 唯一配置文件
```
docs/.vitepress/google-config.json  ← 唯一的配置源
```

### 自动同步机制
- **开发环境**：直接读取 `.vitepress/google-config.json`
- **生产构建**：构建时自动复制到 `public/google-config.json`，供浏览器访问

## 📝 配置文件格式

```json
{
  "analytics": "G-DL1B18JP22",
  "searchConsole": "google327d3a41a389f4ee",
  "adsense": "ca-pub-XXXXXXXXXXXXXXXX"
}
```

### 字段说明

| 字段 | 说明 | 示例 |
|------|------|------|
| `analytics` | Google Analytics (GA4) 测量ID | `G-DL1B18JP22` |
| `searchConsole` | Google Search Console 验证码（支持多个，逗号分隔） | `google327d3a41a389f4ee` |
| `adsense` | Google AdSense 发布商ID | `ca-pub-1234567890123456` |

## 🔧 配置方式

### 方式1: 通过管理后台（推荐）

1. 访问 `/admin` 管理后台
2. 进入"网站配置"
3. 填写对应的Google服务ID
4. 点击保存

✅ **优点**：自动验证格式，操作简单，日志记录

### 方式2: 手动编辑配置文件

直接编辑 `docs/.vitepress/google-config.json`：

```json
{
  "analytics": "G-YOUR-MEASUREMENT-ID",
  "searchConsole": "your-verification-code",
  "adsense": "ca-pub-YOUR-PUBLISHER-ID"
}
```

⚠️ **注意**：手动修改后需要重新构建才能生效

## 🚀 工作流程

### 开发环境 (pnpm dev)
```
1. 读取 .vitepress/google-config.json
2. 构建时注入到 HTML <head> 标签
3. 运行时通过 theme/index.ts 动态加载
```

### 生产构建 (pnpm build)
```
1. 读取 .vitepress/google-config.json
2. 构建时注入到 HTML <head> 标签
3. buildEnd 钩子复制到 public/google-config.json
4. 部署后浏览器可访问 /google-config.json
```

## 📍 配置注入位置

### 构建时注入（config.mts）
- **位置**：`docs/.vitepress/config.mts` 第48-71行
- **时机**：构建时
- **作用**：静态注入到HTML，SEO友好

```typescript
// 从唯一配置源读取
const googleConfig = JSON.parse(
  fs.readFileSync('docs/.vitepress/google-config.json', 'utf-8')
)

// 条件注入到 head
...(googleConfig.analytics ? [
  ['script', { async: '', src: `...${googleConfig.analytics}` }],
] : [])
```

### 运行时加载（theme/index.ts）
- **位置**：`docs/.vitepress/theme/index.ts` 第28-72行
- **时机**：页面加载时
- **作用**：动态注入，支持后续更新

```typescript
fetch('/google-config.json')
  .then(res => res.json())
  .then(config => {
    // 注入 Google Analytics、AdSense、Search Console
  })
```

## 🔄 配置更新流程

### 通过管理后台更新
1. 修改配置并保存
2. 后端更新 `.vitepress/google-config.json`
3. 重新构建：`pnpm build`
4. 配置自动复制到 `public/` 目录
5. 部署新版本

### 手动修改配置
1. 编辑 `docs/.vitepress/google-config.json`
2. 重新构建：`pnpm build`
3. 配置自动复制到 `public/` 目录
4. 部署新版本

## ⚠️ 重要提示

### ✅ 正确做法
- 只修改 `docs/.vitepress/google-config.json`
- 通过管理后台配置
- 修改后重新构建

### ❌ 错误做法
- ~~手动修改 `docs/public/google-config.json`~~（会被覆盖）
- ~~在多个地方维护配置~~（已废弃）
- ~~修改后不重新构建~~（不生效）

## 🎯 最佳实践

1. **使用环境变量**（可选）
   ```bash
   # .env.local
   VITE_GA_ID=G-YOUR-ID
   VITE_GSC_CODE=your-code
   ```

2. **版本控制**
   - 将真实配置添加到 `.gitignore`
   - 提交模板文件 `google-config.template.json`

3. **验证配置**
   ```bash
   # 检查配置文件
   cat docs/.vitepress/google-config.json
   
   # 构建后检查
   cat docs/.vitepress/dist/index.html | grep "gtag"
   ```

## 📚 相关文件

- `docs/.vitepress/google-config.json` - 唯一配置源
- `docs/.vitepress/config.mts` - 构建时读取配置
- `docs/.vitepress/theme/index.ts` - 运行时加载配置
- `scripts/fetch-server.js` - 后端保存配置
- `docs/public/google-config.json` - 自动生成（不要手动修改）

## 🐛 故障排查

### 问题1: 构建后显示占位符 `G-XXXXXXXXXX`
**原因**：配置文件未正确读取  
**解决**：检查 `docs/.vitepress/google-config.json` 是否存在且格式正确

### 问题2: 修改配置后不生效
**原因**：未重新构建  
**解决**：运行 `pnpm build` 重新构建

### 问题3: public目录下的配置被覆盖
**原因**：这是正常行为，该文件由构建自动生成  
**解决**：修改 `.vitepress/google-config.json` 而不是 `public/google-config.json`
