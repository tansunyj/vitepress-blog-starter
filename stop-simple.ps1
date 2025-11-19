# VitePress Blog Stop Script
# Encoding: UTF-8 with BOM

$OutputEncoding = [System.Text.Encoding]::UTF8
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8

Clear-Host
Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "   Stopping VitePress Blog Services" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Kill VitePress dev server (port 5173)
Write-Host "Stopping VitePress (port 5173)..." -ForegroundColor Yellow
$viteProcesses = Get-NetTCPConnection -LocalPort 5173 -ErrorAction SilentlyContinue | 
    Select-Object -ExpandProperty OwningProcess -Unique
foreach ($pid in $viteProcesses) {
    try {
        Stop-Process -Id $pid -Force -ErrorAction SilentlyContinue
        Write-Host "  Stopped process $pid" -ForegroundColor Green
    } catch {
        # Ignore errors
    }
}

# Kill API server (port 3456)
Write-Host "Stopping API Server (port 3456)..." -ForegroundColor Yellow
$apiProcesses = Get-NetTCPConnection -LocalPort 3456 -ErrorAction SilentlyContinue | 
    Select-Object -ExpandProperty OwningProcess -Unique
foreach ($pid in $apiProcesses) {
    try {
        Stop-Process -Id $pid -Force -ErrorAction SilentlyContinue
        Write-Host "  Stopped process $pid" -ForegroundColor Green
    } catch {
        # Ignore errors
    }
}

# Kill any remaining node processes related to this project
Write-Host "Cleaning up Node.js processes..." -ForegroundColor Yellow
Get-Process node -ErrorAction SilentlyContinue | Where-Object {
    $_.CommandLine -like "*vitepress*" -or $_.CommandLine -like "*fetch-server*"
} | ForEach-Object {
    try {
        Stop-Process -Id $_.Id -Force -ErrorAction SilentlyContinue
        Write-Host "  Stopped node process $($_.Id)" -ForegroundColor Green
    } catch {
        # Ignore errors
    }
}

Write-Host ""
Write-Host "All services stopped!" -ForegroundColor Green
Write-Host ""
