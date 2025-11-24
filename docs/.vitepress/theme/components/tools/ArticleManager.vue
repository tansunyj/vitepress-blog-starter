<script setup>
import { MdEditor } from 'md-editor-v3'
import { onMounted, ref } from 'vue'
import ConfirmDialog from './ConfirmDialog.vue'
import FileTree from './FileTree.vue'

import 'md-editor-v3/lib/style.css'

const fileTree = ref([])
const currentFile = ref('')
const message = ref('')
const messageType = ref('success')
const showSidebar = ref(true)
const showViewer = ref(false) // 是否显示查看器
const articleContent = ref('') // 文章内容

// 确认对话框状态
const showConfirmDialog = ref(false)
const confirmTitle = ref('')
const confirmMessage = ref('')
const confirmType = ref('warning')
const pendingAction = ref(null)

// 加载文档树（后端已经构建好导航树结构）
async function loadFileTree() {
  try {
    const response = await fetch('http://localhost:3456/api/markdown/tree')
    const data = await response.json()
    fileTree.value = data.tree || []
  }
  catch (error) {
    console.error('加载文档树失败:', error)
  }
}

// 打开文件（直接加载并显示预览）
async function openFile(filepath) {
  currentFile.value = filepath
  // 直接加载文章内容
  await viewArticle(filepath)
}

// 查看文章（在只读编辑器中打开）
async function viewArticle(filepath) {
  try {
    // 从API读取文章内容
    const apiUrl = `http://localhost:3456/api/markdown/read?file=${encodeURIComponent(filepath)}`

    const response = await fetch(apiUrl)
    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || '读取文件失败')
    }

    const data = await response.json()
    articleContent.value = data.content
    showViewer.value = true // 显示查看器

    console.warn('[ArticleManager] 打开文章查看器:', {
      filepath,
      contentLength: data.content.length,
    })
  }
  catch (error) {
    showMessage(`读取文章失败: ${error.message}`, 'error')
  }
}

// 显示确认对话框
function showConfirm(title, msg, action, type = 'warning') {
  confirmTitle.value = title
  confirmMessage.value = msg
  pendingAction.value = action
  confirmType.value = type
  showConfirmDialog.value = true
}

// 处理确认操作
function handleConfirmAction() {
  if (pendingAction.value) {
    pendingAction.value()
  }
  showConfirmDialog.value = false
  pendingAction.value = null
}

// 下架文章（移动到草稿箱）
function unpublishArticle(filepath) {
  showConfirm(
    '下架文章',
    `确定要下架文章"${filepath}"吗？\n文章将移动到草稿箱。`,
    async () => {
      try {
        const response = await fetch('http://localhost:3456/api/article/unpublish', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ file: filepath }),
        })

        const data = await response.json()
        if (data.success) {
          showMessage('✅ 文章已下架到草稿箱', 'success')
          currentFile.value = '' // 清空选择
          showViewer.value = false // 关闭查看器
          loadFileTree() // 重新加载文档树
        }
        else {
          showMessage(`❌ 下架失败: ${data.error}`, 'error')
        }
      }
      catch (error) {
        showMessage(`❌ 下架失败: ${error.message}`, 'error')
      }
    },
    'warning',
  )
}

function showMessage(msg, type = 'success') {
  if (window.$toast) {
    window.$toast(msg, type)
  }
  else {
    message.value = msg
    messageType.value = type
    setTimeout(() => {
      message.value = ''
    }, 3000)
  }
}

onMounted(() => {
  loadFileTree()
})
</script>

<template>
  <div class="article-manager">
    <div class="manager-header">
      <h2>📰 已上线文章管理</h2>
      <div class="header-actions">
        <button class="btn-icon" title="切换侧边栏" @click="showSidebar = !showSidebar">
          {{ showSidebar ? '◀' : '▶' }}
        </button>
        <button class="btn-primary" @click="loadFileTree">
          🔄 刷新
        </button>
      </div>
    </div>

    <!-- 主体区域：左右布局 -->
    <div class="manager-main">
      <!-- 左侧：文档树 -->
      <div v-if="showSidebar" class="sidebar">
        <div class="sidebar-header">
          <h3>📚 文档目录</h3>
        </div>
        <div class="sidebar-content">
          <FileTree
            :nodes="fileTree"
            :current-file="currentFile"
            mode="published"
            @select="openFile"
            @unpublish="unpublishArticle"
          />
        </div>
      </div>

      <!-- 右侧：内容区域 -->
      <div class="content-area">
        <!-- 查看器模式 -->
        <div v-if="showViewer" class="viewer-mode">
          <div class="viewer-toolbar">
            <span class="current-file-name">📄 {{ currentFile }}</span>
          </div>
          <div class="viewer-preview">
            <MdEditor
              v-model="articleContent"
              language="zh-CN"
              preview-only
              :toolbars="[]"
              editor-id="article-viewer"
              preview-theme="github"
              code-theme="github"
            />
          </div>
        </div>

        <!-- 空状态 -->
        <div v-else class="empty-state">
          <div class="empty-icon">
            📂
          </div>
          <p class="empty-title">
            请从左侧文档树选择文章
          </p>
          <p class="empty-desc">
            点击文档树中的文件即可查看
          </p>
        </div>
      </div>
    </div>

    <!-- 消息提示 -->
    <div v-if="message" class="message" :class="messageType">
      {{ message }}
    </div>

    <!-- 确认对话框 -->
    <ConfirmDialog
      v-model="showConfirmDialog"
      :title="confirmTitle"
      :message="confirmMessage"
      :type="confirmType"
      @confirm="handleConfirmAction"
    />
  </div>
