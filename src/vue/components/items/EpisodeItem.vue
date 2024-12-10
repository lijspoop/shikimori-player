<script setup lang="ts">
defineProps<{
  episode: string | number;
  isActive?: boolean;
  isDisabled?: boolean;
  isWatched?: boolean;
}>();
</script>

<template>
  <CustomButton
    :class="[
      'episode',
      isWatched ? 'watched' : ''
    ]"
    type="button"
    :is-active
    :is-disabled
    >
    <div class="status item-sign" />
    <span class="number" :data-episode-number="episode">{{ episode }} эпизод</span>
  </CustomButton>
</template>