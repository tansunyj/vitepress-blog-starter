<script setup>
import { onMounted, ref } from 'vue'

const config = ref({
  title: '',
  description: '',
  googleAnalytics: '',
  googleSearchConsole: '',
  googleAdsense: '',
  bannerTitle: '',
  bannerSubtitle: '',
  footerMessage: '',
  footerCopyright: '',
})

// 每个区块的编辑状态
const editingSection = ref({
  basic: false,
  footer: false,
  banner: false,
  google: false,
})

const message = ref('')
const messageType = ref('success')

async function loadConfig() {
  try {
    const response = await fetch('http://localhost:3456/api/config/site')
    const data = await response.json()
    if (data.success) {
      config.value = { ...config.value, ...data.config }
      // 移除成功提示：正常加载不需要提示
    }
  }
  catch (error) {
    showMessage(`❌ 加载失败: ${error.message}`, 'error')
  }
}

// 切换编辑状态
function toggleEdit(section) {
  editingSection.value[section] = !editingSection.value[section]
}

// 保存指定区块的配置
async function saveSectionConfig(section) {
  let dataToSave = {}

  // 根据区块选择要保存的数据
  switch (section) {
    case 'basic':
      dataToSave = {
        title: config.value.title,
        description: config.value.description,
      }
      break
    case 'footer':
      dataToSave = {
        footerMessage: config.value.footerMessage,
        footerCopyright: config.value.footerCopyright,
      }
      break
    case 'banner':
      dataToSave = {
        bannerTitle: config.value.bannerTitle,
        bannerSubtitle: config.value.bannerSubtitle,
        bannerImage: config.value.bannerImage,
      }
      break
    case 'google':
      dataToSave = {
        googleAnalytics: config.value.googleAnalytics,
        googleSearchConsole: config.value.googleSearchConsole,
        googleAdsense: config.value.googleAdsense,
      }
      break
  }

  try {
    const response = await fetch('http://localhost:3456/api/config/site', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(dataToSave),
    })

    const data = await response.json()
    if (data.success) {
      editingSection.value[section] = false // 保存成功后退出编辑状态
      showMessage('✅ 保存成功！部分配置需要重启服务器生效。', 'success')
    }
    else {
      showMessage(`❌ 保存失败: ${data.error}`, 'error')
    }
  }
  catch (error) {
    showMessage(`❌ 保存失败: ${error.message}`, 'error')
  }
}

async function saveConfig() {
  try {
    const response = await fetch('http://localhost:3456/api/config/site', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(config.value),
    })

    const data = await response.json()
    if (data.success) {
      showMessage('✅ 配置已保存！\n\n⚠️ 请重启开发服务器以查看更改：\n1. 在终端按 Ctrl+C 停止服务器\n2. 运行 npm run docs:dev 重新启动', 'success')
    }
    else {
      showMessage(`❌ 保存失败: ${data.error}`, 'error')
    }
  }
  catch (error) {
    showMessage(`❌ 保存失败: ${error.message}`, 'error')
  }
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
  loadConfig()
})

// Banner图片上传相关
const selectedBannerFile = ref(null)
const uploadingBanner = ref(false)
const bannerFileInput = ref(null)
const bannerPreviewUrl = ref('') // 预览URL

function handleBannerFileSelect(event) {
  const file = event.target.files[0]
  if (file) {
    selectedBannerFile.value = file

    // 创建本地预览URL
    const reader = new FileReader()
    reader.onload = (e) => {
      bannerPreviewUrl.value = e.target.result
    }
    reader.readAsDataURL(file)
  }
}

async function uploadBannerImage() {
  if (!selectedBannerFile.value) {
    showMessage('❌ 请先选择图片', 'error')
    return
  }

  uploadingBanner.value = true

  try {
    const formData = new FormData()
    formData.append('banner', selectedBannerFile.value)

    const response = await fetch('http://localhost:3456/api/upload/banner', {
      method: 'POST',
      body: formData,
    })

    const data = await response.json()

    if (data.success) {
      showMessage(data.message || '✅ 上传成功！', 'success')
      // 更新配置显示
      config.value.bannerImage = data.path
      // 重新加载配置以确保同步
      await loadConfig()
      // 清空预览和选择
      selectedBannerFile.value = null
      bannerPreviewUrl.value = ''
      if (bannerFileInput.value) {
        bannerFileInput.value.value = ''
      }
    }
    else {
      showMessage(`❌ ${data.error || '上传失败'}`, 'error')
    }
  }
  catch (error) {
    showMessage(`❌ 上传失败: ${error.message}`, 'error')
  }
  finally {
    uploadingBanner.value = false
  }
}
</script>