</template>

<style scoped>
.article-manager {
  padding: 24px;
  width: 100%;
  margin: 0;
  box-sizing: border-box;
}

.manager-header {
  display: flex;
  justify-content: flex-start; /* Move buttons to left */
  align-items: center;
  gap: 32px; /* Add spacing between title and buttons */
  margin-bottom: 24px;
}

.manager-header h2 {
  margin: 0;
  font-size: 24px;
  color: var(--vp-c-text-1);
}

.header-actions {
  display: flex;
  gap: 12px;
  align-items: center;
}

.btn-icon {
  padding: 8px 12px;
  background: #6b7280;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 16px;
  transition: all 0.2s;
}

.btn-icon:hover {
  background: #4b5563;
}

.btn-primary {
  padding: 10px 20px;
  background: var(--vp-c-brand);
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.2s;
}

.btn-primary:hover {
  background: var(--vp-c-brand-dark);
}

/* 主体区域 - 左右布局 */
.manager-main {
  display: flex;
  gap: 20px;
  height: calc(100vh - 200px);
  min-height: 500px;
}

/* 左侧文档树 */
.sidebar {
  width: 280px;
  flex-shrink: 0;
  background: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.sidebar-header {
  padding: 16px;
  background: var(--vp-c-bg-alt);
  border-bottom: 1px solid var(--vp-c-divider);
}

.sidebar-header h3 {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  color: var(--vp-c-text-1);
}

.sidebar-content {
  flex: 1;
  overflow-y: auto;
  padding: 12px;
}

/* 右侧内容区 */
.content-area {
  flex: 1;
  min-width: 0;
  background: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

/* 空状态 */
.empty-state {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  padding: 24px;
}

.empty-icon {
  font-size: 64px;
  margin-bottom: 16px;
}

.empty-title {
  font-size: 18px;
  font-weight: 600;
  color: var(--vp-c-text-1);
  margin: 0 0 8px 0;
}

.empty-desc {
  font-size: 14px;
  color: var(--vp-c-text-3);
  margin: 0;
}

.message {
  position: fixed;
  top: 80px;
  right: 24px;
  padding: 12px 24px;
  border-radius: 8px;
  font-size: 14px;
  z-index: 2000;
  animation: slideIn 0.3s ease-out;
}

.message.success {
  background: #10b981;
  color: white;
}

.message.error {
  background: #ef4444;
  color: white;
}

@keyframes slideIn {
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

/* 查看器模式 - 在右侧内容区域显示 */
.viewer-mode {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.viewer-toolbar {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 12px 16px;
  background: var(--vp-c-bg-alt);
  border-bottom: 2px solid var(--vp-c-divider);
  border-radius: 8px 8px 0 0;
}

.current-file-name {
  font-size: 14px;
  color: var(--vp-c-text-2);
  font-family: monospace;
  flex: 1;
}

.viewer-preview {
  flex: 1;
  overflow-y: auto;
  background: var(--vp-c-bg);
  min-height: 0;
}

/* 调整md-editor在查看器中的样式 */
.viewer-preview :deep(.md-editor) {
  height: auto !important;
  min-height: 100%;
  border: none;
  border-radius: 0;
}

.viewer-preview :deep(.md-editor-preview) {
  padding: 24px;
}

/* 确保内容可以完整显示 */
.viewer-preview :deep(.md-editor-preview-wrapper) {
  overflow: visible !important;
  height: auto !important;
  max-height: none !important;
  width: 100% !important;
}

/* 强制隐藏编辑区域（左侧） */
.viewer-preview :deep(.md-editor-input-wrapper) {
  display: none !important;
  width: 0 !important;
}

/* 确保预览区域占满全宽 */
.viewer-preview :deep(.md-editor-content) {
  width: 100% !important;
}

/* 隐藏分隔线 */
.viewer-preview :deep(.md-editor-resize-bar) {
  display: none !important;
}
</style>
