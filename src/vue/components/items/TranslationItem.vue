<script setup lang="ts">
defineProps<{
  active?: boolean;
  disabled?: boolean;
  content: string;
  size: number;
}>();
</script>

<template>
  <a
    :class="[
      'b-menu-line',
      'entry',
      'b-link',
      {
        active,
        disabled
      }
    ]"
    >
    <span
      v-if="size !== 0"
      class="size tiny"
      >
      {{ size }}
    </span>
    <span class="name" :data-title="content">{{ content }}</span>
  </a>
</template>