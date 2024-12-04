<script setup lang="ts">
import { computed } from 'vue';
import HelloWorld from '#/components/HelloWorld.vue';

import { GM_info } from '$'; 

const logo = computed(() => {
  const icon = new URL(GM_info.script.icon || '');
  icon.searchParams.set('sz', '256');
  return icon.toString();
});
</script>

<template>
  <div>
    <a href="/shikimori">
      <img :src="logo" class="logo" alt="Shikimori logo">
    </a>
  </div>
  <HelloWorld :msg="GM_info.script.name" />
</template>

<style scoped>
.logo {
  height: 12em;
  padding: 1.5em;
  will-change: filter;
}

.logo:hover {
  filter: drop-shadow(0 0 2em #ffffffaa);
}
</style>
