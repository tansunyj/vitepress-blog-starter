@echo off
chcp 65001 >nul
setlocal enabledelayedexpansion

echo.
echo ================================================
echo   📝 自动推送文章到 GitHub
echo ================================================
echo.

:: 检查是否有 Git 变更
git status --short >nul 2>&1
if errorlevel 1 (
    echo ❌ 错误: 未找到 Git 仓库
    pause
    exit /b 1
)

:: 检查是否有未提交的更改
git diff --quiet
if %errorlevel% equ 0 (
    git diff --cached --quiet
    if !errorlevel! equ 0 (
        echo ℹ️  没有需要提交的更改
        pause
        exit /b 0
    )
)

:: 获取已修改的 markdown 文件
echo 🔍 检测新增/修改的文章...
echo.

set "articles="
set "count=0"

:: 获取所有修改的 .md 文件
for /f "tokens=*" %%f in ('git status --short docs/posts/*.md 2^>nul ^| findstr /R "^[AM].*\.md$"') do (
    set "line=%%f"
    :: 提取文件路径（去掉状态标记）
    set "filepath=!line:~3!"
    
    :: 读取文件标题
    for /f "usebackq tokens=*" %%t in (`powershell -Command "$content = Get-Content '!filepath!' -Encoding UTF8; $title = ($content | Select-String -Pattern '^title:\s*(.+)$' | Select-Object -First 1).Matches.Groups[1].Value.Trim().Trim('\"'''); if ($title) { $title } else { 'Untitled' }"`) do (
        set "title=%%t"
        if not "!title!"=="" (
            if !count! gtr 0 (
                set "articles=!articles!, !title!"
            ) else (
                set "articles=!title!"
            )
            set /a count+=1
            echo   ✓ !title!
        )
    )
)

:: 检测图片资源（排除草稿图片）
echo.
echo 🖼️  检测图片资源（排除草稿图片）...
set "image_count=0"
for /f %%i in ('git status --short docs/public/images/covers/ docs/public/images/uploads/ docs/public/images/banner/ 2^>nul ^| find /c /v ""') do set "image_count=%%i"

if !image_count! gtr 0 (
    echo   ✓ 检测到 !image_count! 个图片资源文件
) else (
    echo   ℹ️  无新增图片资源
)

:: 如果没有检测到文章，使用默认提交信息
if !count! equ 0 (
    echo.
    echo ⚠️  未检测到文章标题，使用默认提交信息
    set "commit_msg=Update blog content"
) else (
    echo.
    echo ================================================
    echo 📊 统计信息:
    echo   • 文章数量: !count! 篇
    echo   • 图片资源: !image_count! 个
    echo ================================================
    set "commit_msg=Add: !articles!"
)

echo.
echo ================================================
echo 📦 提交信息预览:
echo ------------------------------------------------
echo !commit_msg!
echo ================================================
echo.

:: 询问用户确认
set /p "confirm=是否继续推送? (Y/n): "
if /i "!confirm!"=="n" (
    echo ❌ 已取消推送
    pause
    exit /b 0
)

echo.
echo 🔄 执行 Git 操作...
echo.

:: 执行 git add（只添加已发布的内容，排除草稿箱和垃圾箱）
echo [1/3] 添加文件...
echo   • 添加已发布文章...
git add docs/posts/
echo   • 添加图片资源（排除草稿图片）...
git add docs/public/images/covers/ 2>nul
git add docs/public/images/uploads/ 2>nul
git add docs/public/images/banner/ 2>nul
echo   • 添加配置文件...
git add docs/.vitepress/config.mts 2>nul
git add nav-config.json 2>nul
git add tags-config.json 2>nul
if errorlevel 1 (
    echo ❌ git add 失败
    pause
    exit /b 1
)
echo ✓ 已发布内容已添加（已排除草稿箱和垃圾箱）

:: 执行 git commit
echo [2/3] 提交更改...
git commit -m "!commit_msg!"
if errorlevel 1 (
    echo ❌ git commit 失败
    pause
    exit /b 1
)
echo ✓ 更改已提交

:: 执行 git push
echo [3/3] 推送到远程...
git push origin main
if errorlevel 1 (
    echo ❌ git push 失败，请检查网络或权限
    pause
    exit /b 1
)

echo.
echo ================================================
echo ✅ 推送成功！
echo ================================================
echo.
echo 📡 文章将在 1-2 分钟后自动部署
echo 🌐 请访问你的网站查看效果
echo.
pause
