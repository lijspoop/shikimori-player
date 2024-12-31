<script setup lang="ts">
defineProps<{
  active?: boolean;
  disabled?: boolean;
  content: string;
}>();
</script>

<template>
  <div
    :class="[
      'b-tag',
      {
        active,
        disabled
      },
      'balancer'
    ]"
    :data-title="content"
    href
    >
    <span>{{ content }}</span>
  </div>
</template>