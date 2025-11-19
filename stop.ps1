# ============================================
# VitePress Blog 停止脚本 (PowerShell)
# ============================================

[Console]::OutputEncoding = [System.Text.Encoding]::UTF8
$OutputEncoding = [System.Text.Encoding]::UTF8

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

function Write-Info {
    param([string]$Message)
    Write-ColorOutput "ℹ $Message" "Cyan"
}

Clear-Host
Write-Host ""
Write-ColorOutput "========================================" "Cyan"
Write-ColorOutput "   停止服务中..." "Cyan"
Write-ColorOutput "========================================" "Cyan"
Write-Host ""

$vitepressPort = 5173
$apiPort = 3456
$stoppedCount = 0

# 停止 VitePress 服务
Write-Info "正在检查端口 $vitepressPort (VitePress)..."
$connection = Get-NetTCPConnection -LocalPort $vitepressPort -ErrorAction SilentlyContinue
if ($connection) {
    $processId = $connection.OwningProcess
    $processName = (Get-Process -Id $processId).ProcessName
    Write-Info "找到进程: $processName (PID: $processId)"
    
    Stop-Process -Id $processId -Force -ErrorAction SilentlyContinue
    Start-Sleep -Milliseconds 500
    
    Write-Success "已停止 VitePress 服务"
    $stoppedCount++
} else {
    Write-Info "VitePress 服务未运行"
}

# 停止 API 服务
Write-Info "正在检查端口 $apiPort (API服务器)..."
$connection = Get-NetTCPConnection -LocalPort $apiPort -ErrorAction SilentlyContinue
if ($connection) {
    $processId = $connection.OwningProcess
    $processName = (Get-Process -Id $processId).ProcessName
    Write-Info "找到进程: $processName (PID: $processId)"
    
    Stop-Process -Id $processId -Force -ErrorAction SilentlyContinue
    Start-Sleep -Milliseconds 500
    
    Write-Success "已停止 API 服务"
    $stoppedCount++
} else {
    Write-Info "API 服务未运行"
}

# 停止所有 node 进程（可选，谨慎使用）
Write-Host ""
$killAllNode = Read-Host "是否停止所有 Node.js 进程？(Y/N，谨慎选择)"
if ($killAllNode -eq "Y" -or $killAllNode -eq "y") {
    $nodeProcesses = Get-Process -Name node -ErrorAction SilentlyContinue
    if ($nodeProcesses) {
        $nodeProcesses | Stop-Process -Force
        $count = ($nodeProcesses | Measure-Object).Count
        Write-Success "已停止 $count 个 Node.js 进程"
        $stoppedCount += $count
    } else {
        Write-Info "没有找到运行中的 Node.js 进程"
    }
}

Write-Host ""
Write-ColorOutput "========================================" "Green"
if ($stoppedCount -gt 0) {
    Write-Success "已停止 $stoppedCount 个服务/进程"
} else {
    Write-Info "没有需要停止的服务"
}
Write-ColorOutput "========================================" "Green"
Write-Host ""
