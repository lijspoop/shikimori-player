<script setup lang="ts">
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import PlayerEpisodesSearch from '../PlayerEpisodesSearch.vue';

import { storeToRefs } from 'pinia';

import { useOptionsStore } from '@/vue/stores/options';
import { useSelectedStore } from '@/vue/stores/selected';

const optionsStore = useOptionsStore();
const { searchVisible } = storeToRefs(optionsStore);

const selectedStore = useSelectedStore();
const { translation, totalEpisodes } = storeToRefs(selectedStore);

</script>

<template>
  <div
    v-if="!searchVisible"
    :class="[
      'sp-episodes_buttons',
      'sp-buttons',
      'group'
    ]"
    >
    <div
      class="b-link_button is-icon"
      @click="searchVisible = true"
      >
      <div class="icon">
        <FaIcon :icon="faMagnifyingGlass" />
      </div>
    </div>
  </div>
  <PlayerEpisodesSearch
    v-else
    :key="0"
    :episodes="Array.from({ length: totalEpisodes }, (_, i) => (translation?.data.totalEpisodes?.start || 1) + i)"
    :scroll-container="() => $el.parentElement.querySelector('[data-scroll-content]')"
    :horizontal="true"
    :min-episode-number="translation?.data.totalEpisodes?.start || 1"
    :max-episode-number="translation?.data.totalEpisodes?.end || 1"
    @hide-click="searchVisible = false"
    />
</template>