#!/bin/bash
# VitePress Blog Startup Script for macOS/Linux
# Equivalent to start-new.ps1 for Windows

# Enable strict error handling
set -e

# Color codes
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

clear
echo ""
echo -e "${CYAN}============================================================${NC}"
echo -e "${CYAN}          VitePress Blog - Environment Check${NC}"
echo -e "${CYAN}============================================================${NC}"
echo ""

# Show software requirements
echo -e "${YELLOW}Required Software:${NC}"
echo -e "${RED}  [REQUIRED]${NC}"
echo -e "    1. Node.js (v18+)"
echo -e "${CYAN}       Download: https://nodejs.org/${NC}"
echo ""
echo -e "    2. pnpm (v9+)"
echo -e "${CYAN}       Install: npm install -g pnpm${NC}"
echo ""
echo -e "${YELLOW}  [RECOMMENDED]${NC}"
echo -e "    3. Git"
echo -e "${CYAN}       Download: https://git-scm.com/download/${NC}"
echo ""
echo -e "${CYAN}============================================================${NC}"
echo ""

# Change to script directory
cd "$(dirname "$0")"

echo -e "${YELLOW}Checking installed software...${NC}"
echo ""

all_required_installed=true
has_warnings=false

# Check Node.js
echo -e "${CYAN}[1/4] Checking Node.js...${NC}"
if command -v node &> /dev/null; then
    node_version=$(node --version)
    echo -e "${GREEN}  [OK] Node.js $node_version${NC}"
else
    echo ""
    echo -e "${RED}  =================================================${NC}"
    echo -e "${RED}  ERROR: Node.js is NOT installed${NC}"
    echo -e "${RED}  =================================================${NC}"
    echo "  Node.js is required to run this blog."
    echo -e "${CYAN}  Download: https://nodejs.org/${NC}"
    echo -e "${RED}  =================================================${NC}"
    echo ""
    all_required_installed=false
fi

# Check pnpm
echo -e "${CYAN}[2/4] Checking pnpm...${NC}"
if command -v pnpm &> /dev/null; then
    pnpm_version=$(pnpm --version)
    echo -e "${GREEN}  [OK] pnpm v$pnpm_version${NC}"
else
    echo ""
    echo -e "${RED}  =================================================${NC}"
    echo -e "${RED}  ERROR: pnpm is NOT installed${NC}"
    echo -e "${RED}  =================================================${NC}"
    echo -e "${CYAN}  Install command: npm install -g pnpm${NC}"
    echo -e "${RED}  =================================================${NC}"
    echo ""
    all_required_installed=false
fi

# Check Git
echo -e "${CYAN}[3/4] Checking Git...${NC}"
if command -v git &> /dev/null; then
    git_version=$(git --version)
    echo -e "${GREEN}  [OK] $git_version${NC}"
    
    git_user=$(git config --global user.name 2>/dev/null || echo "")
    git_email=$(git config --global user.email 2>/dev/null || echo "")
    
    if [ -z "$git_user" ] || [ -z "$git_email" ]; then
        echo -e "${YELLOW}  [!] Git user not configured${NC}"
        echo -e "\033[90m      git config --global user.name \"Your Name\"${NC}"
        echo -e "\033[90m      git config --global user.email \"your@email.com\"${NC}"
        has_warnings=true
    else
        echo -e "${GREEN}  [OK] User: $git_user ($git_email)${NC}"
    fi
else
    echo ""
    echo -e "${YELLOW}  =================================================${NC}"
    echo -e "${YELLOW}  WARNING: Git is NOT installed (Recommended)${NC}"
   echo -e "${YELLOW}  =================================================${NC}"
    echo "  Git is recommended for version control."
    echo -e "${CYAN}  Download: https://git-scm.com/download/${NC}"
    echo -e "${YELLOW}  =================================================${NC}"
    echo ""
    has_warnings=true
fi

# Check dependencies
echo -e "${CYAN}[4/4] Checking dependencies...${NC}"
if [ -d "node_modules" ]; then
    echo -e "${GREEN}  [OK] Dependencies installed${NC}"
else
    echo -e "${YELLOW}  [!] Dependencies not installed${NC}"
    echo -e "\033[90m      Will install automatically...${NC}"
fi

echo ""

# Exit if required software missing
if [ "$all_required_installed" = false ]; then
    echo -e "${RED}============================================================${NC}"
    echo -e "${RED}                    CANNOT START${NC}"
    echo -e "${RED}============================================================${NC}"
    echo "Please install the required software above."
    echo -e "${RED}============================================================${NC}"
    echo ""
    exit 1
fi

# Show warnings
if [ "$has_warnings" = true ]; then
    echo -e "${YELLOW}Note: Some optional software is missing.${NC}"
    echo -e "\033[90m      The blog will work, but some features may be limited.${NC}"
    echo ""
    echo -ne "${YELLOW}Continue anyway? (Y/N): ${NC}"
    read -r response
    if [ "$response" != "Y" ] && [ "$response" != "y" ]; then
        echo -e "${YELLOW}Exiting...${NC}"
        exit 0
    fi
    echo ""
fi

# Install dependencies if needed
if [ ! -d "node_modules" ]; then
    echo -e "${YELLOW}Installing dependencies...${NC}"
    if ! pnpm install; then
        echo ""
        echo -e "${RED}ERROR: Failed to install dependencies${NC}"
        exit 1
    fi
fi

echo ""
echo -e "${GREEN}============================================================${NC}"
echo -e "${GREEN}Starting services...${NC}"
echo -e "${GREEN}============================================================${NC}"
echo -e "${CYAN}  VitePress:  http://localhost:5173${NC}"
echo -e "${CYAN}  API Server: http://localhost:3456${NC}"
echo -e "${GREEN}============================================================${NC}"
echo ""

echo -e "${YELLOW}Press Ctrl+C to stop${NC}"
echo ""

# 后台任务：8秒后打开浏览器
(
    sleep 8
    
    # 检查端口是否打开
    max_retries=10
    retries=0
    
    while [ $retries -lt $max_retries ]; do
        if nc -z localhost 5173 2>/dev/null; then
            # 根据系统打开浏览器
            if [[ "$OSTYPE" == "darwin"* ]]; then
                open "http://localhost:5173"
            elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
                if command -v xdg-open &> /dev/null; then
                    xdg-open "http://localhost:5173"
                elif command -v gnome-open &> /dev/null; then
                    gnome-open "http://localhost:5173"
                fi
            fi
            break
        fi
        sleep 1
        retries=$((retries + 1))
    done
) &

echo -e "${YELLOW}Browser will open in 8 seconds...${NC}"
echo ""

# 启动服务（前台运行）
pnpm dev
