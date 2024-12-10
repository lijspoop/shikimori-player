<script setup lang="ts">
import { computed } from 'vue';

import { storeToRefs } from 'pinia';
import { useMainStore } from '#/stores/main';

import { faArrowLeft, faArrowRight } from '@fortawesome/free-solid-svg-icons';

const main = useMainStore();
const { sidebarVisible } = storeToRefs(main);

const arrow = computed(() => {
  return sidebarVisible.value ? faArrowRight : faArrowLeft;
});

const toggleSidebarTitle = computed(() => {
  return sidebarVisible.value ? 'Свернуть меню' : 'Развернуть меню';
});

const playerLink = computed(() => {
  return '';
});

</script>

<template>
  <div class="sp_content viewport">
    <div
      id="anime_video"
      class="viewport_video"
      data-video-player
      >
      <iframe
        width="100%"
        height="100%"
        allowfullscreen
        :src="playerLink"
        />
    </div>
    <div class="viewport_buttons visible">
      <div
        class="b-button icon"
        :title="toggleSidebarTitle"
        @click="sidebarVisible = !sidebarVisible"
        >
        <FontAwesomeIcon :icon="arrow" />
      </div>
    </div>
  </div>
</template>