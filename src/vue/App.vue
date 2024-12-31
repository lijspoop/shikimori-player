<script setup lang="ts">
import { onMounted, ref } from 'vue';
import PlayerContent from '#/components/PlayerContent.vue';
import PlayerSidebar from '#/components/PlayerSidebar.vue';
import PlayerFooter from '#/components/PlayerFooter.vue';
import PlayerEpisodesList from '@/vue/components/PlayerEpisodesList.vue';

import { storeToRefs } from 'pinia';

import { useMainStore } from '#/stores/main';
const mainStore = useMainStore();
const { anime } = storeToRefs(mainStore);

import { useOptionsStore } from '#/stores/options';
const optionsStore = useOptionsStore();
const { hasEpisodes, sidebarVisible, sidebarHeight } = storeToRefs(optionsStore);

import { useSelectedStore } from '#/stores/selected';
const selectedStore = useSelectedStore();

const headline = ref('Смотреть');

mainStore.initBalancers();

const nextEpisode = (watchedEpisodes: number) => {
  return watchedEpisodes + (selectedStore.isMissingEpisode(watchedEpisodes + 1) ? 0 : 1);
};

const hasColorTextHint = ref(false);

onMounted(() => {
  $(document).on('ajax:success', () => {
    const $user_rate = $('.b-user_rate.anime-' + anime.value.id);
    anime.value.userRate = $user_rate.data('view_object')?.model;

    if (anime.value.userRate?.episodes) {
      let episode = nextEpisode(anime.value.userRate.episodes);
      if (episode > anime.value.episodes) {
        episode = anime.value.userRate.episodes;
      }
      selectedStore.setEpisode(episode);
    }
  });

  if (getComputedStyle(document.documentElement).getPropertyValue('--color-text-hint')) {
    hasColorTextHint.value = true;
  }
});
</script>

<template>
  <div class="subheadline">{{ headline }}</div>
  <div :class="['block', { 'boop': hasColorTextHint }]">
    <div
      :class="[ 'sp-container', 'sp-content', { 'max-height': sidebarHeight }]"
      :data-player-sidebar="sidebarVisible ? 'visible' : 'hidden'" 
      data-player-container
      >
      <PlayerContent />
      <PlayerSidebar />
    </div>
    <div v-if="hasEpisodes" class="sp-container sp-episodes">
      <PlayerEpisodesList />
    </div>
    <PlayerFooter />
  </div>
</template>