<script setup lang="ts">
import BalancerList from '#/components/lists/BalancerList.vue';
import TranslationList from '#/components/lists/TranslationList.vue';
import TranslationTypes from '#/components/lists/TranslationTypes.vue';

import { faBookmark as faBookmarkSolid, faEye } from '@fortawesome/free-solid-svg-icons';
import { faBookmark as faBookmarkRegular } from '@fortawesome/free-regular-svg-icons';

import { storeToRefs } from 'pinia';

import { useMainStore } from '#/stores/main';
const mainStore = useMainStore();
const { anime } = storeToRefs(mainStore);

import { useSelectedStore } from '@/vue/stores/selected';
import { computed } from 'vue';
import { ref } from 'vue';

const selectedStore = useSelectedStore();
const { episode } = storeToRefs(selectedStore);

const watched = computed(() => (anime.value?.userRate?.episodes || 0) > episode.value);
const lastWatched = computed(() => anime.value?.userRate?.episodes === episode.value);

const bookmark = computed(() => {
  return lastWatched.value ? faBookmarkSolid : watched.value ? faEye : faBookmarkRegular;
});

const watchedTitle = computed(() => {
  return lastWatched.value ? 'В закладках' : watched.value ? 'Просмотрен' : 'В просмотренное';
});

const submitWatch = async () => {
  if (anime.value?.userRate?.episodes === episode.value) return; 
  const user_rate = $('.b-user_rate.anime-' + anime.value.id);
  const model = user_rate.data('view_object').model;
  
  const method: 'patch' | 'post' = user_rate.find('form').data('method').toLowerCase();
  const requestData: {
    [key: string]: string
  } = {
    episodes: String(episode.value)
  };

  if (method === 'post') {
    requestData.status = 'watching';
  } else if (method === 'patch') {
    if (model.status === 'completed') {
      requestData.status = 'rewatching';
    }
    else if (episode.value === anime.value.episodes) {
      requestData.status = 'completed';
      if (model.status === 'rewatching') {
        requestData.rewatches = String(model.rewatches + 1);
      } 
    }
    else if (model.status !== 'rewatching' && model.status !== 'watching' ) {
      requestData.status = 'watching';
    }
  }
  
  const response = await fetch(`/user_rates/${model.id}/edit`, {
    method: 'GET'
  });
  
  const data = await response.text();
  
  const doc = new DOMParser().parseFromString(data, 'text/html');
  const $form = $(doc).find('form');
  $form.find('input[name="user_rate[episodes]"]').val(requestData.episodes);

  if ('status' in requestData) {
    $form.find('select[name="user_rate[status]"]').val(requestData.status);
  }

  if ('rewatches' in requestData) {
    $form.find('input[name="user_rate[rewatches]"]').val(requestData.rewatches);
  }

  $form.addClass('hidden');
  user_rate.find('.b-add_to_list').after($form);
  $form.submit();
};
console.log($(document.body).data('user'));

const isSignedIn = ref($(document.body).data('user').id ? true : false);
</script>

<template>
  <div class="sp-sidebar">
    <div class="sp-selection_panel">
      <BalancerList />
      <TranslationTypes />
      <TranslationList />
    </div>
    <div v-if="isSignedIn" class="sp-buttons stretch">
      <div class="sp-buttons group stretch">
        <div
          :class="[ 'b-link_button', { watched: lastWatched } ]"
          @click="submitWatch()"
          >
          <FaIcon :icon="bookmark" class="fa-sm" />
          <span class="number">{{ watchedTitle }}</span>
        </div>
      </div>
    </div>
  </div>
</template>