<template>
  <div class="site-config">
    <div class="config-header">
      <h2>🎨 网站管理</h2>
      <p class="config-tip">💡 点击各区块的"编辑"按钮进行修改，修改完成后保存即可。</p>
    </div>

    <div class="config-tabs">
      <!-- 左侧（基本信息+页脚配置） 和 右侧（Banner配置） 左右布局 -->
      <div class="config-section-row">
        <!-- 左列：基本信息 + 页脚配置 -->
        <div class="config-section-left-column">
          <!-- 基本信息 - 上下布局 -->
          <div class="config-section">
            <div class="section-header">
              <h3>🌐 基本信息</h3>
              <div class="section-actions">
                <button
                  v-if="!editingSection.basic"
                  class="btn-edit"
                  @click="toggleEdit('basic')"
                >
                  ✏️ 编辑
                </button>
                <button
                  v-if="editingSection.basic"
                  class="btn-save"
                  @click="saveSectionConfig('basic')"
                >
                  💾 保存
                </button>
                <button
                  v-if="editingSection.basic"
                  class="btn-cancel"
                  @click="toggleEdit('basic')"
                >
                  ❌ 取消
                </button>
              </div>
            </div>
            <div class="form-group">
              <label>网站名称：</label>
              <input
                v-model="config.title"
                type="text"
                class="form-input"
                :readonly="!editingSection.basic"
                placeholder="杰哥的技术小站"
              >
            </div>
            <div class="form-group">
              <label>网站描述：</label>
              <textarea
                v-model="config.description"
                class="form-textarea"
                rows="3"
                :readonly="!editingSection.basic"
                placeholder="网站描述，用于SEO优化"
              />
            </div>
          </div>

          <!-- 页脚配置 -->
          <div class="config-section">
            <div class="section-header">
              <h3>📄 页脚配置</h3>
              <div class="section-actions">
                <button
                  v-if="!editingSection.footer"
                  class="btn-edit"
                  @click="toggleEdit('footer')"
                >
                  ✏️ 编辑
                </button>
                <button
                  v-if="editingSection.footer"
                  class="btn-save"
                  @click="saveSectionConfig('footer')"
                >
                  💾 保存
                </button>
                <button
                  v-if="editingSection.footer"
                  class="btn-cancel"
                  @click="toggleEdit('footer')"
                >
                  ❌ 取消
                </button>
              </div>
            </div>
            <div class="form-group">
              <label>页脚标题：</label>
              <input
                v-model="config.footerMessage"
                type="text"
                class="form-input"
                :readonly="!editingSection.footer"
                placeholder="杰哥的技术小站"
              >
              <span class="form-hint">💡 页脚第一行显示的网站名称。</span>
            </div>
            <div class="form-group">
              <label>版权信息：</label>
              <input
                v-model="config.footerCopyright"
                type="text"
                class="form-input"
                :readonly="!editingSection.footer"
                placeholder="Copyright © 2025 杰哥"
              >
              <span class="form-hint">💡 页脚第二行显示的版权声明。</span>
            </div>
          </div>
        </div>

        <!-- 右列：Banner配置 -->
        <div class="config-section config-section-half">
          <div class="section-header">
            <h3>🎨 Banner配置</h3>
            <div class="section-actions">
              <button
                v-if="!editingSection.banner"
                class="btn-edit"
                @click="toggleEdit('banner')"
              >
                ✏️ 编辑
              </button>
              <button
                v-if="editingSection.banner"
                class="btn-save"
                @click="saveSectionConfig('banner')"
              >
                💾 保存
              </button>
              <button
                v-if="editingSection.banner"
                class="btn-cancel"
                @click="toggleEdit('banner')"
              >
                ❌ 取消
              </button>
            </div>
          </div>
          <div class="form-group">
            <label>Banner标题：</label>
            <input
              v-model="config.bannerTitle"
              type="text"
              class="form-input"
              :readonly="!editingSection.banner"
              placeholder="欢迎来到我的博客"
            >
            <span class="form-hint">💡 首页顶部Banner显示的主标题。</span>
          </div>
          <div class="form-group">
            <label>Banner背景图：</label>

            <!-- Preview: show selected file preview OR current banner -->
            <div v-if="bannerPreviewUrl || config.bannerImage" class="banner-preview">
              <div class="banner-preview-container">
                <img
                  :src="bannerPreviewUrl || config.bannerImage"
                  alt="Banner Preview"
                  class="preview-image"
                >
              </div>
              <p class="preview-path">
                <span v-if="bannerPreviewUrl" class="preview-label">📷 预览（未保存）</span>
                <code v-else>{{ config.bannerImage }}</code>
              </p>
            </div>

            <!-- Upload controls -->
            <div class="upload-controls">
              <input
                ref="bannerFileInput"
                type="file"
                accept="image/*"
                class="file-input"
                :disabled="!editingSection.banner"
                @change="handleBannerFileSelect"
              >
              <button
                type="button"
                class="btn-upload"
                :disabled="!editingSection.banner || !selectedBannerFile || uploadingBanner"
                @click="uploadBannerImage"
              >
                <span v-if="!uploadingBanner">📤 上传图片</span>
                <span v-else>⏳ 上传中...</span>
              </button>
              <span v-if="selectedBannerFile" class="selected-file">
                已选择: {{ selectedBannerFile.name }}
              </span>
            </div>

            <span class="form-hint">
              💡 推荐尺寸：<strong>1920x500px</strong> 或 <strong>1600x400px</strong>（宽横幅）<br>
              📁 支持 jpg, png, gif, webp 格式，最大5MB
            </span>
          </div>
        </div>
      </div>

      <!-- Google服务集成 -->
      <div class="config-section">
        <div class="section-header">
          <h3>🔌 Google服务集成</h3>
          <div class="section-actions">
            <button
              v-if="!editingSection.google"
              class="btn-edit"
              @click="toggleEdit('google')"
            >
              ✏️ 编辑
            </button>
            <button
              v-if="editingSection.google"
              class="btn-save"
              @click="saveSectionConfig('google')"
            >
              💾 保存
            </button>
            <button
              v-if="editingSection.google"
              class="btn-cancel"
              @click="toggleEdit('google')"
            >
              ❌ 取消
            </button>
          </div>
        </div>

        <!-- Google Analytics -->
        <div class="form-group">
          <label>📊 Google Analytics ID：</label>
          <input
            v-model="config.googleAnalytics"
            type="text"
            class="form-input"
            :readonly="!editingSection.google"
            placeholder="G-XXXXXXXXXX"
          >
          <span class="form-hint">
            📝 <a href="https://analytics.google.com/" target="_blank">获取 Analytics ID</a> |
            保存后将自动在 <code>&lt;head&gt;</code> 中插入 gtag.js 脚本
          </span>
        </div>

        <!-- Google Search Console -->
        <div class="form-group">
          <label>🔍 Google Search Console 验证：</label>
          <input
            v-model="config.googleSearchConsole"
            type="text"
            class="form-input"
            :readonly="!editingSection.google"
            placeholder="验证码（多个用逗号分隔）"
          >
          <span class="form-hint">
            📝 <a href="https://search.google.com/search-console" target="_blank">获取验证码</a> |
            保存后将自动生成：
            <br>1️⃣ <code>&lt;head&gt;</code> 中的 meta 标签
            <br>2️⃣ <code>public/</code> 文件夹中的验证文件（如 google327d3a41a389f4ee.html）
          </span>
        </div>

        <!-- Google AdSense -->
        <div class="form-group">
          <label>💰 Google AdSense ID：</label>
          <input
            v-model="config.googleAdsense"
            type="text"
            class="form-input"
            :readonly="!editingSection.google"
            placeholder="ca-pub-XXXXXXXXXXXXXXXX"
          >
          <span class="form-hint">
            📝 <a href="https://www.google.com/adsense/" target="_blank">获取 AdSense ID</a> |
            保存后将自动生成：
            <br>1️⃣ <code>&lt;head&gt;</code> 中的 AdSense 脚本
            <br>2️⃣ <code>public/ads.txt</code> 文件
          </span>
        </div>

        <div class="info-box">
          <p>✨ <strong>自动化配置</strong></p>
          <p>保存后系统将自动完成以下操作：</p>
          <ul>
            <li><strong>Analytics</strong>：在 theme/index.ts 中动态加载 gtag.js</li>
            <li><strong>Search Console</strong>：在 config.mts head 中添加 meta 标签 + 创建验证文件</li>
            <li><strong>AdSense</strong>：在 theme/index.ts 中动态加载 AdSense 脚本 + 创建 ads.txt</li>
          </ul>
          <p class="warning-text">⚠️ 配置后需要<strong>重启开发服务器</strong>才能生效</p>
        </div>
      </div>
    </div>

    <div v-if="message" class="message" :class="messageType">
      {{ message }}
    </div>
  </div>
