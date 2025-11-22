<script setup lang='ts'>
import type { Ref } from 'vue'
import { useData, useRoute } from 'vitepress'
import { computed, inject, ref } from 'vue'
import usePosts from '../../composables/usePosts'
import Post from './Post.vue'

const { allPosts } = usePosts()
const route = useRoute()
const { frontmatter } = useData()

// 注入选中的tags
const selectedTags = inject<Ref<string[]>>('selectedTags', ref([]))

// 获取当前路径对应的分类文章
const categoryPosts = computed(() => {
  // 获取当前路径，移除末尾斜杠
  let currentPath = route.path.replace(/\/$/, '')
  // 如果路径包含 /blog，移除它（因为文章 href 中没有 /blog）
  currentPath = currentPath.replace(/^\/blog/, '')

  let filtered = allPosts.value.filter((post) => {
    // post.href 格式: /posts/vpn-proxy/tutorial/xxx.html
    const postPath = post.href.replace(/\.html$/, '')
    // 获取文章所在的目录路径
    const postDir = postPath.substring(0, postPath.lastIndexOf('/'))
    // 检查文章目录是否匹配当前分类路径
    // 并且排除当前文章自己
    return postDir === currentPath && post.href !== route.path
  })

  // 如果有选中的tags，进行过滤（OR逻辑）
  if (selectedTags.value.length > 0) {
    filtered = filtered.filter((post) => {
      const postTags = (post.frontmatter?.tags || post.data?.tags || []) as string[]
      // 文章只要包含任意一个选中的标签就显示（OR逻辑）
      return selectedTags.value.some(tag => postTags.includes(tag))
    })
  }

  return filtered
})

// 获取分类信息（从frontmatter或根据路径判断）
const categoryInfo = computed(() => {
  const description = frontmatter.value.description || ''
  return {
    description,
    icon: getCategoryIcon(),
  }
})

function getCategoryIcon(): string {
  const path = route.path

  if (path.includes('/vpn-proxy/free-nodes'))
    return '🔔'
  if (path.includes('/vpn-proxy/'))
    return '🚀'
  if (path.includes('/ai/'))
    return '🤖'
  if (path.includes('/blog/freebies'))
    return '✨'
  if (path.includes('/blog/'))
    return '📚'
  if (path.includes('/resources/'))
    return '📦'

  return '📄'
}
</script>

<template>
  <div class="category-posts-wrapper">
    <!-- 分类标题区域 - 统一样式 -->
    <div class="category-header">
      <h1 class="category-title">
        <span class="category-emoji">{{ categoryInfo.icon }}</span>
        <span class="category-name">{{ frontmatter.title || '文章列表' }}</span>
      </h1>
      <p v-if="categoryInfo.description" class="category-description" v-html="categoryInfo.description" />
    </div>

    <!-- 文章列表 -->
    <div v-if="categoryPosts.length > 0" class="posts-grid">
      <Post v-for="post in categoryPosts" :key="post.href" :post="post" />
    </div>

    <!-- 空状态 -->
    <div v-else class="empty-state">
      <p class="empty-text">
        暂无文章
      </p>
    </div>
  </div>
</template>

<style scoped>
/* 整体容器 - 跟首页一致的布局 */
.category-posts-wrapper {
  max-width: 100%;
  margin: 0 auto;
  padding: 0 1.5rem;
  padding-top: 2rem;
}

/* 分类标题区域 - 简洁设计 */
.category-header {
  margin-bottom: 2.5rem;
}

/* 标题 - 一行文字 */
.category-title {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 2rem;
  font-weight: 600;
  line-height: 1.3;
  color: var(--vp-c-text-1);
  margin: 0 0 1rem 0;
}

.category-emoji {
  font-size: 2rem;
  line-height: 1;
}

.category-name {
  flex: 1;
}

/* 描述框 - 浅灰色提示块 */
.category-description {
  font-size: 0.9375rem;
  line-height: 1.7;
  color: var(--vp-c-text-2);
  margin: 0;
  padding: 1rem 1.5rem;
  background-color: var(--vp-c-bg-soft);
  border-radius: 8px;
  border: 1px solid var(--vp-c-divider);
}

.category-description :deep(strong) {
  font-weight: 600;
  color: var(--vp-c-text-1);
}

/* 文章列表网格 - 单列布局 */
.posts-grid {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

/* 空状态 */
.empty-state {
  text-align: center;
  padding: 2rem 0;
  color: var(--vp-c-text-3);
}

.empty-text {
  font-size: 1.125rem;
  font-weight: 600;
  color: var(--vp-c-text-2);
  margin: 0 0 0.5rem 0;
}

.empty-hint {
  font-size: 0.875rem;
  color: var(--vp-c-text-3);
  margin: 0;
}

/* 响应式 */
@media (max-width: 768px) {
  .category-posts-wrapper {
    padding: 1.5rem 1rem;
  }

  .category-title {
    font-size: 1.5rem;
  }

  .category-emoji {
    font-size: 1.5rem;
  }

  .category-description {
    font-size: 0.875rem;
    padding: 0.875rem 1rem;
  }

  .posts-grid {
    gap: 1.25rem;
  }
}
</style>
