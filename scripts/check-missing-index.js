#!/usr/bin/env node

import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const postsDir = path.join(__dirname, '../docs/posts')

console.log('🔍 检查缺少 index.md 的目录...\n')

// 递归查找所有目录
function findAllDirs(dir, results = [], depth = 0) {
  // 排除特定目录
  const excludeDirs = ['node_modules', '.git', 'dist', '.vitepress']
  
  const files = fs.readdirSync(dir)

  for (const file of files) {
    const filepath = path.join(dir, file)
    const stat = fs.statSync(filepath)

    if (stat.isDirectory() && !excludeDirs.includes(file)) {
      const relativePath = path.relative(postsDir, filepath)
      results.push({ path: relativePath, depth })
      findAllDirs(filepath, results, depth + 1)
    }
  }

  return results
}

const allDirs = findAllDirs(postsDir)
console.log(`📊 找到 ${allDirs.length} 个子目录\n`)

const missingIndex = []
const hasIndex = []
const hasArticles = []

for (const dir of allDirs) {
  const dirPath = path.join(postsDir, dir.path)
  const indexPath = path.join(dirPath, 'index.md')
  
  // 检查目录中是否有 .md 文件（不包括 index.md）
  const files = fs.readdirSync(dirPath)
  const mdFiles = files.filter(f => f.endsWith('.md') && f !== 'index.md')
  
  if (fs.existsSync(indexPath)) {
    hasIndex.push(dir.path)
    if (mdFiles.length > 0) {
      hasArticles.push({ path: dir.path, count: mdFiles.length })
    }
  }
  else {
    missingIndex.push({ path: dir.path, mdCount: mdFiles.length, depth: dir.depth })
  }
}

console.log('='.repeat(60))
console.log('📋 检查结果')
console.log('='.repeat(60))
console.log()

if (missingIndex.length > 0) {
  console.log(`⚠️  缺少 index.md 的目录 (${missingIndex.length}个):`)
  missingIndex.forEach(dir => {
    const indent = '  '.repeat(dir.depth)
    const articleInfo = dir.mdCount > 0 ? ` [有 ${dir.mdCount} 篇文章]` : ' [无文章]'
    console.log(`   ${indent}📁 ${dir.path}${articleInfo}`)
  })
  console.log()
}

if (hasArticles.length > 0) {
  console.log(`✅ 有 index.md 且有文章的目录 (${hasArticles.length}个):`)
  hasArticles.forEach(dir => {
    console.log(`   📁 ${dir.path} (${dir.count} 篇)`)
  })
  console.log()
}

console.log('='.repeat(60))
console.log('📊 统计')
console.log('='.repeat(60))
console.log(`总目录数: ${allDirs.length}`)
console.log(`✅ 有 index.md: ${hasIndex.length}`)
console.log(`⚠️  缺少 index.md: ${missingIndex.length}`)
console.log(`📄 有文章的目录: ${hasArticles.length}`)
console.log()

if (missingIndex.length === 0) {
  console.log('🎉 所有目录都有 index.md！')
}
else {
  const needIndex = missingIndex.filter(d => d.mdCount > 0)
  if (needIndex.length > 0) {
    console.log(`⚠️  建议为有文章的 ${needIndex.length} 个目录创建 index.md`)
  }
}
