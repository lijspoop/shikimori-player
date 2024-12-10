<script setup lang="ts">
defineProps<{
  title: string;
  isActive?: boolean;
  isDisabled?: boolean;
}>();
</script>

<template>
  <CustomButton
    type="tag"
    :is-active
    :is-disabled
    :data-title="title"
    >
    <span>{{ title }}</span>
  </CustomButton>
</template>