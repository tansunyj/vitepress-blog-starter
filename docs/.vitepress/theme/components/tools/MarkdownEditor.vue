<script setup lang="ts">
import { MdEditor } from 'md-editor-v3'
import { computed, nextTick, onBeforeUnmount, onMounted, ref } from 'vue'
import ConfirmDialog from './ConfirmDialog.vue'

import FileTree from './FileTree.vue'

import 'md-editor-v3/lib/style.css'

const content = ref('')
const currentFile = ref('')
const fileTree = ref([])
// const showFileSelector = ref(false) // Removed
const message = ref('')
const messageType = ref('success')
// const searchKeyword = ref('') // Removed
const showSidebar = ref(true)

// 文章元数据字段
const articleTitle = ref('新文章标题')
const articleDescription = ref('文章描述')
const articleAuthor = ref('杰哥')

// 编辑器内容：只包含正文，不包含 frontmatter
const editorContent = computed({
  get() {
    const match = content.value.match(/^---\n[\s\S]*?\n---\n?/)
    if (match) {
      let body = content.value.substring(match[0].length)
      // 删除开头多余的空行或单独的 #
      body = body.replace(/^\s*#\s*\n/, '')
      return body
    }
    return content.value
  },
  set(newValue) {
    // 更新正文内容，保留 frontmatter
    const match = content.value.match(/^---\n[\s\S]*?\n---\n?/)
    if (match) {
      content.value = match[0] + (match[0].endsWith('\n') ? '' : '\n') + newValue
    }
    else {
      content.value = newValue
    }
  },
})
const showSaveDialog = ref(false)
const showPublishDialog = ref(false)
const saveFileName = ref('')
const saveCategory = ref('')
const categories = ref([])
// const activeTab = ref('published') // Removed
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

// 封面图片相关
const coverImage = ref('') // 当前封面图片 URL
const selectedCoverFile = ref(null) // 选中的封面文件
const uploadingCover = ref(false) // 上传中状态
const coverFileInput = ref(null) // 封面文件输入引用

// 标签管理相关
const availableTags = ref([]) // 所有可用标签
const selectedTags = ref([]) // 当前选中的标签
const showTagSelector = ref(false) // 显示标签选择器
const autoSaveTimer = ref(null) // 自动保存定时器
const lastAutoSaveTime = ref(0) // 上次自动保存时间

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

// 计算保存按钮是否可用
const canSave = computed(() => {
  // 文件选择器显示时不能保存 - Removed
  // if (showFileSelector.value) {
  //   return false
  // }
  // 内容为空不能保存
  if (!content.value.trim()) {
    return false
  }
  return true
})

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
    categories.value = cats

    if (cats.length === 0) {
      showMessage('未找到发布分类', 'warning')
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

    // 先关闭文件选择器 - Removed
    // showFileSelector.value = false

    // 等待DOM更新后设置内容
    await nextTick()

    content.value = data.content
    currentFile.value = filepath
    isDraft.value = true // 草稿箱始终是草稿模式
    currentDraftId.value = filepath.replace('.md', '')
    
    // 提取封面图片和标签
    extractCoverFromContent()
    extractTagsFromContent()

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
        // showFileSelector.value = false - Removed
        
        // 提取封面图片和标签
        extractCoverFromContent()
        extractTagsFromContent()

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

// 从内容中提取封面图片
function extractCoverFromContent() {
  const match = content.value.match(/cover:\s*(.+)/i)
  if (match) {
    const extracted = match[1].trim()
    // 只有真正有内容时才设置，避免空字符串
    coverImage.value = extracted || ''
  }
  else {
    coverImage.value = ''
  }
}

// 处理封面图片加载错误
function handleCoverImageError() {
  // 只有在用户已经设置了封面图片的情况下才提示
  if (coverImage.value && coverImage.value.trim() !== '') {
    // 图片加载失败，清空coverImage以显示占位符
    coverImage.value = ''
    showMessage('封面图片加载失败，请重新上传', 'warning')
  }
}

// 处理封面文件选择
async function handleCoverFileSelect(event) {
  const file = event.target.files?.[0]
  if (file) {
    selectedCoverFile.value = file
    // 创建预览URL
    const reader = new FileReader()
    reader.onload = (e) => {
      coverImage.value = e.target.result
    }
    reader.readAsDataURL(file)
    
    // 自动上传封面
    await uploadCoverImage()
  }
}

// 上传封面图片
async function uploadCoverImage() {
  if (!selectedCoverFile.value) {
    showMessage('❌ 请先选择封面图片', 'error')
    return
  }

  uploadingCover.value = true

  try {
    const formData = new FormData()
    formData.append('cover', selectedCoverFile.value)

    // 发送草稿ID，后端会使用它命名封面文件
    const draftId = currentDraftId.value || `${Date.now()}`
    formData.append('draftId', draftId)
    console.log('[uploadCoverImage] 上传封面，草稿ID:', draftId)

    const response = await fetch('http://localhost:3456/api/upload/cover', {
      method: 'POST',
      body: formData,
    })

    const data = await response.json()

    if (data.success) {
      const coverUrl = data.path
      coverImage.value = coverUrl
      console.log('[uploadCoverImage] 封面URL:', coverUrl)

      // 更新 frontmatter 中的 cover 字段
      updateCoverInContent(coverUrl)

      selectedCoverFile.value = null
      showMessage('✅ 封面上传成功！', 'success')
    }
    else {
      showMessage(`❌ 上传失败: ${data.error}`, 'error')
    }
  }
  catch (error) {
    showMessage(`❌ 上传失败: ${error.message}`, 'error')
  }
  finally {
    uploadingCover.value = false
  }
}

// 更新内容中的 cover 字段
function updateCoverInContent(coverUrl) {
  const yamlMatch = content.value.match(/^---\n([\s\S]*?)\n---/)
  if (yamlMatch) {
    let yaml = yamlMatch[1]

    // 检查是否已有 cover 字段（包括空值）
    if (yaml.match(/cover:/i)) {
      // 替换现有的 cover（包括 "cover: " 这种空值）
      // 使用 [^\n]* 只匹配到行尾，不包括换行符
      yaml = yaml.replace(/cover:\s*[^\n]*/i, `cover: ${coverUrl}`)
    }
    else {
      // 在 author 后面添加 cover 字段
      if (yaml.match(/author:/i)) {
        yaml = yaml.replace(/author:.*\n/, match => `${match}cover: ${coverUrl}\n`)
      }
      else {
        yaml = yaml.replace(/description:.*\n/, match => `${match}cover: ${coverUrl}\n`)
      }
    }

    content.value = content.value.replace(/^---\n[\s\S]*?\n---/, `---\n${yaml}\n---`)
  }
}

// 格式化日期为 yyyy-MM-dd HH:mm:ss
function formatDateTime(date) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')
  const seconds = String(date.getSeconds()).padStart(2, '0')
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`
}

// 生成安全的文件名（基于文章标题）
function generateFileName(title) {
  // 如果标题为空或者是默认标题，使用时间戳
  if (!title || title.trim() === '' || title === '新文章标题') {
    return `article-${Date.now()}.md`
  }

  // 清理标题，移除或替换不安全的文件名字符
  let safeName = title.trim()
    .replace(/[\\/:*?"<>|]/g, '-') // 替换Windows文件名非法字符
    .replace(/\s+/g, '-') // 空格替换为连字符
    .replace(/-+/g, '-') // 多个连字符合并为一个
    .replace(/^-+|-+$/g, '') // 移除首尾连字符

  // 限制文件名长度（避免过长）
  if (safeName.length > 50) {
    safeName = safeName.substring(0, 50)
  }

  // 如果清理后为空，使用时间戳
  if (!safeName) {
    return `article-${Date.now()}.md`
  }

  return `${safeName}.md`
}

// 更新内容中的 date 字段为当前时间
function updateDateInContent() {
  const yamlMatch = content.value.match(/^---\n([\s\S]*?)\n---/)
  if (yamlMatch) {
    let yaml = yamlMatch[1]
    const currentDate = formatDateTime(new Date())

    // 检查是否已有 date 字段
    if (yaml.match(/date:/i)) {
      // 替换现有的 date
      yaml = yaml.replace(/date:\s*.+/i, `date: ${currentDate}`)
    }
    else {
      // 在 description 后面添加 date 字段
      yaml = yaml.replace(/description:.*\n/, match => `${match}date: ${currentDate}\n`)
    }

    content.value = content.value.replace(/^---\n[\s\S]*?\n---/, `---\n${yaml}\n---`)
  }
}

// 将一级标题转换为二级标题（发布时使用）
function convertH1ToH2() {
  // 分离 frontmatter 和正文
  const match = content.value.match(/^---\n[\s\S]*?\n---\n?/)
  if (!match)
    return

  const frontmatter = match[0]
  let body = content.value.substring(frontmatter.length)

  // 将所有一级标题 # 转换为二级标题 ##
  // 匹配行首的 # (后面必须有空格或直接换行)
  body = body.replace(/^# (.*)$/gm, '## $1')

  content.value = frontmatter + body
  console.warn('[MarkdownEditor] 已将一级标题转换为二级标题')
}

// 规范化文件末尾的换行符（确保有且只有一个换行符）
function normalizeFileEnding() {
  // 移除末尾所有的空白字符（包括多余的换行符）
  content.value = content.value.trimEnd()
  // 在末尾添加一个换行符
  content.value += '\n'
  console.warn('[MarkdownEditor] 已规范化文件末尾换行符')
}

// 转换图片URL，使编辑器预览能正确显示图片
function transformImgUrl(url: string) {
  // 如果是以 / 开头的绝对路径，添加当前页面的 origin
  if (url.startsWith('/')) {
    return `${window.location.origin}${url}`
  }
  return url
}

// 自动保存草稿（静默模式）
async function autoSaveDraft() {
  // 检查是否有内容需要保存
  if (!content.value.trim() || !isDraft.value) {
    return
  }

  // 调用 saveDraft，传入静默模式参数
  await saveDraft(true)
}

// 保存草稿
// @param isAutoSave - 是否是自动保存（静默模式，不显示成功提示）
async function saveDraft(isAutoSave = false) {
  console.warn('[MarkdownEditor] saveDraft调用, 当前状态:', {
    // showFileSelector: showFileSelector.value,
    contentLength: content.value.length,
    hasContent: !!content.value.trim(),
    canSave: canSave.value,
    isAutoSave,
  })

  // 检查是否可以保存
  // if (showFileSelector.value) {
  //   showMessage('请先关闭文件选择器或打开一个文件', 'warning')
  //   return false
  // }

  if (!content.value.trim()) {
    if (!isAutoSave) {
      showMessage('内容为空，无法保存', 'error')
    }
    return false
  }

  // 如果已选择封面但未上传，先上传封面
  if (selectedCoverFile.value && !uploadingCover.value) {
    console.warn('[MarkdownEditor] 检测到未上传的封面，自动上传中...')
    await uploadCoverImage()
  }

  // 保存前更新所有元数据到 frontmatter
  updateMetadataInContent()

  let filename = currentFile.value
  if (!filename || !isDraft.value) {
    // 新建草稿，使用文章标题生成文件名
    const draftName = generateFileName(articleTitle.value)
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

  // 显示保存中提示（使用 key 以便后续更新）
  // 自动保存时不显示提示
  if (!isAutoSave && window.$toast) {
    window.$toast('正在保存草稿...', 'info', 3000, 'save-draft')
  }

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
      // 记录自动保存时间
      if (isAutoSave) {
        lastAutoSaveTime.value = Date.now()
      }
      // 更新为成功提示（使用相同的 key，会替换掉"保存中"的提示）
      // 自动保存时不显示成功提示
      if (!isAutoSave && window.$toast) {
        window.$toast('草稿保存成功！', 'success', 3000, 'save-draft')
      }
      // 刷新文档树以显示新保存的文件
      loadFileTree()
      return true
    }
    else {
      // 更新为失败提示
      if (window.$toast) {
        window.$toast(`保存失败: ${data.error || '未知错误'}`, 'error', 3000, 'save-draft')
      }
      return false
    }
  }
  catch (error) {
    // 更新为失败提示
    if (window.$toast) {
      window.$toast(`保存失败: ${error.message}`, 'error', 3000, 'save-draft')
    }
    console.error('[MarkdownEditor] Save draft error:', error)
    return false
  }
}

// 图片上传处理函数（md-editor-v3使用）
async function handleUploadImage(files: File[], callback: (urls: string[]) => void) {
  if (!files || files.length === 0) {
    return
  }

  // 如果不是草稿，先保存为草稿
  if (!isDraft.value) {
    await saveDraft()
  }

  const uploadPromises = files.map(async (file) => {
    const formData = new FormData()
    formData.append('image', file)

    try {
      const response = await fetch('http://localhost:3456/api/upload/image', {
        method: 'POST',
        body: formData,
      })

      const data = await response.json()
      if (data.success) {
        return data.url
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
  })

  const urls = await Promise.all(uploadPromises)
  const successUrls = urls.filter(url => url !== '')
  
  if (successUrls.length > 0) {
    showMessage(`✅ 成功上传 ${successUrls.length} 张图片！`, 'success')
    callback(successUrls)
  }
}

// 打开发布对话框
async function openPublishDialog() {
  // 发布前先保存草稿，确保所有修改（包括标签、封面等）都被保存
  showMessage('正在保存修改...', 'info')
  const saved = await saveDraft()
  if (!saved) {
    showMessage('保存失败，无法发布', 'error')
    return
  }

  if (!isDraft.value) {
    showMessage('请先保存为草稿', 'error')
    return
  }

  // 从保存后的内容中重新提取标签，确保数据同步
  extractMetadataFromContent()

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

  // 检查是否选择了标签
  if (selectedTags.value.length === 0) {
    showMessage('⚠️ 请至少选择一个标签', 'warning')
    return
  }

  // 如果已选择封面但未上传，先上传封面
  if (selectedCoverFile.value && !uploadingCover.value) {
    console.warn('[MarkdownEditor] 发布前检测到未上传的封面，自动上传中...')
    showMessage('正在上传封面...', 'info')
    await uploadCoverImage()
  }

  // 更新日期为当前时间
  updateDateInContent()

  // 将一级标题转换为二级标题（VitePress需要二级标题才能生成目录）
  convertH1ToH2()

  // 规范化文件末尾换行符（确保有且只有一个换行符）
  normalizeFileEnding()

  // 保存更新后的内容到草稿
  const saved = await saveDraft()
  if (!saved) {
    showMessage('更新日期失败', 'error')
    return
  }

  let filename = saveFileName.value.trim()
  if (!filename.endsWith('.md')) {
    filename += '.md'
  }

  const targetPath = `${saveCategory.value}/${filename}`
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
      // 使用 Toast key 更新提示
      if (window.$toast) {
        window.$toast('✅ 发布成功！\n\n📌 下一步操作：\n1️⃣ 重启服务查看本地效果（可选）\n2️⃣ 运行推送脚本部署到线上：\n   • Windows: 双击 推送文章.bat\n   • Linux/Mac: 运行 ./推送文章.sh', 'success', 8000, 'publish-article')
      }

      // 清空当前编辑的内容
      content.value = ''
      currentFile.value = ''
      isDraft.value = false
      coverImage.value = ''

      // 重新加载文档树
      loadFileTree()
    }
    else {
      if (window.$toast) {
        window.$toast(`❌ 发布失败: ${data.error}`, 'error', 3000, 'publish-article')
      }
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
  // 先关闭文件选择器 - Removed
  // showFileSelector.value = false

  // 使用nextTick确保DOM更新后再设置内容
  nextTick(() => {
    content.value = `---
title: 新文章标题
description: 文章描述
date: ${formatDateTime(new Date())}
author: 杰哥
cover:
---

# 新文章

在这里输入内容...
`
    currentFile.value = ''
    isDraft.value = true // 新建默认为草稿
    // 为新文章生成草稿ID（用于封面命名）
    currentDraftId.value = `draft-${Date.now()}`

    // 清空封面和标签
    coverImage.value = ''
    selectedTags.value = []

    console.warn('[MarkdownEditor] createNew完成, state:', {
      contentLength: content.value.length,
      // showFileSelector: showFileSelector.value,
      isDraft: isDraft.value,
      canSave: content.value.trim(), // && !showFileSelector.value,
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
  showConfirm(
    '删除草稿',
    `确定要删除草稿"${filepath}"吗？`,
    async () => {
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
    },
    'danger'
  )
}

// 删除文件夹
async function deleteFolder(folderPath) {
  showConfirm(
    '删除文件夹',
    `确定要删除文件夹"${folderPath}"及其所有内容吗？`,
    async () => {
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
    },
    'danger'
  )
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

// 修复 YAML 格式
async function fixYamlFormat() {
  showConfirm(
    '修复 YAML 格式',
    '确定要修复所有草稿的 YAML frontmatter 吗？\n\n这将为所有字段值添加引号，避免包含特殊字符（如 # : - 等）时的解析错误。',
    async () => {
      showMessage('正在修复...', 'info')

      try {
        const response = await fetch('http://localhost:3456/api/drafts/fix-yaml', {
          method: 'POST',
        })

        if (!response.ok) {
          throw new Error(`HTTP错误: ${response.status}`)
        }

        const data = await response.json()

        if (data.success) {
          let message = data.message
          if (data.fixed && data.fixed.length > 0) {
            message += `\n\n修复的文件：\n${data.fixed.join('\n')}`
          }
          showMessage(message, 'success')
          // 重新加载文件树
          loadFileTree()
        }
        else {
          showMessage(`修复失败: ${data.error}`, 'error')
        }
      }
      catch (error) {
        showMessage(`修复失败: ${error.message}`, 'error')
      }
    },
    'info'
  )
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

// 加载所有可用标签
async function loadAvailableTags() {
  try {
    const response = await fetch('http://localhost:3456/api/tags')
    const data = await response.json()
    if (data.success) {
      availableTags.value = data.tags
    }
  }
  catch (error) {
    console.error('加载标签失败:', error)
  }
}

// 从 frontmatter 中提取所有元数据
function extractMetadataFromContent() {
  const yamlMatch = content.value.match(/^---\n([\s\S]*?)\n---/)
  if (yamlMatch) {
    const yaml = yamlMatch[1]

    // 提取 title
    const titleMatch = yaml.match(/title:\s*["']?(.*?)["']?\n/)
    if (titleMatch) {
      articleTitle.value = titleMatch[1].trim()
    }

    // 提取 description
    const descMatch = yaml.match(/description:\s*["']?(.*?)["']?\n/)
    if (descMatch) {
      articleDescription.value = descMatch[1].trim()
    }

    // 提取 author
    const authorMatch = yaml.match(/author:\s*["']?(.*?)["']?\n/)
    if (authorMatch) {
      articleAuthor.value = authorMatch[1].trim()
    }

    // 提取 tags（改进的正则，支持更多格式）
    selectedTags.value = []
    const tagsMatch = yaml.match(/tags:\s*\n((?:\s+-\s+.+\n?)+)/)
    if (tagsMatch) {
      const tagsList = tagsMatch[1].match(/^\s*-\s+(.+)$/gm)
      if (tagsList && tagsList.length > 0) {
        selectedTags.value = tagsList.map(t => t.replace(/^\s*-\s+/, '').trim())
      }
    }

    console.warn('[MarkdownEditor] 提取元数据完成:', {
      title: articleTitle.value,
      description: articleDescription.value,
      author: articleAuthor.value,
      tags: selectedTags.value,
    })
  }
}

// 从 frontmatter 中提取标签（向后兼容）
function extractTagsFromContent() {
  extractMetadataFromContent()
}

// 更新所有元数据到 frontmatter
function updateMetadataInContent() {
  // 清理所有字段的前后空格
  const cleanTitle = articleTitle.value.trim()
  const cleanDescription = articleDescription.value.trim()
  const cleanAuthor = articleAuthor.value.trim()
  const cleanCover = coverImage.value.trim()
  const cleanTags = selectedTags.value.map(t => t.trim()).filter(t => t)

  console.warn('[MarkdownEditor] 更新元数据:', {
    cleanTitle,
    cleanDescription,
    cleanAuthor,
    cleanCover,
    cleanTags,
    selectedTagsRaw: selectedTags.value,
  })

  const yamlMatch = content.value.match(/^---\n([\s\S]*?)\n---/)
  if (yamlMatch) {
    let yaml = yamlMatch[1]

    // 更新 title
    if (yaml.match(/title:/i)) {
      yaml = yaml.replace(/title:\s*.+/i, `title: ${cleanTitle}`)
    }
    else {
      yaml = `title: ${cleanTitle}\n` + yaml
    }

    // 更新 description
    if (yaml.match(/description:/i)) {
      yaml = yaml.replace(/description:\s*.+/i, `description: ${cleanDescription}`)
    }
    else {
      yaml = yaml.replace(/title:.*\n/, match => `${match}description: ${cleanDescription}\n`)
    }

    // 更新 author
    if (yaml.match(/author:/i)) {
      yaml = yaml.replace(/author:\s*.+/i, `author: ${cleanAuthor}`)
    }
    else {
      yaml = yaml.replace(/description:.*\n/, match => `${match}author: ${cleanAuthor}\n`)
    }

    // 更新 tags
    yaml = yaml.replace(/tags:\s*\n((?:\s+-\s+.+\n?)+)/, '')
    
    console.warn('[MarkdownEditor] 准备更新 tags:', {
      cleanTagsLength: cleanTags.length,
      cleanTags,
      hasCover: yaml.match(/cover:/i) !== null,
      hasAuthor: yaml.match(/author:/i) !== null,
    })
    
    if (cleanTags.length > 0) {
      const tagsYaml = 'tags:\n' + cleanTags.map(t => `  - ${t}`).join('\n')
      console.warn('[MarkdownEditor] 生成的 tagsYaml:', tagsYaml)

      if (yaml.match(/cover:/i)) {
        const oldYaml = yaml
        // 修复：cover 后面可能没有换行符，在 yaml 末尾
        yaml = yaml.replace(/cover:\s*[^\n]*/, match => `${match}\n${tagsYaml}`)
        console.warn('[MarkdownEditor] cover 分支执行:', {
          replaced: oldYaml !== yaml,
          oldYaml,
          newYaml: yaml,
        })
      }
      else if (yaml.match(/author:/i)) {
        yaml = yaml.replace(/author:\s*[^\n]*/, match => `${match}\n${tagsYaml}`)
        console.warn('[MarkdownEditor] author 分支执行')
      }
      else {
        yaml += '\n' + tagsYaml
        console.warn('[MarkdownEditor] 追加到末尾')
      }
    }
    else {
      console.warn('[MarkdownEditor] ⚠️ cleanTags 为空，跳过 tags 更新')
    }

    content.value = content.value.replace(/^---\n[\s\S]*?\n---/, `---\n${yaml}\n---`)
  }
  else {
    // 没有 frontmatter，创建新的
    const date = formatDateTime(new Date())
    let frontmatter = `---\ntitle: ${cleanTitle}\ndescription: ${cleanDescription}\ndate: ${date}\nauthor: ${cleanAuthor}\n`
    if (cleanCover) {
      frontmatter += `cover: ${cleanCover}\n`
    }
    if (cleanTags.length > 0) {
      frontmatter += `tags:\n${cleanTags.map(t => `  - ${t}`).join('\n')}\n`
    }
    frontmatter += `---\n`
    content.value = frontmatter + content.value
  }
}

// 更新 frontmatter 中的标签（向后兼容）
function updateTagsInContent() {
  const yamlMatch = content.value.match(/^---\n([\s\S]*?)\n---/)
  if (yamlMatch) {
    let yaml = yamlMatch[1]
    
    // 移除旧的 tags 字段
    yaml = yaml.replace(/tags:\s*\n((?:\s+-\s+.+\n?)+)/, '')
    
    // 添加新的 tags 字段
    if (selectedTags.value.length > 0) {
      const tagsYaml = 'tags:\n' + selectedTags.value.map(t => `  - ${t}`).join('\n') + '\n'
      // 在 cover 后面添加 tags
      if (yaml.match(/cover:/i)) {
        yaml = yaml.replace(/cover:\s*[^\n]*\n/, match => `${match}${tagsYaml}`)
      }
      else if (yaml.match(/author:/i)) {
        yaml = yaml.replace(/author:.*\n/, match => `${match}${tagsYaml}`)
      }
      else {
        yaml = yaml.replace(/description:.*\n/, match => `${match}${tagsYaml}`)
      }
    }
    
    content.value = content.value.replace(/^---\n[\s\S]*?\n---/, `---\n${yaml}\n---`)
  }
}

// 切换标签选择
function toggleTag(tag) {
  const index = selectedTags.value.indexOf(tag)
  if (index > -1) {
    selectedTags.value.splice(index, 1)
  }
  else {
    selectedTags.value.push(tag)
  }
  // 更新 frontmatter
  updateTagsInContent()
}

// 移除标签
function removeTag(tag) {
  const index = selectedTags.value.indexOf(tag)
  if (index > -1) {
    selectedTags.value.splice(index, 1)
    updateTagsInContent()
  }
}

// 快捷键
function handleKeydown(e) {
  if ((e.ctrlKey || e.metaKey) && e.key === 's') {
    e.preventDefault()
    saveDraft()
  }
}

// 处理图片上传
async function onUploadImg(files: File[], callback: (urls: string[]) => void) {
  const res = await Promise.all(
    files.map((file) => {
      return new Promise((resolve, reject) => {
        const form = new FormData()
        form.append('image', file)

        // 使用 fetch-server.js 提供的API
        fetch('http://localhost:3456/api/upload/image', {
          method: 'POST',
          body: form,
        })
          .then(res => res.json())
          .then((res) => {
            if (res.success) {
              resolve(res.url)
            }
            else {
              reject(res.error)
            }
          })
          .catch((err) => {
            console.error(err)
            reject('上传失败')
          })
      })
    }),
  )

  callback(res.map((item: any) => item))
}

// 监听快捷键
onMounted(() => {
  // loadFiles()
  // loadDrafts()
  loadFileTree()
  loadAvailableTags()
  window.addEventListener('keydown', handleKeydown)

  // 启动自动保存定时器（每30秒）
  autoSaveTimer.value = setInterval(() => {
    autoSaveDraft()
  }, 30000) // 30秒 = 30000毫秒

  console.warn('✅ 自动保存已启动（每30秒）')
})

// 组件卸载时清除定时器
onBeforeUnmount(() => {
  if (autoSaveTimer.value) {
    clearInterval(autoSaveTimer.value)
    autoSaveTimer.value = null
    console.warn('🛑 自动保存已停止')
  }
  window.removeEventListener('keydown', handleKeydown)
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
          <!-- <button class="btn-primary" @click="showFileSelector = !showFileSelector">
            📂 打开草稿
          </button> -->
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
          <div class="sidebar-actions">
            <button class="btn-icon" title="修复 YAML 格式" @click="fixYamlFormat">
              🔧
            </button>
            <button class="btn-icon" title="新建文件夹" @click="openCreateFolderDialog">
              📁+
            </button>
          </div>
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
        <!-- 编辑器区域 -->
        <div class="editor-wrapper">
          <!-- 文章元数据表单 -->
          <div v-if="content" class="article-metadata-form">
            <div class="form-row">
              <div class="form-field">
                <label class="form-label">📝 文章标题</label>
                <input
                  v-model="articleTitle"
                  type="text"
                  class="form-input-text"
                  placeholder="请输入文章标题"
                >
              </div>
              <div class="form-field">
                <label class="form-label">✍️ 作者</label>
                <input
                  v-model="articleAuthor"
                  type="text"
                  class="form-input-text"
                  placeholder="请输入作者名称"
                >
              </div>
            </div>
            <div class="form-row">
              <div class="form-field full-width">
                <label class="form-label">📄 文章描述</label>
                <textarea
                  v-model="articleDescription"
                  class="form-textarea"
                  placeholder="请输入文章描述"
                  rows="2"
                />
              </div>
            </div>
          </div>

          <!-- 封面和标签区域 - 横向布局 -->
          <div v-if="content" class="file-and-cover-section">
            <!-- 左侧：封面图片 -->
            <div class="cover-upload-area">
              <input
                ref="coverFileInput"
                type="file"
                accept="image/*"
                style="display: none"
                @change="handleCoverFileSelect"
              >
              <div
                v-if="coverImage && coverImage.trim()"
                class="cover-preview clickable"
                title="点击更换封面"
                @click="coverFileInput?.click()"
              >
                <img
                  :src="coverImage"
                  alt="封面预览"
                  class="cover-image"
                  @error="handleCoverImageError"
                >
                <div class="cover-overlay">
                  <span class="overlay-text">点击更换</span>
                </div>
              </div>
              <div
                v-else
                class="cover-placeholder clickable"
                title="点击上传封面"
                @click="coverFileInput?.click()"
              >
                <span class="placeholder-icon">🖼️</span>
                <span class="placeholder-text">点击上传封面</span>
              </div>
            </div>

            <!-- 右侧：标签管理区域 -->
            <div class="tags-management-area">
              <button class="btn-manage-tags" @click="showTagSelector = true">
                🏷️ 管理标签 ({{ selectedTags.length }})
              </button>
              <div v-if="selectedTags.length > 0" class="selected-tags-display">
                <span
                  v-for="tag in selectedTags"
                  :key="tag"
                  class="tag-badge"
                >
                  {{ tag }}
                  <button class="tag-remove" @click="removeTag(tag)">×</button>
                </span>
              </div>
            </div>
          </div>

          <!-- Markdown编辑器 -->
          <MdEditor
            v-model="editorContent"
            language="zh-CN"
            :preview="true"
            :transform-img-url="transformImgUrl"
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
          <button type="button" class="btn-secondary" @click="cancelSave">
            取消
          </button>
          <button type="button" class="btn-success" @click="confirmSave">
            确认保存
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
          <button type="button" class="btn-secondary" @click="cancelPublish">
            取消
          </button>
          <button type="button" class="btn-success" @click="confirmPublish">
            确认发布
          </button>
        </div>
      </div>
    </div>

    <!-- 标签选择器对话框 -->
    <div v-if="showTagSelector" class="dialog-overlay" @click="showTagSelector = false">
      <div class="dialog-content" @click.stop>
        <div class="dialog-header">
          <h3>🏷️ 选择标签</h3>
        </div>
        <div class="dialog-body">
          <div class="tag-selector-grid">
            <label
              v-for="tag in availableTags"
              :key="tag"
              class="tag-option"
              :class="{ active: selectedTags.includes(tag) }"
            >
              <input
                type="checkbox"
                :checked="selectedTags.includes(tag)"
                @change="toggleTag(tag)"
              >
              <span>{{ tag }}</span>
            </label>
          </div>
          <div v-if="availableTags.length === 0" class="empty-tags">
            暂无可用标签，请先在
            <a href="/tools/admin" target="_blank">标签管理</a>
            中添加标签
          </div>
        </div>
        <div class="dialog-footer">
          <button type="button" class="btn-secondary" @click="showTagSelector = false">
            关闭
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
          <button type="button" class="btn-secondary" @click="cancelCreateFolder">
            取消
          </button>
          <button type="button" class="btn-success" @click="confirmCreateFolder">
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
          <button type="button" class="btn-secondary" @click="cancelRename">
            取消
          </button>
          <button type="button" class="btn-success" @click="confirmRename">
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
  margin-top: 4px; /* Move buttons down slightly */
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

.sidebar-actions {
  display: flex;
  gap: 8px;
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

/* 文章元数据表单 */
.article-metadata-form {
  padding: 16px;
  background: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  margin-bottom: 16px;
}

.form-row {
  display: flex;
  gap: 16px;
  margin-bottom: 12px;
}

.form-row:last-child {
  margin-bottom: 0;
}

.form-field {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.form-field.full-width {
  width: 100%;
}

.form-label {
  font-size: 13px;
  font-weight: 500;
  color: var(--vp-c-text-2);
}

.form-input-text {
  padding: 8px 12px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 6px;
  background: var(--vp-c-bg);
  color: var(--vp-c-text-1);
  font-size: 14px;
  transition: all 0.2s;
}

.form-input-text:focus {
  outline: none;
  border-color: var(--vp-c-brand);
  box-shadow: 0 0 0 3px var(--vp-c-brand-soft);
}

.form-textarea {
  padding: 8px 12px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 6px;
  background: var(--vp-c-bg);
  color: var(--vp-c-text-1);
  font-size: 14px;
  font-family: inherit;
  resize: vertical;
  transition: all 0.2s;
}

.form-textarea:focus {
  outline: none;
  border-color: var(--vp-c-brand);
  box-shadow: 0 0 0 3px var(--vp-c-brand-soft);
}

/* 文件信息和封面区域 - 横向布局 */
.file-and-cover-section {
  display: flex;
  gap: 24px;
  padding: 16px;
  background: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  margin-bottom: 16px;
  align-items: flex-start;
  justify-content: flex-start;
}

/* 左侧区域 - 文件信息和标签 */
.left-section {
  display: flex;
  flex-direction: column;
  gap: 12px;
  min-width: 300px;
  max-width: 450px;
  flex-shrink: 0;
  padding-right: 24px;
  border-right: 1px solid var(--vp-c-divider);
}

/* 当前文件 */
.current-file {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  color: var(--vp-c-text-2);
}

.unsaved-indicator {
  color: #ef4444;
  font-weight: 600;
  margin-left: auto;
}

/* 封面上传区域 - 左侧 */
.cover-upload-area {
  flex-shrink: 0;
}

/* 标签管理区域 - 右侧 */
.tags-management-area {
  flex: 1;
  display: flex;
  align-items: flex-start;
  gap: 12px;
  flex-wrap: wrap;
}

.cover-preview {
  flex-shrink: 0;
  width: 150px;
  height: 90px;
  border-radius: 6px;
  overflow: hidden;
  background: var(--vp-c-bg-alt);
  border: 1px solid var(--vp-c-divider);
  position: relative;
}

.cover-preview.clickable {
  cursor: pointer;
  transition: all 0.3s ease;
}

.cover-preview.clickable:hover {
  transform: scale(1.02);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  border-color: var(--vp-c-brand);
}

.cover-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.cover-preview.clickable:hover .cover-overlay {
  opacity: 1;
}

.overlay-text {
  color: white;
  font-size: 13px;
  font-weight: 500;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

.cover-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.cover-placeholder {
  flex-shrink: 0;
  width: 150px;
  height: 90px;
  border-radius: 6px;
  background: var(--vp-c-bg-alt);
  border: 1px dashed var(--vp-c-divider);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 4px;
  color: var(--vp-c-text-3);
}

.cover-placeholder.clickable {
  cursor: pointer;
  transition: all 0.3s ease;
}

.cover-placeholder.clickable:hover {
  border-color: var(--vp-c-brand);
  background: var(--vp-c-brand-soft);
  color: var(--vp-c-brand);
  transform: scale(1.02);
}

.placeholder-icon {
  font-size: 24px;
  opacity: 0.5;
}

.placeholder-text {
  font-size: 12px;
}

.cover-actions {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
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

/* 修复预览区域 H1 被全局样式隐藏的问题 */
:deep(.md-editor-preview h1:first-of-type),
:deep(.md-editor-preview-wrapper h1:first-of-type) {
  display: block !important;
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
  max-width: 1000px;
  max-height: 800px;
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

  /* 小屏幕上改为竖向布局 */
  .file-and-cover-section {
    flex-direction: column;
    gap: 16px;
    align-items: flex-start;
  }

  .current-file {
    width: 100%;
    min-width: auto;
    padding-right: 0;
    border-right: none; /* 小屏幕隐藏竖线 */
  }

  .cover-upload-area {
    width: 100%;
    flex-direction: column;
    align-items: flex-start;
  }

  .cover-content {
    width: 100%;
    flex-direction: column;
    align-items: flex-start;
  }

  .cover-preview,
  .cover-placeholder {
    width: 100%;
    max-width: 300px;
  }
}

/* 封面上传区域的分隔符和标签按钮 */
.cover-actions .divider {
  margin: 0 12px;
  color: var(--vp-c-divider);
  font-size: 18px;
}

.btn-manage-tags {
  padding: 8px 16px;
  background: var(--vp-c-bg-soft);
  color: var(--vp-c-text-1);
  border: 1px solid var(--vp-c-divider);
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s;
  font-size: 14px;
}

.btn-manage-tags:hover {
  border-color: var(--vp-c-brand);
  background: var(--vp-c-brand-soft);
  color: var(--vp-c-brand);
}

/* 已选标签显示 - 垂直多列布局，每列最多3个 */
.selected-tags-display {
  display: grid;
  grid-template-rows: repeat(3, auto);
  grid-auto-flow: column;
  grid-auto-columns: max-content;
  gap: 8px 12px;
  flex: 1;
  max-height: 150px;
  overflow-x: auto;
  overflow-y: hidden;
  align-items: start;
}

.tags-label {
  font-size: 14px;
  color: var(--vp-c-text-2);
  font-weight: 500;
}

.tag-badge {
  display: inline-flex;
  align-items: center;
  padding: 4px 8px;
  background: var(--vp-c-brand-soft);
  color: var(--vp-c-brand);
  border-radius: 4px;
  font-size: 13px;
  font-weight: 500;
}

.tag-remove {
  margin-left: 6px;
  background: none;
  border: none;
  color: var(--vp-c-brand);
  cursor: pointer;
  font-size: 16px;
  line-height: 1;
  padding: 0;
  opacity: 0.7;
  transition: opacity 0.2s;
}

.tag-remove:hover {
  opacity: 1;
}

/* 标签选择器对话框 - 自动换行显示标签 */
.tag-selector-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
  gap: 12px;
  margin: 16px 0;
  max-height: 600px;
  overflow-y: auto;
  overflow-x: hidden;
}

.tag-option {
  display: flex;
  align-items: center;
  padding: 10px 12px;
  background: var(--vp-c-bg-soft);
  border: 2px solid var(--vp-c-divider);
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s;
  user-select: none;
}

.tag-option:hover {
  border-color: var(--vp-c-brand);
  background: var(--vp-c-brand-soft);
}

.tag-option.active {
  background: var(--vp-c-brand-soft);
  border-color: var(--vp-c-brand);
}

.tag-option input[type="checkbox"] {
  margin-right: 8px;
  cursor: pointer;
}

.tag-option span {
  font-size: 14px;
  color: var(--vp-c-text-1);
  font-weight: 500;
}

.tag-option.active span {
  color: var(--vp-c-brand);
}

.empty-tags {
  text-align: center;
  padding: 40px 20px;
  color: var(--vp-c-text-2);
}

.empty-tags a {
  color: var(--vp-c-brand);
  text-decoration: none;
}

.empty-tags a:hover {
  text-decoration: underline;
}

/* 标签选择器 */
.tag-selector {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-top: 8px;
}

.tag-checkbox {
  display: inline-flex;
  align-items: center;
  padding: 6px 12px;
  background: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-divider);
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s;
  user-select: none;
}

.tag-checkbox:hover {
  border-color: var(--vp-c-brand);
  background: var(--vp-c-brand-soft);
}

.tag-checkbox input[type="checkbox"] {
  margin-right: 6px;
  cursor: pointer;
}

.tag-checkbox input[type="checkbox"]:checked + span {
  color: var(--vp-c-brand);
  font-weight: 500;
}
</style>
