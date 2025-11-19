# 🚀 Quick Start Guide

## For Windows Users

### Simple Method (Recommended)

**Just double-click `start.bat` file!**

The script will automatically:
- ✅ Check Node.js environment
- ✅ Check/Install pnpm package manager
- ✅ Install project dependencies
- ✅ Check port availability
- ✅ Create necessary directories
- ✅ Start development server
- ✅ Open browser automatically

---

## System Requirements

- **Node.js**: v18.0.0 or higher
- **Operating System**: Windows 10/11
- **RAM**: 4GB+ (8GB+ recommended)
- **Disk Space**: 1GB+

---

## Access URLs After Startup

| Service | URL | Description |
|---------|-----|-------------|
| **Frontend** | http://localhost:5173 | Blog frontend |
| **Admin Panel** | http://localhost:5173/tools/admin.html | Article management |
| **API Server** | http://localhost:3456 | Backend API |

---

## Troubleshooting

### Script window closes immediately?

**Solution**: Run as administrator
1. Right-click `start.bat`
2. Select "Run as administrator"

### PowerShell execution policy error?

**Solution**: Allow script execution
```powershell
# Run PowerShell as administrator
Set-ExecutionPolicy RemoteSigned -Scope CurrentUser
```

### Port already in use?

**Solution**: The script will prompt you to close the conflicting process
- Type `Y` when prompted
- Or manually close the process using Task Manager

---

## Manual Start (Advanced)

```bash
# Install dependencies (first time only)
pnpm install

# Start development server
pnpm dev

# Access http://localhost:5173/tools/admin.html
```

---

## File Structure

```
├── start.bat          # Windows startup script (double-click to run)
├── start.ps1          # PowerShell main script
├── docs/              # VitePress documentation
├── drafts/            # Draft articles (auto-created)
├── scripts/           # Backend scripts
└── package.json       # Project configuration
```

---

## Need Help?

1. Check error messages in the console
2. Restart your computer (especially after installing Node.js)
3. Delete `node_modules` and reinstall: `pnpm install`

---

**Happy Blogging!** 🎉
