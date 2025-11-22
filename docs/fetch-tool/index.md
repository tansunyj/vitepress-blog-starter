---
title: "文章爬取工具"
description: "从微信公众号等平台爬取文章并转换为Markdown"
layout: page
---

<script setup>
import { defineAsyncComponent } from 'vue'

const FetchArticleTool = defineAsyncComponent(() =>
  import('../.vitepress/theme/components/tools/FetchArticleTool.vue')
)
</script>

<ClientOnly>
  <FetchArticleTool />
</ClientOnly>
