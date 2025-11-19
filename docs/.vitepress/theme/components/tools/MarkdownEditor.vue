<script setup>
import { MdEditor } from 'md-editor-v3'
import { computed, nextTick, onMounted, ref } from 'vue'

import FileTree from './FileTree.vue'

import 'md-editor-v3/lib/style.css'

const content = ref('')
const currentFile = ref('')
const files = ref([])
const drafts = ref([])
const fileTree = ref([])
const showFileSelector = ref(false)
const message = ref('')
const messageType = ref('success')
const searchKeyword = ref('')
const showSidebar = ref(true)
const showSaveDialog = ref(false)
const showPublishDialog = ref(false)
const saveFileName = ref('')
const saveCategory = ref('')
const categories = ref([])
const activeTab = ref('published') // 'published' | 'drafts'
const isDraft = ref(false) // 当前是否是草稿
const currentDraftId = ref('') // 当前草稿ID，用于图片上传
const showCreateFolderDialog = ref(false) // 显示新建文件夹对话框
const newFolderName = ref('') // 新文件夹名称
const selectedFolder = ref('') // 当前选中的文件夹
const showRenameDialog = ref(false) // 显示重命名对话框
const renameTarget = ref('') // 要重命名的目标路径
const renameType = ref('') // 'file' 或 'folder'
const newName = ref('') // 新名称
const fileInput = ref(null) // 文件输入元素引用

// 计算保存按钮是否可用
const canSave = computed(() => {
  // 文件选择器显示时不能保存
  if (showFileSelector.value) {
    return false
  }
  // 内容为空不能保存
  if (!content.value.trim()) {
    return false
  }
  return true
})

// 过滤后的文章列表
const filteredFiles = computed(() => {
  if (!searchKeyword.value.trim()) {
    return files.value
  }
  const keyword = searchKeyword.value.toLowerCase()
  return files.value.filter(file =>
    file.name.toLowerCase().includes(keyword)
    || file.path.toLowerCase().includes(keyword),
  )
})

// 按日期分组的草稿（年/月）
const groupedDrafts = computed(() => {
  const groups = {}

  drafts.value.forEach((draft) => {
    const date = new Date(draft.modifiedAt)
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const key = `${year}-${month}`

    if (!groups[key]) {
      groups[key] = {
        year,
        month,
        label: `${year}年${month}月`,
        files: [],
      }
    }
    groups[key].files.push(draft)
  })

  // 转换为数组并按时间倒序排序
  return Object.values(groups).sort((a, b) => {
    const dateA = new Date(a.year, a.month - 1)
    const dateB = new Date(b.year, b.month - 1)
    return dateB - dateA
  })
})

// 格式化日期
function formatDate(dateString) {
  const date = new Date(dateString)
  const now = new Date()
  const diff = now - date
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))

  if (days === 0)
    return '今天'
  if (days === 1)
    return '昨天'
  if (days < 7)
    return `${days}天前`
  if (days < 30)
    return `${Math.floor(days / 7)}周前`

  return date.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  })
}

// 格式化文件大小
function formatSize(bytes) {
  if (bytes < 1024)
    return `${bytes} B`
  if (bytes < 1024 * 1024)
    return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`
}

// 加载文章列表
async function loadFiles() {
  try {
    const response = await fetch('http://localhost:3456/api/markdown/list')
    const data = await response.json()
    files.value = data.files
  }
  catch {
    showMessage('加载文章列表失败', 'error')
  }
}

// 加载草稿列表
async function loadDrafts() {
  try {
    const response = await fetch('http://localhost:3456/api/draft/list')
    const data = await response.json()
    drafts.value = data.files
  }
  catch {
    showMessage('加载草稿列表失败', 'error')
  }
}

// 加载树形结构（草稿箱加载drafts文件夹）
async function loadFileTree() {
  try {
    const response = await fetch('http://localhost:3456/api/drafts/tree')
    const data = await response.json()
    fileTree.value = data.tree
  }
  catch {
    showMessage('加载文档树失败', 'error')
  }
}

// 加载发布分类（直接从导航配置构建，不从文件夹读取）
async function loadPublishCategories() {
  try {
    // 从后端API获取导航配置
    const response = await fetch('http://localhost:3456/api/nav-config')
    if (!response.ok) {
      throw new Error(`API请求失败: ${response.status}`)
    }

    const navConfig = await response.json()
    console.log('📋 导航配置:', navConfig)

    const cats = []

    // 遍历导航配置构建分类列表
    navConfig.forEach((navItem) => {
      if (navItem.items) {
        // 有子菜单的情况
        const parentText = navItem.text.replace(/[\u{1F300}-\u{1F9FF}]/gu, '').trim()

        navItem.items.forEach((subItem) => {
          // 直接使用folder字段，而不是从link提取
          const path = subItem.folder
          if (path) {
            cats.push({
              name: subItem.text,
              path, // 实际的文件夹路径，如 ai/tools 或 resources/quark
              displayName: `${parentText} > ${subItem.text}`, // 显示名称，如 AI > AI工具
            })
          }
        })
      }
      else if (navItem.folder) {
        // 单个链接的情况（使用folder字段）
        const text = navItem.text.replace(/[\u{1F300}-\u{1F9FF}]/gu, '').trim()
        cats.push({
          name: text,
          path: navItem.folder,
          displayName: text,
        })
      }
    })

    console.log('📂 生成的分类列表:', cats)
    console.log('📂 分类详情:', JSON.stringify(cats, null, 2))
    categories.value = cats

    if (cats.length === 0) {
      showMessage('未找到发布分类', 'warning')
    }
    else {
      console.log('📂 第一个分类:', cats[0])
    }
  }
  catch (error) {
    console.error('❌ 加载发布分类失败:', error)
    showMessage(`加载发布分类失败: ${error.message}`, 'error')
  }
}

// 打开文件（草稿箱始终从drafts文件夹读取）
async function openFile(filepath) {
  try {
    // 草稿箱的文档树现在显示的是drafts文件夹，所以统一使用drafts API
    const apiUrl = `http://localhost:3456/api/drafts/read?file=${encodeURIComponent(filepath)}`

    const response = await fetch(apiUrl)
    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || '读取文件失败')
    }

    const data = await response.json()

    // 先关闭文件选择器
    showFileSelector.value = false

    // 等待DOM更新后设置内容
    await nextTick()

    content.value = data.content
    currentFile.value = filepath
    isDraft.value = true // 草稿箱始终是草稿模式
    currentDraftId.value = filepath.replace('.md', '')

    console.warn('[MarkdownEditor] 文件打开完成:', {
      filepath,
      contentLength: content.value.length,
      canSave: true,
    })
  }
  catch (error) {
    showMessage(`打开文件失败: ${error.message}`, 'error')
  }
}

