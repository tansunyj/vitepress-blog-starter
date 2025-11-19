import fs from 'node:fs'
import path from 'node:path'
import process from 'node:process'
import readline from 'node:readline'
import { fileURLToPath } from 'node:url'
import axios from 'axios'
import * as cheerio from 'cheerio'
import TurndownService from 'turndown'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// 创建readline接口用于命令行交互
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
})

// 封装问题函数
function question(prompt) {
  return new Promise((resolve) => {
    rl.question(prompt, resolve)
  })
}

// 配置
const CONFIG = {
  // 图片保存目录
  imageDir: path.join(__dirname, '../docs/public/images/articles'),
  // 文章保存目录
  postsBaseDir: path.join(__dirname, '../docs/posts'),
  // 默认作者
  defaultAuthor: '杰哥',
  // User-Agent
  userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
}

// 确保目录存在
function ensureDir(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true })
  }
}

// 下载图片
async function downloadImage(url, filename) {
  try {
    const response = await axios({
      url,
      method: 'GET',
      responseType: 'arraybuffer',
      headers: {
        'User-Agent': CONFIG.userAgent,
        'Referer': 'https://mp.weixin.qq.com/',
      },
      timeout: 30000,
    })

    const filepath = path.join(CONFIG.imageDir, filename)
    fs.writeFileSync(filepath, response.data)
    console.log(`  ✓ 图片下载成功: ${filename}`)
    return `/images/articles/${filename}`
  }
  catch (error) {
    console.error(`  ✗ 图片下载失败 ${url}:`, error.message)
    return url // 返回原URL
  }
}

