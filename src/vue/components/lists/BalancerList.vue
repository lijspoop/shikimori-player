<script setup lang="ts">
import { ref } from 'vue';
import BalancerItem from '#/components/items/BalancerItem.vue';
const balancerTitle = ref('Плеер');

defineProps<{
  balancers?: object[];
}>();

</script>

<template>
  <div class="sp_balancers">
    <div class="title">{{ balancerTitle }}</div>
    <div class="list">
      <BalancerItem title="Kodik" is-active data-balancer="0" />
      <BalancerItem title="Universe" is-disabled data-balancer="1" />
    </div>
  </div>
</template>