// 触发文件导入
function triggerFileImport() {
  if (fileInput.value) {
    fileInput.value.click()
  }
}

// 处理文件导入
async function handleFileImport(event) {
  const file = event.target.files?.[0]
  if (!file)
    return

  // 检查文件类型
  if (!file.name.endsWith('.md') && !file.name.endsWith('.markdown')) {
    showMessage('❌ 请选择MD或Markdown文件', 'error')
    return
  }

  try {
    // 读取文件内容
    const reader = new FileReader()
    reader.onload = (e) => {
      const fileContent = e.target?.result
      if (typeof fileContent === 'string') {
        // 设置内容到编辑器
        content.value = fileContent
        currentFile.value = file.name
        isDraft.value = true
        currentDraftId.value = file.name.replace(/\.(md|markdown)$/, '')
        showFileSelector.value = false

        showMessage(`✅ 已导入文件：${file.name}`, 'success')
        console.warn('[MarkdownEditor] 文件导入成功:', {
          fileName: file.name,
          size: file.size,
          contentLength: fileContent.length,
        })
      }
    }

    reader.onerror = () => {
      showMessage('❌ 读取文件失败', 'error')
    }

    reader.readAsText(file, 'UTF-8')
  }
  catch (error) {
    showMessage(`❌ 导入失败: ${error.message}`, 'error')
  }

  // 清空input，允许重复选择同一文件
  event.target.value = ''
}

// 保存草稿
async function saveDraft() {
  console.warn('[MarkdownEditor] saveDraft调用, 当前状态:', {
    showFileSelector: showFileSelector.value,
    contentLength: content.value.length,
    hasContent: !!content.value.trim(),
    canSave: canSave.value,
  })

  // 检查是否可以保存
  if (showFileSelector.value) {
    showMessage('请先关闭文件选择器或打开一个文件', 'warning')
    return
  }

  if (!content.value.trim()) {
    showMessage('内容为空，无法保存', 'error')
    return
  }

  let filename = currentFile.value
  if (!filename || !isDraft.value) {
    // 新建草稿，生成文件名
    const draftName = `draft-${Date.now()}.md`
    // 如果选中了文件夹，保存到该文件夹下
    if (selectedFolder.value) {
      filename = `${selectedFolder.value}/${draftName}`
    }
    else {
      filename = draftName
    }
  }

  console.warn('[MarkdownEditor] Save draft:', {
    filename,
    selectedFolder: selectedFolder.value,
    currentFile: currentFile.value,
    isDraft: isDraft.value,
  })

  // 提取草稿ID
  const draftId = filename.replace('.md', '')
  currentDraftId.value = draftId

  // 显示保存中提示
  showMessage('正在保存草稿...', 'info')

  try {
    const response = await fetch('http://localhost:3456/api/draft/save', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ file: filename, content: content.value }),
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('[MarkdownEditor] Save HTTP error:', response.status, errorText)
      throw new Error(`HTTP错误: ${response.status}`)
    }

    const data = await response.json()
    console.warn('[MarkdownEditor] Save response:', data)

    if (data.success) {
      currentFile.value = filename
      isDraft.value = true
      showMessage('草稿保存成功！', 'success')
      // 刷新文档树以显示新保存的文件
      loadFileTree()
    }
    else {
      showMessage(`保存失败: ${data.error || '未知错误'}`, 'error')
    }
  }
  catch (error) {
    showMessage(`保存失败: ${error.message}`, 'error')
    console.error('[MarkdownEditor] Save draft error:', error)
  }
}

// 图片上传处理函数（md-editor-v3使用）
async function handleUploadImage(files) {
  const file = files[0]
  if (!file) {
    return
  }

  // 如果不是草稿，先保存为草稿
  if (!isDraft.value) {
    await saveDraft()
  }

  const formData = new FormData()
  formData.append('image', file)
  formData.append('draftId', currentDraftId.value)

  try {
    const response = await fetch('http://localhost:3456/api/draft/upload-image', {
      method: 'POST',
      body: formData,
    })

    const data = await response.json()
    if (data.success) {
      showMessage('✅ 图片上传成功！', 'success')
      return data.path
    }
    else {
      showMessage(`❌ 图片上传失败: ${data.error}`, 'error')
      return ''
    }
  }
  catch (error) {
    showMessage(`❌ 图片上传失败: ${error.message}`, 'error')
    return ''
  }
}

