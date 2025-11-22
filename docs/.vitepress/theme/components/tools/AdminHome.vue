<script setup>
import { ref } from 'vue'

const emit = defineEmits(['switchView'])

const features = [
  {
    id: 'drafts',
    icon: '📝',
    title: '草稿箱',
    desc: 'Markdown 编辑器，创建和编辑草稿',
    color: '#3b82f6',
    bgColor: '#eff6ff',
  },
  {
    id: 'articles',
    icon: '📰',
    title: '已上线',
    desc: '管理已发布的文章',
    color: '#10b981',
    bgColor: '#ecfdf5',
  },
  {
    id: 'trash',
    icon: '🗑️',
    title: '垃圾箱',
    desc: '查看和恢复已删除的文章',
    color: '#ef4444',
    bgColor: '#fef2f2',
  },
  {
    id: 'fetch',
    icon: '📥',
    title: '文章抓取',
    desc: '从网页爬取文章内容',
    color: '#f97316',
    bgColor: '#fff7ed',
  },
  {
    id: 'menu',
    icon: '🗂️',
    title: '菜单管理',
    desc: '配置导航菜单和侧边栏',
    color: '#8b5cf6',
    bgColor: '#f5f3ff',
  },
  {
    id: 'site',
    icon: '🎨',
    title: '网站管理',
    desc: '网站配置和第三方集成',
    color: '#ec4899',
    bgColor: '#fdf2f8',
  },
]

const stats = ref([
  { label: '总文章数', value: '0', icon: '📄', loading: true },
  { label: '草稿数', value: '0', icon: '📝', loading: true },
  { label: '已发布', value: '0', icon: '✅', loading: true },
  { label: '垃圾箱', value: '0', icon: '🗑️', loading: true },
])

// 递归统计文件夹下的 .md 文件数量（排除 index.md 和文件夹）
function countMarkdownFiles(nodes) {
  if (!nodes || !Array.isArray(nodes)) {
    console.warn('⚠️ [countMarkdownFiles] nodes 不是数组:', nodes)
    return 0
  }

  let count = 0
  for (const node of nodes) {
    if (!node)
      continue

    if (node.type === 'file') {
      // 只统计 .md 文件，排除 index.md
      if (node.name && node.name.endsWith('.md') && node.name.toLowerCase() !== 'index.md') {
        count++
        console.warn('📝 统计文件:', node.name)
      }
    }
    else if (node.type === 'folder' && node.children) {
      // 递归统计子文件夹
      count += countMarkdownFiles(node.children)
    }
  }
  return count
}

// 加载统计数据
async function loadStats() {
  try {
    // 并行加载三个数据源
    const [draftsRes, publishedRes, trashRes] = await Promise.all([
      fetch('http://localhost:3456/api/drafts/tree'),
      fetch('http://localhost:3456/api/posts/tree'),
      fetch('http://localhost:3456/api/trash/tree'),
    ])

    const [draftsData, publishedData, trashData] = await Promise.all([
      draftsRes.json(),
      publishedRes.json(),
      trashRes.json(),
    ])

    console.warn('📊 [AdminHome] 加载的数据:', {
      draftsData,
      publishedData,
      trashData,
    })

    // 统计各个类型的文章数量
    const draftsCount = countMarkdownFiles(draftsData.tree || [])
    const publishedCount = countMarkdownFiles(publishedData.tree || [])
    const trashCount = countMarkdownFiles(trashData.tree || [])
    const totalCount = draftsCount + publishedCount

    console.warn('📊 [AdminHome] 统计结果:', {
      draftsCount,
      publishedCount,
      trashCount,
      totalCount,
    })

    stats.value = [
      { label: '总文章数', value: String(totalCount), icon: '📄', loading: false },
      { label: '草稿数', value: String(draftsCount), icon: '📝', loading: false },
      { label: '已发布', value: String(publishedCount), icon: '✅', loading: false },
      { label: '垃圾箱', value: String(trashCount), icon: '🗑️', loading: false },
    ]
  }
  catch (error) {
    console.error('❌ [AdminHome] 加载统计失败:', error)
    // 出错时显示 0
    stats.value = [
      { label: '总文章数', value: '0', icon: '📄', loading: false },
      { label: '草稿数', value: '0', icon: '📝', loading: false },
      { label: '已发布', value: '0', icon: '✅', loading: false },
      { label: '垃圾箱', value: '0', icon: '🗑️', loading: false },
    ]
  }
}

// 组件挂载时加载数据
loadStats()

function navigateTo(id) {
  emit('switchView', id)
}
</script>

