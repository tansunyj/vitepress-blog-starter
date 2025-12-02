import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import axios from 'axios'
import * as cheerio from 'cheerio'
import cors from 'cors'
import express from 'express'
import multer from 'multer'
import matter from 'gray-matter'
import { remark } from 'remark'
import remarkGfm from 'remark-gfm'
import remarkStringify from 'remark-stringify'
import TurndownService from 'turndown'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()
const PORT = 3456

app.use(cors())
app.use(express.json())
app.use(express.json({ limit: '50mb' }))
app.use(express.urlencoded({ extended: true, limit: '50mb' }))

// Multer配置 - Banner图片上传
const bannerStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, '../docs/public/images/banner')
    // 确保目录存在
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true })
    }
    cb(null, uploadDir)
  },
  filename: (req, file, cb) => {
    // 使用时间戳生成唯一文件名
    const ext = path.extname(file.originalname)
    const filename = `banner-${Date.now()}${ext}`
    cb(null, filename)
  }
})

const bannerUpload = multer({
  storage: bannerStorage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB限制
  fileFilter: (req, file, cb) => {
    // 只允许图片格式
    const allowedTypes = /jpeg|jpg|png|gif|webp/
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase())
    const mimetype = allowedTypes.test(file.mimetype)

    if (extname && mimetype) {
      cb(null, true)
    } else {
      cb(new Error('只允许上传图片文件 (jpeg, jpg, png, gif, webp)'))
    }
  }
})

// Multer配置 - 文章封面图片上传
const coverStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, '../docs/public/images/covers')
    // 确保目录存在
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true })
    }
    cb(null, uploadDir)
  },
  filename: (req, file, cb) => {
    // 使用草稿ID作为文件名，确保封面和草稿对应
    const draftId = req.body.draftId || `draft-${Date.now()}`
    const ext = path.extname(file.originalname)
    const filename = `cover-${draftId}${ext}`
    cb(null, filename)
  }
})

const coverUpload = multer({
  storage: coverStorage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB限制
  fileFilter: (req, file, cb) => {
    // 只允许图片格式
    const allowedTypes = /jpeg|jpg|png|gif|webp/
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase())
    const mimetype = allowedTypes.test(file.mimetype)

    if (extname && mimetype) {
      cb(null, true)
    } else {
      cb(new Error('只允许上传图片文件 (jpeg, jpg, png, gif, webp)'))
    }
  }
})

// Multer配置 - 通用图片上传 (Markdown编辑器用)
const uploadStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, '../docs/public/images/uploads')
    // 确保目录存在
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true })
    }
    cb(null, uploadDir)
  },
  filename: (req, file, cb) => {
    // 使用时间戳生成唯一文件名
    const ext = path.extname(file.originalname)
    const filename = `upload-${Date.now()}${ext}`
    cb(null, filename)
  }
})



const generalUpload = multer({
  storage: uploadStorage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB限制
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp/
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase())
    const mimetype = allowedTypes.test(file.mimetype)

    if (extname && mimetype) {
      cb(null, true)
    } else {
      cb(new Error('只允许上传图片文件 (jpeg, jpg, png, gif, webp)'))
    }
  }
})

const CONFIG = {
  imagesBaseDir: path.join(__dirname, '../docs/public/images/articles'),
  postsBaseDir: path.join(__dirname, '../docs/posts'),
  draftsBaseDir: path.join(__dirname, '../drafts/articles'),
  trashBaseDir: path.join(__dirname, '../trash'),
  draftImagesBaseDir: path.join(__dirname, '../docs/public/images/drafts'),
  publicImagesBaseDir: path.join(__dirname, '../docs/public/images'),
  defaultAuthor: '杰哥',
  userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
}

// 导航配置（默认配置，会被nav-config.json覆盖）
let NAV_CONFIG = [
  {
    text: '🚀 网络加速',
    items: [
      { text: '每日节点', link: '/posts/vpn-proxy/free-nodes/', folder: 'vpn-proxy/free-nodes' },
      { text: 'VPN教程', link: '/posts/vpn-proxy/tutorial/', folder: 'vpn-proxy/tutorial' },
      { text: '机场', link: '/posts/vpn-proxy/airport-review/', folder: 'vpn-proxy/airport-review' },
    ],
  },
  {
    text: '🤖 AI',
    items: [
      { text: 'AI工具', link: '/posts/ai/tools/', folder: 'ai/tools' },
      { text: '提示词', link: '/posts/ai/prompts/', folder: 'ai/prompts' },
      { text: 'AI教程', link: '/posts/ai/tutorial/', folder: 'ai/tutorial' },
      { text: '进阶', link: '/posts/ai/advanced/', folder: 'ai/advanced' },
      { text: '大模型', link: '/posts/ai/llm/', folder: 'ai/llm' },
      { text: '工作流', link: '/posts/ai/workflow/', folder: 'ai/workflow' },
    ],
  },
  {
    text: '📚 博客',
    items: [
      { text: '教程', link: '/posts/blog/tutorials/', folder: 'blog/tutorials' },
      { text: '白嫖', link: '/posts/blog/freebies/', folder: 'blog/freebies' },
      { text: '推荐', link: '/posts/blog/recommendations/', folder: 'blog/recommendations' },
    ],
  },
  {
    text: '📦 资源宝库',
    items: [
      { text: '夸克资料', link: '/posts/resources/quark/', folder: 'resources/quark' },
      { text: '学习资料', link: '/posts/resources/learning-materials/', folder: 'resources/learning-materials' },
    ],
  },
]

// 从nav-config.json加载配置（如果存在）
const navConfigPath = path.join(__dirname, '../nav-config.json')
if (fs.existsSync(navConfigPath)) {
  try {
    const configContent = fs.readFileSync(navConfigPath, 'utf-8')
    const loadedConfig = JSON.parse(configContent)
    NAV_CONFIG = loadedConfig
    console.log('✅ 已从 nav-config.json 加载导航配置，共', NAV_CONFIG.length, '个菜单')
  }
  catch (error) {
    console.error('❌ 加载 nav-config.json 失败，使用默认配置:', error.message)
  }
}
else {
  console.log('⚠️ nav-config.json 不存在，使用默认导航配置')
}

// 从导航配置构建树结构
function buildNavTree(baseDir) {
  const navTree = []

  NAV_CONFIG.forEach((navItem, index) => {
    if (navItem.items) {
      const parentText = navItem.text.replace(/[\u{1F300}-\u{1F9FF}]/gu, '').trim()

      const parentNode = {
        name: parentText,
        displayName: parentText,
        type: 'folder',
        path: `_nav_parent_${index}`,
        children: [],
      }

      navItem.items.forEach((subItem) => {
        // 跳过外部链接或没有folder的子项
        if (!subItem.folder || subItem.folder.trim() === '') {
          return
        }

        // 跳过外部链接（http/https开头）
        if (subItem.link && (subItem.link.startsWith('http://') || subItem.link.startsWith('https://'))) {
          return
        }

        const folderPath = subItem.folder
        const fullPath = path.join(baseDir, folderPath)

        // 检查文件夹是否存在
        if (fs.existsSync(fullPath)) {
          const stat = fs.statSync(fullPath)
          if (stat.isDirectory()) {
            // 读取该文件夹下的文件
            const files = buildTree(fullPath, folderPath)

            parentNode.children.push({
              name: subItem.text,
              displayName: subItem.text,
              type: 'folder',
              path: folderPath,
              children: files,
            })
          }
        }
      })

      if (parentNode.children.length > 0) {
        navTree.push(parentNode)
      }
    }
  })

  return navTree
}

// 垃圾箱目录
const trashDir = path.join(__dirname, '../trash')

function ensureDir(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true })
  }
}

