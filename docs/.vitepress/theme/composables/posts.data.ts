import type { MarkdownRenderer } from 'vitepress'
import fs from 'node:fs'
import path from 'node:path'
import process from 'node:process'
import { formatDistance } from 'date-fns'
import { zhCN } from 'date-fns/locale'
import { createMarkdownRenderer } from 'vitepress'
import useBlogFile from './useBlogFile'

let md: MarkdownRenderer
const { folderDir, readFrontMatter } = useBlogFile()

const dir = folderDir('posts')

export interface Post {
  title: string
  author: string
  href: string
  date: {
    time: number
    string: string
    since: string
  }
  excerpt: string | undefined
  data: Record<string, any>
  frontmatter?: {
    tags?: string[]
    [key: string]: any
  }
}

declare const data: Post[]
export { data }

async function load(): Promise<Post[]>
async function load() {
  md = md || (await createMarkdownRenderer(process.cwd()))
  const posts: Post[] = []

  // 递归读取所有子文件夹中的 .md 文件
  function readDirRecursive(dirPath: string, relativePath = '') {
    const files = fs.readdirSync(dirPath)

    files.forEach((file) => {
      const fullPath = path.join(dirPath, file)
      const stat = fs.statSync(fullPath)

      if (stat.isDirectory()) {
        // 递归读取子文件夹
        readDirRecursive(fullPath, path.join(relativePath, file))
      }
      else if (file.endsWith('.md') && file !== 'index.md') {
        // 读取 markdown 文件（排除 index.md）
        const post = getPost(file, dirPath, relativePath)
        if (post)
          posts.push(post)
      }
    })
  }

  readDirRecursive(dir)
  return posts.sort((a, b) => b.date.time - a.date.time)
}

export default {
  watch: path.join(dir, '**/*.md'),
  load,
}

const cache = new Map()

function getPost(file: string, postDir: string, relativePath = ''): Post | null {
  const fullPath = path.join(postDir, file)
  const timestamp = fs.statSync(fullPath).mtimeMs

  const { data, excerpt } = readFrontMatter(file, postDir, cache)

  // 如果没有 title 或 date，跳过这个文件
  if (!data.title || !data.date) {
    return null
  }

  // 构建正确的 URL 路径
  const urlPath = relativePath
    ? path.join(relativePath, file).replace(/\.md$/, '.html')
    : file.replace(/\.md$/, '.html')

  const post: Post = {
    title: data.title,
    author: data.author ? data.author : 'Unknown',
    href: `/posts/${urlPath.replace(/\\/g, '/')}`,
    date: formatDate(data.date),
    excerpt: excerpt && md.render(excerpt),
    data,
    frontmatter: data, // 添加frontmatter，指向data，包含tags等所有元数据
  }

  cache.set(fullPath, {
    timestamp,
    post,
  })
  return post
}

function formatDate(date: string | Date): Post['date'] {
  let parsedDate: Date

  if (date instanceof Date) {
    parsedDate = date
  }
  else {
    // 解析 "yyyy-MM-dd HH:mm:ss" 格式为本地时间
    // 使用手动解析以确保正确处理时区（假设输入时间为 UTC+8）
    const dateStr = String(date).trim()
    const match = dateStr.match(/^(\d{4})-(\d{2})-(\d{2})\s+(\d{2}):(\d{2}):(\d{2})$/)

    if (match) {
      // 手动构造日期对象，使用本地时区
      const [, year, month, day, hour, minute, second] = match
      parsedDate = new Date(
        Number.parseInt(year),
        Number.parseInt(month) - 1, // 月份从0开始
        Number.parseInt(day),
        Number.parseInt(hour),
        Number.parseInt(minute),
        Number.parseInt(second),
      )
      console.warn('[posts.data] 解析时间:', {
        input: dateStr,
        parsed: parsedDate.toISOString(),
        local: parsedDate.toString(),
        now: new Date().toString(),
      })
    }
    else {
      // 回退到原始解析方式
      parsedDate = new Date(date)
    }

    // 如果解析失败，尝试直接解析
    if (Number.isNaN(parsedDate.getTime())) {
      parsedDate = new Date(date)
    }
  }

  return {
    time: +parsedDate,
    string: parsedDate.toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }),
    since: formatDistance(parsedDate, new Date(), { addSuffix: true, locale: zhCN }),
  }
}
