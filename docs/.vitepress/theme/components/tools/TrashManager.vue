<script setup>
import { onMounted, ref } from 'vue'
import ConfirmDialog from './ConfirmDialog.vue'

const trashedArticles = ref([])
const message = ref('')
const messageType = ref('success')
const selectedArticle = ref(null) // 当前选中的文章

// 确认对话框状态
const showConfirmDialog = ref(false)
const confirmTitle = ref('')
const confirmMessage = ref('')
const confirmType = ref('warning')
const pendingAction = ref(null)

// 显示确认对话框
function showConfirm(title, msg, action, type = 'warning') {
  confirmTitle.value = title
  confirmMessage.value = msg
  pendingAction.value = action
  confirmType.value = type
  showConfirmDialog.value = true
}

// 执行确认的操作
function handleConfirmAction() {
  if (pendingAction.value) {
    pendingAction.value()
    pendingAction.value = null
  }
}

// 加载垃圾箱文章
async function loadTrash() {
  try {
    const response = await fetch('http://localhost:3456/api/trash/list')
    const data = await response.json()
    trashedArticles.value = data.files || []
    // 移除加载成功提示：正常加载不需要提示
  }
  catch (error) {
    showMessage(`❌ 加载失败: ${error.message}`, 'error')
  }
}

// 选中文章
function selectArticle(article) {
  selectedArticle.value = article
  console.warn('[TrashManager] 选中文章:', article.name)
}

