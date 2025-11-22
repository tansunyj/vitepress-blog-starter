#!/usr/bin/env node

import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const postsDir = path.join(__dirname, '../docs/posts')

console.log('🔍 开始扫描所有 index.md 文件...\n')

// 递归查找所有 index.md 文件
function findIndexFiles(dir, results = []) {
  const files = fs.readdirSync(dir)

  for (const file of files) {
    const filepath = path.join(dir, file)
    const stat = fs.statSync(filepath)

    if (stat.isDirectory()) {
      findIndexFiles(filepath, results)
    }
    else if (file === 'index.md') {
      results.push(filepath)
    }
  }

  return results
}

const indexFiles = findIndexFiles(postsDir)
console.log(`📊 找到 ${indexFiles.length} 个 index.md 文件\n`)

const issues = {
  categoryPosts: [],
  noLayout: [],
  noPostList: [],
  correct: [],
  empty: [],
}

for (const filepath of indexFiles) {
  const relativePath = path.relative(postsDir, filepath)
  const content = fs.readFileSync(filepath, 'utf-8')

  // 检查是否为空或几乎为空
  if (content.trim().length < 10) {
    issues.empty.push(relativePath)
    continue
  }

  // 检查是否使用了 CategoryPosts
  if (content.includes('<CategoryPosts')) {
    issues.categoryPosts.push(relativePath)
    continue
  }

  // 检查是否包含 layout: doc
  if (!content.includes('layout: doc')) {
    issues.noLayout.push(relativePath)
  }

  // 检查是否包含 PostList
  if (!content.includes('<PostList')) {
    issues.noPostList.push(relativePath)
  }
  else {
    issues.correct.push(relativePath)
  }
}

// 输出报告
console.log('=' .repeat(60))
console.log('📋 扫描结果报告')
console.log('=' .repeat(60))
console.log()

if (issues.categoryPosts.length > 0) {
  console.log('❌ 使用错误组件 CategoryPosts (' + issues.categoryPosts.length + '个):')
  issues.categoryPosts.forEach(file => console.log(`   - ${file}`))
  console.log()
}

if (issues.empty.length > 0) {
  console.log('⚠️  空文件或内容过少 (' + issues.empty.length + '个):')
  issues.empty.forEach(file => console.log(`   - ${file}`))
  console.log()
}

if (issues.noLayout.length > 0) {
  console.log('⚠️  缺少 layout: doc (' + issues.noLayout.length + '个):')
  issues.noLayout.forEach(file => console.log(`   - ${file}`))
  console.log()
}

if (issues.noPostList.length > 0) {
  console.log('⚠️  没有使用 PostList 组件 (' + issues.noPostList.length + '个):')
  issues.noPostList.forEach(file => console.log(`   - ${file}`))
  console.log()
}

if (issues.correct.length > 0) {
  console.log('✅ 格式正确 (' + issues.correct.length + '个):')
  issues.correct.forEach(file => console.log(`   - ${file}`))
  console.log()
}

console.log('=' .repeat(60))
console.log('📊 统计汇总')
console.log('=' .repeat(60))
console.log(`总文件数: ${indexFiles.length}`)
console.log(`✅ 正确: ${issues.correct.length}`)
console.log(`❌ 错误组件: ${issues.categoryPosts.length}`)
console.log(`⚠️  空文件: ${issues.empty.length}`)
console.log(`⚠️  缺少layout: ${issues.noLayout.length}`)
console.log(`⚠️  没有PostList: ${issues.noPostList.length}`)
console.log()

if (issues.categoryPosts.length === 0 && issues.empty.length === 0) {
  console.log('🎉 所有文件都使用了正确的组件！')
}
else {
  console.log('💡 建议运行 node scripts/fix-index-pages.js 来自动修复')
}
