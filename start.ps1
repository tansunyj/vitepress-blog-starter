# ============================================
# VitePress Blog 启动脚本 (PowerShell)
# ============================================

# 设置控制台编码为UTF-8
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8
$OutputEncoding = [System.Text.Encoding]::UTF8

# 颜色函数
function Write-ColorOutput {
    param(
        [string]$Message,
        [string]$Color = "White"
    )
    Write-Host $Message -ForegroundColor $Color
}

function Write-Success {
    param([string]$Message)
    Write-ColorOutput "✓ $Message" "Green"
}

function Write-Error-Msg {
    param([string]$Message)
    Write-ColorOutput "✗ $Message" "Red"
}

function Write-Warning-Msg {
    param([string]$Message)
    Write-ColorOutput "⚠ $Message" "Yellow"
}

function Write-Info {
    param([string]$Message)
    Write-ColorOutput "ℹ $Message" "Cyan"
}

# 显示标题
Clear-Host
Write-Host ""
Write-ColorOutput "========================================" "Cyan"
Write-ColorOutput "   杰哥的技术小站 - 启动脚本" "Cyan"
Write-ColorOutput "========================================" "Cyan"
Write-Host ""

# 必需的版本
$RequiredNodeVersion = "18.0.0"
$RequiredPnpmVersion = "9.0.0"

# ============================================
# 1. 检查 Node.js
# ============================================
Write-Info "正在检查 Node.js 环境..."

try {
    $nodeVersion = node --version 2>$null
    if ($nodeVersion) {
        $nodeVersion = $nodeVersion.Replace('v', '')
        Write-Success "Node.js 已安装: v$nodeVersion"
        
        # 检查版本是否满足要求
        $currentNodeVersion = [version]$nodeVersion.Split('-')[0]
        $minNodeVersion = [version]$RequiredNodeVersion
        
        if ($currentNodeVersion -lt $minNodeVersion) {
            Write-Warning-Msg "Node.js 版本过低，建议升级到 v$RequiredNodeVersion 或更高版本"
        }
    } else {
        throw "Node.js 未安装"
    }
} catch {
    Write-Error-Msg "Node.js 未安装或无法访问"
    Write-Host ""
    Write-ColorOutput "请下载并安装 Node.js:" "Yellow"
    Write-ColorOutput "  官方网站: https://nodejs.org/" "White"
    Write-ColorOutput "  推荐版本: LTS (长期支持版)" "White"
    Write-Host ""
    Write-ColorOutput "安装完成后，请重新运行此脚本" "Yellow"
    Write-Host ""
    
    # 询问是否打开下载页面
    $openBrowser = Read-Host "是否打开 Node.js 下载页面？(Y/N)"
    if ($openBrowser -eq "Y" -or $openBrowser -eq "y") {
        Start-Process "https://nodejs.org/"
    }
    
    pause
    exit 1
}

# ============================================
# 2. 检查 pnpm
# ============================================
Write-Info "正在检查 pnpm 包管理器..."

try {
    $pnpmVersion = pnpm --version 2>$null
    if ($pnpmVersion) {
        Write-Success "pnpm 已安装: v$pnpmVersion"
        
        # 检查版本
        $currentPnpmVersion = [version]$pnpmVersion.Split('-')[0]
        $minPnpmVersion = [version]$RequiredPnpmVersion
        
        if ($currentPnpmVersion -lt $minPnpmVersion) {
            Write-Warning-Msg "pnpm 版本过低，正在更新..."
            npm install -g pnpm@latest
            Write-Success "pnpm 已更新"
        }
    } else {
        throw "pnpm 未安装"
    }
} catch {
    Write-Warning-Msg "pnpm 未安装，正在自动安装..."
    Write-Host ""
    
    try {
        npm install -g pnpm
        Write-Success "pnpm 安装成功"
    } catch {
        Write-Error-Msg "pnpm 安装失败"
        Write-Host ""
        Write-ColorOutput "请手动安装 pnpm:" "Yellow"
        Write-ColorOutput "  运行命令: npm install -g pnpm" "White"
        Write-Host ""
        pause
        exit 1
    }
}

# ============================================
# 3. 检查项目依赖
# ============================================
Write-Info "正在检查项目依赖..."

