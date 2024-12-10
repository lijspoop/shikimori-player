<script setup lang="ts">
import BalancerList from '#/components/lists/BalancerList.vue';
import TranslationList from '#/components/lists/TranslationList.vue';
import TranslationTypes from '#/components/lists/TranslationTypes.vue';
</script>

<template>
  <div class="sp_sidebar">
    <div class="sp_selection-panel">
      <BalancerList 
        :balancers="[
          { title: 'Kodik' },
          { title: 'Universe' },
        ]"
        />
      <TranslationTypes />
      <TranslationList
        :translations="[
          { title: 'Dub.Pro' },
          { title: 'Дубляж' },
        ]"
        />
    </div>
  </div>
</template>