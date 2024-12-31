<script setup lang="ts">
import TranslationTypeItem from '@/vue/components/items/TranslationTypeItem.vue';
import { TranslationsType } from '@/player/balancers';

import { storeToRefs } from 'pinia';

import { useSelectedStore } from '@/vue/stores/selected';
import { computed } from 'vue';
const selectedStore = useSelectedStore();
const { translationType, getBalancer } = storeToRefs(selectedStore);
interface TranslationTypesData {
  id: number;
  title: string;
  type: TranslationsType;
  total: number;
  hidden: boolean;
}

const translationTypes = computed(() => {
  const translations = getBalancer.value?.translations;
  
  return <TranslationTypesData[]>[
    {
      id: 0,
      title: 'Озвучка',
      type: 'voice',
      total: translations?.voice?.length || 0,
      hidden: false
    },
    {
      id: 1,
      title: 'Субтитры',
      type: 'subtitles',
      total: translations?.subtitles?.length || 0,
      hidden: false
    },
    {
      id: 2,
      title: '. . .',
      type: 'unknown',
      total: 0,
      hidden: (translations?.unknown?.length || 0) === 0
    }
  ].filter((item) => !item.hidden);
});

const selectTranslationType = (type: TranslationsType, disabled: boolean) => {
  if (disabled) return;
  selectedStore.setTranslationType(type);
};
</script>

<template>
  <div class="sp-tabs b-stats_bar">
    <div class="stat_names">
      <TranslationTypeItem 
        v-for="item in translationTypes"
        :key="item.id"
        v-bind="{
          content: item.title,
          total: item.total,
          active: translationType === item.type
        }"
        @click="selectTranslationType(item.type, item.hidden)"
        />
    </div>
  </div>
</template>