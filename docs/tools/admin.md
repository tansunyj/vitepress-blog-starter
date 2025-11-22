---
layout: doc
title: "管理后台"
---

<script setup>
import { defineAsyncComponent } from 'vue'

const AdminDashboard = defineAsyncComponent(() =>
  import('../.vitepress/theme/components/tools/AdminDashboard.vue')
)
</script>

<style>
/* 移除VitePress默认容器限制 */
.vp-doc {
  max-width: none !important;
  padding: 0 !important;
  margin: 0 !important;
}

.VPDoc.has-sidebar .container,
.VPDoc.has-aside .container {
  max-width: none !important;
}
</style>

<ClientOnly>
  <AdminDashboard />
</ClientOnly>
