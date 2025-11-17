<script setup lang="ts">
import { computed, ref } from 'vue'
import { useData } from 'vitepress'
import usePosts from '../../composables/usePosts'
import TagFilter from './TagFilter.vue'

const { allPosts } = usePosts()
const { theme } = useData()

// 选中的标签
const selectedTags = ref<string[]>([])

// 过滤后的文章
const filteredPosts = computed(() => {
  if (selectedTags.value.length === 0) {
    return allPosts.value
  }

  return allPosts.value.filter((post) => {
    const postTags = post.frontmatter?.tags || []
    // 文章需要包含所有选中的标签
    return selectedTags.value.every(tag => postTags.includes(tag))
  })
})

// 处理标签过滤
function handleTagFilter(tags: string[]) {
  selectedTags.value = tags
}
</script>

<template>
  <div>
    <!-- Banner 区域容器 -->
    <div v-if="theme.blog?.banner" class="banner-wrapper">
      <div class="banner-container">
        <div class="banner-overlay">
          <div class="banner-content">
            <h1 class="banner-title">
              {{ theme.blog?.title }}
            </h1>
            <p class="banner-description">
              {{ theme.blog?.description }}
            </p>
          </div>
        </div>
        <img
          :src="theme.blog?.banner"
          :alt="theme.blog?.title"
          class="banner-image"
        >
      </div>
    </div>

    <!-- 传统标题（如果没有 banner） -->
    <div v-else class="mx-auto max-w-screen-sm text-center lg:mb-16 mb-8 pt-16">
      <h2 class="mb-4 text-3xl lg:text-4xl tracking-tight font-extrabold text-[color:var(--vp-c-brand-light)] dark:text-[color:var(--vp-c-brand-dark)]">
        {{ theme.blog?.title }}
      </h2>
      <p class="font-light sm:text-xl text-gray-600 dark:text-gray-300">
        {{ theme.blog?.description }}
      </p>
    </div>

    <!-- 标签过滤器 + 文章列表容器 -->
    <div class="mx-auto max-w-screen-xl lg:py-16 lg:px-6 px-4">
      <!-- 标签过滤器 -->
      <TagFilter :posts="allPosts" @filter="handleTagFilter" />

      <!-- 文章列表 -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Post v-for="post of filteredPosts" :key="post.href" :post="post" />
      </div>

      <!-- 无结果提示 -->
      <div v-if="filteredPosts.length === 0" class="empty-state">
        <p class="empty-text">
          😔 没有找到匹配的文章
        </p>
        <p class="empty-hint">
          请尝试选择其他标签组合
        </p>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Banner外层容器 - 保持页面边距 */
.banner-wrapper {
  padding: 0 1.5rem;
  margin-bottom: 2rem;
}

@media (max-width: 768px) {
  .banner-wrapper {
    padding: 0 1rem;
  }
}

.empty-state {
  text-align: center;
  padding: 4rem 2rem;
  margin-top: 2rem;
  background-color: var(--vp-c-bg-soft);
  border-radius: 12px;
  border: 1px dashed var(--vp-c-divider);
}

.empty-text {
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--vp-c-text-2);
  margin: 0 0 0.5rem 0;
}

.empty-hint {
  font-size: 0.875rem;
  color: var(--vp-c-text-3);
  margin: 0;
}
</style>
