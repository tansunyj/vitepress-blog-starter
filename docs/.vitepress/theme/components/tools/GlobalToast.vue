<script setup>
import { onMounted, onUnmounted, ref } from 'vue'

const toasts = ref([])
let toastId = 0

function addToast(message, type = 'success', duration = 3000) {
  const id = toastId++

  // 清理消息中的emoji图标（Toast组件会统一添加）
  let cleanMessage = message
  const emojis = ['✅', '❌', '⚠️', 'ℹ️', '⏳', '📝', '🗑️', '💾', '🚀', '📂', '🖼️', '👁️']
  emojis.forEach((emoji) => {
    cleanMessage = cleanMessage.replace(new RegExp(`^${emoji}\\s*`), '')
  })
  cleanMessage = cleanMessage.trim()

  const toast = {
    id,
    message: cleanMessage,
    type,
  }

  toasts.value.push(toast)

  setTimeout(() => {
    removeToast(id)
  }, duration)
}

function removeToast(id) {
  const index = toasts.value.findIndex(t => t.id === id)
  if (index > -1) {
    toasts.value.splice(index, 1)
  }
}

// 暴露给window对象，让其他组件可以调用
onMounted(() => {
  window.$toast = addToast
})

onUnmounted(() => {
  delete window.$toast
})
</script>

<template>
  <div class="toast-container">
    <TransitionGroup name="toast">
      <div
        v-for="toast in toasts"
        :key="toast.id"
        class="toast-item"
        :class="`toast-${toast.type}`"
      >
        <span class="toast-icon">
          {{ toast.type === 'success' ? '✅' : toast.type === 'error' ? '❌' : 'ℹ️' }}
        </span>
        <span class="toast-message">{{ toast.message }}</span>
      </div>
    </TransitionGroup>
  </div>
</template>

<style scoped>
.toast-container {
  position: fixed;
  top: 80px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 10000;
  display: flex;
  flex-direction: column;
  gap: 12px;
  pointer-events: none;
}

.toast-item {
  min-width: 300px;
  max-width: 600px;
  padding: 16px 24px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 15px;
  font-weight: 500;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15);
  backdrop-filter: blur(10px);
  pointer-events: auto;
  animation: shake 0.5s ease-in-out;
  background: rgba(255, 255, 255, 0.95);
  border: 2px solid;
}

.toast-success {
  color: #22c55e;
  border-color: #22c55e;
  background: rgba(240, 253, 244, 0.95);
}

.toast-error {
  color: #ef4444;
  border-color: #ef4444;
  background: rgba(254, 242, 242, 0.95);
}

.toast-info {
  color: #3b82f6;
  border-color: #3b82f6;
  background: rgba(239, 246, 255, 0.95);
}

.toast-warning {
  color: #f59e0b;
  border-color: #f59e0b;
  background: rgba(255, 251, 235, 0.95);
}

.toast-icon {
  font-size: 20px;
  flex-shrink: 0;
}

.toast-message {
  flex: 1;
  line-height: 1.5;
}

/* 动画 */
.toast-enter-active,
.toast-leave-active {
  transition: all 0.3s ease;
}

.toast-enter-from {
  opacity: 0;
  transform: translateY(-20px) scale(0.9);
}

.toast-leave-to {
  opacity: 0;
  transform: translateY(-20px) scale(0.9);
}

@keyframes shake {
  0%, 100% {
    transform: translateX(0);
  }
  10%, 30%, 50%, 70%, 90% {
    transform: translateX(-2px);
  }
  20%, 40%, 60%, 80% {
    transform: translateX(2px);
  }
}

/* 响应式 */
@media (max-width: 768px) {
  .toast-container {
    top: 70px;
    left: 16px;
    right: 16px;
    transform: none;
  }

  .toast-item {
    min-width: auto;
    max-width: none;
    padding: 12px 16px;
    font-size: 14px;
  }
}
</style>
