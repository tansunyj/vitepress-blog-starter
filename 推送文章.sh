#!/bin/bash

echo ""
echo "================================================"
echo "  📝 自动推送文章到 GitHub"
echo "================================================"
echo ""

# 检查是否在 Git 仓库中
if ! git rev-parse --git-dir > /dev/null 2>&1; then
    echo "❌ 错误: 未找到 Git 仓库"
    exit 1
fi

# 检查是否有未提交的更改
if git diff --quiet && git diff --cached --quiet; then
    echo "ℹ️  没有需要提交的更改"
    exit 0
fi

# 获取已修改的 markdown 文件
echo "🔍 检测新增/修改的文章..."
echo ""

articles=()
count=0

# 获取所有修改的 .md 文件
while IFS= read -r line; do
    # 提取文件路径（去掉状态标记）
    filepath="${line:3}"
    
    # 读取文件标题
    if [[ -f "$filepath" ]]; then
        title=$(grep -m 1 "^title:" "$filepath" | sed -E 's/^title:\s*["'\'']*(.+?)["'\'']*\s*$/\1/')
        if [[ -n "$title" ]]; then
            articles+=("$title")
            ((count++))
            echo "  ✓ $title"
        fi
    fi
done < <(git status --short docs/posts/*.md 2>/dev/null | grep -E "^[AM].*\.md$")

# 检测图片资源（排除草稿图片）
echo ""
echo "🖼️  检测图片资源（排除草稿图片）..."
image_count=$(git status --short docs/public/images/covers/ docs/public/images/uploads/ docs/public/images/banner/ 2>/dev/null | wc -l | tr -d ' ')

if [[ $image_count -gt 0 ]]; then
    echo "  ✓ 检测到 $image_count 个图片资源文件"
else
    echo "  ℹ️  无新增图片资源"
fi

# 如果没有检测到文章，使用默认提交信息
if [[ $count -eq 0 ]]; then
    echo ""
    echo "⚠️  未检测到文章标题，使用默认提交信息"
    commit_msg="Update blog content"
else
    echo ""
    echo "================================================"
    echo "📊 统计信息:"
    echo "  • 文章数量: $count 篇"
    echo "  • 图片资源: $image_count 个"
    echo "================================================"
    # 用逗号连接所有文章标题
    IFS=', '
    commit_msg="Add: ${articles[*]}"
    unset IFS
fi

echo ""
echo "================================================"
echo "📦 提交信息预览:"
echo "------------------------------------------------"
echo "$commit_msg"
echo "================================================"
echo ""

# 询问用户确认
read -p "是否继续推送? (Y/n): " confirm
if [[ "$confirm" =~ ^[Nn]$ ]]; then
    echo "❌ 已取消推送"
    exit 0
fi

echo ""
echo "🔄 执行 Git 操作..."
echo ""

# 执行 git add（只添加已发布的内容，排除草稿箱和垃圾箱）
echo "[1/3] 添加文件..."
echo "  • 添加已发布文章..."
git add docs/posts/
echo "  • 添加图片资源（排除草稿图片）..."
git add docs/public/images/covers/ 2>/dev/null || true
git add docs/public/images/uploads/ 2>/dev/null || true
git add docs/public/images/banner/ 2>/dev/null || true
echo "  • 添加配置文件..."
git add docs/.vitepress/config.mts 2>/dev/null || true
git add nav-config.json 2>/dev/null || true
git add tags-config.json 2>/dev/null || true
if [ $? -ne 0 ]; then
    echo "❌ git add 失败"
    exit 1
fi
echo "✓ 已发布内容已添加（已排除草稿箱和垃圾箱）"

# 执行 git commit
echo "[2/3] 提交更改..."
if ! git commit -m "$commit_msg"; then
    echo "❌ git commit 失败"
    exit 1
fi
echo "✓ 更改已提交"

# 执行 git push
echo "[3/3] 推送到远程..."
if ! git push origin main; then
    echo "❌ git push 失败，请检查网络或权限"
    exit 1
fi

echo ""
echo "================================================"
echo "✅ 推送成功！"
echo "================================================"
echo ""
echo "📡 文章将在 1-2 分钟后自动部署"
echo "🌐 请访问你的网站查看效果"
echo ""
