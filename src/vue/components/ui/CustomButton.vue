<script setup lang="ts">
defineProps<{
  type: 'button' | 'tag';
  isActive?: boolean;
  isDisabled?: boolean;
}>();
</script>

<template>
  <div
    :class="[
      'b-' + type,
      isActive ? 'active' : '',
      isDisabled ? 'disabled' : ''
    ]"
    >
    <slot />
  </div>
</template>