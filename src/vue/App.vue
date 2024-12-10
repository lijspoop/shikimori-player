<script setup lang="ts">
import { ref } from 'vue';
import PlayerContent from '#/components/PlayerContent.vue';
import PlayerSidebar from '#/components/PlayerSidebar.vue';
import PlayerFooter from '#/components/PlayerFooter.vue';
import PlayerEpisodes from '#/components/lists/EpisodeList.vue';


import { storeToRefs } from 'pinia';
import { useMainStore } from '#/stores/main';
const main = useMainStore();
const { sidebarVisible } = storeToRefs(main);

const headline = ref('Смотреть');
</script>

<template>
  <div class="subheadline">{{ headline }}</div>
  <div class="block">
    <CustomContainer :data-player-sidebar="sidebarVisible ? 'visible' : 'hidden'" data-player-container>
      <PlayerContent />
      <PlayerSidebar />
    </CustomContainer>
    <CustomContainer>
      <PlayerEpisodes />
    </CustomContainer>
    <PlayerFooter />
  </div>
</template>