// 打开发布对话框
async function openPublishDialog() {
  if (!content.value.trim()) {
    showMessage('内容为空，无法发布', 'error')
    return
  }

  if (!isDraft.value) {
    showMessage('请先保存为草稿', 'error')
    return
  }

  // 加载发布分类（从posts目录，对应网站导航栏）
  await loadPublishCategories()

  // 设置默认文件名和目录
  saveFileName.value = currentFile.value.replace('draft-', 'article-')
  saveCategory.value = categories.value[0]?.path || ''
  showPublishDialog.value = true
}

// 确认发布
async function confirmPublish() {
  if (!saveFileName.value.trim()) {
    showMessage('请输入文件名', 'error')
    return
  }

  if (!saveCategory.value) {
    showMessage('请选择发布目录', 'error')
    return
  }

  let filename = saveFileName.value.trim()
  if (!filename.endsWith('.md')) {
    filename += '.md'
  }

  const targetPath = `${saveCategory.value}/${filename}`

  console.log('📤 准备发布:', {
    draftFile: currentFile.value,
    targetPath,
    category: saveCategory.value,
    filename,
  })

  try {
    const response = await fetch('http://localhost:3456/api/draft/publish', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        draftFile: currentFile.value,
        targetPath,
        category: saveCategory.value,
      }),
    })

    const data = await response.json()
    if (data.success) {
      showPublishDialog.value = false
      isDraft.value = false
      currentFile.value = targetPath
      showMessage('✅ 发布成功！', 'success')
      loadFiles()
      loadFileTree()
    }
    else {
      showMessage(`❌ 发布失败: ${data.error}`, 'error')
    }
  }
  catch (error) {
    showMessage(`❌ 发布失败: ${error.message}`, 'error')
  }
}

// 取消发布
function cancelPublish() {
  showPublishDialog.value = false
}

// 取消保存
function cancelSave() {
  showSaveDialog.value = false
}

// 新建
function createNew() {
  // 先关闭文件选择器
  showFileSelector.value = false

  // 使用nextTick确保DOM更新后再设置内容
  nextTick(() => {
    content.value = `---
title: 新文章标题
description: 文章描述
date: ${new Date().toISOString().split('T')[0]}
author: 杰哥
category: blog/tutorials
tags:
  - 默认
---

# 新文章

在这里输入内容...
`
    currentFile.value = ''
    isDraft.value = true // 新建默认为草稿
    currentDraftId.value = '' // 清空草稿ID

    console.warn('[MarkdownEditor] createNew完成, state:', {
      contentLength: content.value.length,
      showFileSelector: showFileSelector.value,
      isDraft: isDraft.value,
      canSave: content.value.trim() && !showFileSelector.value,
    })
  })
}

// 打开新建文件夹对话框
function openCreateFolderDialog() {
  newFolderName.value = ''
  showCreateFolderDialog.value = true
}

// 选中文件夹
function handleSelectFolder(folderPath) {
  selectedFolder.value = folderPath
}

// 确认新建文件夹
async function confirmCreateFolder() {
  if (!newFolderName.value.trim()) {
    showMessage('请输入文件夹名称', 'error')
    return
  }

  // 如果选中了文件夹，在其中创建子文件夹
  const folderPath = selectedFolder.value
    ? `${selectedFolder.value}/${newFolderName.value.trim()}`
    : newFolderName.value.trim()

  try {
    const response = await fetch('http://localhost:3456/api/draft/create-folder', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ folderPath }),
    })

    if (!response.ok) {
      throw new Error(`HTTP错误: ${response.status}`)
    }

    const data = await response.json()
    if (data.success) {
      showCreateFolderDialog.value = false
      selectedFolder.value = '' // 清空选中状态
      showMessage('文件夹创建成功', 'success')
      loadFileTree()
    }
    else {
      showMessage(`创建失败: ${data.error}`, 'error')
    }
  }
  catch (error) {
    showMessage(`创建失败: ${error.message}`, 'error')
    console.error('[MarkdownEditor] Create folder error:', error)
  }
}

// 取消新建文件夹
function cancelCreateFolder() {
  showCreateFolderDialog.value = false
}

// 删除草稿
async function deleteDraft(filepath) {
  // eslint-disable-next-line no-alert
  if (!window.confirm(`确定要删除草稿"${filepath}"吗？`)) {
    return
  }

  try {
    const response = await fetch('http://localhost:3456/api/draft/delete', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ file: filepath }),
    })

    const data = await response.json()
    if (data.success) {
      showMessage('草稿删除成功', 'success')
      // 如果删除的是当前文件，清空编辑器
      if (currentFile.value === filepath) {
        currentFile.value = ''
        content.value = ''
      }
      loadFileTree()
    }
    else {
      showMessage(`删除失败: ${data.error}`, 'error')
    }
  }
  catch (error) {
    showMessage(`删除失败: ${error.message}`, 'error')
  }
}