</template>

<style scoped>
.site-config {
  padding: 24px;
  padding-bottom: 120px; /* 增加底部内边距，防止被页脚遮挡 */
  width: 100%;
  margin: 0;
  box-sizing: border-box;
}

.config-header {
  margin-bottom: 32px;
  padding-bottom: 16px;
  border-bottom: 2px solid var(--vp-c-divider);
}

.config-header h2 {
  margin: 0 0 8px 0;
  font-size: 24px;
  color: var(--vp-c-text-1);
}

.config-tip {
  margin: 0;
  font-size: 14px;
  color: var(--vp-c-text-2);
}

.header-actions {
  display: flex;
  gap: 12px;
}

.btn-secondary,
.btn-success {
  padding: 10px 20px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.2s;
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

.config-tabs {
  display: flex;
  flex-direction: column;
  gap: 32px;
}

/* 左右两列的容器 */
.config-section-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
}

/* 左列容器：包含多个上下排列的 section */
.config-section-left-column {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.config-section {
  background: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-divider);
  border-radius: 12px;
  padding: 24px;
}

/* 半宽的区块 */
.config-section-half {
  background: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-divider);
  border-radius: 12px;
  padding: 24px;
}

/* 表单项左右两列布局 */
.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  margin-bottom: 20px;
}

