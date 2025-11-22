<template>
  <div class="fetch-tool-container">
    <div class="fetch-tool-header">
      <h1>📝 文章爬取工具</h1>
      <p class="subtitle">从微信公众号等平台爬取文章，自动转换为Markdown格式</p>
    </div>

    <div class="fetch-tool-card">
      <!-- URL批量输入 -->
      <div class="form-group">
        <label for="article-urls">
          <span class="label-icon">🔗</span>
          文章链接（每行一个URL）
        </label>
        <textarea
          id="article-urls"
          v-model="formData.urls"
          rows="8"
          placeholder="请输入文章URL，每行一个，例如：
https://mp.weixin.qq.com/s/xxxxxxxx
https://zhuanlan.zhihu.com/p/xxxxxxxx
https://blog.csdn.net/xxxxxxxx"
          :disabled="isLoading"
        />
        <p class="input-hint">
          支持微信公众号、知乎、CSDN、简书、掘金等平台 | 文件名自动使用文章标题
        </p>
      </div>

      <!-- 按钮 -->
      <div class="form-actions">
        <button
          class="btn-primary"
          :disabled="!canSubmit || isLoading"
          @click="handleFetch"
        >
          <span v-if="!isLoading">
            <span class="btn-icon">🚀</span>
            开始爬取
          </span>
          <span v-else>
            <span class="btn-icon">⏳</span>
            爬取中...
          </span>
        </button>

        <button
          v-if="result"
          class="btn-secondary"
          :disabled="isLoading"
          @click="handleReset"
        >
          <span class="btn-icon">🔄</span>
          重新爬取
        </button>
      </div>

      <!-- 进度提示 -->
      <div v-if="isLoading" class="loading-steps">
        <div class="loading-step" :class="{ active: currentStep >= 1 }">
          <span class="step-icon">📡</span>
          <span class="step-text">正在获取页面内容...</span>
        </div>
        <div class="loading-step" :class="{ active: currentStep >= 2 }">
          <span class="step-icon">📝</span>
          <span class="step-text">正在解析文章内容...</span>
        </div>
        <div class="loading-step" :class="{ active: currentStep >= 3 }">
          <span class="step-icon">🖼️</span>
          <span class="step-text">正在下载图片...</span>
        </div>
        <div class="loading-step" :class="{ active: currentStep >= 4 }">
          <span class="step-icon">💾</span>
          <span class="step-text">正在保存文件...</span>
        </div>
      </div>

      <!-- 错误提示 -->
      <div v-if="error" class="error-message">
        <span class="error-icon">❌</span>
        <div class="error-content">
          <strong>爬取失败</strong>
          <p>{{ error }}</p>
        </div>
      </div>

      <!-- 批量爬取结果 -->
      <div v-if="results.length > 0" class="results-container">
        <div class="results-header">
          <span class="success-icon">✅</span>
          <h3>批量爬取完成！</h3>
          <p class="results-summary">
            成功：{{ successCount }} 篇 | 失败：{{ failCount }} 篇
          </p>
        </div>

        <div class="results-list">
          <div
            v-for="(item, index) in results"
            :key="index"
            class="result-item-card"
            :class="{ success: item.success, failed: !item.success }"
          >
            <div class="result-header">
              <span class="result-icon">{{ item.success ? '✅' : '❌' }}</span>
              <span class="result-title">{{ item.title || item.url }}</span>
            </div>
            <div v-if="item.success" class="result-details">
              <p>📂 文件：{{ item.filename }}</p>
              <p>🖼️ 图片：{{ item.imageCount }} 张</p>
            </div>
            <div v-else class="result-error">
              <p>{{ item.error }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 使用提示 -->
    <div class="usage-tips">
      <h3>💡 使用提示</h3>
      <ul>
        <li><strong>支持平台：</strong>微信公众号、知乎专栏、CSDN、简书、掘金等</li>
        <li><strong>自动处理：</strong>HTML转Markdown、图片下载、Frontmatter生成</li>
        <li><strong>后续操作：</strong>爬取完成后可在编辑器中打开文件进行进一步编辑</li>
        <li><strong>注意事项：</strong>部分网站有反爬虫机制，可能需要多次尝试</li>
      </ul>
    </div>

    <!-- 底部占位符，防止被页脚遮挡 -->
    <div class="bottom-spacer"></div>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'

const formData = ref({
  urls: '',
})

const isLoading = ref(false)
const currentStep = ref(0)
const error = ref('')
const results = ref([])

// 计算属性
const canSubmit = computed(() => {
  return formData.value.urls.trim().length > 0
})

const successCount = computed(() => {
  return results.value.filter(r => r.success).length
})

const failCount = computed(() => {
  return results.value.filter(r => !r.success).length
})

// 批量爬取文章
async function handleFetch() {
  if (!canSubmit.value)
    return

  isLoading.value = true
  error.value = ''
  results.value = []
  currentStep.value = 0

  // 解析URL列表
  const urls = formData.value.urls
    .split('\n')
    .map(url => url.trim())
    .filter(url => url.length > 0)

  if (urls.length === 0) {
    error.value = '请输入至少一个URL'
    isLoading.value = false
    return
  }

  // 模拟步骤进度
  const stepTimer = setInterval(() => {
    if (currentStep.value < 4) {
      currentStep.value++
    }
  }, 1000)

  try {
    // 逐个爬取
    for (const url of urls) {
      try {
        const response = await fetch('http://localhost:3456/api/fetch-article-batch', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ url }),
        })

        const data = await response.json()

        if (response.ok && data.success) {
          results.value.push({
            success: true,
            url,
            title: data.data.title,
            filename: data.data.filename,
            imageCount: data.data.imageCount || 0,
          })
        }
        else {
          results.value.push({
            success: false,
            url,
            error: data.error || '爬取失败',
          })
        }
      }
      catch (err) {
        results.value.push({
          success: false,
          url,
          error: err.message || '网络错误',
        })
      }
    }
  }
  catch (err) {
    error.value = err.message || '批量爬取失败'
  }
  finally {
    clearInterval(stepTimer)
    isLoading.value = false
    currentStep.value = 4
  }
}