// 删除文件夹
async function deleteFolder(folderPath) {
  // eslint-disable-next-line no-alert
  if (!window.confirm(`确定要删除文件夹"${folderPath}"及其所有内容吗？`)) {
    return
  }

  try {
    const response = await fetch('http://localhost:3456/api/draft/delete', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ file: folderPath }),
    })

    if (!response.ok) {
      throw new Error(`HTTP错误: ${response.status}`)
    }

    const data = await response.json()
    if (data.success) {
      showMessage('文件夹删除成功', 'success')
      selectedFolder.value = '' // 清空选中状态
      loadFileTree()
    }
    else {
      showMessage(`删除失败: ${data.error}`, 'error')
    }
  }
  catch (error) {
    showMessage(`删除失败: ${error.message}`, 'error')
    console.error('[MarkdownEditor] Delete folder error:', error)
  }
}

// 打开重命名对话框
function openRenameDialog(targetPath, type) {
  renameTarget.value = targetPath
  renameType.value = type
  // 获取当前名称（去掉路径和扩展名）
  const pathParts = targetPath.split('/')
  const currentName = pathParts[pathParts.length - 1]
  newName.value = type === 'file' ? currentName.replace('.md', '') : currentName
  showRenameDialog.value = true
}

// 确认重命名
async function confirmRename() {
  if (!newName.value.trim()) {
    showMessage('请输入新名称', 'error')
    return
  }

  const finalName = renameType.value === 'file' ? `${newName.value.trim()}.md` : newName.value.trim()

  console.warn('[MarkdownEditor] Rename request:', {
    oldPath: renameTarget.value,
    newName: finalName,
    type: renameType.value,
  })

  try {
    const response = await fetch('http://localhost:3456/api/draft/rename', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        oldPath: renameTarget.value,
        newName: finalName,
      }),
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('[MarkdownEditor] Rename HTTP error:', response.status, errorText)
      throw new Error(`HTTP错误: ${response.status}`)
    }

    const data = await response.json()
    console.warn('[MarkdownEditor] Rename response:', data)

    if (data.success) {
      showRenameDialog.value = false
      showMessage('重命名成功', 'success')
      // 如果重命名的是当前文件，更新currentFile
      if (renameType.value === 'file' && currentFile.value === renameTarget.value) {
        currentFile.value = data.newPath
      }
      loadFileTree()
    }
    else {
      showMessage(`重命名失败: ${data.error}`, 'error')
    }
  }
  catch (error) {
    showMessage(`重命名失败: ${error.message}`, 'error')
    console.error('[MarkdownEditor] Rename error:', error)
  }
}

// 取消重命名
function cancelRename() {
  showRenameDialog.value = false
}

// 显示消息（使用全局Toast）
function showMessage(msg, type = 'success') {
  if (window.$toast) {
    window.$toast(msg, type)
  }
  else {
    console.warn('[MarkdownEditor] window.$toast not available, using fallback:', msg, type)
    // 降级方案：使用原来的方式
    message.value = msg
    messageType.value = type
    setTimeout(() => {
      message.value = ''
    }, 3000)
  }
}

// 快捷键
function handleKeydown(e) {
  if ((e.ctrlKey || e.metaKey) && e.key === 's') {
    e.preventDefault()
    saveDraft()
  }
}

onMounted(() => {
  loadFiles()
  loadDrafts()
  loadFileTree()
  window.addEventListener('keydown', handleKeydown)
})
</script>

