<script setup>
import { onMounted, ref } from 'vue'
import ConfirmDialog from './ConfirmDialog.vue'

const menuItems = ref([])
const message = ref('')
const messageType = ref('success')
const showEditDialog = ref(false)
const showAddDialog = ref(false)
const editingItem = ref(null)
const editingParentIndex = ref(-1)
const newMenuItem = ref({ text: '', link: '', folder: '', items: null })

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

// 加载菜单配置
async function loadMenus(showSuccessMsg = false) {
  try {
    const response = await fetch('http://localhost:3456/api/nav-config')
    const data = await response.json()
    menuItems.value = data // 直接使用返回的数组
    if (showSuccessMsg) {
      showMessage('✅ 导航配置加载成功', 'success')
    }
  }
  catch (error) {
    showMessage(`❌ 加载失败: ${error.message}`, 'error')
  }
}

// 保存菜单配置
async function saveMenus() {
  try {
    // 第一步：保存配置
    const response = await fetch('http://localhost:3456/api/config/menus', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ menus: menuItems.value }),
    })

    const data = await response.json()
    if (!data.success) {
      showMessage(`保存失败: ${data.error}`, 'error')
      return
    }

    // 第二步：自动创建文件夹和index.md
    try {
      const createResponse = await fetch('http://localhost:3456/api/config/menus/create-folders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ menus: menuItems.value }),
      })
      const createData = await createResponse.json()
      
      if (createData.success) {
        let message = '✅ 保存成功！'
        if (createData.createdFolders && createData.createdFolders.length > 0) {
          message += `\n\n📁 已自动创建 ${createData.createdFolders.length} 个文件夹：\n${createData.createdFolders.map(f => `  • ${f}`).join('\n')}`
        }
        if (createData.errors && createData.errors.length > 0) {
          message += `\n\n⚠️ 部分文件夹创建失败：\n${createData.errors.map(e => `  • ${e.folder}: ${e.error}`).join('\n')}`
        }
        message += '\n\n💡 请重启开发服务器使配置生效'
        showMessage(message, 'success')
      } else {
        // 创建文件夹失败，但配置已保存
        showMessage(`✅ 配置已保存，但文件夹创建失败: ${createData.error}\n\n⚠️ 请检查文件夹权限或手动创建文件夹`, 'error')
      }
    }
    catch (createError) {
      // 创建文件夹出错，但配置已保存
      showMessage(`✅ 配置已保存，但自动创建文件夹时出错\n\n⚠️ 请检查文件夹权限或手动创建文件夹`, 'error')
    }
  }
  catch (error) {
    showMessage(`保存失败: ${error.message}`, 'error')
  }
}

// 编辑菜单项
function editMenu(item, parentIndex = -1) {
  if (item.editable === false) {
    showMessage('⚠️ 此菜单为系统菜单，不可编辑', 'error')
    return
  }
  editingItem.value = { ...item }
  editingParentIndex.value = parentIndex
  showEditDialog.value = true
}

// 确认编辑
async function confirmEdit() {
  if (!editingItem.value.text.trim()) {
    showMessage('请输入菜单名称', 'error')
    return
  }

  const index = menuItems.value.findIndex(m => m.text === editingItem.value.text)
  if (index !== -1) {
    menuItems.value[index] = { ...editingItem.value }
  }

  showEditDialog.value = false
  editingItem.value = null

  // 自动保存
  await saveMenus()
}

// 添加菜单
function addMenu(parentIndex = -1) {
  newMenuItem.value = { text: '', link: '', folder: '', items: null }
  editingParentIndex.value = parentIndex

  // 如果是添加子菜单，获取父级的 folder 作为前缀
  if (parentIndex !== -1 && menuItems.value[parentIndex].folder) {
    newMenuItem.value.folderPrefix = menuItems.value[parentIndex].folder
  }
  else {
    newMenuItem.value.folderPrefix = ''
  }

  showAddDialog.value = true
}

// 确认添加
async function confirmAdd() {
  if (!newMenuItem.value.text.trim()) {
    showMessage('请输入菜单名称', 'error')
    return
  }

  // 构建完整的 folder 路径
  const menuItem = { ...newMenuItem.value }
  if (menuItem.folderPrefix && menuItem.folder) {
    // 子菜单：合并父级路径和当前文件夹
    menuItem.folder = `${menuItem.folderPrefix}/${menuItem.folder}`
  }
  // 移除临时的 folderPrefix 字段
  delete menuItem.folderPrefix

  if (editingParentIndex.value === -1) {
    // 添加一级菜单
    menuItems.value.push(menuItem)
  }
  else {
    // 添加子菜单
    if (!menuItems.value[editingParentIndex.value].items) {
      menuItems.value[editingParentIndex.value].items = []
    }
    menuItems.value[editingParentIndex.value].items.push(menuItem)
  }

  showAddDialog.value = false

  // 自动保存
  await saveMenus()
}

