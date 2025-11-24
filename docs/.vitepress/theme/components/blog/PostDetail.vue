<script setup lang="ts">
import { useData } from 'vitepress'
import { computed } from 'vue'
import useAuthors from '../../composables/useAuthors'
import usePosts from '../../composables/usePosts'

const { frontmatter, page } = useData()

const { currentPost: post } = usePosts()
const { findByName } = useAuthors()

// 如果 usePosts 找不到当前文章（比如 /posts/ 路径），使用 frontmatter
const currentAuthorName = computed(() => {
  if (post?.value?.author) {
    return post.value.author
  }
  return frontmatter.value.author || '杰哥'
})

const currentTags = computed(() => {
  if (post?.value?.data?.tags) {
    return post.value.data.tags
  }
  return frontmatter.value.tags || []
})

const currentTitle = computed(() => {
  if (post?.value?.title) {
    return post.value.title
  }
  return frontmatter.value.title || page.value.title
})

// 格式化日期为 yyyy-MM-dd HH:mm:ss
function formatDateString(date: Date): string {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  const hour = String(date.getHours()).padStart(2, '0')
  const minute = String(date.getMinutes()).padStart(2, '0')
  const second = String(date.getSeconds()).padStart(2, '0')
  return `${year}-${month}-${day} ${hour}:${minute}:${second}`
}

// 手动解析 yyyy-MM-dd HH:mm:ss 格式的日期字符串为本地时间
function parseLocalDateTime(dateStr: string): Date {
  const match = dateStr.match(/^(\d{4})-(\d{2})-(\d{2})\s+(\d{2}):(\d{2}):(\d{2})$/)
  if (match) {
    const [, year, month, day, hour, minute, second] = match
    return new Date(
      Number.parseInt(year),
      Number.parseInt(month) - 1, // 月份从0开始
      Number.parseInt(day),
      Number.parseInt(hour),
      Number.parseInt(minute),
      Number.parseInt(second),
    )
  }
  return new Date(dateStr)
}

const currentDate = computed(() => {
  if (post?.value?.date) {
    return post.value.date
  }
  // 为 frontmatter 的日期创建一个简单的显示格式
  if (frontmatter.value.date) {
    const dateValue = frontmatter.value.date
    let parsedDate: Date
    let dateString: string

    // 如果是字符串格式
    if (typeof dateValue === 'string') {
      // 检查是否已经是 yyyy-MM-dd HH:mm:ss 格式
      if (/^\d{4}-\d{2}-\d{2}\s+\d{2}:\d{2}:\d{2}$/.test(dateValue)) {
        dateString = dateValue
        parsedDate = parseLocalDateTime(dateValue) // 使用手动解析
      }
      // 检查是否是 ISO 8601 格式 (如 2025-11-24T16:50:15.000Z)
      // VitePress 可能将 "2025-11-24 16:50:15" (北京时间) 解析为 "2025-11-24T16:50:15.000Z"
      // 这里需要提取 UTC 时间的数值，并作为北京时间使用
      else if (/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/.test(dateValue)) {
        const isoDate = new Date(dateValue)
        // 使用 getUTC* 方法提取时间数值（避免时区转换）
        const year = isoDate.getUTCFullYear()
        const month = isoDate.getUTCMonth()
        const day = isoDate.getUTCDate()
        const hour = isoDate.getUTCHours()
        const minute = isoDate.getUTCMinutes()
        const second = isoDate.getUTCSeconds()
        // 将提取的数值作为本地时间（北京时间）创建 Date 对象
        parsedDate = new Date(year, month, day, hour, minute, second)
        dateString = formatDateString(parsedDate)
      }
      else {
        // 其他格式，先解析再格式化
        parsedDate = new Date(dateValue)
        dateString = formatDateString(parsedDate)
      }
    }
    // 如果是 Date 对象（gray-matter 解析的）
    else if (dateValue instanceof Date) {
      // 使用 getUTC* 方法提取时间数值，作为北京时间使用
      const year = dateValue.getUTCFullYear()
      const month = dateValue.getUTCMonth()
      const day = dateValue.getUTCDate()
      const hour = dateValue.getUTCHours()
      const minute = dateValue.getUTCMinutes()
      const second = dateValue.getUTCSeconds()

      parsedDate = new Date(year, month, day, hour, minute, second)
      dateString = formatDateString(parsedDate)
    }
    // 其他情况，尝试转换
    else {
      parsedDate = new Date(String(dateValue))
      dateString = formatDateString(parsedDate)
    }

    return {
      string: dateString,
      since: dateString,
      time: +parsedDate,
    }
  }
  return null
})

const author = findByName(currentAuthorName.value)
</script>

<template>
  <div class="post-detail-header">
    <!-- 文章标题 - 第一行，最显眼 -->
    <h1 class="post-title">
      {{ currentTitle }}
    </h1>

    <!-- 元信息 - 小字，灰色 -->
    <div class="post-meta">
      <PostAuthor :author="author" />
      <span class="meta-separator">|</span>
      <span v-if="currentDate" class="meta-date">{{ currentDate.string }}</span>
    </div>

    <!-- 标签列表 -->
    <div v-if="currentTags && currentTags.length > 0" class="post-tags">
      <span
        v-for="tag in currentTags"
        :key="tag"
        class="tag-item"
      >
        #{{ tag }}
      </span>
    </div>
  </div>
</template>

<style scoped>
.post-detail-header {
  margin-bottom: 2rem;
  padding-bottom: 2rem;
  border-bottom: 1px solid var(--vp-c-divider);
}

/* 标题 - 第一行，大而醒目，居中显示 */
.post-title {
  font-size: 2.5rem;
  font-weight: 700;
  line-height: 1.2;
  color: var(--text-primary);
  margin: 0 0 1rem 0;
  font-family: var(--font-family-heading);
  text-align: center;
}

/* 元信息 - 小字，灰色，居中显示 */
.post-meta {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  font-size: 0.875rem;
  color: var(--text-tertiary);
  margin-bottom: 1rem;
}

.meta-separator {
  color: var(--text-muted);
  margin: 0 0.75rem;
  opacity: 0.3;
  font-weight: 300;
}

.meta-date {
  color: var(--text-tertiary);
}

.meta-category {
  display: inline-flex;
  align-items: center;
}

/* 标签列表 - 居中显示 */
.post-tags {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 0.5rem;
  margin-top: 1rem;
}

.tag-item {
  display: inline-flex;
  align-items: center;
  padding: 0.25rem 0.75rem;
  background: var(--bg-tertiary);
  color: var(--vp-c-brand);
  border: 1px solid var(--vp-c-brand-light);
  border-radius: 6px;
  font-size: 0.875rem;
  font-weight: 500;
  transition: all var(--transition-fast);
  cursor: default;
}

.tag-item:hover {
  background: var(--vp-c-brand-light);
  color: white;
  border-color: var(--vp-c-brand);
}

/* 响应式 */
@media (max-width: 768px) {
  .post-title {
    font-size: 1.75rem;
  }

  .post-meta {
    font-size: 0.8125rem;
  }
}
</style>