<template>
  <div class="markdown-editor-container">
    <!-- 顶部工具栏 -->
    <div class="editor-header">
      <div class="header-left">
        <h2>✏️ Markdown 编辑器</h2>
        <div class="editor-actions">
          <button class="btn-icon" title="切换侧边栏" @click="showSidebar = !showSidebar">
            {{ showSidebar ? '◀' : '▶' }}
          </button>
          <button class="btn-secondary" @click="createNew">
            ➕ 新增
          </button>
          <button class="btn-primary" @click="showFileSelector = !showFileSelector">
            📂 打开草稿
          </button>
          <button class="btn-info" @click="triggerFileImport">
            📥 导入MD文档
          </button>
          <input
            ref="fileInput"
            type="file"
            accept=".md,.markdown"
            style="display: none"
            @change="handleFileImport"
          >
          <button
            class="btn-success"
            :disabled="!canSave"
            :title="canSave ? '保存当前草稿' : '请先打开或创建一个草稿'"
            @click="saveDraft"
            @mouseenter="console.warn('🖱️ 鼠标进入保存按钮区域')"
            @mouseleave="console.warn('🖱️ 鼠标离开保存按钮区域')"
          >
            💾 保存草稿
          </button>
          <button class="btn-warning" :disabled="!isDraft" @click="openPublishDialog">
            🚀 发布
          </button>
        </div>
      </div>
    </div>

    <!-- 主体区域 -->
    <div class="editor-main-layout">
      <!-- 左侧：文档树（草稿箱显示drafts文件夹结构） -->
      <div v-if="showSidebar" class="sidebar">
        <div class="sidebar-header">
          <h3>📚 草稿目录</h3>
          <button class="btn-icon" title="新建文件夹" @click="openCreateFolderDialog">
            📁+
          </button>
        </div>
        <div class="sidebar-content">
          <FileTree
            :nodes="fileTree"
            :current-file="currentFile"
            :selected-folder="selectedFolder"
            @select="openFile"
            @delete="deleteDraft"
            @select-folder="handleSelectFolder"
            @delete-folder="deleteFolder"
            @rename-folder="(path) => openRenameDialog(path, 'folder')"
            @rename-file="(path) => openRenameDialog(path, 'file')"
          />
        </div>
      </div>

      <!-- 右侧：编辑区 -->
      <div class="editor-content">
        <!-- 文件选择器 -->
        <div v-if="showFileSelector" class="file-selector">
          <!-- 选项卡 -->
          <div class="tabs">
            <button
              class="tab"
              :class="{ active: activeTab === 'published' }"
              @click="activeTab = 'published'"
            >
              📚 已发布 ({{ files.length }})
            </button>
            <button
              class="tab"
              :class="{ active: activeTab === 'drafts' }"
              @click="activeTab = 'drafts'"
            >
              📝 草稿箱 ({{ drafts.length }})
            </button>
          </div>

          <div class="selector-header">
            <h3>{{ activeTab === 'drafts' ? '选择草稿' : '选择文章' }}</h3>
            <div class="search-box">
              <input
                v-model="searchKeyword"
                type="text"
                placeholder="🔍 搜索文章名称或路径..."
                class="search-input"
              >
              <span v-if="searchKeyword" class="clear-search" @click="searchKeyword = ''">
                ✕
              </span>
            </div>
          </div>
          <div class="file-count">
            共找到 {{ activeTab === 'drafts' ? drafts.length : filteredFiles.length }} 篇文章
          </div>

          <!-- 草稿箱：按日期分组显示 -->
          <div v-if="activeTab === 'drafts'" class="file-list">
            <div v-if="groupedDrafts.length === 0" class="no-results">
              <p>📝 还没有草稿</p>
              <p class="hint">
                点击"新增"开始创建
              </p>
            </div>
            <div v-for="group in groupedDrafts" :key="group.label" class="file-group">
              <div class="group-header">
                <span class="group-icon">📅</span>
                <span class="group-label">{{ group.label }}</span>
                <span class="group-count">({{ group.files.length }})</span>
              </div>
              <div
                v-for="file in group.files"
                :key="file.path"
                class="file-item"
                :class="{ active: currentFile === file.path }"
                @click="openFile(file.path, true)"
              >
                <span class="file-icon">📄</span>
                <div class="file-info">
                  <div class="file-name">
                    {{ file.name }}
                  </div>
                  <div class="file-path">
                    {{ file.path }}
                  </div>
                  <div class="file-meta">
                    <span class="meta-item">
                      <span class="meta-icon">📅</span>
                      {{ formatDate(file.modifiedAt) }}
                    </span>
                    <span class="meta-item">
                      <span class="meta-icon">📦</span>
                      {{ formatSize(file.size) }}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- 已发布文章：列表显示 -->
          <div v-else class="file-list">
            <div
              v-for="file in filteredFiles"
              :key="file.path"
              class="file-item"
              :class="{ active: currentFile === file.path }"
              @click="openFile(file.path, false)"
            >
              <span class="file-icon">📄</span>
              <div class="file-info">
                <div class="file-name">
                  {{ file.name }}
                </div>
                <div class="file-path">
                  {{ file.path }}
                </div>
                <div class="file-meta">
                  <span class="meta-item">
                    <span class="meta-icon">📅</span>
                    {{ formatDate(file.modifiedAt) }}
                  </span>
                  <span class="meta-item">
                    <span class="meta-icon">📦</span>
                    {{ formatSize(file.size) }}
                  </span>
                </div>
              </div>
            </div>
            <div v-if="filteredFiles.length === 0" class="no-results">
              <p>😔 没有找到匹配的文章</p>
              <p class="hint">
                试试其他关键词
              </p>
            </div>
          </div>
        </div>

        <!-- 编辑器区域 -->
        <div v-if="!showFileSelector">
          <!-- 当前文件信息 -->
          <div v-if="currentFile" class="current-file">
            <span class="file-icon">📄</span>
            <span class="file-path">{{ currentFile }}</span>
          </div>

          <!-- Markdown编辑器 -->
          <MdEditor
            v-model="content"
            language="zh-CN"
            :preview="true"
            :toolbars="[
              'bold',
              'underline',
              'italic',
              'strikeThrough',
              '-',
              'title',
              'sub',
              'sup',
              'quote',
              'unorderedList',
              'orderedList',
              'task',
              '-',
              'codeRow',
              'code',
              'link',
              'image',
              'table',
              '-',
              'revoke',
              'next',
              '=',
              'pageFullscreen',
              'fullscreen',
              'preview',
              'catalog',
            ]"
            :on-upload-img="handleUploadImage"
            style="height: calc(100vh - 250px); min-height: 600px"
          />
        </div>
      </div>
    </div>

    <!-- 状态提示 -->
    <div v-if="message" class="message" :class="messageType">
      {{ message }}
    </div>

    <!-- 保存对话框 -->
    <div v-if="showSaveDialog" class="dialog-overlay" @click="cancelSave">
      <div class="dialog-content" @click.stop>
        <div class="dialog-header">
          <h3>💾 保存文章</h3>
          <button class="dialog-close" @click="cancelSave">
            ✕
          </button>
        </div>
        <div class="dialog-body">
          <div class="form-group">
            <label>文件名：</label>
            <input
              v-model="saveFileName"
              type="text"
              class="form-input"
              placeholder="article-xxx.md"
            >
            <span class="form-hint">会自动添加 .md 后缀</span>
          </div>
          <div class="form-group">
            <label>保存到目录：</label>
            <select v-model="saveCategory" class="form-select">
              <option v-for="cat in categories" :key="cat.path" :value="cat.path">
                {{ cat.displayName }}
              </option>
            </select>
          </div>
          <div class="form-info">
            <strong>完整路径：</strong>
            <code>{{ saveCategory }}/{{ saveFileName }}</code>
          </div>
        </div>
        <div class="dialog-footer">
          <button class="btn-secondary" @click="cancelSave">
            取消
          </button>
          <button class="btn-success" @click="confirmSave">
            确认保存
          </button>
        </div>
      </div>
    </div>

    <!-- 发布对话框 -->
    <div v-if="showPublishDialog" class="dialog-overlay" @click="cancelPublish">
      <div class="dialog-content" @click.stop>
        <div class="dialog-header">
          <h3>🚀 发布文章</h3>
          <button class="dialog-close" @click="cancelPublish">
            ✕
          </button>
        </div>
        <div class="dialog-body">
          <div class="form-info" style="margin-bottom: 16px; background: #fff3cd; border-left: 4px solid #ffc107;">
            <strong>📌 提示：</strong>发布后，草稿中的图片将自动复制到正式目录，图片路径会自动更新。
          </div>
          <div class="form-group">
            <label>文件名：</label>
            <input
              v-model="saveFileName"
              type="text"
              class="form-input"
              placeholder="article-xxx.md"
            >
            <span class="form-hint">会自动添加 .md 后缀</span>
          </div>
          <div class="form-group">
            <label>发布到菜单：</label>
            <select v-model="saveCategory" class="form-select">
              <option v-for="cat in categories" :key="cat.path" :value="cat.path">
                {{ cat.displayName }}
              </option>
            </select>
          </div>
          <div class="form-info">
            <strong>完整路径：</strong>
            <code>{{ saveCategory }}/{{ saveFileName }}</code>
          </div>
        </div>
        <div class="dialog-footer">
          <button class="btn-secondary" @click="cancelPublish">
            取消
          </button>
          <button class="btn-success" @click="confirmPublish">
            确认发布
          </button>
        </div>
      </div>
    </div>

    <!-- 新建文件夹对话框 -->
    <div v-if="showCreateFolderDialog" class="dialog-overlay" @click="cancelCreateFolder">
      <div class="dialog-content" @click.stop>
        <div class="dialog-header">
          <h3>📁 新建文件夹</h3>
          <button class="dialog-close" @click="cancelCreateFolder">
            ✕
          </button>
        </div>
        <div class="dialog-body">
          <div class="form-group">
            <label>文件夹名称：</label>
            <input
              v-model="newFolderName"
              type="text"
              class="form-input"
              placeholder="输入文件夹名称"
              @keyup.enter="confirmCreateFolder"
            >
            <span v-if="selectedFolder" class="form-hint">将在 <code>{{ selectedFolder }}/</code> 中创建</span>
            <span v-else class="form-hint">将在根目录创建，例如: 2024-11、技术笔记</span>
          </div>
        </div>
        <div class="dialog-footer">
          <button class="btn-secondary" @click="cancelCreateFolder">
            取消
          </button>
          <button class="btn-success" @click="confirmCreateFolder">
            创建
          </button>
        </div>
      </div>
    </div>

    <!-- 重命名对话框 -->
    <div v-if="showRenameDialog" class="dialog-overlay" @click="cancelRename">
      <div class="dialog-content" @click.stop>
        <div class="dialog-header">
          <h3>✏️ 重命名{{ renameType === 'folder' ? '文件夹' : '文件' }}</h3>
          <button class="dialog-close" @click="cancelRename">
            ✕
          </button>
        </div>
        <div class="dialog-body">
          <div class="form-group">
            <label>新名称：</label>
            <input
              v-model="newName"
              type="text"
              class="form-input"
              :placeholder="renameType === 'file' ? '输入文件名（不含.md）' : '输入文件夹名称'"
              @keyup.enter="confirmRename"
            >
            <span class="form-hint">原名称: <code>{{ renameTarget.split('/').pop() }}</code></span>
          </div>
        </div>
        <div class="dialog-footer">
          <button class="btn-secondary" @click="cancelRename">
            取消
          </button>
          <button class="btn-success" @click="confirmRename">
            确定
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.markdown-editor-container {
  padding: 24px;
  width: 100%;
  margin: 0;
  box-sizing: border-box;
  position: relative;
  z-index: 100;
  min-height: calc(100vh - 64px);
  box-sizing: border-box;
}