// 删除菜单
function deleteMenu(index, parentIndex = -1) {
  const item = parentIndex === -1
    ? menuItems.value[index]
    : menuItems.value[parentIndex].items[index]

  if (item.editable === false) {
    showMessage('⚠️ 此菜单为系统菜单，不可删除', 'error')
    return
  }

  showConfirm(
    '删除菜单',
    `确定删除菜单"${item.text}"吗？`,
    async () => {
      if (parentIndex === -1) {
        menuItems.value.splice(index, 1)
      }
      else {
        menuItems.value[parentIndex].items.splice(index, 1)
      }

      // 自动保存
      await saveMenus()
    },
    'danger'
  )
}

// 显示消息
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
  loadMenus()
})
</script>

<template>
  <div class="menu-manager-container">
    <div class="manager-header">
      <h2>🗂️ 导航菜单管理</h2>
      <div class="header-actions">
        <button class="btn-secondary" @click="loadMenus(true)">
          🔄 重新加载
        </button>
        <button class="btn-primary" @click="addMenu(-1)">
          ➕ 添加一级菜单
        </button>
        <button class="btn-success" @click="saveMenus">
          💾 保存配置
        </button>
      </div>
    </div>

    <div class="menu-list">
      <div v-for="(menu, index) in menuItems" :key="index" class="menu-item">
        <div class="menu-header">
          <div class="menu-info">
            <span class="menu-icon">{{ menu.text.includes('️') ? '' : '📌' }}</span>
            <span class="menu-text">{{ menu.text }}</span>
            <span v-if="menu.link" class="menu-link">→ {{ menu.link }}</span>
            <span v-if="menu.folder" class="menu-folder">📁 {{ menu.folder }}</span>
            <span v-if="menu.editable === false" class="menu-badge">🔒 系统菜单</span>
          </div>
          <div class="menu-actions">
            <button
              v-if="menu.editable !== false"
              class="btn-small btn-edit"
              @click="editMenu(menu, -1)"
            >
              ✏️ 编辑
            </button>
            <button
              v-if="!menu.link"
              class="btn-small btn-add"
              @click="addMenu(index)"
            >
              ➕ 添加子菜单
            </button>
            <button
              v-if="menu.editable !== false"
              class="btn-small btn-delete"
              @click="deleteMenu(index, -1)"
            >
              🗑️ 删除
            </button>
          </div>
        </div>

        <!-- 子菜单 -->
        <div v-if="menu.items && menu.items.length > 0" class="submenu-list">
          <div v-for="(submenu, subIndex) in menu.items" :key="subIndex" class="submenu-item">
            <div class="submenu-info">
              <span class="submenu-icon">└─</span>
              <span class="submenu-text">{{ submenu.text }}</span>
              <span v-if="submenu.link" class="submenu-link">→ {{ submenu.link }}</span>
              <span v-if="submenu.folder" class="submenu-folder">📁 {{ submenu.folder }}</span>
            </div>
            <div class="submenu-actions">
              <button
                class="btn-small btn-edit"
                @click="editMenu(submenu, index)"
              >
                ✏️
              </button>
              <button
                class="btn-small btn-delete"
                @click="deleteMenu(subIndex, index)"
              >
                🗑️
              </button>
            </div>
          </div>
        </div>
      </div>

      <div v-if="menuItems.length === 0" class="no-menus">
        <p>📭 暂无菜单配置</p>
        <p class="hint">
          点击"添加一级菜单"开始配置
        </p>
      </div>
    </div>

    <!-- 编辑对话框 -->
    <div v-if="showEditDialog" class="dialog-overlay" @click="showEditDialog = false">
      <div class="dialog-content" @click.stop>
        <div class="dialog-header">
          <h3>✏️ 编辑菜单</h3>
          <button class="dialog-close" @click="showEditDialog = false">
            ✕
          </button>
        </div>
        <div class="dialog-body">
          <div class="form-group">
            <label>菜单名称<span style="color: red;">*</span>：</label>
            <input
              v-model="editingItem.text"
              type="text"
              class="form-input"
              placeholder="例如：📚 博客"
            >
            <span class="form-hint">💡 必填项。支持使用 emoji 图标，会显示在导航栏上。</span>
          </div>
          <div class="form-group">
            <label>链接地址（可选）：</label>
            <input
              v-model="editingItem.link"
              type="text"
              class="form-input"
              placeholder="通常留空即可"
            >
            <span class="form-hint">
              ⚠️ <strong>如需添加子菜单，请保持此字段为空。</strong><br>
              💡 仅在创建直接跳转菜单时填写：<br>
              &nbsp;&nbsp;&nbsp;• 站内链接：/about/ 或 /posts/blog/<br>
              &nbsp;&nbsp;&nbsp;• 外部链接：https://github.com 或 https://google.com
            </span>
          </div>
          <div class="form-group">
            <label>文件夹名称（推荐填写）：</label>
            <input
              v-model="editingItem.folder"
              type="text"
              class="form-input"
              placeholder="例如：blog 或 ai/tools"
            >
            <span class="form-hint">
              💡 指定文章保存的文件夹路径。<br>
              📂 支持多级路径（如：ai/tools），用于组织文章结构。
            </span>
          </div>
        </div>
        <div class="dialog-footer">
          <button type="button" class="btn-secondary" @click="showEditDialog = false">
            取消
          </button>
          <button type="button" class="btn-success" @click="confirmEdit">
            确认
          </button>
        </div>
      </div>
    </div>

    <!-- 添加对话框 -->
    <div v-if="showAddDialog" class="dialog-overlay" @click="showAddDialog = false">
      <div class="dialog-content" @click.stop>
        <div class="dialog-header">
          <h3>➕ 添加菜单</h3>
          <button class="dialog-close" @click="showAddDialog = false">
            ✕
          </button>
        </div>
        <div class="dialog-body">
          <div class="form-group">
            <label>菜单名称<span style="color: red;">*</span>：</label>
            <input
              v-model="newMenuItem.text"
              type="text"
              class="form-input"
              placeholder="例如：📚 博客"
            >
            <span class="form-hint">💡 必填项。支持使用 emoji 图标，会显示在导航栏上。</span>
          </div>
          <div class="form-group">
            <label>链接地址（可选）：</label>
            <input
              v-model="newMenuItem.link"
              type="text"
              class="form-input"
              placeholder="通常留空即可"
            >
            <span class="form-hint">
              ⚠️ <strong>如需添加子菜单，请保持此字段为空。</strong><br>
              💡 仅在创建直接跳转菜单时填写：<br>
              &nbsp;&nbsp;&nbsp;• 站内链接：/about/ 或 /posts/blog/<br>
              &nbsp;&nbsp;&nbsp;• 外部链接：https://github.com 或 https://google.com
            </span>
          </div>
          <div class="form-group">
            <label>文件夹名称（推荐填写）：</label>
            <div v-if="newMenuItem.folderPrefix" class="folder-prefix-hint">
              📁 父级路径: <code>{{ newMenuItem.folderPrefix }}/</code>
            </div>
            <input
              v-model="newMenuItem.folder"
              type="text"
              class="form-input"
              :placeholder="newMenuItem.folderPrefix ? `例如：tools（将保存到 ${newMenuItem.folderPrefix}/tools）` : '例如：blog 或 ai/tools'"
            >
            <span class="form-hint">
              💡 {{ newMenuItem.folderPrefix ? '只需填写当前文件夹名称，会自动添加到父级路径下。' : '指定文章保存的文件夹路径。' }}<br>
              📂 支持多级路径（如：ai/tools），用于组织文章结构。
            </span>
          </div>
        </div>
        <div class="dialog-footer">
          <button type="button" class="btn-secondary" @click="showAddDialog = false">
            取消
          </button>
          <button type="button" class="btn-success" @click="confirmAdd">
            确认添加
          </button>
        </div>
      </div>
    </div>

    <!-- 确认对话框 -->
    <ConfirmDialog
      v-model="showConfirmDialog"
      :title="confirmTitle"
      :message="confirmMessage"
      :type="confirmType"
      @confirm="handleConfirmAction"
    />

    <!-- 状态提示 -->
    <div v-if="message" class="message" :class="messageType">
      {{ message }}
    </div>
  </div>
