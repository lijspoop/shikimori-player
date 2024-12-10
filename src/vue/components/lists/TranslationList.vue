<script setup lang="ts">
import TranslationItem from '#/components/items/TranslationItem.vue';

defineProps<{
  translations?: object[];
}>();

</script>

<template>
  <div class="sp_menu">
    <div class="menu-list">
      <TranslationItem title="Dub.Pro" is-active />
      <TranslationItem title="Дубляж" />
    </div>
  </div>
</template>