// 使用remark专业处理markdown格式
async function cleanMarkdown(markdown) {
  try {
    const result = await remark()
      .use(remarkGfm) // 支持GitHub Flavored Markdown
      .use(remarkStringify, {
        bullet: '-', // 使用 - 作为列表符号
        emphasis: '*', // 使用 * 表示斜体
        strong: '*', // 使用 ** 表示粗体
        fences: true, // 使用 ``` 代码块
        incrementListMarker: false, // 列表数字不递增
      })
      .process(markdown)

    let cleaned = String(result)

    // 后处理：逐行清理（remark不会处理这些细节）
    cleaned = cleaned
      .split('\n')
      .map((line) => {
        // 保留代码块缩进（4个空格或Tab开头）
        if (line.match(/^(\t| {4})/)) {
          return line
        }
        // 保留列表项缩进
        if (line.match(/^\s*[-*+]\s/) || line.match(/^\s*\d+\.\s/)) {
          return line
        }
        // 保留引用块
        if (line.match(/^\s*>/)) {
          return line
        }
        // 其他行移除前导空格
        return line.trimStart()
      })
      .join('\n')

    // 额外清理（针对微信公众号特殊格式）
    cleaned = cleaned
      // 转义HTML标签
      .replace(/<(\w+)>/g, '`<$1>`')
      // 移除空括号
      .replace(/【\s*】/g, '')
      // 清理特殊符号之间的多余空格（但保留中英文之间的空格）
      // 例如：***—*** **END** ***—*** → ***—*****END***—***
      .replace(/(\*+)\s+(\*+)/g, '$1$2')
      .replace(/(\*+)\s+([—\-~`!@#$%^&()_+=[\]{}|;:'"<>,.?/\\])/g, '$1$2')
      .replace(/([—\-~`!@#$%^&()_+=[\]{}|;:'"<>,.?/\\])\s+(\*+)/g, '$1$2')
      // 清理多余空行
      .replace(/\n{3,}/g, '\n\n')

    return cleaned.trim()
  }
  catch (error) {
    console.error('Markdown处理失败:', error)
    // 降级到基础清理
    return markdown.trim()
  }
}

/**
 * 下载图片并保存到本地
 * @param {string} url - 图片URL
 * @param {string} filename - 文件名
 * @param {string} imageDir - 本地保存目录
 * @param {number} retries - 重试次数
 * @returns {Promise<boolean>} 返回是否成功
 */
async function downloadImage(url, filename, imageDir, retries = 3) {
  for (let i = 0; i < retries; i++) {
    try {
      console.log(`  📥 正在下载图片 (${i + 1}/${retries}): ${url}`)
      
      const response = await axios({
        url,
        method: 'GET',
        responseType: 'arraybuffer',
        headers: {
          'User-Agent': CONFIG.userAgent,
          'Referer': url.includes('weixin.qq.com') ? 'https://mp.weixin.qq.com/' : undefined,
          'Accept': 'image/webp,image/apng,image/*,*/*;q=0.8',
          'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.8',
          'Cache-Control': 'no-cache',
        },
        timeout: 45000,
        maxRedirects: 5,
      })

      if (!response.data || response.data.length === 0) {
        throw new Error('图片数据为空')
      }

      const filepath = path.join(imageDir, filename)
      fs.writeFileSync(filepath, response.data)
      
      // 验证文件是否写入成功
      const stats = fs.statSync(filepath)
      if (stats.size === 0) {
        throw new Error('图片文件写入失败，文件大小为0')
      }
      
      console.log(`  ✅ 图片下载成功: ${filename} (${Math.round(stats.size / 1024)}KB)`)
      return true
    }
    catch (error) {
      console.error(`  ❌ 图片下载失败 (尝试 ${i + 1}/${retries}): ${error.message}`)
      
      if (i === retries - 1) {
        console.error(`  💥 图片下载彻底失败，跳过: ${url}`)
        return false
      }
      
      // 等待一段时间后重试
      await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)))
    }
  }
  
  return false
}

async function fetchArticle(url, articleId) {
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

  const title = $('#activity-name').text().trim()
    || $('.rich_media_title').text().trim()
    || $('h1').first().text().trim()
    || '未命名文章'

  const author = $('#js_name').text().trim()
    || $('.rich_media_meta_text').text().trim()
    || CONFIG.defaultAuthor

  const publishTime = $('#publish_time').text().trim()
    || $('.rich_media_meta_text').eq(1).text().trim()
    || new Date().toISOString().split('T')[0]

  let content = $('#js_content').html()
    || $('.rich_media_content').html()
    || $('article').html()
    || $('body').html()

  if (!content) {
    throw new Error('无法提取文章内容')
  }

  console.log(`  标题: ${title}`)
  console.log(`  作者: ${author}`)
  console.log(`  日期: ${publishTime}\n`)

  // 图片保存到草稿图片目录
  const articleImageDir = path.join(CONFIG.draftImagesBaseDir, articleId)
  ensureDir(articleImageDir)

  const $content = cheerio.load(content)
  const images = []
  let imageIndex = 1

  $content('img').each((i, elem) => {
    const src = $content(elem).attr('src')
      || $content(elem).attr('data-src')
      || $content(elem).attr('data-original')
      || $content(elem).attr('data-lazy-src')

    if (src) {
      let fullSrc = src
      if (src.startsWith('//')) {
        fullSrc = `https:${src}`
      }
      else if (src.startsWith('/') && !src.startsWith('//')) {
        const urlObj = new URL(url)
        fullSrc = `${urlObj.protocol}//${urlObj.host}${src}`
      }

      if (fullSrc.startsWith('http')) {
        images.push({ elem, src: fullSrc })
      }
    }
  })

  console.log(`  找到 ${images.length} 张图片`)

  let successCount = 0
  let failCount = 0

  for (const { elem, src } of images) {
    try {
      const ext = path.extname(new URL(src).pathname) || '.jpg'
      const filename = `${imageIndex}${ext}`

      // 尝试下载图片到草稿图片目录
      const success = await downloadImage(src, filename, articleImageDir)

      if (success) {
        // 下载成功，使用本地路径
        const imagePath = `/images/drafts/${articleId}/${filename}`
        $content(elem).attr('src', imagePath)
        successCount++
      }
      else {
        // 下载失败，保留原始URL，但添加提示
        console.log(`  ⚠️  保留原始图片链接: ${src}`)
        failCount++
      }

      imageIndex++
    }
    catch (error) {
      console.error(`  ❌ 处理图片时出错 ${src}:`, error.message)
      failCount++
    }
  }

  console.log(`\n📊 图片处理统计: 成功 ${successCount} 张，失败 ${failCount} 张`)

  content = $content.html()

  const turndownService = new TurndownService({
    headingStyle: 'atx',
    codeBlockStyle: 'fenced',
    emDelimiter: '*',
    bulletListMarker: '-',
    hr: '---',
  })

  turndownService.addRule('images', {
    filter: 'img',
    replacement: (_content, node) => {
      const src = node.getAttribute('src') || ''
      const alt = node.getAttribute('alt') || '图片'
      return `\n\n![${alt}](${src})\n\n`
    },
  })

  turndownService.addRule('cleanSections', {
    filter: (node) => {
      return node.nodeName === 'SECTION' || node.className?.includes('rich_media')
    },
    replacement: (content) => {
      return content
    },
  })

  turndownService.addRule('lineBreaks', {
    filter: 'br',
    replacement: () => '\n',
  })

  turndownService.addRule('emptyParagraphs', {
    filter: (node) => {
      return node.nodeName === 'P' && !node.textContent.trim()
    },
    replacement: () => '',
  })

  let markdown = turndownService.turndown(content)

  // 使用remark专业处理markdown格式
  markdown = await cleanMarkdown(markdown)

  return {
    title,
    author,
    publishTime,
    markdown,
    imageCount: images.length,
  }
}

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

function saveArticle(articleData, category, tags, articleId) {
  const { title, author, publishTime, markdown } = articleData

  const frontmatter = `---
title: ${escapeYamlString(title)}
description: ${escapeYamlString(title)}
date: ${escapeYamlString(publishTime)}
author: ${escapeYamlString(author)}
category: ${escapeYamlString(category)}
tags:
${tags.map(tag => `  - ${escapeYamlString(tag)}`).join('\n')}
---

`

  // 确保markdown末尾有换行符，避免VitePress构建错误
  const cleanMarkdown = `${markdown.trim()}\n`
  const fullContent = frontmatter + cleanMarkdown

  // 保存到草稿箱，而不是直接发布
  ensureDir(CONFIG.draftsBaseDir)

  const filename = `${articleId}.md`
  const filepath = path.join(CONFIG.draftsBaseDir, filename)

  fs.writeFileSync(filepath, fullContent, 'utf-8')

  console.log(`💾 文章已保存到草稿箱: ${filepath}`)

  return { filepath, filename }
}

app.post('/api/fetch-article', async (req, res) => {
  try {
    const { url, category, tags } = req.body

    if (!url || !url.startsWith('http')) {
      return res.status(400).json({ error: '请输入有效的URL' })
    }

    if (!category) {
      return res.status(400).json({ error: '请选择文章分类' })
    }

    const articleId = `article-${Date.now()}`

    const articleData = await fetchArticle(url, articleId)

    const { filepath, filename } = saveArticle(
      articleData,
      category,
      tags || ['默认'],
      articleId,
    )

    res.json({
      success: true,
      data: {
        ...articleData,
        filename,
        filepath,
      },
    })
  } catch (error) {
    console.error('爬取失败:', error)
    res.status(500).json({
      success: false,
      error: error.message || '爬取失败',
    })
  }
})

