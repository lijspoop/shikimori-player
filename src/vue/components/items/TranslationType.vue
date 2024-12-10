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
    >
    <span class="title">{{ title }}</span>
  </CustomButton>
</template>