// 生成文件名安全字符串
function sanitizeFilename(str) {
  return str
    .replace(/[<>:"/\\|?*\x00-\x1F]/g, '') // 移除非法字符
    .replace(/\s+/g, '-') // 空格转短横线
    .replace(/[，。！？；：""''（）【】《》、]/g, '') // 移除中文标点
    .substring(0, 50) // 限制长度
}

// 生成唯一文件名
function generateUniqueFilename(title, category) {
  const timestamp = Date.now()
  const safeTitle = sanitizeFilename(title)
  return `${safeTitle}-${timestamp}.md`
}

// 爬取文章
async function fetchArticle(url) {
  console.log('\n🔍 开始爬取文章...\n')

  try {
    // 1. 获取HTML内容
    console.log('📡 正在获取页面内容...')
    const response = await axios({
      url,
      method: 'GET',
      headers: {
        'User-Agent': CONFIG.userAgent,
        'Referer': 'https://mp.weixin.qq.com/',
      },
      timeout: 30000,
    })

    const html = response.data
    const $ = cheerio.load(html)

    // 2. 提取文章信息
    console.log('📝 正在解析文章内容...\n')

    // 微信公众号文章选择器
    let title = $('#activity-name').text().trim()
      || $('.rich_media_title').text().trim()
      || $('h1').first().text().trim()
      || '未命名文章'

    let author = $('#js_name').text().trim()
      || $('.rich_media_meta_text').text().trim()
      || CONFIG.defaultAuthor

    let publishTime = $('#publish_time').text().trim()
      || $('.rich_media_meta_text').eq(1).text().trim()
      || new Date().toISOString().split('T')[0]

    // 提取文章内容
    let content = $('#js_content').html()
      || $('.rich_media_content').html()
      || $('article').html()
      || $('body').html()

    if (!content) {
      throw new Error('无法提取文章内容，请检查URL是否正确')
    }

    console.log(`  标题: ${title}`)
    console.log(`  作者: ${author}`)
    console.log(`  日期: ${publishTime}\n`)

    // 3. 处理图片
    console.log('🖼️  正在处理图片...\n')
    ensureDir(CONFIG.imageDir)

    const $content = cheerio.load(content)
    const images = []
    let imageIndex = 1

    // 找到所有图片
    $content('img').each((i, elem) => {
      const src = $content(elem).attr('src') || $content(elem).attr('data-src')
      if (src && src.startsWith('http')) {
        images.push({ elem, src })
      }
    })

    // 下载图片并替换链接
    for (const { elem, src } of images) {
      const ext = path.extname(new URL(src).pathname) || '.jpg'
      const filename = `${sanitizeFilename(title)}-${imageIndex}${ext}`
      const localPath = await downloadImage(src, filename)
      $content(elem).attr('src', localPath)
      imageIndex++
    }

    content = $content.html()

    // 4. 转换为Markdown
    console.log('\n📄 正在转换为Markdown...\n')
    const turndownService = new TurndownService({
      headingStyle: 'atx',
      codeBlockStyle: 'fenced',
      emDelimiter: '*',
    })

    // 自定义规则：保持图片
    turndownService.addRule('images', {
      filter: 'img',
      replacement: (content, node) => {
        const src = node.getAttribute('src') || ''
        const alt = node.getAttribute('alt') || '图片'
        return `\n![${alt}](${src})\n`
      },
    })

    // 自定义规则：清理微信特殊标签
    turndownService.addRule('cleanWechatTags', {
      filter: (node) => {
        return node.nodeName === 'SECTION'
          || node.nodeName === 'P'
          || node.className?.includes('rich_media')
      },
      replacement: (content) => {
        return content
      },
    })

    const markdown = turndownService.turndown(content)

    // 5. 清理Markdown内容
    const cleanedMarkdown = markdown
      .replace(/\n{3,}/g, '\n\n') // 移除多余空行
      .replace(/^\s+|\s+$/g, '') // 移除首尾空白
      .trim()

    return {
      title,
      author,
      publishTime,
      markdown: cleanedMarkdown,
      imageCount: images.length,
    }
  }
  catch (error) {
    console.error('\n❌ 爬取失败:', error.message)
    throw error
  }
}

// 保存文章
async function saveArticle(articleData, category, tags) {
  const { title, author, publishTime, markdown, imageCount } = articleData

  // 构建文章frontmatter
  const frontmatter = `---
title: ${title}
description: ${title}
date: ${publishTime}
author: ${author}
category: ${category}
tags:
${tags.map(tag => `  - ${tag}`).join('\n')}
---

`

  const fullContent = frontmatter + markdown

  // 生成文件路径
  const categoryPath = path.join(CONFIG.postsBaseDir, category.toLowerCase())
  ensureDir(categoryPath)

  const filename = generateUniqueFilename(title, category)
  const filepath = path.join(categoryPath, filename)

  // 保存文件
  fs.writeFileSync(filepath, fullContent, 'utf-8')

  return { filepath, filename }
}

// 主函数
async function main() {
  console.log('\n╔════════════════════════════════════════════╗')
  console.log('║   微信公众号文章爬取工具 v1.0           ║')
  console.log('╚════════════════════════════════════════════╝\n')

  try {
    // 1. 获取文章URL
    const url = await question('📌 请输入文章URL: ')
    if (!url || !url.startsWith('http')) {
      throw new Error('请输入有效的URL')
    }

    // 2. 爬取文章
    const articleData = await fetchArticle(url)

    // 3. 选择分类
    console.log('\n📂 请选择文章分类:')
    console.log('  1. blog/tutorials (教程)')
    console.log('  2. blog/freebies (白嫖指南)')
    console.log('  3. blog/recommendations (推荐)')
    console.log('  4. vpn-proxy/tutorial (VPN教程)')
    console.log('  5. vpn-proxy/free-nodes (免费节点)')
    console.log('  6. ai/tools (AI工具)')
    console.log('  7. ai/tutorial (AI教程)')
    console.log('  8. resources/quark (夸克资料)')
    console.log('  9. 自定义分类\n')

    const categoryChoice = await question('请选择 (1-9): ')

    const categoryMap = {
      1: 'blog/tutorials',
      2: 'blog/freebies',
      3: 'blog/recommendations',
      4: 'vpn-proxy/tutorial',
      5: 'vpn-proxy/free-nodes',
      6: 'ai/tools',
      7: 'ai/tutorial',
      8: 'resources/quark',
    }

    let category = categoryMap[categoryChoice]
    if (categoryChoice === '9') {
      category = await question('请输入自定义分类路径 (如: blog/custom): ')
    }
    if (!category) {
      throw new Error('无效的分类选择')
    }

    // 4. 输入标签
    const tagsInput = await question('\n🏷️  请输入文章标签 (用逗号分隔，如: 教程,VPN,技术): ')
    const tags = tagsInput.split(/[,，]/).map(tag => tag.trim()).filter(Boolean)

    if (tags.length === 0) {
      tags.push('默认')
    }

    // 5. 保存文章
    console.log('\n💾 正在保存文章...\n')
    const { filepath, filename } = await saveArticle(articleData, category, tags)

    // 6. 完成
    console.log('\n╔════════════════════════════════════════════╗')
    console.log('║          ✅ 文章爬取成功！              ║')
    console.log('╚════════════════════════════════════════════╝\n')
    console.log(`📄 文件名: ${filename}`)
    console.log(`📂 保存路径: ${filepath}`)
    console.log(`🖼️  下载图片: ${articleData.imageCount} 张`)
    console.log(`📝 字数统计: ${articleData.markdown.length} 字符\n`)
    console.log('💡 提示: 你可以在编辑器中打开文件进行进一步编辑\n')
  }
  catch (error) {
    console.error('\n❌ 错误:', error.message)
    process.exit(1)
  }
  finally {
    rl.close()
  }
}

// 运行
main()
