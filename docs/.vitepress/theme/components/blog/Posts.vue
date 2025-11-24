<script setup lang="ts">
import type { Ref } from 'vue'
import { useData } from 'vitepress'
import { computed, inject, onMounted, ref } from 'vue'
import usePosts from '../../composables/usePosts'
import Post from './Post.vue'

const { allPosts } = usePosts()
const { theme } = useData()

// 注入选中的tags
const selectedTags = inject<Ref<string[]>>('selectedTags', ref([]))

// Banner 配置
const bannerConfig = ref({
  title: '欢迎来到杰哥的技术小站',
  subtitle: '',
  banner: '/images/banner/banner.png'
})

// 加载 Banner 配置
async function loadBannerConfig() {
  try {
    const response = await fetch('http://localhost:3456/api/config/site')
    const data = await response.json()
    if (data.success && data.config) {
      if (data.config.bannerTitle) bannerConfig.value.title = data.config.bannerTitle
      if (data.config.bannerSubtitle) bannerConfig.value.subtitle = data.config.bannerSubtitle
      if (data.config.bannerImage) bannerConfig.value.banner = data.config.bannerImage
    }
  }
  catch (error) {
    console.error('Failed to load banner config:', error)
  }
}

// 获取首页显示的20篇最新文章
const recentPosts = computed(() => allPosts.value.slice(0, 20))

// 统计tags并获取热门tags（只基于首页的20篇文章）
const topTags = computed(() => {
  const tagCounts: Record<string, number> = {}

  recentPosts.value.forEach((post) => {
    const tags = post.frontmatter?.tags || post.data?.tags
    if (tags && Array.isArray(tags)) {
      tags.forEach((tag: string) => {
        tagCounts[tag] = (tagCounts[tag] || 0) + 1
      })
    }
  })

  // 按数量排序，显示所有tags
  return Object.keys(tagCounts)
    .sort((a, b) => tagCounts[b] - tagCounts[a])
})

// 切换tag选中状态
function toggleTag(tag: string) {
  const index = selectedTags.value.indexOf(tag)
  if (index > -1) {
    selectedTags.value.splice(index, 1)
  }
  else {
    selectedTags.value.push(tag)
  }
}

// 清除所有选中的tags
function clearAllTags() {
  selectedTags.value = []
}

// 过滤后的文章（基于首页的20篇最新文章）
const filteredPosts = computed(() => {
  // 如果没有选中tags，显示所有20篇
  if (selectedTags.value.length === 0) {
    return recentPosts.value
  }

  // 有选中tags，在这20篇中进行过滤（OR逻辑）
  return recentPosts.value.filter((post) => {
    const postTags = (post.frontmatter?.tags || post.data?.tags || []) as string[]
    // 文章只要包含任意一个选中的标签就显示（OR逻辑）
    return selectedTags.value.some(tag => postTags.includes(tag))
  })
})

// 组件挂载时加载配置
onMounted(() => {
  loadBannerConfig()
})
</script>

<template>
  <div>
    <!-- Banner 区域容器 -->
    <div v-if="bannerConfig.banner" class="banner-wrapper">
      <div class="banner-container">
        <img
          :src="bannerConfig.banner"
          :alt="bannerConfig.title"
          class="banner-image"
        >
        <div style="position: absolute !important; inset: 0 !important; background: linear-gradient(to bottom, rgba(0,0,0,0.4), rgba(0,0,0,0.6)) !important; z-index: 10 !important; display: flex !important; align-items: flex-start !important; justify-content: center !important; padding-top: 8rem !important;">
          <span style="color: #ffffff !important; font-size: 3.2rem !important; font-weight: 700 !important; text-shadow: 2px 2px 8px rgba(0,0,0,0.8) !important; font-family: -apple-system, BlinkMacSystemFont, sans-serif !important; display: block !important; text-align: center !important; letter-spacing: 0.05em !important;">
            {{ bannerConfig.title }}
          </span>
        </div>
      </div>
    </div>

    <!-- 传统标题（如果没有 banner） -->
    <div v-else class="mx-auto max-w-screen-sm text-center lg:mb-16 mb-8 pt-16">
      <h2 class="mb-4 text-3xl lg:text-4xl tracking-tight font-extrabold text-[color:var(--vp-c-brand-light)] dark:text-[color:var(--vp-c-brand-dark)]">
        {{ bannerConfig.title }}
      </h2>
    </div>

    <!-- Tags过滤器 - 首页横向展示 -->
    <div class="mx-auto max-w-screen-xl px-6 mb-8">
      <div class="tags-filter-horizontal">
        <div class="filter-header">
          <span class="filter-label">筛选标签</span>
          <div class="tags-horizontal-list">
            <button
              v-for="tag in topTags"
              :key="tag"
              class="tag-horizontal-item"
              :class="{ active: selectedTags.includes(tag) }"
              @click="toggleTag(tag)"
            >
              {{ tag }}
            </button>
          </div>
          <button
            v-if="selectedTags.length > 0"
            class="clear-all-btn"
            @click="clearAllTags"
          >
            清除全部 ({{ selectedTags.length }})
          </button>
        </div>
      </div>
    </div>

    <!-- 文章列表容器 -->
    <div class="mx-auto max-w-screen-xl lg:py-16 lg:px-6 px-4">
      <!-- 文章列表 -->
      <div v-if="filteredPosts.length > 0" class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Post v-for="post of filteredPosts" :key="post.href" :post="post" />
      </div>

      <!-- 无结果提示 -->
      <div v-else class="empty-state">
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
  margin-top: 10px; /* 距离页眉10px */
  margin-bottom: 2rem;
}