.editor-header {
  margin-bottom: 24px;
  padding-bottom: 16px;
  border-bottom: 2px solid var(--vp-c-divider);
  position: relative;
  z-index: 1000 !important;
  background: var(--vp-c-bg);
  pointer-events: auto !important;
  isolation: isolate;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 24px;
  flex-wrap: wrap;
}

.editor-header h2 {
  margin: 0;
  font-size: 24px;
  color: var(--vp-c-text-1);
  pointer-events: none;
  white-space: nowrap;
  flex-shrink: 0;
}

.editor-actions {
  display: flex;
  gap: 12px;
  align-items: center;
  position: relative;
  z-index: 1001 !important;
  pointer-events: auto !important;
  isolation: isolate;
  flex-wrap: wrap;
}

/* 主体布局：左右结构 */
.editor-main-layout {
  display: flex;
  gap: 20px;
  height: calc(100vh - 180px);
  min-height: 600px;
}

/* 确保md-editor不会遮挡顶部按钮 */
.editor-main-layout :deep(.md-editor) {
  z-index: 1;
}

.editor-main-layout :deep(.md-editor-toolbar) {
  z-index: 10;
}

/* 强制降低VitePress侧边栏和占位符的z-index，防止遮挡按钮 */
:deep(.spacer),
:deep(.aside-container),
:deep(.VPDocAside),
:deep(.VPDocAsideOutline) {
  z-index: 0 !important;
  position: relative;
}

