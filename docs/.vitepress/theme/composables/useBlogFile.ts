import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import matter from 'gray-matter'

export default () => {
  function readFrontMatter(file: string, parentDir: string, cache: Map<any, any>) {
    const fullPath = path.join(parentDir, file)
    const timestamp = fs.statSync(fullPath).mtimeMs

    const cached = cache.get(fullPath)
    if (cached && timestamp === cached.timestamp)
      return cached.post

    const src = fs.readFileSync(fullPath, 'utf-8')
    const data = matter(src, { excerpt: true })

    // 修复时区问题：gray-matter 会自动将 YYYY-MM-DD HH:mm:ss 解析为 UTC 时间
    // 我们需要将其恢复为原始字符串，以便 posts.data.ts 中的 formatDate 函数按本地时间处理
    if (data.data.date instanceof Date) {
      try {
        // 重新读取文件内容查找 date 字段的原始字符串
        const dateMatch = src.match(/^date:\s*(.+?)$/m)
        if (dateMatch) {
          const rawDate = dateMatch[1].trim()
          // 只有当原始字符串看起来像日期时间且不包含时区信息时才覆盖
          // 例如 "2025-11-22 18:25:39" 或 "2025-11-22 18:25"
          if (/^\d{4}-\d{2}-\d{2}\s+\d{2}:\d{2}(:\d{2})?$/.test(rawDate)) {
            data.data.date = rawDate
          }
        }
      }
      catch (e) {
        console.error(`[useBlogFile] Error recovering raw date for ${file}:`, e)
      }
    }

    return data
  }

  function folderDir(name: string): string {
    // import.meta is supported
    const dirname = path.dirname(fileURLToPath(import.meta.url))
    // authors 在 blog/ 文件夹下，posts 在根目录下
    if (name === 'authors') {
      return path.resolve(dirname, `../../../blog/${name}`)
    }
    return path.resolve(dirname, `../../../${name}`)
  }

  return { folderDir, readFrontMatter }
}
