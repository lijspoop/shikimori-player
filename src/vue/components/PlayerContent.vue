<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue';

import ContentButtons from '#/components/buttons/ContentButtons.vue';

import { storeToRefs } from 'pinia';

import { useSelectedStore } from '@/vue/stores/selected';
const selectedStore = useSelectedStore();
const { translation, episode, getBalancer } = storeToRefs(selectedStore);

import { BalancersNames, LinkParams } from '@/player/balancers';

const playerLink = computed(() => {

  const _translation = translation.value;
  const result = _translation?.data?.episodes?.[episode.value] || _translation?.data?.link;
  if (!result) return '';
  const params = new URLSearchParams;
  const balancerParams: Partial<LinkParams<BalancersNames>> = getBalancer.value?.options.linkParams || {};
  
  for (const [ key, value ] of Object.entries(balancerParams)) {
    params.set(key, value);
  }

  return (typeof result === 'object' ? result?.link : result) + `?${params.toString()}`;
});

const isUiVisible = ref(true);

const kodikHandler: (this: Window, ev: MessageEvent<any>) => any = (ev) => {
  if (ev.data?.key === 'kodik_player_pause') {
    isUiVisible.value = true;
  }
  else if (ev.data?.key === 'kodik_player_play') {
    isUiVisible.value = false;
  }
  /* else if (ev.data?.key === 'kodik_player_video_ended') {
    // здесь скорее всего можно сделать автоматическое переключение на следующий эпизод
  }
  else if (ev.data?.key === 'kodik_player_duration_update') {
    // не знаю как это можно использовать
  } */
};

onMounted(() => {
  window.addEventListener('message', kodikHandler);
});

onUnmounted(() => {
  window.removeEventListener('message', kodikHandler);
});
</script>

<template>
  <div class="sp-viewport">
    <div
      id="anime_video"
      class="sp-viewport_video-player"
      data-video-player
      >
      <iframe
        class="sp-viewport_iframe"
        :src="playerLink"
        frameborder="0"
        allowfullscreen
        />
    </div>
    <ContentButtons :is-ui-visible="isUiVisible" />
  </div>
</template>