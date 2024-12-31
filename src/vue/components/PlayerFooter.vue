<script setup lang="ts">
import { GM_info } from '$'; 
const version = GM_info.script.version.split('.');
</script>

<template>
  <div class="sp-footer">
    <div 
      class="script-info"
      :data-name="GM_info.script.name"
      :data-version="GM_info.script.version"
      :data-version-major="version[0]"
      :data-version-minor="version[1]"
      :data-version-patch="version[2]"
      >
      <span class="name">{{ GM_info.script.name }}</span>
      <span class="version"> v{{ GM_info.script.version }}</span>
    </div>
  </div>
</template>