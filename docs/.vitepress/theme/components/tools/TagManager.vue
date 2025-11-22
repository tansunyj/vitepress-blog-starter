<script setup lang="ts">
import { ref, onMounted } from 'vue'
import ConfirmDialog from './ConfirmDialog.vue'

const tags = ref<string[]>([])
const newTagName = ref('')
const loading = ref(false)
const showAddDialog = ref(false)
const showDeleteDialog = ref(false)
const tagToDelete = ref('')

// 加载所有标签
async function loadTags() {
  try {
    const response = await fetch('http://localhost:3456/api/tags')
    const data = await response.json()
    if (data.success) {
      tags.value = data.tags
    }
  }
  catch (error) {
    console.error('加载标签失败:', error)
    showMessage('加载标签失败', 'error')
  }
}

// 添加新标签
async function addTag() {
  const tagName = newTagName.value.trim()
  if (!tagName) {
    showMessage('请输入标签名称', 'warning')
    return
  }

  if (tags.value.includes(tagName)) {
    showMessage('标签已存在', 'warning')
    return
  }

  loading.value = true
  try {
    const response = await fetch('http://localhost:3456/api/tags', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: tagName }),
    })

    const data = await response.json()
    if (data.success) {
      tags.value.push(tagName)
      newTagName.value = ''
      showAddDialog.value = false
      showMessage('✅ 标签添加成功', 'success')
    }
    else {
      showMessage(`❌ ${data.error}`, 'error')
    }
  }
  catch (error) {
    showMessage(`❌ 添加失败: ${error.message}`, 'error')
  }
  finally {
    loading.value = false
  }
}

// 显示删除确认对话框
function showDeleteConfirm(tagName: string) {
  tagToDelete.value = tagName
  showDeleteDialog.value = true
}

// 确认删除标签
async function confirmDelete() {
  if (!tagToDelete.value)
    return

  loading.value = true
  try {
    const response = await fetch(`http://localhost:3456/api/tags/${encodeURIComponent(tagToDelete.value)}`, {
      method: 'DELETE',
    })

    const data = await response.json()
    if (data.success) {
      tags.value = tags.value.filter(t => t !== tagToDelete.value)
      showMessage('✅ 标签删除成功', 'success')
    }
    else {
      showMessage(`❌ ${data.error}`, 'error')
    }
  }
  catch (error) {
    showMessage(`❌ 删除失败: ${error.message}`, 'error')
  }
  finally {
    loading.value = false
    tagToDelete.value = ''
  }
}

// 显示消息
function showMessage(message: string, type: 'success' | 'error' | 'warning' = 'success') {
  if (window.$toast) {
    window.$toast(message, type, 3000)
  }
}

onMounted(() => {
  loadTags()
})
</script>

<template>
  <div class="tag-manager">
    <div class="header">
      <h2>🏷️ 标签管理</h2>
      <button class="btn-add" @click="showAddDialog = true">
        ➕ 新增标签
      </button>
    </div>

    <div v-if="tags.length === 0" class="empty-state">
      <p>暂无标签，点击上方按钮添加第一个标签</p>
    </div>

    <div v-else class="tags-grid">
      <div v-for="tag in tags" :key="tag" class="tag-card">
        <span class="tag-name">{{ tag }}</span>
        <button class="btn-delete" title="删除" @click="showDeleteConfirm(tag)">
          🗑️
        </button>
      </div>
    </div>

    <!-- 添加标签对话框 -->
    <div v-if="showAddDialog" class="dialog-overlay" @click="showAddDialog = false">
      <div class="dialog" @click.stop>
        <h3>新增标签</h3>
        <input
          v-model="newTagName"
          type="text"
          placeholder="输入标签名称"
          class="input-tag"
          @keyup.enter="addTag"
        >
        <div class="dialog-actions">
          <button class="btn-cancel" @click="showAddDialog = false">
            取消
          </button>
          <button class="btn-confirm" :disabled="loading" @click="addTag">
            {{ loading ? '添加中...' : '确定' }}
          </button>
        </div>
      </div>
    </div>

    <!-- 删除确认对话框 -->
    <ConfirmDialog
      v-model="showDeleteDialog"
      type="danger"
      title="确认删除"
      :message="`确定要删除标签 &quot;${tagToDelete}&quot; 吗？`"
      confirm-text="删除"
      cancel-text="取消"
      @confirm="confirmDelete"
    />
  </div>
</template>

<style scoped>
.tag-manager {
  padding: 24px;
  max-width: 1200px;
  margin: 0 auto;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 32px;
}

.header h2 {
  margin: 0;
  font-size: 24px;
  color: var(--vp-c-text-1);
}

.btn-add {
  padding: 10px 20px;
  background: var(--vp-c-brand);
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 14px;
  transition: opacity 0.2s;
}

.btn-add:hover {
  opacity: 0.9;
}

.empty-state {
  text-align: center;
  padding: 60px 20px;
  color: var(--vp-c-text-2);
}

.tags-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 16px;
}

.tag-card {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  background: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  transition: all 0.2s;
}

.tag-card:hover {
  border-color: var(--vp-c-brand);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.tag-name {
  font-size: 14px;
  color: var(--vp-c-text-1);
  font-weight: 500;
}

.btn-delete {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 18px;
  padding: 4px 8px;
  opacity: 0.6;
  transition: opacity 0.2s;
}

.btn-delete:hover {
  opacity: 1;
}

/* 对话框样式 */
.dialog-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
}

.dialog {
  background: var(--vp-c-bg);
  border-radius: 12px;
  padding: 24px;
  min-width: 400px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
}

.dialog h3 {
  margin: 0 0 16px 0;
  font-size: 18px;
  color: var(--vp-c-text-1);
}

.input-tag {
  width: 100%;
  padding: 10px 12px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 6px;
  font-size: 14px;
  margin-bottom: 20px;
  background: var(--vp-c-bg-soft);
  color: var(--vp-c-text-1);
}

.input-tag:focus {
  outline: none;
  border-color: var(--vp-c-brand);
}

.dialog-actions {
  display: flex;
  gap: 12px;
  justify-content: flex-end;
}

.btn-cancel,
.btn-confirm {
  padding: 8px 16px;
  border-radius: 6px;
  border: none;
  cursor: pointer;
  font-size: 14px;
  transition: opacity 0.2s;
}

.btn-cancel {
  background: var(--vp-c-bg-soft);
  color: var(--vp-c-text-1);
}

.btn-confirm {
  background: var(--vp-c-brand);
  color: white;
}

.btn-cancel:hover,
.btn-confirm:hover {
  opacity: 0.9;
}

.btn-confirm:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>
