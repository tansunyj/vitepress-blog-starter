<script setup lang='ts'>
import type { Ref } from 'vue'
import { computed, inject, ref } from 'vue'
import usePosts from '../../composables/usePosts'
import Post from './Post.vue'

// 接收 folder 参数
const props = defineProps<{
  folder: string
}>()

const { allPosts } = usePosts()

// 注入选中的tags
const selectedTags = inject<Ref<string[]>>('selectedTags', ref([]))

// 根据 folder 参数过滤文章
const filteredPosts = computed(() => {
  // 标准化 folder 路径（移除首尾斜杠）
  const normalizedFolder = props.folder.replace(/^\/|\/$/g, '')

  let filtered = allPosts.value.filter((post) => {
    // post.href 格式: /posts/vpn-proxy/airport-review/article.html
    const postPath = post.href.replace(/\.html$/, '')
    // 获取文章所在的目录路径: /posts/vpn-proxy/airport-review
    const postDir = postPath.substring(0, postPath.lastIndexOf('/'))
    // 移除 /posts/ 前缀: vpn-proxy/airport-review
    const relativePath = postDir.replace(/^\/posts\//, '')

    // 检查文章目录是否匹配 folder 参数
    return relativePath === normalizedFolder
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
</script>

<template>
  <div class="post-list-wrapper">
    <!-- 文章列表 -->
    <div v-if="filteredPosts.length > 0" class="posts-grid">
      <Post v-for="post in filteredPosts" :key="post.href" :post="post" />
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
/* 整体容器 */
.post-list-wrapper {
  max-width: 100%;
  margin: 0 auto;
  padding: 2rem 3rem;
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
  .post-list-wrapper {
    padding: 1.5rem 2rem;
  }

  .posts-grid {
    gap: 1.25rem;
  }
}

@media (max-width: 480px) {
  .post-list-wrapper {
    padding: 1rem 1.5rem;
  }
}
</style>
