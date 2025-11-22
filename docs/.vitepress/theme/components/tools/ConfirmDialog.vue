<script setup>
import { onMounted, onUnmounted } from 'vue'

const props = defineProps({
  modelValue: {
    type: Boolean,
    required: true
  },
  title: {
    type: String,
    default: '确认操作'
  },
  message: {
    type: String,
    default: ''
  },
  confirmText: {
    type: String,
    default: '确定'
  },
  cancelText: {
    type: String,
    default: '取消'
  },
  type: {
    type: String,
    default: 'warning', // warning, danger, info
    validator: (value) => ['warning', 'danger', 'info'].includes(value)
  }
})

const emit = defineEmits(['update:modelValue', 'confirm', 'cancel'])

function handleConfirm() {
  emit('confirm')
  emit('update:modelValue', false)
}

function handleCancel() {
  emit('cancel')
  emit('update:modelValue', false)
}

// Close on Escape key
function handleKeydown(e) {
  if (props.modelValue && e.key === 'Escape') {
    handleCancel()
  }
}

onMounted(() => {
  window.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeydown)
})
</script>

<template>
  <Teleport to="body">
    <Transition name="dialog-fade">
      <div v-if="modelValue" class="dialog-overlay" @click="handleCancel">
        <div class="dialog-container" @click.stop>
          <div class="dialog-header">
            <span class="dialog-icon" :class="type">
              <span v-if="type === 'warning'">⚠️</span>
              <span v-else-if="type === 'danger'">🗑️</span>
              <span v-else>ℹ️</span>
            </span>
            <h3>{{ title }}</h3>
          </div>
          
          <div class="dialog-body">
            <p>{{ message }}</p>
          </div>
          
          <div class="dialog-footer">
            <button class="btn-cancel" @click="handleCancel">
              {{ cancelText }}
            </button>
            <button 
              class="btn-confirm" 
              :class="type"
              @click="handleConfirm"
            >
              {{ confirmText }}
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.dialog-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  backdrop-filter: blur(4px);
}

.dialog-container {
  background: var(--vp-c-bg);
  border-radius: 12px;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
  width: 90%;
  max-width: 400px;
  padding: 24px;
  border: 1px solid var(--vp-c-divider);
  transform-origin: center center;
}

.dialog-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
}

.dialog-icon {
  font-size: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.dialog-header h3 {
  margin: 0;
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--vp-c-text-1);
}

.dialog-body {
  margin-bottom: 24px;
}

.dialog-body p {
  margin: 0;
  color: var(--vp-c-text-2);
  line-height: 1.6;
  white-space: pre-wrap;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}

button {
  padding: 8px 20px;
  border-radius: 8px;
  font-weight: 500;
  font-size: 0.95rem;
  cursor: pointer;
  transition: all 0.2s;
  border: none;
}

.btn-cancel {
  background: var(--vp-c-bg-soft);
  color: var(--vp-c-text-2);
  border: 1px solid var(--vp-c-divider);
}

.btn-cancel:hover {
  background: var(--vp-c-bg-mute);
  color: var(--vp-c-text-1);
}

.btn-confirm {
  color: white;
}

.btn-confirm.warning {
  background: var(--accent-orange);
}

.btn-confirm.warning:hover {
  background: var(--accent-orange-dark);
}

.btn-confirm.danger {
  background: #ef4444;
}

.btn-confirm.danger:hover {
  background: #dc2626;
}

.btn-confirm.info {
  background: var(--vp-c-brand);
}

.btn-confirm.info:hover {
  background: var(--vp-c-brand-dark);
}

/* Transitions */
.dialog-fade-enter-active,
.dialog-fade-leave-active {
  transition: opacity 0.2s ease;
}

.dialog-fade-enter-from,
.dialog-fade-leave-to {
  opacity: 0;
}

.dialog-fade-enter-active .dialog-container,
.dialog-fade-leave-active .dialog-container {
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.dialog-fade-enter-from .dialog-container,
.dialog-fade-leave-to .dialog-container {
  transform: scale(0.95) translateY(10px);
  opacity: 0;
}
</style>