// 通用图片上传API
app.post('/api/upload/image', generalUpload.single('image'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, error: '请选择要上传的图片' })
    }

    // 返回相对于public目录的路径
    const url = `/images/uploads/${req.file.filename}`

    res.json({
      success: true,
      url,
      filename: req.file.filename
    })
  } catch (error) {
    console.error('图片上传失败:', error)
    res.status(500).json({
      success: false,
      error: error.message || '图片上传失败'
    })
  }
})

// 批量爬取文章（使用文章标题命名，自动分类到blog）
app.post('/api/fetch-article-batch', async (req, res) => {
  try {
    const { url } = req.body

    if (!url || !url.startsWith('http')) {
      return res.status(400).json({ success: false, error: '请输入有效的URL' })
    }

    const articleId = `article-${Date.now()}`
    const category = 'blog' // 批量爬取默认保存到blog目录

    const articleData = await fetchArticle(url, articleId)

    // 使用saveArticle函数保存到草稿箱
    const { filepath, filename } = saveArticle(
      articleData,
      category,
      ['爬取文章'],
      articleId,
    )

    res.json({
      success: true,
      data: {
        title: articleData.title,
        author: articleData.author,
        publishTime: articleData.publishTime,
        imageCount: articleData.imageCount,
        filename,
        filepath,
      },
    })
  }
  catch (error) {
    console.error('批量爬取失败:', error)
    res.status(500).json({
      success: false,
      error: error.message || '爬取失败',
    })
  }
})

app.get('/api/categories', (_req, res) => {
  const categories = [
    { value: 'vpn-proxy/free-nodes', label: '🚀 每日节点 (vpn-proxy/free-nodes)' },
    { value: 'vpn-proxy/tutorial', label: '🚀 VPN教程 (vpn-proxy/tutorial)' },
    { value: 'vpn-proxy/airport-review', label: '🚀 机场 (vpn-proxy/airport-review)' },
    { value: 'ai/tools', label: '🤖 AI工具 (ai/tools)' },
    { value: 'ai/prompts', label: '🤖 提示词 (ai/prompts)' },
    { value: 'ai/tutorial', label: '🤖 AI教程 (ai/tutorial)' },
    { value: 'ai/advanced', label: '🤖 进阶 (ai/advanced)' },
    { value: 'ai/llm', label: '🤖 大模型 (ai/llm)' },
    { value: 'ai/workflow', label: '🤖 工作流 (ai/workflow)' },
    { value: 'blog/tutorials', label: '📚 教程 (blog/tutorials)' },
    { value: 'blog/freebies', label: '📚 白嫖 (blog/freebies)' },
    { value: 'blog/recommendations', label: '📚 推荐 (blog/recommendations)' },
    { value: 'resources/quark', label: '📦 夸克资料 (resources/quark)' },
    { value: 'resources/learning-materials', label: '📦 学习资料 (resources/learning-materials)' },
  ]

  res.json({ categories })
})

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', message: '文章爬取API服务运行中' })
})

// Markdown编辑器API
// 获取所有Markdown文件列表（扁平）
app.get('/api/markdown/list', (_req, res) => {
  try {
    const files = []

    function scanDir(dir, basePath = '') {
      const items = fs.readdirSync(dir)

      for (const item of items) {
        const fullPath = path.join(dir, item)
        const stat = fs.statSync(fullPath)

        if (stat.isDirectory() && !item.startsWith('.')) {
          scanDir(fullPath, path.join(basePath, item))
        }
        else if (item.endsWith('.md') && item !== 'index.md') {
          files.push({
            name: item,
            path: path.join(basePath, item),
            fullPath,
            createdAt: stat.birthtime.toISOString(),
            modifiedAt: stat.mtime.toISOString(),
            size: stat.size,
          })
        }
      }
    }

    scanDir(CONFIG.postsBaseDir)

    // 按修改时间倒序排序（最新的在前）
    res.json({
      success: true,
      files: files.sort((a, b) => new Date(b.modifiedAt) - new Date(a.modifiedAt)),
    })
  }
  catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    })
  }
})

// 获取树形结构的文件列表
// 通用的buildTree函数
function buildTree(dir, basePath = '') {
  const items = fs.readdirSync(dir)
  const tree = []

  for (const item of items) {
    const fullPath = path.join(dir, item)
    const stat = fs.statSync(fullPath)

    if (item.startsWith('.'))
      continue

    if (stat.isDirectory()) {
      tree.push({
        name: item,
        type: 'folder',
        path: path.join(basePath, item),
        children: buildTree(fullPath, path.join(basePath, item)),
      })
    }
    else if (item.endsWith('.md') && item !== 'index.md') {
      tree.push({
        name: item,
        type: 'file',
        path: path.join(basePath, item),
        fullPath,
        createdAt: stat.birthtime.toISOString(),
        modifiedAt: stat.mtime.toISOString(),
        size: stat.size,
      })
    }
  }

  // 文件夹在前，文件在后，同类按名称排序
  return tree.sort((a, b) => {
    if (a.type !== b.type) {
      return a.type === 'folder' ? -1 : 1
    }
    return a.name.localeCompare(b.name)
  })
}

// 获取已发布文章的树形结构（基于导航配置）
app.get('/api/markdown/tree', (_req, res) => {
  try {
    const tree = buildNavTree(CONFIG.postsBaseDir)

    res.json({
      success: true,
      tree,
    })
  }
  catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    })
  }
})

// 获取草稿的树形结构（按时间倒序）
app.get('/api/drafts/tree', (_req, res) => {
  try {
    // 确保drafts目录存在
    if (!fs.existsSync(CONFIG.draftsBaseDir)) {
      fs.mkdirSync(CONFIG.draftsBaseDir, { recursive: true })
    }

    const tree = buildTree(CONFIG.draftsBaseDir)

    // 对文件按创建时间倒序排列（最新的在前）
    function sortByTimeDesc(nodes) {
      nodes.forEach((node) => {
        if (node.type === 'folder' && node.children) {
          sortByTimeDesc(node.children)
        }
      })
      nodes.sort((a, b) => {
        if (a.type !== b.type) {
          return a.type === 'folder' ? -1 : 1
        }
        if (a.type === 'file' && b.type === 'file') {
          return new Date(b.createdAt) - new Date(a.createdAt)
        }
        return a.name.localeCompare(b.name)
      })
    }
    sortByTimeDesc(tree)

    res.json({
      success: true,
      tree,
    })
  }
  catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    })
  }
})

// 获取已发布文章的树形结构
app.get('/api/posts/tree', (_req, res) => {
  try {
    if (!fs.existsSync(CONFIG.postsBaseDir)) {
      fs.mkdirSync(CONFIG.postsBaseDir, { recursive: true })
    }

    const tree = buildTree(CONFIG.postsBaseDir)

    res.json({
      success: true,
      tree,
    })
  }
  catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    })
  }
})

// 获取垃圾箱的树形结构
app.get('/api/trash/tree', (_req, res) => {
  try {
    if (!fs.existsSync(CONFIG.trashBaseDir)) {
      fs.mkdirSync(CONFIG.trashBaseDir, { recursive: true })
    }

    const tree = buildTree(CONFIG.trashBaseDir)

    res.json({
      success: true,
      tree,
    })
  }
  catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    })
  }
})

// 读取已发布文章的Markdown文件内容
app.get('/api/markdown/read', (req, res) => {
  try {
    const { file } = req.query

    if (!file) {
      return res.status(400).json({ error: '缺少文件路径参数' })
    }

    const filepath = path.join(CONFIG.postsBaseDir, file)

    // 安全检查：确保文件在posts目录内
    if (!filepath.startsWith(CONFIG.postsBaseDir)) {
      return res.status(403).json({ error: '无权访问此文件' })
    }

    if (!fs.existsSync(filepath)) {
      return res.status(404).json({ error: '文件不存在' })
    }

    const content = fs.readFileSync(filepath, 'utf-8')

    res.json({
      success: true,
      content,
      filepath,
    })
  }
  catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    })
  }
})

// 读取草稿文件的内容
app.get('/api/drafts/read', (req, res) => {
  try {
    const { file } = req.query

    if (!file) {
      return res.status(400).json({ error: '缺少文件路径参数' })
    }

    const filepath = path.join(CONFIG.draftsBaseDir, file)

    // 安全检查：确保文件在drafts目录内
    if (!filepath.startsWith(CONFIG.draftsBaseDir)) {
      return res.status(403).json({ error: '无权访问此文件' })
    }

    if (!fs.existsSync(filepath)) {
      return res.status(404).json({ error: `文件不存在: ${filepath}` })
    }

    const content = fs.readFileSync(filepath, 'utf-8')

    res.json({
      success: true,
      content,
      filepath,
    })
  }
  catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    })
  }
})

