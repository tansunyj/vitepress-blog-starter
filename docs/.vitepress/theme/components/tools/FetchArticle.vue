<script setup>
// 文章爬取功能 - 复用现有的fetch页面内容
</script>

<template>
  <div class="fetch-article-wrapper">
    <iframe src="/tools/fetch.html" class="fetch-iframe" />
  </div>
</template>

<style scoped>
.fetch-article-wrapper {
  width: 100%;
  height: calc(100vh - 120px);
  min-height: 600px;
}

.fetch-iframe {
  width: 100%;
  height: 100%;
  border: none;
  border-radius: 8px;
}
</style>
