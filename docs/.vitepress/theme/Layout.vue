<script setup lang="ts">
import { useRoute, useData } from 'vitepress'
import DefaultTheme from 'vitepress/theme'
import { computed, provide, ref } from 'vue'
import PostDetail from './components/blog/PostDetail.vue'
import PostNav from './components/blog/PostNav.vue'
import SidebarTagFilter from './components/blog/SidebarTagFilter.vue'
import { useSidebarHighlight } from './composables/sidebarHighlight'
import usePosts from './composables/usePosts'

const { Layout } = DefaultTheme
const route = useRoute()
const { frontmatter, site } = useData()
const { allPosts } = usePosts()

// 检测是否是文章页面（/posts/ 或 /blog/posts/ 路径下的具体文章）
const isPostPage = computed(() => {
  // 如果 frontmatter 中指定 isArticle: false，则不视为文章详情页
  if (frontmatter.value.isArticle === false) {
    return false
  }

  const path = route.path
  // 检测是否包含 /posts/ 且以 .html 结尾（具体文章页面）
  return path.includes('/posts/') && path.endsWith('.html')
})

// 检测是否显示标签筛选组件（关于页面不显示）
const showTagFilter = computed(() => {
  const path = route.path
  // 关于页面不显示标签筛选
  return !path.includes('/about/')
})

// 获取当前分类的文章（用于侧边栏tags）
const currentCategoryPosts = computed(() => {
  const path = route.path

  // 如果是首页，返回所有文章
  if (path === '/' || path === '/index.html') {
    return allPosts.value
  }

  // 如果不在posts路径下，返回所有文章
  if (!path.includes('/posts/')) {
    return allPosts.value
  }

  // 情况1：文章详情页 - 只返回当前文章
  if (isPostPage.value) {
    const currentPost = allPosts.value.find(post => post.href === path)
    return currentPost ? [currentPost] : []
  }

  // 情况2：分类列表页 - 返回该分类所有文章
  // 获取当前路径，移除末尾斜杠和.html
  let currentPath = path.replace(/\/$/, '').replace(/\.html$/, '')
  // 移除 /blog 前缀（如果有）
  currentPath = currentPath.replace(/^\/blog/, '')

  // 过滤出当前分类的文章
  return allPosts.value.filter((post) => {
    const postPath = post.href.replace(/\.html$/, '')
    const postDir = postPath.substring(0, postPath.lastIndexOf('/'))
    // 文章目录要以当前路径开头
    return postDir.startsWith(currentPath)
  })
})

// 选中的标签
const selectedTags = ref<string[]>([])

// 处理标签过滤
function handleTagFilter(tags: string[]) {
  selectedTags.value = tags
}

// 通过provide将选中的tags提供给子组件
provide('selectedTags', selectedTags)

// 使用侧边栏高亮功能
useSidebarHighlight()
</script>

<template>
  <Layout>
    <!-- 导航栏 - 添加自定义标题（在搜索框左侧） -->
    <template #nav-bar-content-before>
      <a href="/" class="custom-nav-title">{{ site?.title || '杰哥的技术小站' }}</a>
    </template>

    <!-- 侧边栏底部 - 添加Tags过滤（关于页面不显示） -->
    <template #sidebar-nav-after>
      <div v-if="showTagFilter" class="sidebar-tags-wrapper">
        <SidebarTagFilter :posts="currentCategoryPosts" @filter="handleTagFilter" />
      </div>
    </template>

    <template #doc-before>
      <!-- 如果是文章页面，自动添加 PostDetail 头部 -->
      <PostDetail v-if="isPostPage" />
    </template>

    <template #doc-after>
      <!-- 如果是文章页面，自动添加底部导航 -->
      <PostNav v-if="isPostPage" />
    </template>
  </Layout>
</template>

<style>
.sidebar-tags-wrapper {
  padding: 16px 0 0 0;
  margin: 0;
}
</style>
