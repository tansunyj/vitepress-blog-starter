---
title: Markdown 编辑器
description: 在线编辑Markdown文档
layout: page
---

<script setup>
import { defineAsyncComponent } from 'vue'

const MarkdownEditor = defineAsyncComponent(() =>
  import('../.vitepress/theme/components/tools/MarkdownEditor.vue')
)
</script>

<ClientOnly>
  <MarkdownEditor />
</ClientOnly>
