<script setup lang="ts">
defineProps<{
  title: string;
  isActive?: boolean;
  isDisabled?: boolean;
}>();
</script>

<template>
  <CustomButton
    type="button"
    :is-active
    :is-disabled
    :data-title="title"
    >
    <span>{{ title }}</span>
  </CustomButton>
</template>