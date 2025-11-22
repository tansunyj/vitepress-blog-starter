---
layout: doc
title: "导航菜单管理"
---

<script setup>
import { defineAsyncComponent } from 'vue'

const MenuManager = defineAsyncComponent(() =>
  import('../.vitepress/theme/components/tools/MenuManager.vue')
)
</script>

<ClientOnly>
  <MenuManager />
</ClientOnly>
