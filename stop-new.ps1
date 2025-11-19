# VitePress Blog Stop Script
# Pure ASCII version

$OutputEncoding = [System.Text.Encoding]::UTF8
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8

Clear-Host
Write-Host ""
Write-Host "============================================================" -ForegroundColor Cyan
Write-Host "          Stopping VitePress Blog Services" -ForegroundColor Cyan
Write-Host "============================================================" -ForegroundColor Cyan
Write-Host ""

# Stop VitePress (port 5173)
Write-Host "[1/2] Stopping VitePress (port 5173)..." -ForegroundColor Yellow
$viteProcesses = Get-NetTCPConnection -LocalPort 5173 -ErrorAction SilentlyContinue | 
    Select-Object -ExpandProperty OwningProcess -Unique

if ($viteProcesses) {
    foreach ($pid in $viteProcesses) {
        try {
            Stop-Process -Id $pid -Force -ErrorAction SilentlyContinue
            Write-Host "  [OK] Stopped process $pid" -ForegroundColor Green
        } catch {
            Write-Host "  [!] Could not stop process $pid" -ForegroundColor Yellow
        }
    }
} else {
    Write-Host "  [OK] No VitePress process found" -ForegroundColor Gray
}

# Stop API Server (port 3456)
Write-Host "[2/2] Stopping API Server (port 3456)..." -ForegroundColor Yellow
$apiProcesses = Get-NetTCPConnection -LocalPort 3456 -ErrorAction SilentlyContinue | 
    Select-Object -ExpandProperty OwningProcess -Unique

if ($apiProcesses) {
    foreach ($pid in $apiProcesses) {
        try {
            Stop-Process -Id $pid -Force -ErrorAction SilentlyContinue
            Write-Host "  [OK] Stopped process $pid" -ForegroundColor Green
        } catch {
            Write-Host "  [!] Could not stop process $pid" -ForegroundColor Yellow
        }
    }
} else {
    Write-Host "  [OK] No API Server process found" -ForegroundColor Gray
}

# Clean up any remaining node processes
Write-Host ""
Write-Host "Cleaning up Node.js processes..." -ForegroundColor Yellow
$cleaned = $false

Get-Process node -ErrorAction SilentlyContinue | ForEach-Object {
    $cmdLine = $_.CommandLine
    if ($cmdLine -and ($cmdLine -like "*vitepress*" -or $cmdLine -like "*fetch-server*")) {
        try {
            Stop-Process -Id $_.Id -Force -ErrorAction SilentlyContinue
            Write-Host "  [OK] Stopped node process $($_.Id)" -ForegroundColor Green
            $cleaned = $true
        } catch {
            # Ignore
        }
    }
}

if (-not $cleaned) {
    Write-Host "  [OK] No related processes found" -ForegroundColor Gray
}

Write-Host ""
Write-Host "============================================================" -ForegroundColor Green
Write-Host "All services stopped!" -ForegroundColor Green
Write-Host "============================================================" -ForegroundColor Green
Write-Host ""
