<script setup lang="ts">
import { ref } from 'vue';
import BalancerItem from '#/components/items/BalancerItem.vue';

const headline = ref('Плеер');

import { storeToRefs } from 'pinia';

import { useMainStore } from '#/stores/main';
const mainStore = useMainStore();
const { getBalancers } = storeToRefs(mainStore);

import { useSelectedStore } from '@/vue/stores/selected';
const selectedStore = useSelectedStore();
const { balancerName } = storeToRefs(selectedStore);

</script>

<template>
  <div class="sp-balancers">
    <div class="title">{{ headline }}</div>
    <div class="list">
      <BalancerItem 
        v-for="(balancer, index) in getBalancers"
        :key="index"
        v-bind="{
          content: balancer.title,
          active: balancerName === balancer.title
        }"
        @click="selectedStore.setBalancerName(balancer.title)"
        />
    </div>
  </div>
</template>