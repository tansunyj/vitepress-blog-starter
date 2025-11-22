<script setup lang='ts'>
import type { Post } from '../../composables/posts.data'
import { formatDistance } from 'date-fns'
import { zhCN } from 'date-fns/locale'
import { computed, onMounted, ref } from 'vue'
import useAuthors from '../../composables/useAuthors'
import PostAuthor from './PostAuthor.vue'

const props = defineProps<{
  post: Post
}>()
const { findByName } = useAuthors()
const author = findByName(props.post.author || '杰哥')

// 客户端动态计算相对时间
const relativeSince = ref(props.post.date.since)

onMounted(() => {
  // 在客户端重新计算相对时间
  const postDate = new Date(props.post.date.time)
  relativeSince.value = formatDistance(postDate, new Date(), { addSuffix: true, locale: zhCN })

  // 每分钟更新一次
  const interval = setInterval(() => {
    relativeSince.value = formatDistance(postDate, new Date(), { addSuffix: true, locale: zhCN })
  }, 60000)

  // 组件卸载时清除定时器
  return () => clearInterval(interval)
})

// 将预览图URL转换为缩略图URL（用于列表卡片）
const thumbnailUrl = computed(() => {
  const coverUrl = props.post.data.cover
  if (!coverUrl)
    return ''

  // 只对Cloudflare图床URL进行转换（包含 /previews/ 的URL）
  // 本地相对路径（如 /images/xxx.png）保持不变
  if (coverUrl.includes('/previews/')) {
    return coverUrl.replace('/previews/', '/thumbnails/')
  }

  // 其他情况直接返回原URL
  return coverUrl
})
</script>

<template>
  <a
    :href="post.href"
    class="block rounded-xl shadow-md hover:shadow-xl transition-all duration-300 bg-white dark:bg-gray-800 cursor-pointer post-card-link"
  >
    <article class="flex flex-row p-4 gap-4 items-stretch">
      <!-- 左侧1:1正方形封面图 -->
      <div class="flex-shrink-0 w-[28%] aspect-square overflow-hidden rounded-lg">
        <img
          v-if="thumbnailUrl"
          :src="thumbnailUrl"
          :alt="post.title"
          class="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
        >
        <div
          v-else
          class="w-full h-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center"
        >
          <svg class="w-16 h-16 text-white" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z" />
          </svg>
        </div>
      </div>

      <!-- 右侧60%内容区域 -->
      <div class="flex-1 flex flex-col min-w-0">
        <!-- 标题 - 顶部对齐，无上边距 -->
        <h2 class="text-lg font-bold text-gray-900 dark:text-white hover:text-[color:var(--vp-c-brand-light)] transition-colors line-clamp-2 mb-3 leading-tight m-0 p-0">
          {{ post.title }}
        </h2>

        <!-- 标签列表 - 中间 -->
        <div v-if="post.data.tags && post.data.tags.length" class="flex flex-wrap gap-2 mb-3">
          <span
            v-for="tag in post.data.tags"
            :key="tag"
            class="px-3 py-1.5 text-xs font-medium bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-full border border-blue-200 dark:border-blue-700/50"
          >
            #{{ tag }}
          </span>
        </div>

        <!-- 底部区域：作者和发布时间分开 -->
        <div class="mt-auto flex items-end justify-between">
          <!-- 左下：作者 -->
          <div class="text-xs">
            <PostAuthor :author="author" />
          </div>

          <!-- 右下：发布时间 -->
          <div class="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
            <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path
                fill-rule="evenodd"
                d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                clip-rule="evenodd"
              />
            </svg>
            {{ relativeSince }}
          </div>
        </div>
      </div>
    </article>
  </a>
</template>

<style scoped></style>