// 恢复选中的文章
async function restoreSelected() {
  if (!selectedArticle.value)
    return

  const article = selectedArticle.value
  const isFromDrafts = article.source === 'drafts'

  try {
    const endpoint = isFromDrafts ? '/api/trash/restore-draft' : '/api/trash/restore'
    const response = await fetch(`http://localhost:3456${endpoint}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ file: article.path }),
    })

    const data = await response.json()
    if (data.success) {
      showMessage(`✅ ${isFromDrafts ? '草稿' : '文章'}已恢复`, 'success')
      selectedArticle.value = null
      loadTrash()
    }
    else {
      showMessage(`❌ 恢复失败: ${data.error}`, 'error')
    }
  }
  catch (error) {
    showMessage(`❌ 恢复失败: ${error.message}`, 'error')
  }
}

// 永久删除选中的文章
function deleteSelected() {
  if (!selectedArticle.value)
    return

  showConfirm(
    '永久删除',
    `确定要永久删除"${selectedArticle.value.name}"吗？\n此操作无法撤销！`,
    async () => {
      try {
        const response = await fetch('http://localhost:3456/api/trash/delete-permanent', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ file: selectedArticle.value.path }),
        })

        const data = await response.json()
        if (data.success) {
          showMessage('✅ 文章已永久删除', 'success')
          selectedArticle.value = null
          loadTrash()
        }
        else {
          showMessage(`❌ 删除失败: ${data.error}`, 'error')
        }
      }
      catch (error) {
        showMessage(`❌ 删除失败: ${error.message}`, 'error')
      }
    },
    'danger'
  )
}

// 清空垃圾箱
function emptyTrash() {
  showConfirm(
    '清空垃圾箱',
    '确定要清空垃圾箱吗？\n此操作将永久删除所有文件，无法撤销！',
    async () => {
      try {
        const response = await fetch('http://localhost:3456/api/trash/empty', {
          method: 'POST',
        })

        const data = await response.json()
        if (data.success) {
          showMessage('✅ 垃圾箱已清空', 'success')
          loadTrash()
        }
        else {
          showMessage(`❌ 清空失败: ${data.error}`, 'error')
        }
      }
      catch (error) {
        showMessage(`❌ 清空失败: ${error.message}`, 'error')
      }
    },
    'danger'
  )
}

function formatDate(dateString) {
  const date = new Date(dateString)
  return date.toLocaleDateString('zh-CN')
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
  loadTrash()
})
</script>

<template>
  <div class="trash-manager">
    <div class="manager-header">
      <h2>🗑️ 垃圾箱</h2>
      <div class="header-actions">
        <button
          class="btn-restore-top"
          :disabled="!selectedArticle"
          @click="restoreSelected"
        >
          ↩️ 恢复{{ selectedArticle ? (selectedArticle.source === 'drafts' ? '草稿' : '文章') : '' }}
        </button>
        <button
          class="btn-delete-top"
          :disabled="!selectedArticle"
          @click="deleteSelected"
        >
          ❌ 永久删除
        </button>
        <button class="btn-secondary" @click="loadTrash">
          🔄 刷新
        </button>
        <button
          class="btn-danger"
          :disabled="trashedArticles.length === 0"
          @click="emptyTrash"
        >
          🗑️ 清空垃圾箱
        </button>
      </div>
    </div>

    <div v-if="selectedArticle" class="selected-info">
      <span class="selected-icon">✓</span>
      已选中：<strong>{{ selectedArticle.name }}</strong>
      <span class="badge" :class="selectedArticle.source === 'drafts' ? 'badge-draft' : 'badge-post'">
        {{ selectedArticle.source === 'drafts' ? '草稿' : '文章' }}
      </span>
      <button class="btn-clear" @click="selectedArticle = null">
        ✕ 取消选择
      </button>
    </div>

    <div v-if="trashedArticles.length === 0" class="empty-state">
      <div class="empty-icon">
        🎉
      </div>
      <p class="empty-title">
        垃圾箱是空的
      </p>
      <p class="empty-desc">
        已删除的文章会显示在这里
      </p>
    </div>

    <div v-else class="trash-list">
      <div
        v-for="article in trashedArticles"
        :key="article.path"
        class="trash-item"
        :class="{ selected: selectedArticle?.path === article.path }"
        @click="selectArticle(article)"
      >
        <div class="trash-info">
          <span class="trash-icon">{{ article.source === 'drafts' ? '📝' : '📄' }}</span>
          <div class="trash-details">
            <div class="trash-name">
              {{ article.name }}
              <span v-if="article.source === 'drafts'" class="badge badge-draft">草稿</span>
              <span v-else class="badge badge-post">文章</span>
            </div>
            <div class="trash-meta">
              <span>删除时间：{{ formatDate(article.modifiedAt) }}</span>
              <span>原路径：{{ article.relativePath }}</span>
            </div>
          </div>
        </div>
        <div class="trash-select-indicator">
          <span v-if="selectedArticle?.path === article.path" class="check-icon">✓</span>
          <span v-else class="check-placeholder">○</span>
        </div>
      </div>
    </div>

    <div v-if="trashedArticles.length > 0" class="stats">
      共 {{ trashedArticles.length }} 个项目在垃圾箱
    </div>

    <!-- 确认对话框 -->
    <ConfirmDialog
      v-model="showConfirmDialog"
      :title="confirmTitle"
      :message="confirmMessage"
      :type="confirmType"
      @confirm="handleConfirmAction"
    />

    <div v-if="message" class="message" :class="messageType">
      {{ message }}
    </div>
  </div>
</template>

<style scoped>
.trash-manager {
  padding: 24px;
  width: 100%;
  margin: 0;
  box-sizing: border-box;
}

.manager-header {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  gap: 32px;
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
  flex-wrap: wrap;
  margin-top: 4px; /* Move buttons down slightly */
}

.btn-restore-top,
.btn-delete-top,
.btn-secondary,
.btn-danger {
  padding: 10px 20px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.2s;
  white-space: nowrap;
}

.btn-restore-top {
  background: #10b981;
  color: white;
}

.btn-restore-top:hover:not(:disabled) {
  background: #059669;
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(16, 185, 129, 0.3);
}

.btn-restore-top:disabled {
  background: #d1d5db;
  color: #9ca3af;
  cursor: not-allowed;
}

.btn-delete-top {
  background: #ef4444;
  color: white;
}

.btn-delete-top:hover:not(:disabled) {
  background: #dc2626;
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(239, 68, 68, 0.3);
}

.btn-delete-top:disabled {
  background: #d1d5db;
  color: #9ca3af;
  cursor: not-allowed;
}

.btn-secondary {
  background: #6b7280;
  color: white;
}

.btn-secondary:hover {
  background: #4b5563;
}

.btn-danger {
  background: #ef4444;
  color: white;
}

.btn-danger:hover {
  background: #dc2626;
}

.btn-danger:disabled {
  background: #d1d5db;
  cursor: not-allowed;
}

/* 选中状态显示 */
.selected-info {
  padding: 12px 16px;
  background: var(--vp-c-brand-soft);
  border: 2px solid var(--vp-c-brand);
  border-radius: 8px;
  margin-bottom: 16px;
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  color: var(--vp-c-text-1);
}

.selected-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  background: var(--vp-c-brand);
  color: white;
  border-radius: 50%;
  font-size: 12px;
  font-weight: bold;
}

.btn-clear {
  margin-left: auto;
  padding: 4px 12px;
  background: transparent;
  border: 1px solid var(--vp-c-divider);
  border-radius: 4px;
  cursor: pointer;
  font-size: 12px;
  color: var(--vp-c-text-2);
  transition: all 0.2s;
}

.btn-clear:hover {
  background: var(--vp-c-bg-alt);
  border-color: var(--vp-c-brand);
  color: var(--vp-c-brand);
}

.empty-state {
  text-align: center;
  padding: 80px 24px;
}

.empty-icon {
  font-size: 64px;
  margin-bottom: 16px;
}

.empty-title {
  font-size: 20px;
  font-weight: 600;
  color: var(--vp-c-text-1);
  margin: 0 0 8px 0;
}

.empty-desc {
  font-size: 14px;
  color: var(--vp-c-text-3);
  margin: 0;
}

.trash-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.trash-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  background: var(--vp-c-bg-soft);
  border: 2px solid var(--vp-c-divider);
  border-radius: 8px;
  transition: all 0.2s;
  position: relative;
  gap: 16px;
  cursor: pointer;
  user-select: none;
}

.trash-item:hover {
  background: var(--vp-c-bg-alt);
  border-color: var(--vp-c-brand);
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.trash-item.selected {
  background: var(--vp-c-brand-soft);
  border-color: var(--vp-c-brand);
  border-width: 2px;
}

.trash-item.selected:hover {
  background: var(--vp-c-brand-soft);
}

.trash-info {
  display: flex;
  align-items: center;
  gap: 12px;
  flex: 1;
  min-width: 0;
  max-width: calc(100% - 220px);
  pointer-events: none !important;
  user-select: text;
}

.trash-info * {
  pointer-events: auto !important;
}

.trash-icon {
  font-size: 24px;
  flex-shrink: 0;
}

.trash-details {
  flex: 1;
  min-width: 0;
  overflow: hidden;
}

.trash-name {
  font-weight: 600;
  font-size: 16px;
  color: var(--vp-c-text-1);
  margin-bottom: 4px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.badge {
  display: inline-block;
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
}

.badge-draft {
  background: #fef3c7;
  color: #f59e0b;
  border: 1px solid #fbbf24;
}

.badge-post {
  background: #dbeafe;
  color: #3b82f6;
  border: 1px solid #60a5fa;
}

.trash-meta {
  display: flex;
  gap: 16px;
  font-size: 12px;
  color: var(--vp-c-text-3);
}

/* 选中指示器 */
.trash-select-indicator {
  flex-shrink: 0;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  pointer-events: none;
}

.check-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  background: var(--vp-c-brand);
  color: white;
  border-radius: 50%;
  font-size: 14px;
  font-weight: bold;
}

.check-placeholder {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  border: 2px solid var(--vp-c-divider);
  color: var(--vp-c-text-3);
  border-radius: 50%;
  font-size: 14px;
  transition: all 0.2s;
}

.trash-item:hover .check-placeholder {
  border-color: var(--vp-c-brand);
  color: var(--vp-c-brand);
}

.stats {
  margin-top: 16px;
  text-align: center;
  font-size: 13px;
  color: var(--vp-c-text-3);
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
</style>
