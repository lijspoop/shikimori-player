<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue';

import { faChevronLeft, faChevronRight, faChevronUp, faChevronDown, faTimes } from '@fortawesome/free-solid-svg-icons';


const props = defineProps<{
  episodes: Array<number>;
  scrollContainer: () => HTMLElement;
  horizontal: boolean;
  minEpisodeNumber: number;
  maxEpisodeNumber: number;
}>();

const emit = defineEmits<{
  (e: 'hide-click', value: boolean): void;
}>();

const arrowPrev = computed(() => props.horizontal ? faChevronLeft : faChevronUp);
const arrowNext = computed(() => props.horizontal ? faChevronRight : faChevronDown);

let scrollOffset = 0;

const filteredEpisodes = ref<number[]>([]);
const currentIndex = ref(0);
const searchQuery = ref('');
let scrollElement: HTMLElement | null = null;
let inputElement: HTMLInputElement | null = null;

const resetSearch = () => {
  searchQuery.value = '';

  filteredEpisodes.value = [];
  scrollToIndex(0, true);

  emit('hide-click', false);
};

watch(searchQuery, (newValue, oldValue) => {
  if (!oldValue && scrollElement) {
    scrollOffset = props.horizontal? scrollElement.scrollLeft : scrollElement.scrollTop;
  }

  newValue = newValue.toString().trim();

  if (newValue.length && /\d+/.test(newValue)) {
    filteredEpisodes.value = props.episodes.filter((episode) => String(episode).includes(newValue));
  } else {
    resetScroll(scrollOffset);
    filteredEpisodes.value = [];
  }
  scrollToIndex(0, true);
});

const scrollToIndex = (index: number, shouldFocus: boolean = false) => {
  let targetElement;
  if (filteredEpisodes.value.length) {
    currentIndex.value = index;
    const episode = String(filteredEpisodes.value[currentIndex.value]);

    if (episode) {
      if (!scrollElement) return;
      targetElement = scrollElement.querySelector(`[data-scroll-id="${episode}"]`) as HTMLElement;
      
      let scrollPosition = 0;

      if (props.horizontal ) {

        scrollPosition = targetElement.offsetLeft - targetElement.offsetWidth;
      }
      else {
        scrollPosition = targetElement.offsetTop - targetElement.offsetHeight;
      }
      setScrollPosition(scrollPosition);
    }
  }
  highlightElement(targetElement, shouldFocus);
};

const setScrollPosition = (position: number) => {
  if (!scrollElement) return;

  if (props.horizontal) {
    scrollElement.scrollLeft = position;
  } else {
    scrollElement.scrollTop = position;
  }
};

const highlightElement = (element: HTMLElement | undefined, shouldFocus: boolean) => {
  const highlightClass = 'highlight';
  const currentHighlight = scrollElement?.querySelector(`.${highlightClass}`) as HTMLElement;
  if (currentHighlight) currentHighlight.classList.remove(highlightClass);
  if (element) element.classList.add(highlightClass);
  if (shouldFocus && inputElement) inputElement.focus();
};

const resetScroll = (scrollOffset: number) => {
  if (!scrollElement) return;
  
  if (props.horizontal) {
    scrollElement.scrollLeft = scrollOffset;
  }
  else {
    scrollElement.scrollTop = scrollOffset;
  }
};

onMounted(() => {
  scrollElement = props.scrollContainer();
  inputElement = scrollElement?.querySelector('input') as HTMLInputElement;
});
</script>

<template>
  <div ref="root" :class="[ 'sp-episodes_search']">
    <div :class="[ 'sp-episodes_search_input' ]">
      <div :class="[ 'b-input', 'integer' ]">
        <input
          v-model="searchQuery"
          :class="[ 'numeric', 'integer' ]"
          :min="minEpisodeNumber"
          :max="maxEpisodeNumber"
          :icon-left="!horizontal ? 'search' : undefined"
          placeholder="№ Эпизода"
          inputmode="numeric"
          pattern="\\d*"
          type="number"
          >
      </div>
      <div v-if="searchQuery" :class="[ 'found-episodes' ]">
        {{ currentIndex + 1 }} / {{ filteredEpisodes.length }}
      </div>
    </div>
    <div class="sp-divider vertical" />
    <div
      v-if="horizontal || searchQuery"
      :class="[
        'sp-episodes_search_buttons',
        'sp-buttons',
        'group'
      ]"
      >
      <div
        class="b-link_button is-icon"
        @click="() => {
          if (currentIndex < minEpisodeNumber) return;
          scrollToIndex(currentIndex - 1);
        }"
        >
        <div class="icon">
          <fa-icon :icon="arrowPrev" />
        </div>
      </div>
      <div
        class="b-link_button is-icon"
        @click="() => {
          // понятия не имею почему 2
          if (currentIndex + 2 > filteredEpisodes.length) return;
          scrollToIndex(currentIndex + 1);
        }"
        >
        <div class="icon">
          <fa-icon :icon="arrowNext" />
        </div>
      </div>
      <div
        class="b-link_button is-icon"
        @click="resetSearch"
        >
        <div class="icon">
          <fa-icon :icon="faTimes" />
        </div>
      </div>
    </div>
  </div>
</template>