// 保存Markdown文件
app.post('/api/markdown/save', (req, res) => {
  try {
    const { file, content } = req.body

    if (!file || content === undefined) {
      return res.status(400).json({ error: '缺少必要参数' })
    }

    const filepath = path.join(CONFIG.postsBaseDir, file)

    // 安全检查：确保文件在posts目录内
    if (!filepath.startsWith(CONFIG.postsBaseDir)) {
      return res.status(403).json({ error: '无权保存此文件' })
    }

    fs.writeFileSync(filepath, content, 'utf-8')

    res.json({
      success: true,
      message: '保存成功',
      filepath,
    })
  }
  catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    })
  }
})

// ========================================
// 草稿箱API
// ========================================

// 获取草稿列表
app.get('/api/draft/list', (_req, res) => {
  try {
    ensureDir(CONFIG.draftsBaseDir)
    const files = []
    const items = fs.readdirSync(CONFIG.draftsBaseDir)

    for (const item of items) {
      if (item.endsWith('.md')) {
        const fullPath = path.join(CONFIG.draftsBaseDir, item)
        const stat = fs.statSync(fullPath)
        files.push({
          name: item,
          path: item,
          fullPath,
          createdAt: stat.birthtime.toISOString(),
          modifiedAt: stat.mtime.toISOString(),
          size: stat.size,
        })
      }
    }

    // 按修改时间倒序
    res.json({
      success: true,
      files: files.sort((a, b) => new Date(b.modifiedAt) - new Date(a.modifiedAt)),
    })
  }
  catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    })
  }
})

// 读取草稿内容
app.get('/api/draft/read', (req, res) => {
  try {
    const { file } = req.query
    if (!file) {
      return res.status(400).json({ success: false, error: '缺少文件名' })
    }

    const filepath = path.join(CONFIG.draftsBaseDir, file)
    if (!fs.existsSync(filepath)) {
      return res.status(404).json({ success: false, error: '草稿不存在' })
    }

    const content = fs.readFileSync(filepath, 'utf-8')
    res.json({ success: true, content })
  }
  catch (error) {
    res.status(500).json({ success: false, error: error.message })
  }
})

// 保存草稿
app.post('/api/draft/save', (req, res) => {
  try {
    const { file, content } = req.body
    if (!file || content === undefined) {
      return res.status(400).json({ success: false, error: '缺少必要参数' })
    }

    ensureDir(CONFIG.draftsBaseDir)
    const filepath = path.join(CONFIG.draftsBaseDir, file)

    // 确保父目录存在（支持保存到子文件夹）
    const parentDir = path.dirname(filepath)
    ensureDir(parentDir)

    fs.writeFileSync(filepath, content, 'utf-8')

    res.json({
      success: true,
      message: '草稿保存成功',
      filepath,
    })
  }
  catch (error) {
    console.error('[API] Save draft error:', error)
    res.status(500).json({ success: false, error: error.message })
  }
})

// 删除草稿（移动到垃圾箱）
app.delete('/api/draft/delete', (req, res) => {
  try {
    const { file } = req.body
    if (!file) {
      return res.status(400).json({ success: false, error: '缺少文件名' })
    }

    const sourcePath = path.join(CONFIG.draftsBaseDir, file)
    if (!fs.existsSync(sourcePath)) {
      return res.status(404).json({ success: false, error: '文件不存在' })
    }

    // 创建垃圾箱草稿目录
    const trashDraftsDir = path.join(trashDir, 'drafts')
    ensureDir(trashDraftsDir)

    // 保持原有目录结构
    const targetPath = path.join(trashDraftsDir, file)
    const targetDir = path.dirname(targetPath)
    ensureDir(targetDir)

    // 移动文件/文件夹到垃圾箱
    const stat = fs.statSync(sourcePath)
    if (stat.isDirectory()) {
      // 递归复制文件夹
      function copyDir(src, dest) {
        ensureDir(dest)
        const items = fs.readdirSync(src)
        items.forEach((item) => {
          const srcPath = path.join(src, item)
          const destPath = path.join(dest, item)
          const itemStat = fs.statSync(srcPath)
          if (itemStat.isDirectory()) {
            copyDir(srcPath, destPath)
          }
          else {
            fs.copyFileSync(srcPath, destPath)
          }
        })
      }
      copyDir(sourcePath, targetPath)
      // 删除原文件夹
      fs.rmSync(sourcePath, { recursive: true, force: true })
    }
    else {
      // 移动文件
      fs.renameSync(sourcePath, targetPath)
    }

    res.json({ success: true, message: '已移至垃圾箱' })
  }
  catch (error) {
    res.status(500).json({ success: false, error: error.message })
  }
})

// 新建草稿文件夹
app.post('/api/draft/create-folder', (req, res) => {
  try {
    const { folderPath } = req.body
    if (!folderPath) {
      return res.status(400).json({ success: false, error: '缺少文件夹路径' })
    }

    const fullPath = path.join(CONFIG.draftsBaseDir, folderPath)

    // 安全检查：确保路径在drafts目录内
    if (!fullPath.startsWith(CONFIG.draftsBaseDir)) {
      return res.status(403).json({ success: false, error: '无权访问此路径' })
    }

    if (fs.existsSync(fullPath)) {
      return res.status(400).json({ success: false, error: '文件夹已存在' })
    }

    fs.mkdirSync(fullPath, { recursive: true })

    res.json({ success: true, message: '文件夹创建成功' })
  }
  catch (error) {
    res.status(500).json({ success: false, error: error.message })
  }
})

// 重命名草稿文件/文件夹
app.post('/api/draft/rename', (req, res) => {
  try {
    const { oldPath, newName } = req.body
    if (!oldPath || !newName) {
      return res.status(400).json({ success: false, error: '缺少必要参数' })
    }

    // 规范化路径，统一使用正斜杠
    const normalizedOldPath = oldPath.replace(/\\/g, '/')

    const sourcePath = path.join(CONFIG.draftsBaseDir, normalizedOldPath)
    if (!fs.existsSync(sourcePath)) {
      return res.status(404).json({ success: false, error: '文件或文件夹不存在' })
    }

    // 计算新路径 - 保持在同一目录下
    const dirPath = path.dirname(normalizedOldPath)
    // 确保使用正斜杠，并正确处理根目录和子目录
    const newPath = (dirPath === '.' || dirPath === '') ? newName : `${dirPath}/${newName}`
    const targetPath = path.join(CONFIG.draftsBaseDir, newPath)

    // 安全检查
    const normalizedTarget = path.normalize(targetPath)
    const normalizedBase = path.normalize(CONFIG.draftsBaseDir)
    if (!normalizedTarget.startsWith(normalizedBase)) {
      return res.status(403).json({ success: false, error: '无权访问此路径' })
    }

    if (fs.existsSync(targetPath)) {
      return res.status(400).json({ success: false, error: '目标名称已存在' })
    }

    fs.renameSync(sourcePath, targetPath)

    // 返回规范化的新路径（使用正斜杠）
    const responseNewPath = newPath.replace(/\\/g, '/')

    res.json({
      success: true,
      message: '重命名成功',
      newPath: responseNewPath,
    })
  }
  catch (error) {
    console.error('[API] Rename error:', error)
    res.status(500).json({ success: false, error: error.message })
  }
})

