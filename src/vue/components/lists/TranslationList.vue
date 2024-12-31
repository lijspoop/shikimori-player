<script setup lang="ts">
import TranslationItem from '#/components/items/TranslationItem.vue';
import { BalancersNames, Translation } from '@/player/balancers';

import { storeToRefs } from 'pinia';

import { useSelectedStore } from '@/vue/stores/selected';

const selectedStore = useSelectedStore();
const { translation: selectedTranslation, translationsSorted } = storeToRefs(selectedStore);

const getTotalEpisodes = (targetTranslation: Translation<BalancersNames>) => {
  if (!targetTranslation.data.totalEpisodes) {
    return targetTranslation.data.link ? 1 : 0;
  }
  return (targetTranslation.data.totalEpisodes?.end - targetTranslation.data.totalEpisodes.start || 0) + 1;
};

const title = (value: Translation<BalancersNames>) => {
  let result = '1 эпизод';
  if (!value.data.link && value.data.totalEpisodes) {
    result = (value.data.totalEpisodes.start === value.data.totalEpisodes.end
      ? `${value.data.totalEpisodes.start}`
      : `с ${value.data.totalEpisodes.start} по ${value.data.totalEpisodes.end}`)
            + ' эпизод';
  }

  if ('quality' in value.data)
    result += ` [${value.data.quality}]`;

  return result;
};
</script>

<template>
  <div class="sp-translations">
    <div data-scroll-container>
      <div class="inner" data-scroll-content>
        <TranslationItem
          v-for="(translation, index) in translationsSorted"
          :key="index"
          v-scroll-to.mounted.vertical="selectedTranslation === translation"
          v-bind="{
            content: translation.title,
            active: selectedTranslation === translation,
            size: getTotalEpisodes(translation)
          }"
          :data-ep-start="translation.data?.totalEpisodes?.start || 1"
          :data-ep-end="translation.data?.totalEpisodes?.end || 1"
          :title="title(translation)"
          @click="selectedStore.setTranslation(translation)"
          />
      </div>
    </div>
  </div>
</template>