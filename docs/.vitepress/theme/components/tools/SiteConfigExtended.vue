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
  footerText: '',
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

async function saveConfig() {
  try {
    const response = await fetch('http://localhost:3456/api/config/site', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(config.value),
    })

    const data = await response.json()
    if (data.success) {
      showMessage('✅ 保存成功！请重启开发服务器', 'success')
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
</script>

<template>
  <div class="site-config">
    <div class="config-header">
      <h2>🎨 网站管理</h2>
      <div class="header-actions">
        <button class="btn-secondary" @click="loadConfig">
          🔄 重新加载
        </button>
        <button class="btn-success" @click="saveConfig">
          💾 保存配置
        </button>
      </div>
    </div>

    <div class="config-tabs">
      <!-- 基本信息 -->
      <div class="config-section">
        <h3>🌐 基本信息</h3>
        <div class="form-group">
          <label>网站名称：</label>
          <input
            v-model="config.title"
            type="text"
            class="form-input"
            placeholder="杰哥的技术小站"
          >
        </div>
        <div class="form-group">
          <label>网站描述：</label>
          <textarea
            v-model="config.description"
            class="form-textarea"
            rows="3"
            placeholder="网站描述，用于SEO优化"
          />
        </div>
      </div>

      <!-- Banner配置 -->
      <div class="config-section">
        <h3>🎨 Banner配置</h3>
        <div class="form-group">
          <label>Banner标题：</label>
          <input
            v-model="config.bannerTitle"
            type="text"
            class="form-input"
            placeholder="欢迎来到我的博客"
          >
        </div>
        <div class="form-group">
          <label>Banner副标题：</label>
          <input
            v-model="config.bannerSubtitle"
            type="text"
            class="form-input"
            placeholder="分享技术，记录生活"
          >
        </div>
        <div class="form-group">
          <label>Banner背景图：</label>
          <input
            type="file"
            accept="image/*"
            class="form-input"
            disabled
          >
          <span class="form-hint">暂不支持上传，请手动替换 public/images/banner.jpg</span>
        </div>
      </div>

      <!-- 页脚配置 -->
      <div class="config-section">
        <h3>📄 页脚配置</h3>
        <div class="form-group">
          <label>页脚文字：</label>
          <textarea
            v-model="config.footerText"
            class="form-textarea"
            rows="2"
            placeholder="© 2025 杰哥的技术小站. All rights reserved."
          />
        </div>
      </div>

      <!-- Google服务集成 -->
      <div class="config-section">
        <h3>🔌 Google服务集成</h3>

        <div class="form-group">
          <label>Google Analytics ID：</label>
          <input
            v-model="config.googleAnalytics"
            type="text"
            class="form-input"
            placeholder="G-XXXXXXXXXX"
          >
          <span class="form-hint">
            <a href="https://analytics.google.com/" target="_blank">获取 Analytics ID</a>
          </span>
        </div>

        <div class="form-group">
          <label>Google Search Console验证码：</label>
          <input
            v-model="config.googleSearchConsole"
            type="text"
            class="form-input"
            placeholder="meta标签中的content值"
          >
          <span class="form-hint">
            <a href="https://search.google.com/search-console" target="_blank">获取验证码</a>
          </span>
        </div>

        <div class="form-group">
          <label>Google AdSense ID：</label>
          <input
            v-model="config.googleAdsense"
            type="text"
            class="form-input"
            placeholder="ca-pub-XXXXXXXXXXXXXXXX"
          >
          <span class="form-hint">
            <a href="https://www.google.com/adsense/" target="_blank">获取 AdSense ID</a>
          </span>
        </div>

        <div class="info-box">
          <p>💡 <strong>提示：</strong></p>
          <p>保存后需要在 <code>docs/.vitepress/config.mts</code> 中配置相应的head标签</p>
          <pre class="code-example">
head: [
  ['script', { 
    async: '', 
    src: 'https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX' 
  }],
  // ... 其他配置
]</pre>
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
  width: 100%;
  margin: 0;
  box-sizing: border-box;
}

.config-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 32px;
  padding-bottom: 16px;
  border-bottom: 2px solid var(--vp-c-divider);
}

.config-header h2 {
  margin: 0;
  font-size: 24px;
  color: var(--vp-c-text-1);
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

.config-section {
  background: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-divider);
  border-radius: 12px;
  padding: 24px;
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
  padding: 10px 12px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 6px;
  background: var(--vp-c-bg);
  color: var(--vp-c-text-1);
  font-size: 14px;
  font-family: inherit;
  transition: all 0.2s;
}

.form-input:focus,
.form-textarea:focus {
  outline: none;
  border-color: var(--vp-c-brand);
  box-shadow: 0 0 0 3px var(--vp-c-brand-soft);
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

.info-box {
  background: #dbeafe;
  border-left: 4px solid #3b82f6;
  padding: 16px;
  border-radius: 6px;
  margin-top: 20px;
}

.info-box p {
  margin: 4px 0;
  font-size: 14px;
  color: #1e3a8a;
}

.info-box code {
  background: #1e3a8a;
  color: #dbeafe;
  padding: 2px 6px;
  border-radius: 3px;
  font-size: 12px;
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
</style>
