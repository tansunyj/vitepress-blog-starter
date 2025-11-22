#!/usr/bin/env node

import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// 需要修复的目录列表（folder路径 -> 标题）
const indexPages = {
  'vpn-proxy/free-nodes': { title: '免费节点', emoji: '🔔', desc: '本板块每日更新免费VPN节点' },
  'vpn-proxy/airport-review': { title: '机场推荐', emoji: '✈️', desc: '优质VPN机场推荐与对比' },
  'resources/software': { title: '软件工具', emoji: '💾', desc: '精选实用软件' },
  'resources/quark': { title: '夸克资源', emoji: '📦', desc: '精选夸克网盘资源' },
  'resources/learning-materials': { title: '学习资源', emoji: '📚', desc: '精选优质学习资料' },
  'blog/tutorials': { title: '教程合集', emoji: '📚', desc: '手把手教程，解决实际问题' },
  'blog/recommendations': { title: '精选推荐', emoji: '🌟', desc: '好用的工具、网站和资源推荐' },
  'blog/freebies': { title: '免费资源', emoji: '✨', desc: '精选各种免费资源和白嫖技巧' },
  'ai/workflow': { title: 'AI工作流', emoji: '🔄', desc: '探索AI自动化工作流和应用案例' },
  'ai/tutorial': { title: 'AI教程', emoji: '📖', desc: '系统化的AI学习教程' },
  'ai/prompts': { title: '提示词库', emoji: '💬', desc: '精选各类AI提示词' },
  'ai/llm': { title: '大语言模型', emoji: '🧠', desc: '深入了解各种大语言模型' },
  'ai/advanced': { title: 'AI进阶', emoji: '🚀', desc: '深入探索AI的高级应用' },
}

const postsDir = path.join(__dirname, '../docs/posts')

console.log('🔧 开始修复 index.md 文件...\n')

let fixed = 0
let errors = []

for (const [folder, info] of Object.entries(indexPages)) {
  const indexPath = path.join(postsDir, folder, 'index.md')
  
  if (!fs.existsSync(indexPath)) {
    console.log(`⚠️  文件不存在: ${folder}/index.md`)
    continue
  }
  
  try {
    const content = fs.readFileSync(indexPath, 'utf-8')
    
    // 检查是否包含 CategoryPosts
    if (!content.includes('<CategoryPosts')) {
      console.log(`✓  已是正确格式: ${folder}/index.md`)
      continue
    }
    
    // 生成新内容
    const newContent = `---
layout: doc
title: ${info.title}
description: ${info.emoji} ${info.title} | ${info.desc}
---

# ${info.emoji} ${info.title}

${info.desc}

## 📚 文章列表

<PostList folder="${folder}" />
`
    
    fs.writeFileSync(indexPath, newContent, 'utf-8')
    console.log(`✅ 已修复: ${folder}/index.md`)
    fixed++
  }
  catch (error) {
    console.error(`❌ 修复失败: ${folder}/index.md - ${error.message}`)
    errors.push({ folder, error: error.message })
  }
}

console.log(`\n✅ 修复完成！`)
console.log(`   成功: ${fixed} 个`)
if (errors.length > 0) {
  console.log(`   失败: ${errors.length} 个`)
  errors.forEach(e => console.log(`     - ${e.folder}: ${e.error}`))
}