</template>

<style scoped>
.menu-manager-container {
  width: 100%;
  margin: 0;
  padding: 24px;
  padding-bottom: 120px;
  min-height: calc(100vh - 64px);
  box-sizing: border-box;
}

.manager-header {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 24px;
  padding-bottom: 16px;
  border-bottom: 2px solid var(--vp-c-divider);
  flex-wrap: wrap;
}

.manager-header h2 {
  margin: 0;
  margin-right: 8px;
  color: var(--vp-c-text-1);
  line-height: 1; /* Ensure line-height doesn't cause misalignment */
  display: flex;
  align-items: center;
}

.header-actions {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
  margin-top: 4px; /* Move buttons down slightly */
}

.btn-primary,
.btn-secondary,
.btn-success,
.btn-small {
  padding: 10px 20px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.2s;
}

.btn-primary {
  background: var(--vp-c-brand);
  color: white;
}

.btn-primary:hover {
  background: var(--vp-c-brand-dark);
}

.btn-secondary {
  background: #6b7280;
  color: white;
}

.btn-secondary:hover {
  background: #4b5563;
}

.btn-success {
  background: #10b981;
  color: white;
}

.btn-success:hover {
  background: #059669;
}

.btn-small {
  padding: 6px 12px;
  font-size: 12px;
}

