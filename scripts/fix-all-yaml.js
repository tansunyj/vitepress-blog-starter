#!/usr/bin/env node

import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// 辅助函数：转义YAML字符串值
function escapeYamlString(str) {
  if (!str) {
    return '""'
  }
  // 如果包含特殊字符，使用双引号包裹并转义内部的双引号
  const needsQuotes = /[:#\-\[\]{}\n\r\t]/.test(str) || str.startsWith(' ') || str.endsWith(' ')
  if (needsQuotes || str.includes('"')) {
    return `"${str.replace(/"/g, '\\"')}"`
  }
  // 简单字符串也用引号包裹，更安全
  return `"${str}"`
}

const docsDir = path.join(__dirname, '../docs')
const draftsDir = path.join(__dirname, '../drafts')

console.log('🔍 开始扫描所有 Markdown 文件...\n')

// 递归查找所有 .md 文件
function findMarkdownFiles(dir, results = []) {
  const excludeDirs = ['node_modules', '.git', 'dist', '.vitepress/cache', '.vitepress/dist', 'README.md']
  
  const files = fs.readdirSync(dir)

  for (const file of files) {
    const filepath = path.join(dir, file)
    const stat = fs.statSync(filepath)

    if (stat.isDirectory()) {
      const shouldExclude = excludeDirs.some(excluded => filepath.includes(excluded))
      if (!shouldExclude) {
        findMarkdownFiles(filepath, results)
      }
    }
    else if (file.endsWith('.md')) {
      results.push(filepath)
    }
  }

  return results
}

const mdFiles = [
  ...findMarkdownFiles(docsDir),
  ...findMarkdownFiles(draftsDir),
]
console.log(`📊 找到 ${mdFiles.length} 个 Markdown 文件\n`)

const issues = {
  fixed: [],
  errors: [],
  skipped: [],
  noFrontmatter: [],
}

for (const filepath of mdFiles) {
  const relativePath = path.relative(docsDir, filepath)
  
  try {
    const content = fs.readFileSync(filepath, 'utf-8')
    
    // 检查是否有 frontmatter
    const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/)
    if (!frontmatterMatch) {
      issues.noFrontmatter.push(relativePath)
      continue
    }
    
    const [, frontmatterStr, markdown] = frontmatterMatch
    
    // 检查是否需要修复
    let needsFix = false
    const lines = frontmatterStr.split('\n')
    const fixedLines = []
    
    for (const line of lines) {
      // 匹配 key: value 格式
      const keyValueMatch = line.match(/^(\s*)(\w+):\s*(.*)$/)
      if (keyValueMatch) {
        const [, indent, key, value] = keyValueMatch
        
        // 跳过已经有引号的值、tags字段、空值
        if (value && !value.startsWith('"') && !value.startsWith("'") && key !== 'tags' && key !== 'layout') {
          fixedLines.push(`${indent}${key}: ${escapeYamlString(value)}`)
          needsFix = true
        }
        else {
          fixedLines.push(line)
        }
      }
      else {
        fixedLines.push(line)
      }
    }
    
    if (needsFix) {
      const newContent = `---\n${fixedLines.join('\n')}\n---\n${markdown}`
      fs.writeFileSync(filepath, newContent, 'utf-8')
      issues.fixed.push(relativePath)
      console.log(`✅ 已修复: ${relativePath}`)
    }
    else {
      issues.skipped.push(relativePath)
    }
  }
  catch (error) {
    issues.errors.push({ file: relativePath, error: error.message })
    console.error(`❌ 修复失败: ${relativePath} - ${error.message}`)
  }
}

console.log('\n' + '='.repeat(60))
console.log('📋 修复结果报告')
console.log('='.repeat(60))
console.log(`总文件数: ${mdFiles.length}`)
console.log(`✅ 已修复: ${issues.fixed.length}`)
console.log(`⏭️  已是正确格式: ${issues.skipped.length}`)
console.log(`⚠️  无 frontmatter: ${issues.noFrontmatter.length}`)
console.log(`❌ 修复失败: ${issues.errors.length}`)

if (issues.fixed.length > 0) {
  console.log('\n修复的文件：')
  issues.fixed.forEach(f => console.log(`  - ${f}`))
}

if (issues.errors.length > 0) {
  console.log('\n失败的文件：')
  issues.errors.forEach(e => console.log(`  - ${e.file}: ${e.error}`))
}

console.log('\n✅ 修复完成！')
console.log('💡 现在可以运行 pnpm dev 启动项目')
