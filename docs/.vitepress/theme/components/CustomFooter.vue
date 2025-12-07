<script setup lang="ts">
import { onMounted } from 'vue'

onMounted(() => {
  // 动态插入Buy Me a Coffee二维码到页脚
  const footerContainer = document.querySelector('.VPFooter .container')
  if (footerContainer && !document.querySelector('.coffee-qr-section')) {
    const qrSection = document.createElement('div')
    qrSection.className = 'coffee-qr-section'
    qrSection.innerHTML = `
      <img src="/images/qrcode.webp" alt="Buy Me a Coffee" class="coffee-qr-image" />
      <div class="coffee-qr-info">
        <div class="coffee-qr-text">Buy Me a Coffee</div>
        <div class="coffee-qr-subtext">如果觉得内容有帮助，欢迎请我喝杯咖啡</div>
      </div>
    `
    footerContainer.appendChild(qrSection)
  }
})
</script>

<template>
  <div />
</template>

<style>
/* 注意：这里不使用scoped，因为样式需要应用到动态创建的元素 */
.coffee-qr-section {
  display: flex;
  flex-direction: row; /* 横向排列 */
  align-items: center;
  gap: 12px; /* 二维码和文字之间的间距 */
}

.coffee-qr-image {
  width: 120px;
  height: 120px;
  border-radius: 8px;
  transition: transform 0.3s ease;
  cursor: pointer;
  flex-shrink: 0; /* 防止二维码被压缩 */
}

.coffee-qr-image:hover {
  transform: scale(1.05);
}

.coffee-qr-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
  max-width: 180px;
}

.coffee-qr-text {
  font-size: 14px;
  font-weight: 600;
  color: var(--vp-c-text-1);
  text-align: left;
  line-height: 1.4;
}

.coffee-qr-subtext {
  font-size: 12px;
  color: var(--vp-c-text-2);
  text-align: left;
  line-height: 1.5;
}

/* 移动端样式 */
@media (max-width: 968px) {
  .coffee-qr-section {
    flex-direction: column; /* 移动端改为垂直 */
    gap: 8px;
  }

  .coffee-qr-image {
    width: 100px;
    height: 100px;
  }

  .coffee-qr-info {
    text-align: center;
    max-width: 100%;
  }

  .coffee-qr-text {
    font-size: 13px;
    text-align: center;
  }

  .coffee-qr-subtext {
    font-size: 11px;
    text-align: center;
  }
}
</style>
