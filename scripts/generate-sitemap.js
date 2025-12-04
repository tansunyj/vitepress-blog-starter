import fs from 'node:fs'
import path from 'node:path'
import process from 'node:process'
import { fileURLToPath } from 'node:url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// 配置
const CONFIG = {
  domain: 'https://hellosai.cc', // 正式域名
  outputPath: path.join(__dirname, '../docs/public/sitemap.xml'),
  postsDir: path.join(__dirname, '../docs/posts'),
  defaultDate: '2025-10-01', // 默认更新日期
}

// 获取所有markdown文件
function getAllMarkdownFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir)

  files.forEach((file) => {
    const filePath = path.join(dir, file)
    const stat = fs.statSync(filePath)

    if (stat.isDirectory()) {
      getAllMarkdownFiles(filePath, fileList)
    }
    else if (file.endsWith('.md') && file !== 'index.md') {
      fileList.push(filePath)
    }
  })

  return fileList
}

// 生成URL
function generateUrl(filePath) {
  const relativePath = path.relative(path.join(__dirname, '../docs'), filePath)
  const url = relativePath
    .replace(/\\/g, '/')
    .replace(/\.md$/, '.html')

  return `${CONFIG.domain}/${url}`
}

// 获取文件修改时间
function getLastModified(_filePath) {
  // 使用配置的默认日期，而不是文件实际修改时间
  return CONFIG.defaultDate
}

// 生成sitemap.xml
function generateSitemap() {
  const files = getAllMarkdownFiles(CONFIG.postsDir)

  let sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <!-- 首页 -->
  <url>
    <loc>${CONFIG.domain}/</loc>
    <lastmod>${CONFIG.defaultDate}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
`

  // 添加所有文章
  files.forEach((file) => {
    const url = generateUrl(file)
    const lastmod = getLastModified(file)

    sitemap += `
  <url>
    <loc>${url}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.6</priority>
  </url>
`
  })

  // 添加关于页面
  sitemap += `
  <url>
    <loc>${CONFIG.domain}/about/</loc>
    <lastmod>${CONFIG.defaultDate}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.5</priority>
  </url>
</urlset>`

  // 写入文件
  fs.writeFileSync(CONFIG.outputPath, sitemap, 'utf-8')
  console.log('✅ Sitemap生成成功！')
  console.log(`📄 文件位置: ${CONFIG.outputPath}`)
  console.log(`📊 包含 ${files.length + 2} 个URL`)
}

// 执行生成
try {
  generateSitemap()
}
catch (error) {
  console.error('❌ Sitemap生成失败:', error)
  process.exit(1)
}
