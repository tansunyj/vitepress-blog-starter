<script setup>
import { defineAsyncComponent, ref } from 'vue'
import GlobalToast from './GlobalToast.vue'

const currentView = ref('home')
const expandedMenus = ref([]) // 默认不展开任何菜单

const views = {
  home: defineAsyncComponent(() => import('./AdminHome.vue')),
  drafts: defineAsyncComponent(() => import('./MarkdownEditor.vue')),
  articles: defineAsyncComponent(() => import('./ArticleManager.vue')),
  trash: defineAsyncComponent(() => import('./TrashManager.vue')),
  fetch: defineAsyncComponent(() => import('./FetchArticleTool.vue')),
  menu: defineAsyncComponent(() => import('./MenuManager.vue')),
  site: defineAsyncComponent(() => import('./SiteConfigExtended.vue')),
}

const menuItems = [
  { id: 'home', icon: '🏠', label: '首页', desc: '管理后台概览' },
  {
    id: 'article',
    icon: '📄',
    label: '文章管理',
    desc: '管理所有文章',
    children: [
      { id: 'drafts', icon: '📝', label: '草稿箱', desc: 'Markdown编辑器' },
      { id: 'articles', icon: '📰', label: '已上线', desc: '管理已发布文章' },
      { id: 'trash', icon: '🗑️', label: '垃圾箱', desc: '已删除的文章' },
      { id: 'fetch', icon: '📥', label: '文章爬取', desc: '爬取网页文章' },
    ],
  },
  { id: 'menu', icon: '🗂️', label: '菜单管理', desc: '导航菜单配置' },
  { id: 'site', icon: '🎨', label: '网站管理', desc: '网站配置与集成' },
]

function switchView(viewId) {
  currentView.value = viewId
}

function toggleMenu(menuId) {
  const index = expandedMenus.value.indexOf(menuId)
  if (index > -1) {
    expandedMenus.value.splice(index, 1)
  }
  else {
    expandedMenus.value.push(menuId)
  }
}

function isExpanded(menuId) {
  return expandedMenus.value.includes(menuId)
}
</script>

<template>
  <div class="admin-dashboard">
    <!-- 左侧导航 -->
    <aside class="admin-sidebar">
      <div class="sidebar-header">
        <h2>🛠️ 管理后台</h2>
        <p class="subtitle">VitePress CMS</p>
      </div>

      <nav class="sidebar-nav">
        <template v-for="item in menuItems" :key="item.id">
          <!-- 有子菜单的项 -->
          <div v-if="item.children" class="nav-group">
            <div
              class="nav-item nav-parent"
              :class="{ expanded: isExpanded(item.id) }"
              @click="toggleMenu(item.id)"
            >
              <span class="nav-icon">{{ item.icon }}</span>
              <div class="nav-content">
                <div class="nav-label">{{ item.label }}</div>
                <div class="nav-desc">{{ item.desc }}</div>
              </div>
              <span class="nav-arrow">{{ isExpanded(item.id) ? '▼' : '▶' }}</span>
            </div>

            <!-- 子菜单 -->
            <div v-show="isExpanded(item.id)" class="nav-children">
              <div
                v-for="child in item.children"
                :key="child.id"
                class="nav-item nav-child"
                :class="{ active: currentView === child.id }"
                @click="switchView(child.id)"
              >
                <span class="nav-icon">{{ child.icon }}</span>
                <div class="nav-content">
                  <div class="nav-label">{{ child.label }}</div>
                  <div class="nav-desc">{{ child.desc }}</div>
                </div>
              </div>
            </div>
          </div>

          <!-- 没有子菜单的项 -->
          <div
            v-else
            class="nav-item"
            :class="{ active: currentView === item.id }"
            @click="switchView(item.id)"
          >
            <span class="nav-icon">{{ item.icon }}</span>
            <div class="nav-content">
              <div class="nav-label">{{ item.label }}</div>
              <div class="nav-desc">{{ item.desc }}</div>
            </div>
          </div>
        </template>
      </nav>

      <div class="sidebar-footer">
        <div class="version">v1.0.0</div>
      </div>
    </aside>

    <!-- 右侧内容区 -->
    <main class="admin-content">
      <component :is="views[currentView]" v-if="views[currentView]" @switch-view="switchView" />
    </main>

    <!-- 全局Toast提示 -->
    <GlobalToast />
  </div>