// 发布草稿到正式目录
app.post('/api/draft/publish', (req, res) => {
  try {
    const { draftFile, targetPath, category } = req.body
    console.log('📤 发布请求:', { draftFile, targetPath, category })

    if (!draftFile || !targetPath || !category) {
      return res.status(400).json({ success: false, error: '缺少必要参数' })
    }

    const draftPath = path.join(CONFIG.draftsBaseDir, draftFile)
    console.log('📂 草稿路径:', draftPath)

    if (!fs.existsSync(draftPath)) {
      return res.status(404).json({ success: false, error: '草稿不存在' })
    }

    // 读取草稿内容
    let content = fs.readFileSync(draftPath, 'utf-8')

    // 从MD内容中提取所有草稿图片路径（/images/drafts/xxx/yyy）
    const draftImagePattern = /\/images\/drafts\/([^\/]+)\/([^)\s"']+)/g
    const foundImages = new Set()
    let match

    while ((match = draftImagePattern.exec(content)) !== null) {
      const draftDirName = match[1] // 例如：article-1764659952737
      const imageName = match[2] // 例如：1.jpg
      foundImages.add({ draftDirName, imageName, fullPath: match[0] })
    }

    console.log(`📸 从MD中找到 ${foundImages.size} 个草稿图片`)

    // 按草稿目录分组处理图片
    const imagesByDraftDir = {}
    foundImages.forEach(({ draftDirName, imageName, fullPath }) => {
      if (!imagesByDraftDir[draftDirName]) {
        imagesByDraftDir[draftDirName] = []
      }
      imagesByDraftDir[draftDirName].push({ imageName, fullPath })
    })

    // 处理每个草稿目录下的图片
    Object.keys(imagesByDraftDir).forEach((draftDirName) => {
      const draftImageDir = path.join(CONFIG.draftImagesBaseDir, draftDirName)
      console.log(`📂 处理草稿目录: ${draftDirName}`)

      if (!fs.existsSync(draftImageDir)) {
        console.warn(`⚠️ 草稿图片目录不存在: ${draftImageDir}`)
        return
      }

      // 保留草稿目录结构：/images/{category}/{draftDirName}/
      const targetImageDir = path.join(CONFIG.publicImagesBaseDir, category, draftDirName)
      console.log('📸 图片源目录:', draftImageDir)
      console.log('📸 图片目标目录:', targetImageDir)
      ensureDir(targetImageDir)

      // 复制整个草稿目录下的所有图片
      const allImages = fs.readdirSync(draftImageDir)
      allImages.forEach((imageName) => {
        const srcPath = path.join(draftImageDir, imageName)
        const destPath = path.join(targetImageDir, imageName)

        if (fs.existsSync(srcPath) && fs.statSync(srcPath).isFile()) {
          fs.copyFileSync(srcPath, destPath)
          console.log(`✅ 复制图片: ${imageName}`)
        }
      })

      // 替换MD中的图片路径（保留目录结构）
      // 从 /images/drafts/{draftDirName}/ 替换为 /images/{category}/{draftDirName}/
      const draftPathPrefix = `/images/drafts/${draftDirName}/`
      const publicPathPrefix = `/images/${category}/${draftDirName}/`
      content = content.replace(
        new RegExp(draftPathPrefix.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'),
        publicPathPrefix
      )
      console.log(`✅ 替换路径前缀: ${draftPathPrefix} -> ${publicPathPrefix}`)

      // 删除草稿图片目录
      try {
        fs.rmSync(draftImageDir, { recursive: true, force: true })
        console.log(`🗑️ 已删除草稿图片目录: ${draftImageDir}`)
      }
      catch (err) {
        console.warn(`⚠️ 删除草稿图片目录失败: ${err.message}`)
      }
    })

    // 保存到正式目录
    const targetFilePath = path.join(CONFIG.postsBaseDir, targetPath)
    const targetDir = path.dirname(targetFilePath)
    console.log('💾 目标文件路径:', targetFilePath)
    console.log('💾 目标目录:', targetDir)
    ensureDir(targetDir)
    fs.writeFileSync(targetFilePath, content, 'utf-8')
    console.log('✅ 文件保存成功')

    // 删除草稿文件
    fs.unlinkSync(draftPath)
    console.log('🗑️ 草稿文件已删除:', draftPath)

    res.json({
      success: true,
      message: '发布成功',
      targetPath,
    })
  }
  catch (error) {
    console.error('❌ 发布失败:', error)
    res.status(500).json({ success: false, error: error.message })
  }
})

// 配置multer存储
const storage = multer.diskStorage({
  destination(req, file, cb) {
    const { draftId } = req.body
    if (!draftId) {
      return cb(new Error('缺少草稿ID'))
    }
    const uploadDir = path.join(CONFIG.draftImagesBaseDir, draftId)
    ensureDir(uploadDir)
    cb(null, uploadDir)
  },
  filename(req, file, cb) {
    // 保留原始文件名（已经是安全的）或生成唯一文件名
    const ext = path.extname(file.originalname)
    const name = path.basename(file.originalname, ext)
    const safeName = name.replace(/[^a-zA-Z0-9_-]/g, '_')
    const uniqueName = `${safeName}-${Date.now()}${ext}`
    cb(null, uniqueName)
  },
})

const draftUpload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
  fileFilter(req, file, cb) {
    const allowedTypes = /jpeg|jpg|png|gif|webp|svg/
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase())
    const mimetype = allowedTypes.test(file.mimetype)

    if (extname && mimetype) {
      cb(null, true)
    }
    else {
      cb(new Error('只允许上传图片文件'))
    }
  },
})

// 上传图片到草稿箱
app.post('/api/draft/upload-image', draftUpload.single('image'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, error: '没有上传文件' })
    }

    const { draftId } = req.body
    const imagePath = `/drafts/images/${draftId}/${req.file.filename}`

    res.json({
      success: true,
      message: '图片上传成功',
      path: imagePath,
      filename: req.file.filename,
      size: req.file.size,
    })
  }
  catch (error) {
    res.status(500).json({ success: false, error: error.message })
  }
})

// Base64图片上传（用于粘贴图片）
app.post('/api/draft/upload-image-base64', (req, res) => {
  try {
    const { draftId, base64Data, filename } = req.body

    if (!draftId || !base64Data) {
      return res.status(400).json({ success: false, error: '缺少必要参数' })
    }

    // 解析base64
    const matches = base64Data.match(/^data:image\/(\w+);base64,(.+)$/)
    if (!matches) {
      return res.status(400).json({ success: false, error: '无效的base64图片数据' })
    }

    const ext = matches[1]
    const data = matches[2]
    const buffer = Buffer.from(data, 'base64')

    // 生成文件名
    const safeName = filename ? filename.replace(/[^a-zA-Z0-9_-]/g, '_') : `image-${Date.now()}`
    const imageName = `${safeName}.${ext}`

    // 保存文件
    const uploadDir = path.join(CONFIG.draftImagesBaseDir, draftId)
    ensureDir(uploadDir)
    const imagePath = path.join(uploadDir, imageName)
    fs.writeFileSync(imagePath, buffer)

    const publicPath = `/drafts/images/${draftId}/${imageName}`

    res.json({
      success: true,
      message: '图片上传成功',
      path: publicPath,
      filename: imageName,
      size: buffer.length,
    })
  }
  catch (error) {
    res.status(500).json({ success: false, error: error.message })
  }
})

// ========================================
// 配置管理API
// ========================================

const configPath = path.join(__dirname, '../docs/.vitepress/config.mts')
// navConfigPath 已在文件顶部定义

// 读取菜单配置（从JSON文件）
app.get('/api/config/menus', (_req, res) => {
  try {
    if (!fs.existsSync(navConfigPath)) {
      return res.status(404).json({ success: false, error: '配置文件不存在' })
    }

    const configContent = fs.readFileSync(navConfigPath, 'utf-8')
    const navConfig = JSON.parse(configContent)

    res.json({
      success: true,
      menus: navConfig,
    })
  }
  catch (error) {
    console.error('读取菜单配置失败:', error)
    res.status(500).json({ success: false, error: error.message })
  }
})

// 保存菜单配置（直接写入JSON文件）
app.post('/api/config/menus', (req, res) => {
  try {
    const { menus } = req.body
    if (!menus || !Array.isArray(menus)) {
      return res.status(400).json({ success: false, error: '无效的菜单数据' })
    }

    console.log('📝 开始保存菜单配置...')

    // 过滤掉系统菜单（editable: false）
    const filteredMenus = menus.filter(menu => menu.editable !== false)

    // 直接写入JSON文件
    fs.writeFileSync(navConfigPath, JSON.stringify(filteredMenus, null, 2), 'utf-8')

    console.log('✅ 菜单配置已保存到:', navConfigPath)
    console.log('✅ 保存的菜单数量:', filteredMenus.length)

    // 同时更新服务器端的 NAV_CONFIG
    NAV_CONFIG.length = 0
    NAV_CONFIG.push(...filteredMenus)

    res.json({
      success: true,
      message: '保存成功！请重启开发服务器生效',
    })
  }
  catch (error) {
    console.error('❌ 保存菜单配置失败:', error)
    res.status(500).json({ success: false, error: error.message })
  }
})