.form-row:last-child {
  margin-bottom: 0;
}

/* 区块头部（标题和操作按钮） */
.section-header {
  display: flex;
  align-items: baseline; /* 使用基线对齐，确保文字和按钮对齐 */
  gap: 24px; /* 标题和按钮之间的间距 */
  margin-bottom: 20px;
  padding-bottom: 12px;
  border-bottom: 1px solid var(--vp-c-divider);
}

.section-header h3 {
  margin: 0;
  font-size: 18px;
  line-height: 1.5; /* 设置行高 */
  color: var(--vp-c-text-1);
  flex-shrink: 0; /* 标题不缩小 */
}

.section-actions {
  display: flex;
  gap: 8px;
  flex-shrink: 0; /* 按钮不缩小 */
}

/* 编辑/保存/取消按钮 */
.btn-edit,
.btn-save,
.btn-cancel {
  padding: 6px 12px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 13px;
  transition: all 0.2s;
}

.btn-edit {
  background: var(--vp-c-brand);
  color: white;
}

.btn-edit:hover {
  background: var(--vp-c-brand-dark);
}

.btn-save {
  background: #10b981;
  color: white;
}

.btn-save:hover {
  background: #059669;
}

.btn-cancel {
  background: #6b7280;
  color: white;
}

.btn-cancel:hover {
  background: #4b5563;
}

.config-section h3 {
  margin: 0 0 20px 0;
  font-size: 18px;
  color: var(--vp-c-text-1);
}

.form-group {
  margin-bottom: 20px;
}

.form-group:last-child {
  margin-bottom: 0;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  font-weight: 600;
  color: var(--vp-c-text-1);
  font-size: 14px;
}

.form-input,
.form-textarea {
  width: 100%;
  padding: 8px 12px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 4px;
  font-size: 14px;
  color: var(--vp-c-text-1);
  background: var(--vp-c-bg);
  transition: border-color 0.2s, background-color 0.2s;
}

.form-input:focus,
.form-textarea:focus {
  outline: none;
  border-color: var(--vp-c-brand);
  box-shadow: 0 0 0 3px var(--vp-c-brand-soft);
}

/* 只读状态样式 */
.form-input[readonly],
.form-textarea[readonly] {
  background: var(--vp-c-bg-soft);
  color: var(--vp-c-text-2);
  cursor: not-allowed;
  opacity: 0.7;
}

.form-input:disabled {
  background: var(--vp-c-bg-alt);
  cursor: not-allowed;
  opacity: 0.6;
}

