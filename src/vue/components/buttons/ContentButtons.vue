<script setup lang="ts">
import { computed } from 'vue';

defineProps<{
  isUiVisible: boolean
}>();

import { storeToRefs } from 'pinia';

import { useOptionsStore } from '#/stores/options';
const optionsStore = useOptionsStore();
const { sidebarVisible, sidebarHeight } = storeToRefs(optionsStore);

import { faArrowUp, faArrowDown, faArrowLeft, faArrowRight } from '@fortawesome/free-solid-svg-icons';

const arrowUpDown = computed(() => {
  return sidebarHeight.value ? faArrowUp : faArrowDown;
});

const arrowLeftRight = computed(() => {
  return sidebarVisible.value ? faArrowRight : faArrowLeft;
});

const toggleSidebarTitleUpDown = computed(() => {
  return sidebarHeight.value ? 'Уменьшить по высоте' : 'Увеличить по высоте';
});

const toggleSidebarTitleLeftRight = computed(() => {
  return sidebarVisible.value ? 'Свернуть меню' : 'Развернуть меню';
});
</script>

<template>
  <div
    :class="[
      'sp-viewport_buttons',
      'sp-buttons',
      'group',
      { visible: isUiVisible }
    ]"
    >
    <div
      class="b-link_button is-icon size-lg"
      :title="toggleSidebarTitleUpDown"
      @click="optionsStore.setSidebarHeight(!sidebarHeight)"
      >
      <fa-icon :icon="arrowUpDown" />
    </div>
    <div
      class="b-link_button is-icon size-lg"
      :title="toggleSidebarTitleLeftRight"
      @click="optionsStore.setSidebarVisible(!sidebarVisible)"
      >
      <fa-icon :icon="arrowLeftRight" />
    </div>
  </div>
</template>