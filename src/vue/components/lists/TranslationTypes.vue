<script setup lang="ts">
import TranslationType from '#/components/items/TranslationType.vue';
</script>

<template>
  <div class="sp_tabs">
    <TranslationType title="Озвучка" is-active />
    <TranslationType title="Субтитры" is-disabled />
  </div>
</template>