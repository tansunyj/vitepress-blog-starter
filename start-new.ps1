# VitePress Blog Startup Script
# Pure ASCII version - No Unicode characters

$OutputEncoding = [System.Text.Encoding]::UTF8
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8

Clear-Host
Write-Host ""
Write-Host "============================================================" -ForegroundColor Cyan
Write-Host "          VitePress Blog - Environment Check" -ForegroundColor Cyan
Write-Host "============================================================" -ForegroundColor Cyan
Write-Host ""

# Show software requirements
Write-Host "Required Software:" -ForegroundColor Yellow
Write-Host "  [REQUIRED]" -ForegroundColor Red
Write-Host "    1. Node.js (v18+)" -ForegroundColor White
Write-Host "       Download: https://nodejs.org/" -ForegroundColor Cyan
Write-Host ""
Write-Host "    2. pnpm (v9+)" -ForegroundColor White
Write-Host "       Install: npm install -g pnpm" -ForegroundColor Cyan
Write-Host ""
Write-Host "  [RECOMMENDED]" -ForegroundColor Yellow
Write-Host "    3. Git" -ForegroundColor White
Write-Host "       Download: https://git-scm.com/download/win" -ForegroundColor Cyan
Write-Host ""
Write-Host "============================================================" -ForegroundColor Cyan
Write-Host ""

Set-Location $PSScriptRoot

Write-Host "Checking installed software..." -ForegroundColor Yellow
Write-Host ""

$allRequiredInstalled = $true
$hasWarnings = $false

# Check Node.js
Write-Host "[1/4] Checking Node.js..." -ForegroundColor Cyan
try {
    $nodeVersion = node --version 2>$null
    if ($LASTEXITCODE -eq 0) {
        Write-Host "  [OK] Node.js $nodeVersion" -ForegroundColor Green
    } else {
        Write-Host ""
        Write-Host "  =================================================" -ForegroundColor Red
        Write-Host "  ERROR: Node.js is NOT installed" -ForegroundColor Red
        Write-Host "  =================================================" -ForegroundColor Red
        Write-Host "  Node.js is required to run this blog." -ForegroundColor White
        Write-Host "  Download: https://nodejs.org/" -ForegroundColor Cyan
        Write-Host "  =================================================" -ForegroundColor Red
        Write-Host ""
        $allRequiredInstalled = $false
    }
} catch {
    Write-Host ""
    Write-Host "  ERROR: Node.js is NOT installed" -ForegroundColor Red
    Write-Host "  Download: https://nodejs.org/" -ForegroundColor Cyan
    Write-Host ""
    $allRequiredInstalled = $false
}

# Check pnpm
Write-Host "[2/4] Checking pnpm..." -ForegroundColor Cyan
try {
    $pnpmVersion = pnpm --version 2>$null
    if ($LASTEXITCODE -eq 0) {
        Write-Host "  [OK] pnpm v$pnpmVersion" -ForegroundColor Green
    } else {
        Write-Host ""
        Write-Host "  =================================================" -ForegroundColor Red
        Write-Host "  ERROR: pnpm is NOT installed" -ForegroundColor Red
        Write-Host "  =================================================" -ForegroundColor Red
        Write-Host "  Install command: npm install -g pnpm" -ForegroundColor Cyan
        Write-Host "  =================================================" -ForegroundColor Red
        Write-Host ""
        $allRequiredInstalled = $false
    }
} catch {
    Write-Host ""
    Write-Host "  ERROR: pnpm is NOT installed" -ForegroundColor Red
    Write-Host "  Install: npm install -g pnpm" -ForegroundColor Cyan
    Write-Host ""
    $allRequiredInstalled = $false
}

# Check Git
Write-Host "[3/4] Checking Git..." -ForegroundColor Cyan
try {
    $gitVersion = git --version 2>$null
    if ($LASTEXITCODE -eq 0) {
        Write-Host "  [OK] $gitVersion" -ForegroundColor Green
        
        $gitUser = git config --global user.name 2>$null
        $gitEmail = git config --global user.email 2>$null
        
        if (-not $gitUser -or -not $gitEmail) {
            Write-Host "  [!] Git user not configured" -ForegroundColor Yellow
            Write-Host "      git config --global user.name ""Your Name""" -ForegroundColor Gray
            Write-Host "      git config --global user.email ""your@email.com""" -ForegroundColor Gray
            $hasWarnings = $true
        } else {
            $userInfo = "$gitUser ($gitEmail)"
            Write-Host "  [OK] User: $userInfo" -ForegroundColor Green
        }
    } else {
        Write-Host ""
        Write-Host "  =================================================" -ForegroundColor Yellow
        Write-Host "  WARNING: Git is NOT installed (Recommended)" -ForegroundColor Yellow
        Write-Host "  =================================================" -ForegroundColor Yellow
        Write-Host "  Git is recommended for version control." -ForegroundColor White
        Write-Host "  Download: https://git-scm.com/download/win" -ForegroundColor Cyan
        Write-Host "  =================================================" -ForegroundColor Yellow
        Write-Host ""
        $hasWarnings = $true
    }
} catch {
    Write-Host ""
    Write-Host "  WARNING: Git is NOT installed" -ForegroundColor Yellow
    Write-Host "  Download: https://git-scm.com/download/win" -ForegroundColor Cyan
    Write-Host ""
    $hasWarnings = $true
}

# Check dependencies
Write-Host "[4/4] Checking dependencies..." -ForegroundColor Cyan
if (Test-Path "node_modules") {
    Write-Host "  [OK] Dependencies installed" -ForegroundColor Green
} else {
    Write-Host "  [!] Dependencies not installed" -ForegroundColor Yellow
    Write-Host "      Will install automatically..." -ForegroundColor Gray
}

Write-Host ""

# Exit if required software missing
if (-not $allRequiredInstalled) {
    Write-Host "============================================================" -ForegroundColor Red
    Write-Host "                    CANNOT START" -ForegroundColor Red
    Write-Host "============================================================" -ForegroundColor Red
    Write-Host "Please install the required software above." -ForegroundColor White
    Write-Host "============================================================" -ForegroundColor Red
    Write-Host ""
    pause
    exit 1
}

# Show warnings
if ($hasWarnings) {
    Write-Host "Note: Some optional software is missing." -ForegroundColor Yellow
    Write-Host "      The blog will work, but some features may be limited." -ForegroundColor Gray
    Write-Host ""
    Write-Host "Continue anyway? (Y/N): " -ForegroundColor Yellow -NoNewline
    $response = Read-Host
    if ($response -ne "Y" -and $response -ne "y") {
        Write-Host "Exiting..." -ForegroundColor Yellow
        exit 0
    }
    Write-Host ""
}

# Install dependencies if needed
if (-not (Test-Path "node_modules")) {
    Write-Host "Installing dependencies..." -ForegroundColor Yellow
    pnpm install
    if ($LASTEXITCODE -ne 0) {
        Write-Host ""
        Write-Host "ERROR: Failed to install dependencies" -ForegroundColor Red
        pause
        exit 1
    }
}

Write-Host ""
Write-Host "============================================================" -ForegroundColor Green
Write-Host "Starting services..." -ForegroundColor Green
Write-Host "============================================================" -ForegroundColor Green
Write-Host "  VitePress:  http://localhost:5173" -ForegroundColor Cyan
Write-Host "  API Server: http://localhost:3456" -ForegroundColor Cyan
Write-Host "============================================================" -ForegroundColor Green
Write-Host ""
Write-Host "Press Ctrl+C to stop" -ForegroundColor Yellow
Write-Host ""

# Start dev server
pnpm dev