/* 左侧边栏 */
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
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.sidebar-header h3 {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  color: var(--vp-c-text-1);
}

.btn-icon {
  padding: 8px 12px;
  background: #6b7280;
  color: white;
  border: none;
  border-radius: 6px;
  position: relative;
  z-index: 1002 !important;
  pointer-events: auto !important;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.2s;
  flex-shrink: 0;
}

.btn-icon:hover {
  background: var(--vp-c-brand);
  color: white;
}

.sidebar-content {
  flex: 1;
  overflow-y: auto;
  padding: 12px;
}

/* 右侧编辑区 */
.editor-content {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
}

.btn-primary,
.btn-info,
.btn-success,
.btn-secondary,
.btn-warning {
  padding: 10px 20px;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-primary {
  background: var(--vp-c-brand);
  color: white;
  position: relative;
  z-index: 1002 !important;
  pointer-events: auto !important;
}

.btn-primary:hover {
  background: var(--vp-c-brand-dark);
}

.btn-info {
  background: #3b82f6;
  color: white;
  position: relative;
  z-index: 1002 !important;
  pointer-events: auto !important;
}

.btn-info:hover {
  background: #2563eb;
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(59, 130, 246, 0.3);
}

.btn-success {
  background: #10b981;
  color: white;
  position: relative;
  z-index: 1002 !important;
  pointer-events: auto !important;
}

.btn-success:hover:not(:disabled) {
  background: #059669;
  transform: translateY(-1px);
  box-shadow: 0 4px 8px rgba(16, 185, 129, 0.3);
}

.btn-success:disabled {
  pointer-events: none !important;
  opacity: 0.6;
}

.btn-secondary {
  background: #6b7280;
  color: white;
  position: relative;
  z-index: 1002 !important;
  pointer-events: auto !important;
}

.btn-secondary:hover {
  background: #4b5563;
}

.btn-warning {
  background: #f59e0b;
  color: white;
  position: relative;
  z-index: 1002 !important;
  pointer-events: auto !important;
}

.btn-warning:hover:not(:disabled) {
  background: #d97706;
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(245, 158, 11, 0.3);
}

.btn-warning:disabled {
  background: #d1d5db;
  cursor: not-allowed;
  opacity: 0.6;
}

/* 选项卡 */
.tabs {
  display: flex;
  gap: 8px;
  margin-bottom: 16px;
  border-bottom: 2px solid var(--vp-c-divider);
}

.tab {
  background: none;
  border: none;
  padding: 12px 20px;
  font-size: 14px;
  color: var(--vp-c-text-2);
  cursor: pointer;
  border-bottom: 2px solid transparent;
  margin-bottom: -2px;
  transition: all 0.2s;
}

.tab:hover {
  color: var(--vp-c-text-1);
  background: var(--vp-c-bg-soft);
}

.tab.active {
  color: var(--vp-c-brand);
  border-bottom-color: var(--vp-c-brand);
  font-weight: 600;
}

/* 文件选择器 */
.file-selector {
  background: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 24px;
  max-height: 500px;
  overflow-y: auto;
}

.selector-header {
  margin-bottom: 16px;
}

.file-selector h3 {
  margin: 0 0 12px 0;
  font-size: 16px;
  color: var(--vp-c-text-1);
}

.search-box {
  position: relative;
  margin-bottom: 8px;
}

.search-input {
  width: 100%;
  padding: 10px 36px 10px 12px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 6px;
  background: var(--vp-c-bg);
  color: var(--vp-c-text-1);
  font-size: 14px;
  transition: all 0.2s;
}

.search-input:focus {
  outline: none;
  border-color: var(--vp-c-brand);
  box-shadow: 0 0 0 3px var(--vp-c-brand-soft);
}

.clear-search {
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  cursor: pointer;
  color: var(--vp-c-text-3);
  font-size: 18px;
  padding: 4px;
  transition: color 0.2s;
}

.clear-search:hover {
  color: var(--vp-c-text-1);
}

.file-count {
  margin-bottom: 12px;
  padding: 8px 12px;
  background: var(--vp-c-bg-alt);
  border-radius: 4px;
  font-size: 13px;
  color: var(--vp-c-text-2);
}

.file-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
  max-height: 400px;
  overflow-y: auto;
}

/* 文件分组 */
.file-group {
  margin-bottom: 20px;
}

.group-header {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  margin-bottom: 12px;
  background: var(--vp-c-bg-alt);
  border-left: 3px solid var(--vp-c-brand);
  border-radius: 4px;
  font-weight: 600;
  color: var(--vp-c-text-1);
}

.group-icon {
  font-size: 16px;
}

.group-label {
  flex: 1;
  font-size: 14px;
}

.group-count {
  font-size: 12px;
  color: var(--vp-c-text-3);
  font-weight: normal;
}

.file-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  background: var(--vp-c-bg);
  border: 1px solid var(--vp-c-divider);
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s;
}