.btn-edit {
  background: #3b82f6;
  color: white;
}

.btn-edit:hover {
  background: #2563eb;
}

.btn-add {
  background: #10b981;
  color: white;
}

.btn-add:hover {
  background: #059669;
}

.btn-delete {
  background: #ef4444;
  color: white;
}

.btn-delete:hover {
  background: #dc2626;
}

.menu-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.menu-item {
  background: var(--vp-c-bg-soft);
  border: 2px solid var(--vp-c-divider);
  border-radius: 8px;
  padding: 16px;
}

.menu-header {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 12px;
  flex-wrap: wrap;
}

.menu-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.menu-icon {
  font-size: 20px;
}

.menu-text {
  font-weight: 600;
  font-size: 16px;
  color: var(--vp-c-text-1);
}

.menu-link {
  font-size: 14px;
  color: var(--vp-c-text-3);
}

.menu-folder {
  font-size: 13px;
  color: var(--vp-c-brand);
  background: var(--vp-c-brand-soft);
  padding: 2px 8px;
  border-radius: 4px;
  font-weight: 500;
}

.menu-badge {
  padding: 4px 8px;
  background: #fbbf24;
  color: #78350f;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
}

.menu-actions {
  display: flex;
  gap: 8px;
}

.submenu-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-left: 32px;
  padding-left: 16px;
  border-left: 2px solid var(--vp-c-divider);
}

.submenu-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  background: var(--vp-c-bg);
  border-radius: 6px;
  flex-wrap: wrap;
}

.submenu-info {
  display: flex;
  align-items: center;
  gap: 8px;
}

.submenu-icon {
  color: var(--vp-c-text-3);
}

.submenu-text {
  font-weight: 500;
  color: var(--vp-c-text-1);
}

.submenu-link {
  font-size: 14px;
  color: var(--vp-c-text-3);
}

.submenu-folder {
  font-size: 12px;
  color: var(--vp-c-brand);
  background: var(--vp-c-brand-soft);
  padding: 2px 6px;
  border-radius: 3px;
  font-weight: 500;
}

.submenu-actions {
  display: flex;
  gap: 8px;
}

.no-menus {
  text-align: center;
  padding: 48px 24px;
  color: var(--vp-c-text-2);
}

.no-menus p {
  margin: 8px 0;
}

.hint {
  font-size: 14px;
  color: var(--vp-c-text-3);
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
  z-index: 1000;
}

.dialog-content {
  background: var(--vp-c-bg);
  border-radius: 12px;
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.2);
  width: 90%;
  max-width: 500px;
}

.dialog-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  border-bottom: 1px solid var(--vp-c-divider);
}

.dialog-header h3 {
  margin: 0;
  font-size: 18px;
  color: var(--vp-c-text-1);
}

.dialog-close {
  background: none;
  border: none;
  font-size: 24px;
  color: var(--vp-c-text-3);
  cursor: pointer;
  padding: 0;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
}

.dialog-close:hover {
  background: var(--vp-c-bg-alt);
  color: var(--vp-c-text-1);
}

.dialog-body {
  padding: 20px;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
  color: var(--vp-c-text-1);
}

.form-input {
  width: 100%;
  padding: 10px 12px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 6px;
  background: var(--vp-c-bg);
  color: var(--vp-c-text-1);
  font-size: 14px;
}

.form-input:focus {
  outline: none;
  border-color: var(--vp-c-brand);
  box-shadow: 0 0 0 3px var(--vp-c-brand-soft);
}

.form-hint {
  display: block;
  margin-top: 6px;
  font-size: 12px;
  color: var(--vp-c-text-3);
}

.folder-prefix-hint {
  margin-bottom: 8px;
  padding: 8px 12px;
  background: var(--vp-c-brand-soft);
  border-left: 3px solid var(--vp-c-brand);
  border-radius: 4px;
  font-size: 13px;
  color: var(--vp-c-text-1);
}

.folder-prefix-hint code {
  background: var(--vp-c-bg);
  padding: 2px 6px;
  border-radius: 3px;
  font-family: monospace;
  color: var(--vp-c-brand);
  font-weight: 600;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  padding: 16px 20px;
  border-top: 1px solid var(--vp-c-divider);
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