// 自动创建菜单对应的文件夹和index.md
app.post('/api/config/menus/create-folders', (req, res) => {
  try {
    const { menus } = req.body
    if (!menus || !Array.isArray(menus)) {
      return res.status(400).json({ success: false, error: '无效的菜单数据' })
    }

    console.log('📁 开始创建菜单文件夹...')

    const postsDir = path.join(__dirname, '../docs/posts')
    const createdFolders = []
    const errors = []

    // 递归创建文件夹和index.md
    function createFolderForMenu(menu) {
      if (!menu.folder) {
        return
      }

      const folderPath = path.join(postsDir, menu.folder)
      try {
        // 创建文件夹（如果不存在）
        let folderCreated = false
        if (!fs.existsSync(folderPath)) {
          fs.mkdirSync(folderPath, { recursive: true })
          folderCreated = true
          console.log(`  ✅ 创建文件夹: ${menu.folder}`)
        }

        // 创建 index.md（如果不存在）
        const indexPath = path.join(folderPath, 'index.md')
        if (!fs.existsSync(indexPath)) {
          const indexContent = `---
layout: doc
title: ${escapeYamlString(menu.text)}
---

# ${menu.text}

这是 ${menu.text} 的分类页面。

## 文章列表

<PostList folder="${menu.folder}" />
`
          fs.writeFileSync(indexPath, indexContent, 'utf-8')
          console.log(`  ✅ 创建索引页: ${menu.folder}/index.md`)

          // 记录创建的文件夹（包括已存在但创建了index.md的）
          if (!folderCreated) {
            createdFolders.push(menu.folder)
          }
        }

        // 记录新创建的文件夹
        if (folderCreated) {
          createdFolders.push(menu.folder)
        }
      }
      catch (error) {
        errors.push({ folder: menu.folder, error: error.message })
        console.error(`  ❌ 创建失败: ${menu.folder} - ${error.message}`)
      }

      // 递归处理子菜单
      if (menu.items && Array.isArray(menu.items)) {
        menu.items.forEach(subMenu => createFolderForMenu(subMenu, menu.folder))
      }
    }

    // 遍历所有菜单
    menus.forEach((menu) => {
      if (menu.editable !== false) {
        createFolderForMenu(menu)
      }
    })

    console.log(`✅ 文件夹创建完成，共创建 ${createdFolders.length} 个文件夹`)

    res.json({
      success: true,
      message: `成功创建 ${createdFolders.length} 个文件夹`,
      createdFolders,
      errors: errors.length > 0 ? errors : undefined,
    })
  }
  catch (error) {
    console.error('❌ 创建文件夹失败:', error)
    res.status(500).json({ success: false, error: error.message })
  }
})

// 修复所有草稿的 YAML frontmatter
app.post('/api/drafts/fix-yaml', (_req, res) => {
  try {
    if (!fs.existsSync(CONFIG.draftsBaseDir)) {
      return res.json({ success: true, message: '草稿箱为空', fixed: [] })
    }

    const files = fs.readdirSync(CONFIG.draftsBaseDir)
      .filter(f => f.endsWith('.md'))

    const fixed = []
    const errors = []

    for (const file of files) {
      try {
        const filepath = path.join(CONFIG.draftsBaseDir, file)
        const content = fs.readFileSync(filepath, 'utf-8')

        // 匹配 frontmatter
        const match = content.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/)
        if (!match) {
          continue
        }

        const [, frontmatterStr, markdown] = match

        // 解析 frontmatter 的每一行
        const lines = frontmatterStr.split('\n')
        const fixedLines = []

        for (let i = 0; i < lines.length; i++) {
          const line = lines[i]

          // 匹配 key: value 格式
          const keyValueMatch = line.match(/^(\s*)([\w]+):\s*(.*)$/)
          if (keyValueMatch) {
            const [, indent, key, value] = keyValueMatch

            // 跳过已经有引号的值
            if (value.startsWith('"') || value.startsWith("'") || key === 'tags' || !value) {
              fixedLines.push(line)
              continue
            }

            // 添加引号
            fixedLines.push(`${indent}${key}: ${escapeYamlString(value)}`)
          }
          else {
            fixedLines.push(line)
          }
        }

        // 重建文件内容
        const newContent = `---\n${fixedLines.join('\n')}\n---\n${markdown}`

        // 只有内容改变时才写入
        if (newContent !== content) {
          fs.writeFileSync(filepath, newContent, 'utf-8')
          fixed.push(file)
          console.log(`✅ 修复草稿: ${file}`)
        }
      }
      catch (error) {
        errors.push({ file, error: error.message })
        console.error(`❌ 修复失败: ${file} - ${error.message}`)
      }
    }

    res.json({
      success: true,
      message: `成功修复 ${fixed.length} 个草稿`,
      fixed,
      errors: errors.length > 0 ? errors : undefined,
    })
  }
  catch (error) {
    console.error('❌ 修复草稿失败:', error)
    res.status(500).json({ success: false, error: error.message })
  }
})

// 读取网站配置
app.get('/api/config/site', (_req, res) => {
  try {
    const configContent = fs.readFileSync(configPath, 'utf-8')

    // 提取网站标题
    const titleMatch = configContent.match(/title:\s*'([^']+)'/)
    const descMatch = configContent.match(/description:\s*'([^']+)'/)

    // 提取页脚配置（直接匹配字段）
    const footerMessageMatch = configContent.match(/message:\s*'([^']+)'/)
    const footerCopyrightMatch = configContent.match(/copyright:\s*'([^']+)'/)

    const config = {
      title: titleMatch ? titleMatch[1] : '',
      description: descMatch ? descMatch[1] : '',
      footerMessage: footerMessageMatch ? footerMessageMatch[1] : '',
      footerCopyright: footerCopyrightMatch ? footerCopyrightMatch[1] : '',
    }

    // 读取 banner 配置
    const bannerConfigPath = path.join(__dirname, '../docs/banner-config.json')
    if (fs.existsSync(bannerConfigPath)) {
      const bannerConfig = JSON.parse(fs.readFileSync(bannerConfigPath, 'utf-8'))
      config.bannerTitle = bannerConfig.title || ''
      config.bannerSubtitle = bannerConfig.subtitle || ''
      config.bannerImage = bannerConfig.banner || ''
    }

    // 读取 Google 服务配置
    const googleConfigPath = path.join(__dirname, '../docs/.vitepress/google-config.json')
    if (fs.existsSync(googleConfigPath)) {
      const googleConfig = JSON.parse(fs.readFileSync(googleConfigPath, 'utf-8'))
      config.googleAnalytics = googleConfig.analytics || ''
      config.googleSearchConsole = googleConfig.searchConsole || ''
      config.googleAdsense = googleConfig.adsense || ''
    }
    else {
      config.googleAnalytics = ''
      config.googleSearchConsole = ''
      config.googleAdsense = ''
    }

    res.json({ success: true, config })
  }
  catch (error) {
    res.status(500).json({ success: false, error: error.message })
  }
})

// 保存网站配置
app.post('/api/config/site', (req, res) => {
  try {
    const {
      title,
      description,
      footerMessage,
      footerCopyright,
      bannerTitle,
      bannerSubtitle,
      bannerImage,
      googleAnalytics,
      googleSearchConsole,
      googleAdsense
    } = req.body
    let configContent = fs.readFileSync(configPath, 'utf-8')

    // 替换标题
    if (title !== undefined) {
      configContent = configContent.replace(
        /title:\s*'[^']*'/,
        `title: '${title}'`,
      )
    }

    // 替换描述
    if (description !== undefined) {
      configContent = configContent.replace(
        /description:\s*'[^']*'/,
        `description: '${description}'`,
      )
    }

    // 替换页脚信息
    if (footerMessage !== undefined) {
      configContent = configContent.replace(
        /(message:\s*)'[^']*'/,
        `$1'${footerMessage}'`,
      )
    }

    // 替换版权信息
    if (footerCopyright !== undefined) {
      configContent = configContent.replace(
        /(copyright:\s*)'[^']*'/,
        `$1'${footerCopyright}'`,
      )
    }

    fs.writeFileSync(configPath, configContent, 'utf-8')

    // 保存 banner 配置
    if (bannerTitle !== undefined || bannerSubtitle !== undefined || bannerImage !== undefined) {
      const bannerConfigPath = path.join(__dirname, '../docs/banner-config.json')
      let bannerConfig = {}

      // 读取现有配置
      if (fs.existsSync(bannerConfigPath)) {
        bannerConfig = JSON.parse(fs.readFileSync(bannerConfigPath, 'utf-8'))
      }

      // 更新配置
      if (bannerTitle !== undefined) bannerConfig.title = bannerTitle
      if (bannerSubtitle !== undefined) bannerConfig.subtitle = bannerSubtitle
      if (bannerImage !== undefined) bannerConfig.banner = bannerImage

      // 写入文件
      fs.writeFileSync(bannerConfigPath, JSON.stringify(bannerConfig, null, 2), 'utf-8')
    }

    // 处理 Google 服务配置
    if (googleAnalytics !== undefined || googleSearchConsole !== undefined || googleAdsense !== undefined) {
      const googleConfigPath = path.join(__dirname, '../docs/.vitepress/google-config.json')
      let googleConfig = {}

      // 读取现有配置
      if (fs.existsSync(googleConfigPath)) {
        googleConfig = JSON.parse(fs.readFileSync(googleConfigPath, 'utf-8'))
      }

      // 更新配置
      if (googleAnalytics !== undefined) googleConfig.analytics = googleAnalytics
      if (googleSearchConsole !== undefined) googleConfig.searchConsole = googleSearchConsole
      if (googleAdsense !== undefined) googleConfig.adsense = googleAdsense

      // 写入配置文件（单一配置源）
      fs.writeFileSync(googleConfigPath, JSON.stringify(googleConfig, null, 2), 'utf-8')
      console.log('✅ Google配置已保存到:', googleConfigPath)

      // 处理 Google Search Console 验证
      if (googleSearchConsole) {
        const verificationCodes = googleSearchConsole.split(',').map(code => code.trim()).filter(code => code)

        // 在 public 文件夹创建验证文件
        const publicPath = path.join(__dirname, '../docs/public')
        if (!fs.existsSync(publicPath)) {
          fs.mkdirSync(publicPath, { recursive: true })
        }

        verificationCodes.forEach(code => {
          const verifyFilePath = path.join(publicPath, `${code}.html`)
          fs.writeFileSync(verifyFilePath, `google-site-verification: ${code}.html`, 'utf-8')
        })
      }

      // 处理 Google AdSense ads.txt
      if (googleAdsense) {
        const publicPath = path.join(__dirname, '../docs/public')
        const adsTxtPath = path.join(publicPath, 'ads.txt')
        const publisherId = googleAdsense.replace('ca-pub-', '')
        const adsTxtContent = `google.com, pub-${publisherId}, DIRECT, f08c47fec0942fa0`
        fs.writeFileSync(adsTxtPath, adsTxtContent, 'utf-8')
      }
    }

    let message = '✅ 配置保存成功！'
    if (bannerTitle !== undefined || bannerSubtitle !== undefined || bannerImage !== undefined) {
      message += ' Banner配置已更新。'
    }
    if (googleAnalytics || googleSearchConsole || googleAdsense) {
      message += ' Google服务已配置，请重启开发服务器生效。'
    }

    res.json({
      success: true,
      message,
    })
  }
  catch (error) {
    res.status(500).json({ success: false, error: error.message })
  }
})