.form-textarea {
  resize: vertical;
  min-height: 80px;
}

.form-hint {
  display: block;
  margin-top: 6px;
  font-size: 12px;
  color: var(--vp-c-text-3);
}

.form-hint a {
  color: var(--vp-c-brand);
  text-decoration: none;
}

.form-hint a:hover {
  text-decoration: underline;
}

.warning-box {
  background: #fef3c7;
  border-left: 4px solid #f59e0b;
  padding: 20px;
  border-radius: 8px;
  margin-bottom: 32px;
}

.warning-box p {
  margin: 8px 0;
  font-size: 14px;
  color: #92400e;
  line-height: 1.6;
}

.warning-box p:first-child {
  margin-top: 0;
}

.warning-box strong {
  color: #78350f;
}

.warning-box code {
  background: #fbbf24;
  color: #78350f;
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 13px;
  font-weight: 600;
}

.restart-steps {
  margin-top: 12px;
  padding-top: 12px;
  border-top: 1px solid #fbbf24;
}

.info-box {
  background: #dbeafe;
  border-left: 4px solid #3b82f6;
  padding: 16px;
  border-radius: 6px;
  margin-top: 20px;
}

.info-box p {
  margin: 8px 0;
  font-size: 14px;
  color: #1e3a8a;
  line-height: 1.6;
}

.info-box ul {
  margin: 8px 0;
  padding-left: 20px;
  color: #1e3a8a;
}

.info-box li {
  margin: 6px 0;
  font-size: 14px;
  line-height: 1.6;
}

.info-box code {
  background: #1e3a8a;
  color: #dbeafe;
  padding: 2px 6px;
  border-radius: 3px;
  font-size: 12px;
}

.warning-text {
  color: #dc2626 !important;
  font-weight: 600;
  margin-top: 12px !important;
  padding-top: 12px;
  border-top: 1px dashed #3b82f6;
}

.code-example {
  background: #1e3a8a;
  color: #dbeafe;
  padding: 12px;
  border-radius: 4px;
  overflow-x: auto;
  font-size: 12px;
  margin: 8px 0 0 0;
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

/* Banner上传相关样式 */
.banner-preview {
  margin: 12px 0;
  padding: 12px;
  background: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
}

.banner-preview-container {
  width: 100%;
  max-width: 600px;
  aspect-ratio: 16 / 5;
  overflow: hidden;
  border-radius: 6px;
  background: #f0f0f0;
  margin-bottom: 8px;
}

.preview-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.preview-path {
  margin: 0;
  font-size: 12px;
  color: var(--vp-c-text-3);
}

.preview-label {
  display: inline-block;
  padding: 4px 8px;
  background: #fbbf24;
  color: #78350f;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 600;
}

.preview-path code {
  background: var(--vp-c-bg);
  padding: 2px 6px;
  border-radius: 3px;
  font-size: 11px;
}

.upload-controls {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: nowrap; /* 不换行，保持同一行 */
  margin: 12px 0;
}

.file-input {
  flex: 0 0 auto; /* 不伸缩，自动宽度 */
  width: 50%; /* 宽度减半 */
  max-width: 300px; /* 最大宽度限制 */
  padding: 8px 12px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 6px;
  background: var(--vp-c-bg);
  color: var(--vp-c-text-1);
  cursor: pointer;
  font-size: 14px;
}

.file-input:hover {
  border-color: var(--vp-c-brand);
}

.btn-upload {
  padding: 10px 20px;
  border: none;
  border-radius: 6px;
  background: var(--vp-c-brand);
  color: white;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  white-space: nowrap;
}

.btn-upload:hover:not(:disabled) {
  background: var(--vp-c-brand-dark);
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}

.btn-upload:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.selected-file {
  font-size: 13px;
  color: var(--vp-c-text-2);
  font-style: italic;
}

@media (max-width: 768px) {
  /* 小屏幕恢复单列布局 */
  .config-section-row {
    grid-template-columns: 1fr;
  }

  .config-section-left-column {
    gap: 16px;
  }

  .form-row {
    grid-template-columns: 1fr;
  }

  .upload-controls {
    flex-direction: column;
    align-items: stretch;
  }

  .file-input {
    width: 100%;
    max-width: none;
  }

  .btn-upload {
    width: 100%;
  }
}
</style>
