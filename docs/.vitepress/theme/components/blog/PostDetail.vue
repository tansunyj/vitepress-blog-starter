<script setup lang="ts">
import { formatDistance } from 'date-fns'
import { zhCN } from 'date-fns/locale'
import { useData } from 'vitepress'
import { computed, onMounted, ref } from 'vue'
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

const currentDate = computed(() => {
  if (post?.value?.date) {
    return post.value.date
  }
  // 为 frontmatter 的日期创建一个简单的显示格式
  if (frontmatter.value.date) {
    return {
      string: frontmatter.value.date,
      since: frontmatter.value.date,
      time: new Date(frontmatter.value.date).getTime(),
    }
  }
  return null
})

const author = findByName(currentAuthorName.value)

// 客户端动态计算相对时间
const relativeSince = ref('')

onMounted(() => {
  if (currentDate.value?.time) {
    const postDate = new Date(currentDate.value.time)
    relativeSince.value = formatDistance(postDate, new Date(), { addSuffix: true, locale: zhCN })

    // 每分钟更新一次
    const interval = setInterval(() => {
      relativeSince.value = formatDistance(postDate, new Date(), { addSuffix: true, locale: zhCN })
    }, 60000)

    // 组件卸载时清除定时器
    return () => clearInterval(interval)
  }
  else if (currentDate.value?.since) {
    relativeSince.value = currentDate.value.since
  }
})
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
      <span v-if="currentDate" class="meta-date">{{ relativeSince || currentDate.since }}</span>
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

/* 标题 - 第一行，大而醒目 */
.post-title {
  font-size: 2.5rem;
  font-weight: 700;
  line-height: 1.2;
  color: var(--text-primary);
  margin: 0 0 1rem 0;
  font-family: var(--font-family-heading);
}

/* 元信息 - 小字，灰色 */
.post-meta {
  display: flex;
  align-items: center;
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

/* 标签列表 */
.post-tags {
  display: flex;
  flex-wrap: wrap;
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
