<script setup>
import { onMounted, ref } from 'vue'

const config = ref({
  title: '',
  description: '',
})
const message = ref('')
const messageType = ref('success')

// 加载配置
async function loadConfig() {
  try {
    const response = await fetch('http://localhost:3456/api/config/site')
    const data = await response.json()
    if (data.success) {
      config.value = data.config
      showMessage('✅ 配置加载成功', 'success')
    }
  }
  catch (error) {
    showMessage(`❌ 加载失败: ${error.message}`, 'error')
  }
}

// 保存配置
async function saveConfig() {
  try {
    const response = await fetch('http://localhost:3456/api/config/site', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(config.value),
    })

    const data = await response.json()
    if (data.success) {
      showMessage('✅ 保存成功！请重启开发服务器生效', 'success')
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
  message.value = msg
  messageType.value = type
  setTimeout(() => {
    message.value = ''
  }, 3000)
}

onMounted(() => {
  loadConfig()
})
</script>

<template>
  <div class="site-config-container">
    <div class="config-header">
      <h2>⚙️ 网站配置管理</h2>
      <div class="header-actions">
        <button class="btn-secondary" @click="loadConfig">
          🔄 重新加载
        </button>
        <button class="btn-success" @click="saveConfig">
          💾 保存配置
        </button>
      </div>
    </div>

    <div class="config-sections">
      <!-- 基本信息 -->
      <div class="config-section">
        <h3>🌐 基本信息</h3>
        <div class="form-group">
          <label>网站名称：</label>
          <input
            v-model="config.title"
            type="text"
            class="form-input"
            placeholder="例如：杰哥的技术小站"
          >
        </div>
        <div class="form-group">
          <label>网站描述：</label>
          <textarea
            v-model="config.description"
            class="form-textarea"
            rows="3"
            placeholder="输入网站描述，用于SEO优化"
          />
        </div>
      </div>

      <!-- Banner配置 -->
      <div class="config-section">
        <h3>🎨 Banner配置</h3>
        <div class="info-box">
          <p>💡 <strong>提示：</strong>Banner配置需要修改主题组件文件</p>
          <p>文件位置：<code>docs/.vitepress/theme/components/Banner.vue</code></p>
        </div>
        <div class="form-group">
          <label>Banner标题：</label>
          <input
            type="text"
            class="form-input"
            placeholder="欢迎来到我的博客"
            disabled
          >
          <span class="form-hint">请直接编辑 Banner.vue 文件</span>
        </div>
        <div class="form-group">
          <label>Banner背景图：</label>
          <input
            type="text"
            class="form-input"
            placeholder="/images/banner.jpg"
            disabled
          >
          <span class="form-hint">请直接编辑 Banner.vue 文件</span>
        </div>
      </div>

      <!-- 页脚配置 -->
      <div class="config-section">
        <h3>📄 页脚配置</h3>
        <div class="info-box">
          <p>💡 <strong>提示：</strong>页脚配置需要修改VitePress配置</p>
          <p>文件位置：<code>docs/.vitepress/config.mts</code></p>
        </div>
        <div class="form-group">
          <label>版权信息：</label>
          <input
            type="text"
            class="form-input"
            placeholder="© 2025 杰哥的技术小站"
            disabled
          >
          <span class="form-hint">请直接编辑 config.mts 文件</span>
        </div>
      </div>

      <!-- SEO配置 -->
      <div class="config-section">
        <h3>🔍 SEO配置</h3>
        <div class="info-box">
          <p>💡 <strong>提示：</strong>SEO配置在网站描述中已包含</p>
          <p>关键词配置位置：<code>docs/.vitepress/config.mts → head → meta keywords</code></p>
        </div>
      </div>
    </div>

    <!-- 状态提示 -->
    <div v-if="message" class="message" :class="messageType">
      {{ message }}
    </div>
  </div>
</template>

<style scoped>
.site-config-container {
  max-width: 1000px;
  margin: 0 auto;
  padding: 24px;
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

.config-sections {
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
  color: var(--vp-c-text-1);
  font-size: 18px;
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
  font-weight: 500;
  color: var(--vp-c-text-1);
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

.info-box {
  background: #dbeafe;
  border-left: 4px solid #3b82f6;
  padding: 16px;
  border-radius: 6px;
  margin-bottom: 20px;
}

.info-box p {
  margin: 6px 0;
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
