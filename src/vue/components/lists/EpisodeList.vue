<script setup lang="ts">
import EpisodeItem from '#/components/items/EpisodeItem.vue';

import { storeToRefs } from 'pinia';
import { useMainStore } from '#/stores/main';
const main = useMainStore();
const { hasEpisodes } = storeToRefs(main);

</script>

<template>
  <div v-if="hasEpisodes" class="sp_episodes">
    <div data-scroll-container>
      <div class="inner" data-scroll-content>
        <EpisodeItem episode="1" />
        <EpisodeItem episode="2" />
        <EpisodeItem episode="3" is-watched />
        <EpisodeItem episode="4" is-active />
        <EpisodeItem episode="5" />
        <EpisodeItem episode="6" />
        <EpisodeItem episode="7" is-disabled />
      </div>
    </div>
  </div>
</template>