// 重置表单
function handleReset() {
  formData.value.urls = ''
  error.value = ''
  results.value = []
}
</script>

<style scoped>
.fetch-tool-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 2rem 1rem 6rem 1rem;
}

.fetch-tool-header {
  text-align: center;
  margin-bottom: 2rem;
}

.fetch-tool-header h1 {
  font-size: 2.5rem;
  margin-bottom: 0.5rem;
  color: var(--vp-c-brand);
}

.subtitle {
  font-size: 1.1rem;
  color: var(--vp-c-text-2);
}

.fetch-tool-card {
  background: var(--vp-c-bg-soft);
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-group label {
  display: flex;
  align-items: center;
  font-size: 1rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: var(--vp-c-text-1);
}

.label-icon {
  margin-right: 0.5rem;
  font-size: 1.2rem;
}

.form-group input,
.form-group select,
.form-group textarea {
  width: 100%;
  padding: 0.75rem 1rem;
  font-size: 1rem;
  border: 2px solid var(--vp-c-divider);
  border-radius: 8px;
  background: var(--vp-c-bg);
  color: var(--vp-c-text-1);
  transition: all 0.2s;
  font-family: inherit;
  resize: vertical;
}

.form-group input:focus,
.form-group select:focus,
.form-group textarea:focus {
  outline: none;
  border-color: var(--vp-c-brand);
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.form-group input:disabled,
.form-group select:disabled,
.form-group textarea:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.input-hint {
  margin-top: 0.5rem;
  font-size: 0.875rem;
  color: var(--vp-c-text-2);
}

.form-actions {
  display: flex;
  gap: 1rem;
  margin-top: 2rem;
}

.btn-primary,
.btn-secondary {
  flex: 1;
  padding: 0.875rem 1.5rem;
  font-size: 1rem;
  font-weight: 600;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.btn-primary {
  background: var(--vp-c-brand);
  color: white;
}

.btn-primary:hover:not(:disabled) {
  background: var(--vp-c-brand-dark);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
}

.btn-primary:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
}

.btn-secondary {
  background: var(--vp-c-bg-soft);
  color: var(--vp-c-text-1);
  border: 2px solid var(--vp-c-divider);
}

.btn-secondary:hover:not(:disabled) {
  background: var(--vp-c-bg);
}

.btn-icon {
  font-size: 1.2rem;
}

.loading-steps {
  margin-top: 2rem;
  padding: 1.5rem;
  background: var(--vp-c-bg);
  border-radius: 8px;
  border: 2px solid var(--vp-c-divider);
}

.loading-step {
  display: flex;
  align-items: center;
  padding: 0.75rem 0;
  color: var(--vp-c-text-3);
  opacity: 0.4;
  transition: all 0.3s;
}

.loading-step.active {
  color: var(--vp-c-brand);
  opacity: 1;
}

.step-icon {
  margin-right: 0.75rem;
  font-size: 1.5rem;
}

.step-text {
  font-size: 1rem;
}

.error-message {
  margin-top: 1.5rem;
  padding: 1rem 1.5rem;
  background: #fee;
  border: 2px solid #fcc;
  border-radius: 8px;
  display: flex;
  align-items: flex-start;
  gap: 1rem;
}

.error-icon {
  font-size: 1.5rem;
}

.error-content strong {
  display: block;
  color: #c00;
  margin-bottom: 0.25rem;
}

.error-content p {
  color: #666;
  margin: 0;
}

/* 批量结果容器 */
.results-container {
  margin-top: 2rem;
  padding: 1.5rem;
  background: var(--vp-c-bg);
  border: 2px solid var(--vp-c-brand);
  border-radius: 8px;
}

.results-header {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
}

.success-icon {
  font-size: 2rem;
}

.results-header h3 {
  margin: 0;
  color: var(--vp-c-brand);
}

.results-summary {
  margin: 0;
  color: var(--vp-c-text-2);
  font-size: 0.9rem;
}

.results-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.result-item-card {
  padding: 1rem;
  border-radius: 8px;
  border: 2px solid var(--vp-c-divider);
  background: var(--vp-c-bg-soft);
}

.result-item-card.success {
  border-color: #10b981;
  background: rgba(16, 185, 129, 0.05);
}

.result-item-card.failed {
  border-color: #ef4444;
  background: rgba(239, 68, 68, 0.05);
}

.result-header {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
}

.result-icon {
  font-size: 1.2rem;
}

.result-title {
  font-weight: 600;
  color: var(--vp-c-text-1);
  flex: 1;
}

.result-details,
.result-error {
  padding-left: 1.7rem;
}

.result-details p,
.result-error p {
  margin: 0.25rem 0;
  font-size: 0.9rem;
  color: var(--vp-c-text-2);
}

.result-error p {
  color: #ef4444;
}

.usage-tips {
  margin-top: 3rem;
  padding: 1.5rem;
  background: var(--vp-c-bg-soft);
  border-radius: 8px;
}

.usage-tips h3 {
  margin-top: 0;
  margin-bottom: 1rem;
  color: var(--vp-c-brand);
}

.usage-tips ul {
  margin: 0;
  padding-left: 1.5rem;
}

.usage-tips li {
  margin-bottom: 0.5rem;
  line-height: 1.6;
}

@media (max-width: 768px) {
  .fetch-tool-container {
    padding: 1rem 0.5rem;
  }

  .fetch-tool-card {
    padding: 1.5rem 1rem;
  }

  .form-actions {
    flex-direction: column;
  }

  .result-item {
    flex-direction: column;
    gap: 0.25rem;
  }

  .result-label {
    min-width: auto;
  }
}

.bottom-spacer {
  height: 120px;
  width: 100%;
  flex-shrink: 0;
}
</style>