@media (max-width: 768px) {
  .banner-wrapper {
    padding: 0 1rem;
    margin-top: 8px; /* 移动端稍小一点 */
  }
}

/* 空状态提示 */
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

/* 横向Tags过滤器 */
.tags-filter-horizontal {
  padding: 1rem 0; /* 去掉左右padding，只保留上下 */
}

.filter-header {
  display: flex;
  align-items: center;
  gap: 1rem; /* 从1.5rem减小到1rem */
  flex-wrap: wrap;
}

.filter-label {
  font-size: 1rem; /* 从1.125rem减小到1rem */
  font-weight: 700;
  color: var(--vp-c-brand);
  white-space: nowrap;
  flex-shrink: 0;
}

.tags-horizontal-list {
  display: flex;
  flex-wrap: wrap;
  gap: 0.375rem; /* 从0.5rem减小到0.375rem */
  flex: 1;
  min-width: 0;
}

.clear-all-btn {
  padding: 0.375rem 0.875rem; /* 减小padding */
  font-size: 0.8125rem; /* 减小字体 */
  font-weight: 500;
  color: var(--vp-c-brand);
  background-color: transparent;
  border: 1px solid var(--vp-c-brand);
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s ease;
  white-space: nowrap;
  flex-shrink: 0;
}

.clear-all-btn:hover {
  color: #fff;
  background-color: var(--vp-c-brand);
}

.tag-horizontal-item {
  padding: 0.25rem 0.75rem; /* 进一步减小 */
  font-size: 0.75rem; /* 12px - 更小的字体 */
  font-weight: 500;
  color: var(--vp-c-text-2);
  background-color: var(--vp-c-bg);
  border: 1px solid var(--vp-c-divider);
  border-radius: 12px; /* 从16px减小到12px */
  cursor: pointer;
  transition: all 0.2s ease;
  white-space: nowrap;
}

.tag-horizontal-item:hover {
  color: var(--vp-c-brand);
  border-color: var(--vp-c-brand);
  transform: translateY(-2px);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.tag-horizontal-item.active {
  color: #fff;
  background-color: var(--vp-c-brand);
  border-color: var(--vp-c-brand);
  box-shadow: 0 2px 8px rgba(59, 130, 246, 0.25);
}

.tag-horizontal-item.active:hover {
  background-color: var(--vp-c-brand-dark);
}

@media (max-width: 768px) {
  .tags-filter-horizontal {
    padding: 0.75rem 0;
  }

  .filter-header {
    gap: 1rem;
  }

  .filter-label {
    font-size: 1rem;
    width: 100%;
    margin-bottom: 0.5rem;
  }

  .tags-horizontal-list {
    gap: 0.375rem;
    order: 2;
  }

  .clear-all-btn {
    order: 3;
  }

  .tag-horizontal-item {
    padding: 0.25rem 0.75rem;
    font-size: 0.75rem;
  }
}
</style>

<style>
/* Banner样式 - 不使用scoped，确保能应用到所有子元素 */
.banner-container {
  position: relative !important;
  max-width: var(--vp-layout-max-width, 1440px) !important;
  margin: 0 auto 3rem !important;
  min-height: 500px !important;
  height: auto !important;
  overflow: visible !important;
  border-radius: 12px !important;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1) !important;
}

.banner-image {
  position: absolute !important;
  top: 0 !important;
  left: 0 !important;
  width: 100% !important;
  height: 100% !important;
  object-fit: cover !important;
  object-position: center !important;
  z-index: 0 !important;
}

.banner-overlay {
  position: absolute !important;
  top: 0 !important;
  left: 0 !important;
  right: 0 !important;
  bottom: 0 !important;
  background: linear-gradient(to bottom, rgba(0, 0, 0, 0.5) 0%, rgba(0, 0, 0, 0.7) 100%) !important;
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
  padding-top: 3rem !important;
  z-index: 10 !important;
}

.banner-content {
  position: relative !important;
  z-index: 11 !important;
  text-align: center !important;
  color: white !important;
  padding: 2rem !important;
  max-width: 800px !important;
}

.banner-title {
  font-size: 7rem !important;
  font-weight: 900 !important;
  margin: 0 !important;
  margin-bottom: 1rem !important;
  text-shadow: 5px 5px 15px black !important;
  line-height: 1.2 !important;
  letter-spacing: -0.02em !important;
  color: white !important;
  opacity: 1 !important;
  visibility: visible !important;
  display: block !important;
}

.banner-description {
  font-size: 1.5rem !important;
  font-weight: 400 !important;
  text-shadow: 2px 2px 8px rgba(0, 0, 0, 0.8) !important;
  opacity: 0.95 !important;
  line-height: 1.5 !important;
  color: white !important;
}

@media (max-width: 768px) {
  .banner-container {
    min-height: 300px !important;
  }
  
  .banner-overlay {
    padding-top: 2rem !important;
  }
  
  .banner-title {
    font-size: 5rem !important;
  }
  
  .banner-description {
    font-size: 1.2rem !important;
  }
}

@media (max-width: 480px) {
  .banner-container {
    min-height: 250px !important;
  }
  
  .banner-overlay {
    padding-top: 1.5rem !important;
  }
  
  .banner-title {
    font-size: 3.5rem !important;
  }
  
  .banner-description {
    font-size: 1rem !important;
  }
}
</style>
