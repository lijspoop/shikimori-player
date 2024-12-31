<script setup lang="ts">
import EpisodeItem from '#/components/items/EpisodeItem.vue';
import EpisodesButtons from '#/components/buttons/EpisodesButtons.vue';

import { storeToRefs } from 'pinia';

import { useMainStore } from '#/stores/main';
const mainStore = useMainStore();
const { anime, data } = storeToRefs(mainStore);


import { useSelectedStore } from '@/vue/stores/selected';
import HorizontalScroll from '#/components/ui/HorizontalScroll.vue';

const selectedStore = useSelectedStore();
const { episode } = storeToRefs(selectedStore);

const selectEpisode = (targetEpisode: number) => {
  if (selectedStore.isMissingEpisode(targetEpisode)) return;

  selectedStore.setEpisode(targetEpisode);
};

// v-scroll-to.updated="needScrollTo(targetEpisode)"
// const needScrollTo = (targetEpisode: number) => {
//   if (episode.value === targetEpisode && translationWasChanged.value) {
//     prevTranslation.value = translation.value;
//     return true;
//   }
//   return false;
// };
</script>

<template>
  <EpisodesButtons />
  <HorizontalScroll 
    container="sp-episodes_container"
    :enable-wheel-scroll="true"
    :scroll-to="episode"
    >
    <EpisodeItem
      v-for="targetEpisode in data.totalEpisodes"
      :key="targetEpisode"
      v-bind="{
        active: episode === targetEpisode,
        disabled: selectedStore.isMissingEpisode(targetEpisode),
        episode: targetEpisode,
        watched: anime?.userRate?.episodes === targetEpisode
      }"
      v-scroll-to.mounted.horizontal="episode === targetEpisode"
      :episode="targetEpisode"
      :data-scroll-id="targetEpisode"
      @click="selectEpisode(targetEpisode)"
      />
  </HorizontalScroll>
</template>