.file-item:hover {
  background: var(--vp-c-bg-alt);
  border-color: var(--vp-c-brand);
}

.file-item.active {
  background: var(--vp-c-brand-soft);
  border-color: var(--vp-c-brand);
}

.file-icon {
  font-size: 24px;
}

.file-info {
  flex: 1;
}

.file-name {
  font-weight: 500;
  color: var(--vp-c-text-1);
  margin-bottom: 4px;
}

.file-path {
  font-size: 12px;
  color: var(--vp-c-text-2);
  margin-bottom: 6px;
}

.file-meta {
  display: flex;
  gap: 16px;
  font-size: 11px;
  color: var(--vp-c-text-3);
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 4px;
}

.meta-icon {
  font-size: 12px;
}

.no-results {
  padding: 48px 24px;
  text-align: center;
  color: var(--vp-c-text-2);
}

.no-results p {
  margin: 8px 0;
}

.no-results .hint {
  font-size: 13px;
  color: var(--vp-c-text-3);
}

/* 当前文件 */
.current-file {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  background: var(--vp-c-bg-soft);
  border-radius: 6px;
  margin-bottom: 16px;
  font-size: 14px;
  color: var(--vp-c-text-2);
}

.unsaved-indicator {
  color: #ef4444;
  font-weight: 600;
  margin-left: auto;
}

/* 编辑器主体 */
.editor-main {
  background: var(--vp-c-bg);
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  overflow: hidden;
}

.editor-split {
  display: grid;
  grid-template-columns: 1fr 1fr;
  height: calc(100vh - 300px);
  min-height: 600px;
}

.editor-pane,
.preview-pane {
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.editor-pane {
  border-right: 1px solid var(--vp-c-divider);
}

.pane-header {
  padding: 12px 16px;
  background: var(--vp-c-bg-soft);
  border-bottom: 1px solid var(--vp-c-divider);
  font-weight: 600;
  font-size: 14px;
  color: var(--vp-c-text-1);
}

.editor-textarea {
  flex: 1;
  padding: 16px;
  border: none;
  outline: none;
  font-family: 'JetBrains Mono', 'Fira Code', Consolas, Monaco, monospace;
  font-size: 14px;
  line-height: 1.6;
  color: var(--vp-c-text-1);
  background: var(--vp-c-bg);
  resize: none;
}

.preview-content {
  flex: 1;
  padding: 16px;
  overflow-y: auto;
  color: var(--vp-c-text-1);
  line-height: 1.7;
}

/* 预览内容样式 */
.preview-content :deep(h1),
.preview-content :deep(h2),
.preview-content :deep(h3) {
  margin-top: 24px;
  margin-bottom: 16px;
  font-weight: 600;
  line-height: 1.25;
}

.preview-content :deep(h1) {
  font-size: 2em;
  border-bottom: 1px solid var(--vp-c-divider);
  padding-bottom: 8px;
}

.preview-content :deep(h2) {
  font-size: 1.5em;
}

.preview-content :deep(h3) {
  font-size: 1.25em;
}

.preview-content :deep(p) {
  margin-bottom: 16px;
}

.preview-content :deep(code) {
  background: var(--vp-c-bg-soft);
  padding: 2px 6px;
  border-radius: 4px;
  font-family: 'JetBrains Mono', 'Fira Code', Consolas, Monaco, monospace;
  font-size: 0.9em;
}

.preview-content :deep(pre) {
  background: #1e1e1e;
  padding: 16px;
  border-radius: 6px;
  overflow-x: auto;
  margin-bottom: 16px;
}

.preview-content :deep(pre code) {
  background: none;
  padding: 0;
  color: #d4d4d4;
}

.preview-content :deep(img) {
  max-width: 100%;
  border-radius: 6px;
}

/* 消息提示 */
.message {
  position: fixed;
  top: 80px;
  right: 24px;
  padding: 12px 20px;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  animation: slideIn 0.3s ease;
  z-index: 1000;
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

/* 对话框 */
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
  max-height: 80vh;
  overflow: auto;
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

.form-input,
.form-select {
  width: 100%;
  padding: 10px 12px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 6px;
  background: var(--vp-c-bg);
  color: var(--vp-c-text-1);
  font-size: 14px;
}

.form-input:focus,
.form-select:focus {
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

.form-info {
  padding: 12px;
  background: var(--vp-c-bg-soft);
  border-radius: 6px;
  font-size: 13px;
  color: var(--vp-c-text-2);
}

.form-info code {
  background: var(--vp-c-bg-alt);
  padding: 2px 6px;
  border-radius: 3px;
  font-family: monospace;
  color: var(--vp-c-brand);
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  padding: 16px 20px;
  border-top: 1px solid var(--vp-c-divider);
}

.btn-icon {
  padding: 8px 12px;
  border: 1px solid var(--vp-c-divider);
  background: var(--vp-c-bg);
  color: var(--vp-c-text-2);
  border-radius: 6px;
  cursor: pointer;
  font-size: 16px;
  transition: all 0.2s;
}

.btn-icon:hover {
  background: var(--vp-c-bg-alt);
  border-color: var(--vp-c-brand);
  color: var(--vp-c-brand);
}

@media (max-width: 768px) {
  .editor-split {
    grid-template-columns: 1fr;
  }

  .editor-pane {
    border-right: none;
    border-bottom: 1px solid var(--vp-c-divider);
  }

  .dialog-content {
    width: 95%;
    max-width: none;
  }
}
</style>