</template>

<style scoped>
.admin-dashboard {
  display: flex;
  min-height: calc(100vh - 64px);
  background: var(--vp-c-bg);
  position: fixed;
  top: 64px;
  left: 0;
  right: 0;
  bottom: 0;
  width: 100vw;
  margin: 0;
  padding: 0;
  max-width: none !important;
}

/* 左侧导航 */
.admin-sidebar {
  width: 240px;
  flex-shrink: 0;
  background: var(--vp-c-bg-soft);
  border-right: 1px solid var(--vp-c-divider);
  display: flex;
  flex-direction: column;
  overflow-y: auto;
}

.sidebar-header {
  padding: 24px 20px;
  border-bottom: 1px solid var(--vp-c-divider);
}

.sidebar-header h2 {
  margin: 0 0 4px 0;
  font-size: 20px;
  font-weight: 700;
  color: var(--vp-c-text-1);
}

.subtitle {
  margin: 0;
  font-size: 12px;
  color: var(--vp-c-text-3);
  font-weight: 500;
  letter-spacing: 0.5px;
}

.sidebar-nav {
  flex: 1;
  padding: 12px 8px;
  overflow-y: auto;
}

.nav-group {
  margin-bottom: 4px;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 12px;
  margin-bottom: 4px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
  border: 2px solid transparent;
}

.nav-item:hover {
  background: var(--vp-c-bg-alt);
}

.nav-item.active {
  background: var(--vp-c-brand-soft);
  border-color: var(--vp-c-brand);
}

/* 父菜单项 */
.nav-parent {
  background: var(--vp-c-bg);
  font-weight: 600;
}

.nav-parent:hover {
  background: var(--vp-c-bg-alt);
}

.nav-parent.expanded {
  background: var(--vp-c-bg-alt);
}

/* 展开/折叠箭头 */
.nav-arrow {
  font-size: 12px;
  color: var(--vp-c-text-3);
  transition: transform 0.2s;
  margin-left: auto;
}

/* 子菜单容器 */
.nav-children {
  margin-left: 12px;
  padding-left: 12px;
  border-left: 2px solid var(--vp-c-divider);
}

/* 子菜单项 */
.nav-child {
  margin-bottom: 2px;
  padding: 10px 12px;
}

.nav-child .nav-icon {
  font-size: 20px;
}

.nav-child .nav-label {
  font-size: 13px;
  font-weight: 500;
}

.nav-child .nav-desc {
  font-size: 11px;
}

.nav-icon {
  font-size: 24px;
  flex-shrink: 0;
}

.nav-content {
  flex: 1;
  min-width: 0;
}

.nav-label {
  font-weight: 600;
  font-size: 14px;
  color: var(--vp-c-text-1);
  margin-bottom: 2px;
}

.nav-item.active .nav-label {
  color: var(--vp-c-brand);
}

.nav-desc {
  font-size: 11px;
  color: var(--vp-c-text-3);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.sidebar-footer {
  padding: 16px 20px;
  border-top: 1px solid var(--vp-c-divider);
  text-align: center;
}

.version {
  font-size: 12px;
  color: var(--vp-c-text-3);
  font-weight: 500;
}

/* 右侧内容区 */
.admin-content {
  flex: 1;
  min-width: 0;
  overflow-y: auto;
  overflow-x: hidden;
  background: var(--vp-c-bg);
}

.content-panel {
  min-height: 100%;
  width: 100%;
}

/* 响应式 */
@media (max-width: 768px) {
  .admin-dashboard {
    flex-direction: column;
  }

  .admin-sidebar {
    width: 100%;
    border-right: none;
    border-bottom: 1px solid var(--vp-c-divider);
  }

  .sidebar-nav {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
    gap: 8px;
  }

  .nav-item {
    flex-direction: column;
    text-align: center;
    padding: 16px 8px;
  }

  .nav-icon {
    font-size: 32px;
  }
}
</style>
