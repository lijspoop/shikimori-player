<script setup lang="ts">
import { faBookmark as faBookmarkSolid } from '@fortawesome/free-solid-svg-icons';

defineProps<{
  active?: boolean;
  disabled?: boolean;
  episode: number;
  watched?: boolean;
}>();
</script>

<template>
  <div
    :class="[
      'b-link_button',
      {
        dark: active || disabled,
        disabled
      },
      { watched },
      'episode'
    ]"
    >
    <FaIcon :icon="faBookmarkSolid" :class="['fa-sm', { hidden: !watched } ]" />
    <span class="number" :data-episode-number="episode">{{ episode }} эпизод</span>
  </div>
</template>