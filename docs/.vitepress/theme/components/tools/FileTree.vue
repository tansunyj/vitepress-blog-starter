<script setup>
import { ref } from 'vue'

defineProps({
  nodes: {
    type: Array,
    default: () => [],
  },
  currentFile: {
    type: String,
    default: '',
  },
  selectedFolder: {
    type: String,
    default: '',
  },
  mode: {
    type: String,
    default: 'draft', // 'draft' | 'published'
  },
})

const emit = defineEmits(['select', 'delete', 'selectFolder', 'deleteFolder', 'renameFolder', 'renameFile', 'unpublish'])

const expandedFolders = ref(new Set())

function toggleFolder(folderPath) {
  if (expandedFolders.value.has(folderPath)) {
    expandedFolders.value.delete(folderPath)
  }
  else {
    expandedFolders.value.add(folderPath)
  }
}

function selectFile(node) {
  if (node.type === 'file') {
    emit('select', node.path)
  }
}

function selectFolder(folderPath) {
  // 选中文件夹并切换展开/折叠状态
  emit('selectFolder', folderPath)
  // 切换展开状态
  toggleFolder(folderPath)
}

function isFolderExpanded(path) {
  return expandedFolders.value.has(path)
}
</script>

<template>
  <div class="file-tree">
    <div
      v-for="node in nodes"
      :key="node.path"
      class="tree-node"
    >
      <!-- 文件夹 -->
      <div
        v-if="node.type === 'folder'"
        class="tree-item folder"
        :class="{ selected: selectedFolder === node.path }"
      >
        <div class="folder-content" @click="selectFolder(node.path)">
          <span class="folder-icon">
            {{ isFolderExpanded(node.path) ? '📂' : '📁' }}
          </span>
          <span class="node-name">{{ node.name }}</span>
          <span class="folder-count">({{ node.children?.length || 0 }})</span>
        </div>
        <div class="folder-actions">
          <button
            class="btn-action"
            title="重命名"
            @click.stop="emit('renameFolder', node.path)"
          >
            ✏️
          </button>
          <button
            class="btn-action btn-danger"
            title="删除文件夹"
            @click.stop="emit('deleteFolder', node.path)"
          >
            🗑️
          </button>
        </div>
      </div>

      <!-- 文件 -->
      <div
        v-else
        class="tree-item file"
        :class="{ active: currentFile === node.path }"
      >
        <div class="file-content" @click="selectFile(node)">
          <span class="file-icon">📄</span>
          <span class="node-name">{{ node.name }}</span>
        </div>
        <!-- 草稿模式：重命名+删除 -->
        <div v-if="mode === 'draft'" class="file-actions">
          <button
            class="btn-action"
            title="重命名"
            @click.stop="emit('renameFile', node.path)"
          >
            ✏️
          </button>
          <button
            class="btn-action btn-danger"
            title="删除草稿"
            @click.stop="emit('delete', node.path)"
          >
            🗑️
          </button>
        </div>
        <!-- 已上线模式：下架 -->
        <div v-else class="file-actions">
          <button
            class="btn-action btn-warning"
            title="下架到草稿箱"
            @click.stop="emit('unpublish', node.path)"
          >
            📥 下架
          </button>
        </div>
      </div>

      <!-- 递归显示子节点 -->
      <div
        v-if="node.type === 'folder' && node.children && node.children.length > 0"
        v-show="isFolderExpanded(node.path)"
        class="tree-children"
      >
        <FileTree
          :nodes="node.children"
          :current-file="currentFile"
          :selected-folder="selectedFolder"
          :mode="mode"
          @select="(path) => emit('select', path)"
          @delete="(path) => emit('delete', path)"
          @select-folder="(path) => emit('selectFolder', path)"
          @delete-folder="(path) => emit('deleteFolder', path)"
          @rename-folder="(path) => emit('renameFolder', path)"
          @rename-file="(path) => emit('renameFile', path)"
          @unpublish="(path) => emit('unpublish', path)"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
.file-tree {
  user-select: none;
}

.tree-node {
  margin-bottom: 2px;
}

.tree-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  padding: 6px 8px;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s;
  font-size: 14px;
}

.file-content {
  display: flex;
  align-items: center;
  gap: 8px;
  flex: 1;
  overflow: hidden;
}

.folder-content {
  display: flex;
  align-items: center;
  gap: 8px;
  flex: 1;
  overflow: hidden;
}

.folder-actions,
.file-actions {
  display: flex;
  gap: 4px;
  opacity: 0;
  transition: opacity 0.2s;
}

.tree-item:hover .folder-actions,
.tree-item:hover .file-actions {
  opacity: 1;
}

.btn-action {
  padding: 2px 6px;
  background: transparent;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.2s;
}

.btn-action:hover {
  background: var(--vp-c-bg-alt);
}

.btn-action.btn-danger:hover {
  background: var(--vp-c-danger-soft);
}

.btn-action.btn-warning {
  background: #f59e0b;
  color: white;
  padding: 4px 8px;
  font-size: 12px;
}

.btn-action.btn-warning:hover {
  background: #d97706;
}

.tree-item:hover {
  background: var(--vp-c-bg-alt);
}

.tree-item.file.active {
  background: var(--vp-c-brand-soft);
  color: var(--vp-c-brand);
  font-weight: 500;
}

.folder {
  font-weight: 500;
  color: var(--vp-c-text-1);
}

.folder.selected {
  background: var(--vp-c-brand-soft);
  color: var(--vp-c-brand);
}

.file {
  color: var(--vp-c-text-2);
}

.folder-icon,
.file-icon {
  font-size: 16px;
  flex-shrink: 0;
}

.node-name {
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.folder-count {
  font-size: 12px;
  color: var(--vp-c-text-3);
  font-weight: normal;
}

.tree-children {
  margin-left: 20px;
  padding-left: 8px;
  border-left: 1px solid var(--vp-c-divider-light);
}
</style>