// Banner图片上传
app.post('/api/upload/banner', bannerUpload.single('banner'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, error: '未选择文件' })
    }

    // 返回相对路径（用于web访问）
    const relativePath = `/images/banner/${req.file.filename}`

    // 自动更新banner配置
    const bannerConfigPath = path.join(__dirname, '../docs/banner-config.json')
    let bannerConfig = {}

    if (fs.existsSync(bannerConfigPath)) {
      bannerConfig = JSON.parse(fs.readFileSync(bannerConfigPath, 'utf-8'))
    }

    bannerConfig.banner = relativePath
    fs.writeFileSync(bannerConfigPath, JSON.stringify(bannerConfig, null, 2), 'utf-8')

    res.json({
      success: true,
      path: relativePath,
      filename: req.file.filename,
      message: '✅ 图片上传成功！Banner配置已自动更新。'
    })
  }
  catch (error) {
    res.status(500).json({ success: false, error: error.message })
  }
})

// 文章封面图片上传
app.post('/api/upload/cover', coverUpload.single('cover'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, error: '未选择文件' })
    }

    // 获取草稿ID，用于重命名封面文件
    const draftId = req.body.draftId
    if (draftId) {
      const ext = path.extname(req.file.originalname)
      const newFilename = `cover-${draftId}${ext}`
      const oldPath = req.file.path
      const newPath = path.join(path.dirname(oldPath), newFilename)

      // 删除旧的封面（如果存在）
      const coverDir = path.dirname(oldPath)
      const oldCovers = fs.readdirSync(coverDir).filter(f => f.startsWith(`cover-${draftId}.`))
      oldCovers.forEach((oldCover) => {
        const oldCoverPath = path.join(coverDir, oldCover)
        if (oldCoverPath !== newPath && fs.existsSync(oldCoverPath)) {
          fs.unlinkSync(oldCoverPath)
          console.log(`🗑️ 删除旧封面: ${oldCover}`)
        }
      })

      // 重命名为新文件
      fs.renameSync(oldPath, newPath)
      console.log(`✅ 封面已保存: ${newFilename}`)

      // 返回新的相对路径
      const relativePath = `/images/covers/${newFilename}`
      res.json({
        success: true,
        path: relativePath,
        filename: newFilename,
        message: '✅ 封面上传成功！',
      })
    }
    else {
      // 没有 draftId，使用默认文件名
      const relativePath = `/images/covers/${req.file.filename}`
      res.json({
        success: true,
        path: relativePath,
        filename: req.file.filename,
        message: '✅ 封面上传成功！',
      })
    }
  }
  catch (error) {
    res.status(500).json({ success: false, error: error.message })
  }
})

// ========================================
// 垃圾箱管理API
// ========================================

// 创建垃圾箱目录
if (!fs.existsSync(trashDir)) {
  fs.mkdirSync(trashDir, { recursive: true })
}

// 删除文章（移到垃圾箱）
app.post('/api/article/delete', (req, res) => {
  try {
    const { file } = req.body
    const sourcePath = path.join(__dirname, '..', file)
    const fileName = path.basename(file)
    const trashPath = path.join(trashDir, fileName)

    if (!fs.existsSync(sourcePath)) {
      return res.status(404).json({ success: false, error: '文件不存在' })
    }

    fs.renameSync(sourcePath, trashPath)

    res.json({ success: true, message: '文章已移至垃圾箱' })
  }
  catch (error) {
    res.status(500).json({ success: false, error: error.message })
  }
})

// 下架文章（从posts移动到drafts）
app.post('/api/article/unpublish', (req, res) => {
  try {
    const { file } = req.body
    console.log('📥 下架请求:', file)

    if (!file) {
      return res.status(400).json({ success: false, error: '缺少文件路径参数' })
    }

    // 移除可能的posts前缀，获取相对路径
    const relativePath = file.replace(/^posts\//, '')

    // 源文件路径（在posts目录下）
    const sourcePath = path.join(CONFIG.postsBaseDir, relativePath)
    console.log('📂 源文件路径:', sourcePath)

    // 检查源文件是否存在
    if (!fs.existsSync(sourcePath)) {
      return res.status(404).json({ success: false, error: '文章不存在' })
    }

    // 读取文章内容并解析 frontmatter
    const fileContent = fs.readFileSync(sourcePath, 'utf-8')

    let content = fileContent

    try {
      // 尝试解析 frontmatter（验证格式）
      matter(fileContent)
    }
    catch (error) {
      // 解析失败，需要修复
      console.warn('⚠️ frontmatter 解析失败，将尝试修复:', error.message)

      // 尝试手动提取和修复
      const frontmatterMatch = fileContent.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/)
      if (frontmatterMatch) {
        const [, frontmatterStr, markdown] = frontmatterMatch
        const lines = frontmatterStr.split('\n')
        const fixedLines = []

        for (const line of lines) {
          const keyValueMatch = line.match(/^(\s*)(\w+):\s*(.*)$/)
          if (keyValueMatch) {
            const [, indent, key, value] = keyValueMatch
            if (value && !value.startsWith('"') && !value.startsWith("'") && key !== 'tags') {
              fixedLines.push(`${indent}${key}: ${escapeYamlString(value)}`)
            }
            else {
              fixedLines.push(line)
            }
          }
          else {
            fixedLines.push(line)
          }
        }

        content = `---\n${fixedLines.join('\n')}\n---\n${markdown}`
        console.log('✅ frontmatter 已修复')
      }
    }

    // 提取category（从相对路径中获取，如 ai/tools/xxx.md -> ai/tools）
    const pathParts = relativePath.split(/[/\\]/)
    pathParts.pop() // 移除文件名
    const category = pathParts.join('/')
    console.log('📂 文章分类:', category)

    // 生成草稿ID（使用文件名）
    const draftId = path.basename(relativePath, '.md')
    console.log('📝 草稿ID:', draftId)

    // 处理图片：从public/images移动到drafts/images
    const draftImageDir = path.join(CONFIG.draftImagesBaseDir, draftId)

    // 查找文章中引用的图片
    const imageRegex = /!\[.*?\]\((\/images\/[^)]+)\)/g
    const images = []
    let match = imageRegex.exec(content)
    while (match !== null) {
      images.push(match[1]) // 提取图片路径，如 /images/ai/tools/xxx.jpg
      match = imageRegex.exec(content)
    }

    console.log('📸 找到图片引用:', images)

    if (images.length > 0) {
      ensureDir(draftImageDir)

      images.forEach((imgPath) => {
        // imgPath 格式: /images/category/filename.jpg
        const imgFilename = path.basename(imgPath)
        const srcPath = path.join(CONFIG.publicImagesBaseDir, imgPath.replace('/images/', ''))
        const destPath = path.join(draftImageDir, imgFilename)

        if (fs.existsSync(srcPath)) {
          fs.renameSync(srcPath, destPath)
          console.log(`📸 移动图片: ${imgFilename}`)

          // 替换图片路径（使用新的草稿图片路径）
          const newImgPath = `/images/drafts/${draftId}/${imgFilename}`
          content = content.replace(imgPath, newImgPath)
          console.log(`📸 替换路径: ${imgPath} -> ${newImgPath}`)
        }
      })
    }

    // 目标路径（在drafts目录下）
    const targetPath = path.join(CONFIG.draftsBaseDir, relativePath)
    const targetDir = path.dirname(targetPath)
    ensureDir(targetDir)

    // 检查目标文件是否已存在
    if (fs.existsSync(targetPath)) {
      return res.status(400).json({ success: false, error: '草稿箱中已存在同名文件' })
    }

    // 保存到草稿箱（内容已更新图片路径）
    fs.writeFileSync(targetPath, content, 'utf-8')
    console.log('💾 草稿保存成功:', targetPath)

    // 删除原文件
    fs.unlinkSync(sourcePath)
    console.log('🗑️ 原文件已删除:', sourcePath)

    res.json({
      success: true,
      message: '文章已下架到草稿箱',
      targetPath: relativePath,
    })
  }
  catch (error) {
    console.error('❌ 下架失败:', error)
    res.status(500).json({ success: false, error: error.message })
  }
})

