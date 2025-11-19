# 🚀 启动脚本输出示例

本文档展示 `start.bat` 运行时的各种输出场景。

---

## ✅ 场景1：所有软件已安装（最佳状态）

```
============================================================
          VitePress Blog - Environment Check
============================================================

============================================================
  Required Software Checklist
============================================================

  [REQUIRED]
    1. Node.js (v18+)       https://nodejs.org/
    2. pnpm (v9+)           npm install -g pnpm

  [RECOMMENDED]
    3. Git                  https://git-scm.com/download/win

============================================================

Checking installed software...

[1/4] Checking Node.js...
  [OK] Node.js v20.10.0

[2/4] Checking pnpm...
  [OK] pnpm v9.15.3

[3/4] Checking Git...
  [OK] git version 2.43.0.windows.1
  [OK] User: 杰哥 <jie@example.com>

[4/4] Checking dependencies...
  [OK] Dependencies installed


Starting services...
  - VitePress: http://localhost:5173
  - API Server: http://localhost:3456

Press Ctrl+C to stop

...
```

---

## ⚠️ 场景2：Git 未配置用户信息

```
[3/4] Checking Git...
  [OK] git version 2.43.0.windows.1
  [!] Git user not configured
      Run: git config --global user.name "Your Name"
      Run: git config --global user.email "your@email.com"

[4/4] Checking dependencies...
  [OK] Dependencies installed


Note: Some optional software is missing.
      The blog will work, but some features may be limited.

Continue anyway? (Y/N):
```

---

## ❌ 场景3：Git 未安装

```
[3/4] Checking Git...

╔════════════════════════════════════════════════════════╗
║                     ! WARNING !                        ║
╠════════════════════════════════════════════════════════╣
║  Git is NOT installed (Recommended)                    ║
║  Git is recommended for version control and GitHub     ║
║                                                        ║
║  Download: https://git-scm.com/download/win            ║
╚════════════════════════════════════════════════════════╝

[4/4] Checking dependencies...
  [OK] Dependencies installed


Note: Some optional software is missing.
      The blog will work, but some features may be limited.

Continue anyway? (Y/N):
```

---

## 🚨 场景4：Node.js 未安装（致命错误）

```
[1/4] Checking Node.js...

╔════════════════════════════════════════════════════════╗
║                     ! WARNING !                        ║
╠════════════════════════════════════════════════════════╣
║  Node.js is NOT installed (Required)                   ║
║  Node.js is required to run this blog system           ║
║                                                        ║
║  Download: https://nodejs.org/                         ║
╚════════════════════════════════════════════════════════╝

[2/4] Checking pnpm...

╔════════════════════════════════════════════════════════╗
║                     ! WARNING !                        ║
╠════════════════════════════════════════════════════════╣
║  pnpm is NOT installed (Required)                      ║
║  Install: npm install -g pnpm                          ║
╚════════════════════════════════════════════════════════╝

[3/4] Checking Git...
  [OK] git version 2.43.0.windows.1
  [OK] User: 杰哥 <jie@example.com>

[4/4] Checking dependencies...
  [!] Dependencies not installed
      Will install automatically...


╔════════════════════════════════════════════════════════╗
║                    CANNOT START                        ║
╠════════════════════════════════════════════════════════╣
║  Please install the required software above and        ║
║  run this script again.                                ║
╚════════════════════════════════════════════════════════╝

请按任意键继续. . .
```

---

## 🔧 场景5：需要安装依赖

```
[4/4] Checking dependencies...
  [!] Dependencies not installed
      Will install automatically...


Installing dependencies...

Lockfile is up to date, resolution step is skipped
Already up to date
Progress: resolved 1, reused 0, downloaded 0, added 0, done

Done in 2.5s

Starting services...
  - VitePress: http://localhost:5173
  - API Server: http://localhost:3456
```

---

## 📊 输出说明

### 状态标记

| 标记 | 含义 | 颜色 |
|------|------|------|
| `[OK]` | 已安装且配置正确 | 绿色 |
| `[!]` | 警告或需要注意 | 黄色 |
| `! WARNING !` | 软件未安装 | 红色框 |
| `CANNOT START` | 缺少必需软件，无法启动 | 红色框 |

### 软件分类

- **[REQUIRED]** - 必需软件，没有则无法运行
- **[RECOMMENDED]** - 推荐软件，没有也能运行但功能受限

---

## 💡 使用建议

1. **首次运行**：仔细阅读所有输出信息
2. **看到红色框**：说明有软件未安装，按提示安装
3. **看到黄色警告**：可以忽略，但建议安装
4. **看到绿色 [OK]**：一切正常

---

## 🔗 相关文档

- [软件环境要求](SOFTWARE_REQUIREMENTS.md) - 详细的软件安装指南
- [启动说明](启动说明.md) - 快速启动指南
- [README](README.md) - 项目总体介绍