<template>
  <div class="admin-home">
    <!-- 欢迎区域 -->
    <div class="welcome-section">
      <div class="welcome-content">
        <h1 class="welcome-title">
          👋 欢迎使用管理后台
        </h1>
        <p class="welcome-desc">
          VitePress 博客内容管理系统 - 让内容创作更简单
        </p>
      </div>
      <div class="welcome-time">
        {{ new Date().toLocaleString('zh-CN', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          weekday: 'long',
          hour: '2-digit',
          minute: '2-digit',
        }) }}
      </div>
    </div>

    <!-- 统计卡片 -->
    <div class="stats-section">
      <div
        v-for="stat in stats"
        :key="stat.label"
        class="stat-card"
        :class="{ loading: stat.loading }"
      >
        <div class="stat-icon">
          {{ stat.icon }}
        </div>
        <div class="stat-info">
          <div class="stat-value">
            {{ stat.loading ? '...' : stat.value }}
          </div>
          <div class="stat-label">
            {{ stat.label }}
          </div>
        </div>
      </div>
    </div>

    <!-- 功能卡片 -->
    <div class="features-section">
      <h2 class="section-title">
        快速访问
      </h2>
      <div class="features-grid">
        <div
          v-for="feature in features"
          :key="feature.id"
          class="feature-card"
          :style="{
            '--card-color': feature.color,
            '--card-bg': feature.bgColor,
          }"
          @click="navigateTo(feature.id)"
        >
          <div class="feature-icon">
            {{ feature.icon }}
          </div>
          <h3 class="feature-title">
            {{ feature.title }}
          </h3>
          <p class="feature-desc">
            {{ feature.desc }}
          </p>
          <div class="feature-arrow">
            →
          </div>
        </div>
      </div>
    </div>

    <!-- 快捷操作 -->
    <div class="actions-section">
      <h2 class="section-title">
        快捷操作
      </h2>
      <div class="actions-grid">
        <button class="action-btn primary" @click="navigateTo('drafts')">
          <span class="action-icon">✍️</span>
          <span class="action-text">新建草稿</span>
        </button>
        <button class="action-btn secondary" @click="navigateTo('fetch')">
          <span class="action-icon">📥</span>
          <span class="action-text">抓取文章</span>
        </button>
        <button class="action-btn secondary" @click="navigateTo('menu')">
          <span class="action-icon">🗂️</span>
          <span class="action-text">管理菜单</span>
        </button>
        <button class="action-btn secondary" @click="navigateTo('site')">
          <span class="action-icon">⚙️</span>
          <span class="action-text">网站设置</span>
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.admin-home {
  padding: 32px;
  max-width: 1400px;
  margin: 0 auto;
  min-height: 100%;
  background: var(--vp-c-bg);
}

/* 欢迎区域 */
.welcome-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 32px;
  background: linear-gradient(135deg, var(--vp-c-brand-soft) 0%, var(--vp-c-brand-softer) 100%);
  border-radius: 16px;
  margin-bottom: 32px;
  border: 1px solid var(--vp-c-brand-light);
}

.welcome-content {
  flex: 1;
}

.welcome-title {
  font-size: 32px;
  font-weight: 700;
  color: var(--vp-c-brand);
  margin: 0 0 8px 0;
}

.welcome-desc {
  font-size: 16px;
  color: var(--vp-c-text-2);
  margin: 0;
}

.welcome-time {
  font-size: 14px;
  color: var(--vp-c-text-3);
  font-weight: 500;
}

/* 统计卡片 */
.stats-section {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
  margin-bottom: 32px;
}

.stat-card {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 20px;
  background: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-divider);
  border-radius: 12px;
  transition: all 0.3s;
}

.stat-card:hover {
  border-color: var(--vp-c-brand);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.stat-card.loading {
  opacity: 0.6;
}

.stat-icon {
  font-size: 32px;
}

.stat-info {
  flex: 1;
}

.stat-value {
  font-size: 28px;
  font-weight: 700;
  color: var(--vp-c-text-1);
  line-height: 1;
  margin-bottom: 4px;
}

.stat-label {
  font-size: 13px;
  color: var(--vp-c-text-3);
  font-weight: 500;
}

/* 功能区域 */
.features-section {
  margin-bottom: 32px;
}

.section-title {
  font-size: 20px;
  font-weight: 600;
  color: var(--vp-c-text-1);
  margin: 0 0 16px 0;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 16px;
}

.feature-card {
  position: relative;
  padding: 24px;
  background: var(--card-bg);
  border: 2px solid transparent;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s;
  overflow: hidden;
}

.feature-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: var(--card-color);
  opacity: 0;
  transition: opacity 0.3s;
}

.feature-card:hover {
  border-color: var(--card-color);
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
}

.feature-card:hover::before {
  opacity: 1;
}

.feature-icon {
  font-size: 48px;
  margin-bottom: 12px;
}

.feature-title {
  font-size: 18px;
  font-weight: 600;
  color: var(--vp-c-text-1);
  margin: 0 0 8px 0;
}

.feature-desc {
  font-size: 14px;
  color: var(--vp-c-text-2);
  margin: 0;
  line-height: 1.5;
}

.feature-arrow {
  position: absolute;
  bottom: 16px;
  right: 16px;
  font-size: 24px;
  color: var(--card-color);
  opacity: 0;
  transition: all 0.3s;
}

.feature-card:hover .feature-arrow {
  opacity: 1;
  transform: translateX(4px);
}

/* 快捷操作 */
.actions-section {
  margin-bottom: 32px;
}

.actions-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 12px;
}

.action-btn {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px 24px;
  border: 2px solid transparent;
  border-radius: 10px;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
  background: var(--vp-c-bg-soft);
  color: var(--vp-c-text-1);
}

.action-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.action-btn.primary {
  background: var(--vp-c-brand);
  color: white;
}

.action-btn.primary:hover {
  background: var(--vp-c-brand-dark);
  box-shadow: 0 4px 16px rgba(59, 130, 246, 0.4);
}

.action-btn.secondary {
  border-color: var(--vp-c-divider);
}

.action-btn.secondary:hover {
  border-color: var(--vp-c-brand);
  background: var(--vp-c-brand-soft);
}

.action-icon {
  font-size: 20px;
}

.action-text {
  flex: 1;
  text-align: left;
}

/* 响应式 */
@media (max-width: 768px) {
  .admin-home {
    padding: 16px;
  }

  .welcome-section {
    flex-direction: column;
    gap: 16px;
    padding: 24px;
    text-align: center;
  }

  .welcome-title {
    font-size: 24px;
  }

  .stats-section {
    grid-template-columns: repeat(2, 1fr);
  }

  .features-grid {
    grid-template-columns: 1fr;
  }

  .actions-grid {
    grid-template-columns: 1fr;
  }
}
</style>