// 获取垃圾箱列表
app.get('/api/trash/list', (_req, res) => {
  try {
    if (!fs.existsSync(trashDir)) {
      return res.json({ success: true, files: [] })
    }

    const files = []

    // 递归读取文件
    function scanDir(dir, basePath = '') {
      const items = fs.readdirSync(dir)
      items.forEach((item) => {
        const fullPath = path.join(dir, item)
        const stats = fs.statSync(fullPath)
        const relativePath = basePath ? `${basePath}/${item}` : item

        if (stats.isDirectory()) {
          // 递归扫描子目录
          scanDir(fullPath, relativePath)
        }
        else if (item.endsWith('.md')) {
          // 判断来源：drafts 或 posts
          const source = relativePath.startsWith('drafts/') ? 'drafts' : 'posts'
          files.push({
            name: item,
            path: `trash/${relativePath}`,
            relativePath,
            modifiedAt: stats.mtime,
            size: stats.size,
            source, // 标识来源
          })
        }
      })
    }

    scanDir(trashDir)

    res.json({ success: true, files })
  }
  catch (error) {
    res.status(500).json({ success: false, error: error.message })
  }
})

// 恢复文章
app.post('/api/trash/restore', (req, res) => {
  try {
    const { file } = req.body
    const fileName = file.replace('trash/', '')
    const trashPath = path.join(trashDir, fileName)

    if (!fs.existsSync(trashPath)) {
      return res.status(404).json({ success: false, error: '文件不存在' })
    }

    // 恢复到原位置（这里简化为恢复到posts/blog）
    const restorePath = path.join(__dirname, '../docs/posts/blog', fileName)
    fs.renameSync(trashPath, restorePath)

    res.json({ success: true, message: '文章已恢复' })
  }
  catch (error) {
    res.status(500).json({ success: false, error: error.message })
  }
})

// 恢复草稿（从垃圾箱恢复到草稿箱）
app.post('/api/trash/restore-draft', (req, res) => {
  try {
    const { file } = req.body
    if (!file) {
      return res.status(400).json({ success: false, error: '缺少文件路径' })
    }

    // file格式: "drafts/folder/file.md"
    const relativePath = file.replace('trash/drafts/', '')
    const trashPath = path.join(trashDir, 'drafts', relativePath)

    if (!fs.existsSync(trashPath)) {
      return res.status(404).json({ success: false, error: '文件不存在' })
    }

    // 恢复到草稿箱
    const restorePath = path.join(CONFIG.draftsBaseDir, relativePath)
    const restoreDir = path.dirname(restorePath)
    ensureDir(restoreDir)

    // 移动文件/文件夹回草稿箱
    const stat = fs.statSync(trashPath)
    if (stat.isDirectory()) {
      // 递归复制文件夹
      function copyDir(src, dest) {
        ensureDir(dest)
        const items = fs.readdirSync(src)
        items.forEach((item) => {
          const srcPath = path.join(src, item)
          const destPath = path.join(dest, item)
          const itemStat = fs.statSync(srcPath)
          if (itemStat.isDirectory()) {
            copyDir(srcPath, destPath)
          }
          else {
            fs.copyFileSync(srcPath, destPath)
          }
        })
      }
      copyDir(trashPath, restorePath)
      // 删除垃圾箱中的文件夹
      fs.rmSync(trashPath, { recursive: true, force: true })
    }
    else {
      // 移动文件
      fs.renameSync(trashPath, restorePath)
    }

    res.json({ success: true, message: '草稿已恢复' })
  }
  catch (error) {
    res.status(500).json({ success: false, error: error.message })
  }
})

// 永久删除
app.post('/api/trash/delete-permanent', (req, res) => {
  try {
    const { file } = req.body
    const fileName = file.replace('trash/', '')
    const trashPath = path.join(trashDir, fileName)

    if (!fs.existsSync(trashPath)) {
      return res.status(404).json({ success: false, error: '文件不存在' })
    }

    fs.unlinkSync(trashPath)

    res.json({ success: true, message: '文章已永久删除' })
  }
  catch (error) {
    res.status(500).json({ success: false, error: error.message })
  }
})

// 清空垃圾箱
app.post('/api/trash/empty', (_req, res) => {
  try {
    if (fs.existsSync(trashDir)) {
      const files = fs.readdirSync(trashDir)
      files.forEach((file) => {
        fs.rmSync(path.join(trashDir, file), { recursive: true, force: true })
      })
    }

    res.json({ success: true, message: '垃圾箱已清空' })
  }
  catch (error) {
    res.status(500).json({ success: false, error: error.message })
  }
})

// 获取导航配置（从JSON文件）
app.get('/api/nav-config', (req, res) => {
  try {
    if (!fs.existsSync(navConfigPath)) {
      return res.json(NAV_CONFIG) // 降级到默认配置
    }

    const configContent = fs.readFileSync(navConfigPath, 'utf-8')
    const navConfig = JSON.parse(configContent)
    res.json(navConfig)
  }
  catch (error) {
    console.error('读取导航配置失败:', error)
    res.status(500).json({ error: error.message })
  }
})

// ========================================
// 标签管理API
// ========================================

const tagsFilePath = path.join(__dirname, '../tags.json')

// 读取所有标签
function readTags() {
  if (!fs.existsSync(tagsFilePath)) {
    return []
  }
  const content = fs.readFileSync(tagsFilePath, 'utf-8')
  return JSON.parse(content)
}

// 保存标签
function saveTags(tags) {
  fs.writeFileSync(tagsFilePath, JSON.stringify(tags, null, 2), 'utf-8')
}

// 获取所有标签
app.get('/api/tags', (_req, res) => {
  try {
    const tags = readTags()
    res.json({ success: true, tags })
  }
  catch (error) {
    res.status(500).json({ success: false, error: error.message })
  }
})

// 添加新标签
app.post('/api/tags', (req, res) => {
  try {
    const { name } = req.body
    if (!name || !name.trim()) {
      return res.status(400).json({ success: false, error: '标签名称不能为空' })
    }

    const tags = readTags()
    const trimmedName = name.trim()

    if (tags.includes(trimmedName)) {
      return res.status(400).json({ success: false, error: '标签已存在' })
    }

    tags.push(trimmedName)
    saveTags(tags)

    res.json({ success: true, message: '标签添加成功', tags })
  }
  catch (error) {
    res.status(500).json({ success: false, error: error.message })
  }
})

// 删除标签
app.delete('/api/tags/:name', (req, res) => {
  try {
    const tagName = decodeURIComponent(req.params.name)
    const tags = readTags()

    const index = tags.indexOf(tagName)
    if (index === -1) {
      return res.status(404).json({ success: false, error: '标签不存在' })
    }

    tags.splice(index, 1)
    saveTags(tags)

    res.json({ success: true, message: '标签删除成功', tags })
  }
  catch (error) {
    res.status(500).json({ success: false, error: error.message })
  }
})

app.listen(PORT, () => {
  console.log(`\n✅ 文章爬取API服务已启动`)
  console.log(`🌐 API地址: http://localhost:${PORT}`)
  console.log(`📝 测试接口: http://localhost:${PORT}/api/health`)
  console.log(`💾 图片存储: 本地存储模式`)
  console.log(`📁 草稿图片: public/images/drafts/\n`)
})