$nodeModulesPath = Join-Path $PSScriptRoot "node_modules"
if (-Not (Test-Path $nodeModulesPath)) {
    Write-Warning-Msg "依赖未安装，正在安装项目依赖..."
    Write-Host ""
    Write-ColorOutput "这可能需要几分钟时间，请耐心等待..." "Yellow"
    Write-Host ""
    
    try {
        pnpm install
        Write-Host ""
        Write-Success "依赖安装成功"
    } catch {
        Write-Error-Msg "依赖安装失败"
        Write-Host ""
        Write-ColorOutput "请尝试手动安装:" "Yellow"
        Write-ColorOutput "  运行命令: pnpm install" "White"
        Write-Host ""
        pause
        exit 1
    }
} else {
    Write-Success "项目依赖已安装"
}

# ============================================
# 4. 检查端口占用
# ============================================
Write-Info "正在检查端口占用..."

function Test-PortInUse {
    param([int]$Port)
    $connection = Get-NetTCPConnection -LocalPort $Port -ErrorAction SilentlyContinue
    return $connection -ne $null
}

$vitepressPort = 5173
$apiPort = 3456

$vitepressInUse = Test-PortInUse -Port $vitepressPort
$apiInUse = Test-PortInUse -Port $apiPort

if ($vitepressInUse) {
    Write-Warning-Msg "端口 $vitepressPort 已被占用（VitePress）"
    $killProcess = Read-Host "是否尝试关闭占用该端口的进程？(Y/N)"
    if ($killProcess -eq "Y" -or $killProcess -eq "y") {
        $connection = Get-NetTCPConnection -LocalPort $vitepressPort
        $processId = $connection.OwningProcess
        Stop-Process -Id $processId -Force
        Write-Success "已关闭进程 (PID: $processId)"
    }
}

if ($apiInUse) {
    Write-Warning-Msg "端口 $apiPort 已被占用（API服务器）"
    $killProcess = Read-Host "是否尝试关闭占用该端口的进程？(Y/N)"
    if ($killProcess -eq "Y" -or $killProcess -eq "y") {
        $connection = Get-NetTCPConnection -LocalPort $apiPort
        $processId = $connection.OwningProcess
        Stop-Process -Id $processId -Force
        Write-Success "已关闭进程 (PID: $processId)"
    }
}

if (-Not $vitepressInUse -and -Not $apiInUse) {
    Write-Success "端口检查通过"
}

# ============================================
# 5. 检查必要目录
# ============================================
Write-Info "正在检查必要目录..."

$draftsDir = Join-Path $PSScriptRoot "drafts\articles"
$draftsImagesDir = Join-Path $PSScriptRoot "drafts\images"
$trashDir = Join-Path $PSScriptRoot "trash"

if (-Not (Test-Path $draftsDir)) {
    New-Item -ItemType Directory -Path $draftsDir -Force | Out-Null
    Write-Success "已创建草稿目录"
}

if (-Not (Test-Path $draftsImagesDir)) {
    New-Item -ItemType Directory -Path $draftsImagesDir -Force | Out-Null
    Write-Success "已创建草稿图片目录"
}

if (-Not (Test-Path $trashDir)) {
    New-Item -ItemType Directory -Path $trashDir -Force | Out-Null
    Write-Success "已创建垃圾箱目录"
}

Write-Success "目录检查完成"

# ============================================
# 6. 启动服务
# ============================================
Write-Host ""
Write-ColorOutput "========================================" "Green"
Write-ColorOutput "   环境检查完成，正在启动服务..." "Green"
Write-ColorOutput "========================================" "Green"
Write-Host ""

Write-Info "启动命令: pnpm dev"
Write-Host ""
Write-ColorOutput "服务地址:" "Cyan"
Write-ColorOutput "  前台网站: http://localhost:5173" "White"
Write-ColorOutput "  管理后台: http://localhost:5173/tools/admin.html" "White"
Write-ColorOutput "  API服务:  http://localhost:3456" "White"
Write-Host ""
Write-ColorOutput "提示: 按 Ctrl+C 可以停止服务" "Yellow"
Write-Host ""
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
Write-Host ""

# 等待3秒后打开浏览器
Start-Job -ScriptBlock {
    Start-Sleep -Seconds 8
    Start-Process "http://localhost:5173/tools/admin.html"
} | Out-Null

Write-ColorOutput "浏览器将在 8 秒后自动打开..." "Yellow"
Write-Host ""

# 启动服务（使用 pnpm dev，它会同时启动 VitePress 和 API 服务器）
try {
    Set-Location $PSScriptRoot
    pnpm dev
} catch {
    Write-Host ""
    Write-Error-Msg "服务启动失败"
    Write-Host ""
    pause
    exit 1
}
