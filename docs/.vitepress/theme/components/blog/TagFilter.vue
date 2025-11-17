<script setup lang="ts">
import { computed, ref } from 'vue'

interface Post {
  frontmatter: {
    tags?: string[]
    [key: string]: any
  }
  [key: string]: any
}

const props = defineProps<{
  posts: Post[]
}>()

const emit = defineEmits<{
  filter: [tags: string[]]
}>()

// 当前选中的标签
const selectedTags = ref<string[]>([])

// 从所有文章中收集标签
const allTags = computed(() => {
  const tagsSet = new Set<string>()
  props.posts.forEach((post) => {
    if (post.frontmatter?.tags && Array.isArray(post.frontmatter.tags)) {
      post.frontmatter.tags.forEach((tag: string) => {
        tagsSet.add(tag)
      })
    }
  })
  return Array.from(tagsSet).sort()
})

// 每个标签的文章数量
const tagCounts = computed(() => {
  const counts: Record<string, number> = {}
  props.posts.forEach((post) => {
    if (post.frontmatter?.tags && Array.isArray(post.frontmatter.tags)) {
      post.frontmatter.tags.forEach((tag: string) => {
        counts[tag] = (counts[tag] || 0) + 1
      })
    }
  })
  return counts
})

// 切换标签选中状态
function toggleTag(tag: string) {
  const index = selectedTags.value.indexOf(tag)
  if (index > -1) {
    // 已选中，取消选中
    selectedTags.value.splice(index, 1)
  }
  else {
    // 未选中，添加选中
    selectedTags.value.push(tag)
  }
  emit('filter', selectedTags.value)
}

// 清除所有选中的标签
function clearTags() {
  selectedTags.value = []
  emit('filter', [])
}

// 判断标签是否被选中
function isTagSelected(tag: string): boolean {
  return selectedTags.value.includes(tag)
}
</script>

<template>
  <div v-if="allTags.length > 0" class="tag-filter">
    <!-- 顶部信息栏 -->
    <div class="filter-header">
      <div class="filter-title">
        <span class="icon">🏷️</span>
        <span class="text">标签筛选</span>
        <span v-if="selectedTags.length > 0" class="count">
          ({{ selectedTags.length }} 个已选)
        </span>
      </div>
      <button
        v-if="selectedTags.length > 0"
        class="clear-btn"
        @click="clearTags"
      >
        清除筛选
      </button>
    </div>

    <!-- 标签列表 -->
    <div class="tags-list">
      <button
        v-for="tag in allTags"
        :key="tag"
        class="tag-item"
        :class="{ active: isTagSelected(tag) }"
        @click="toggleTag(tag)"
      >
        <span class="tag-name">{{ tag }}</span>
        <span class="tag-count">{{ tagCounts[tag] }}</span>
      </button>
    </div>
  </div>
</template>

<style scoped>
.tag-filter {
  margin-bottom: 2rem;
  padding: 1.5rem;
  background-color: var(--vp-c-bg-soft);
  border-radius: 12px;
  border: 1px solid var(--vp-c-divider);
}

/* 顶部信息栏 */
.filter-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid var(--vp-c-divider);
}

.filter-title {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1.125rem;
  font-weight: 600;
  color: var(--vp-c-text-1);
}

.filter-title .icon {
  font-size: 1.25rem;
}

.filter-title .count {
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--vp-c-brand);
}

.clear-btn {
  padding: 0.5rem 1rem;
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--vp-c-brand);
  background-color: transparent;
  border: 1px solid var(--vp-c-brand);
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.clear-btn:hover {
  color: #fff;
  background-color: var(--vp-c-brand);
}

/* 标签列表 */
.tags-list {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
}

.tag-item {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--vp-c-text-2);
  background-color: var(--vp-c-bg);
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.tag-item:hover {
  color: var(--vp-c-brand);
  border-color: var(--vp-c-brand);
  transform: translateY(-2px);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.tag-item.active {
  color: #fff;
  background-color: var(--vp-c-brand);
  border-color: var(--vp-c-brand);
  box-shadow: 0 2px 8px rgba(59, 130, 246, 0.3);
}

.tag-item.active:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.4);
}

.tag-name {
  line-height: 1;
}

.tag-count {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 1.5rem;
  height: 1.5rem;
  padding: 0 0.375rem;
  font-size: 0.75rem;
  font-weight: 600;
  background-color: rgba(0, 0, 0, 0.1);
  border-radius: 10px;
}

.tag-item.active .tag-count {
  background-color: rgba(255, 255, 255, 0.2);
}

/* 响应式 */
@media (max-width: 768px) {
  .tag-filter {
    padding: 1rem;
  }

  .filter-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.75rem;
  }

  .clear-btn {
    width: 100%;
  }

  .tags-list {
    gap: 0.5rem;
  }

  .tag-item {
    padding: 0.375rem 0.75rem;
    font-size: 0.8125rem;
  }
}
</style>
