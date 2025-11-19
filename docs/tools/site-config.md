---
layout: doc
title: 网站配置管理
---

<script setup>
import { defineAsyncComponent } from 'vue'

const SiteConfig = defineAsyncComponent(() =>
  import('../.vitepress/theme/components/tools/SiteConfig.vue')
)
</script>

<ClientOnly>
  <SiteConfig />
</ClientOnly>
