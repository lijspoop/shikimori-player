<script setup lang="ts">
// восстановленный код с помощью gpt-4o. код взят с сайта https://anilib.me/ru/anime/{slug_url}/watch
import { Ref, ref, computed, reactive, watchEffect, onMounted, onBeforeUnmount, nextTick, watch } from 'vue';

import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';

interface Props {
  container?: any;
  scrollTo?: string | number;
  scrollPositionKey?: string;
  arrowStyle?: string;
  disableArrows?: boolean;
  enableWheelScroll?: boolean;
}

const props = defineProps<Props>();

interface CustomWheelEvent extends Event {
  detail?: number,
  wheelDelta?: number,
  wheelDeltaY?: number,
  deltaY?: number,
  deltaMode?: number
}

function getScrollDelta(event: CustomWheelEvent) {
  return event.detail
    ? event.wheelDelta ? event.wheelDelta / event.detail / 40 * (event.detail > 0 ? 1 : -1)
      : -event.detail / 3
    : (event.wheelDelta || 1) / 120;
}

function createScrollHandler(
  container: HTMLElement,
  scrollStep: number,
  animationDuration: number,
  direction = 'horizontal'
) {
  let isScrolling = false;
  let isAnimating = false;
  let targetScrollLeft = container.scrollLeft;
  let currentScrollLeft = container.scrollLeft;

  function onScrollEvent(event: Event) {
    event.preventDefault();
    const delta = getScrollDelta(event as WheelEvent);
    targetScrollLeft += -delta * scrollStep;

    if (direction === 'vertical') {
      targetScrollLeft = Math.max(0, Math.min(targetScrollLeft, container.scrollHeight - container.clientHeight));
    } else {
      targetScrollLeft = Math.max(0, Math.min(targetScrollLeft, container.scrollWidth - container.clientWidth));
    }

    if (!isAnimating) {
      animateScroll();
    }
  }

  function animateScroll() {
    const scrollDifference = (targetScrollLeft - currentScrollLeft) / animationDuration;
    isAnimating = true;
    currentScrollLeft = parseFloat((currentScrollLeft + scrollDifference).toFixed(2));
    container.scrollLeft = currentScrollLeft;

    if (Math.abs(scrollDifference) > 0.5) {
      requestAnimationFrame(animateScroll);
    } else {
      isAnimating = false;
    }
  }

  function onScroll() {
    if (!isAnimating) {
      currentScrollLeft = targetScrollLeft = container.scrollLeft;
    }
  }

  function onWheelEvent(event: CustomWheelEvent) {
    let isValidWheelEvent = false;
    if (event.wheelDeltaY) {
      isValidWheelEvent = event.wheelDeltaY === (event.deltaY || 0) * -3;
    } else if (event.deltaMode === 0) {
      isValidWheelEvent = true;
    }

    if (isValidWheelEvent) {
      startScroll();
    } else {
      stopScroll();
    }
  }

  function stopScroll() {
    container.removeEventListener('mousewheel', onWheelEvent);
    container.removeEventListener('DOMMouseScroll', onWheelEvent);
  }

  function startScroll() {
    stopScroll();
    if (!isScrolling) {
      container.removeEventListener('mousewheel', onScrollEvent);
      container.removeEventListener('DOMMouseScroll', onScrollEvent);
      container.removeEventListener('scroll', onScroll);
      isScrolling = true;
    }
  }

  container.addEventListener('scroll', onScroll, { passive: false });
  container.addEventListener('mousewheel', onWheelEvent, { passive: false });
  container.addEventListener('DOMMouseScroll', onWheelEvent, { passive: false });
  container.addEventListener('mousewheel', onScrollEvent, { passive: false });
  container.addEventListener('DOMMouseScroll', onScrollEvent, { passive: false });

  return stopScroll;
}

let scrollPositions: { [key: string]: any} = {};

const trimObject = (obj: { [key: string]: any}, keysToKeep: string[]) => {
  const trimmedObject: { [key: string]: any} = {};
  keysToKeep.forEach((key) => {
    if (key in obj) {
      trimmedObject[key] = obj[key];
    }
  });
  return trimmedObject;
};

const handleScrollPosition = (scrollContainer: Ref<HTMLElement>, key: string | undefined) => {
  if (key) {
    nextTick(() => {
      if (scrollPositions[key]) {
        scrollContainer.value.scrollLeft = scrollPositions[key];
      }
    });

    watchEffect(() => {
      const keys = Object.keys(scrollPositions);
      scrollPositions = trimObject(scrollPositions, keys.slice(0, 99));
      scrollPositions[key] = scrollContainer.value.scrollLeft;
    });
  }
};

const isTablet = ref(false);
const scrollContainer = ref<HTMLElement>({} as HTMLElement);
const dragState = reactive({ dragging: false, pageX: 0, scrollLeft: 0 });
const arrowVisibility = reactive({ left: false, right: false });

handleScrollPosition(scrollContainer, props.scrollPositionKey);

const onMouseDown = (event: MouseEvent) => {
  if (!isTablet.value) {
    dragState.dragging = true;
    dragState.pageX = event.pageX;
    dragState.scrollLeft = scrollContainer.value.scrollLeft;
    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  }
};

const onMouseMove = (event: MouseEvent) => {
  const deltaX = event.pageX - dragState.pageX;
  scrollContainer.value.scrollLeft = dragState.scrollLeft - deltaX;
};

const onMouseUp = () => {
  if (dragState.dragging) {
    dragState.dragging = false;
    document.removeEventListener('mousemove', onMouseMove);
    document.removeEventListener('mouseup', onMouseUp);
  }
};

const updateArrowVisibility = () => {
  if (scrollContainer.value) {
    const isAtEnd = scrollContainer.value.offsetWidth === scrollContainer.value.scrollWidth;
    arrowVisibility.left = scrollContainer.value.scrollLeft >= 25;
    const rightStep = scrollContainer.value.scrollWidth - scrollContainer.value.offsetWidth;

    arrowVisibility.right = !isAtEnd && scrollContainer.value.scrollLeft <= rightStep - 25;
  }
};

const scrollByAmount = (direction: 'left' | 'right') => {
  const scrollAmount = scrollContainer.value.offsetWidth * 0.7;
  let newScrollLeft = direction === 'right'
    ? Math.min(scrollContainer.value.scrollLeft + scrollAmount, scrollContainer.value.scrollWidth)
    : Math.max(scrollContainer.value.scrollLeft - scrollAmount, 0);

  scrollContainer.value.scrollTo({
    left: newScrollLeft,
    behavior: 'smooth'
  });
};

const scrollById = (scrollId: string | number | undefined, smoothScroll: boolean) => {
  if (scrollId !== undefined) {
    const el: HTMLElement | null = scrollContainer.value.querySelector(`[data-scroll-id="${scrollId}"]`);
    if (el) {
      const K = el.offsetLeft + el.offsetWidth / 2 - scrollContainer.value.parentElement!.offsetWidth / 2;
      scrollContainer.value.scrollTo({
        left: K,
        behavior: smoothScroll ? 'smooth' : 'auto'
      });
    }
  }
};

let wheelScrollHandler: () => void;

watch(() => props.scrollTo, (scrollId) => {
  scrollById(scrollId, true);
});

onMounted(() => {
  updateArrowVisibility();
  scrollById(props.scrollTo, false);
  if (props.enableWheelScroll) {
    wheelScrollHandler = createScrollHandler(scrollContainer.value, 120, 20);
  }
});

onBeforeUnmount(() => {
  if (props.enableWheelScroll && wheelScrollHandler) {
    wheelScrollHandler();
  }
});

const containerClasses = computed(() => ({
  [props.container]: true,
  drag: dragState.dragging
}));

const arrowClasses = {
  arrow: true,
  'is-icon': true
};

const arrowLeftClasses = computed(function() {
  return {
    ...arrowClasses,
    left: true
  };
});

const arrowRightClasses = computed(() => ({
  ...arrowClasses,
  right: true
}));
</script>

<template>
  <div :class="containerClasses" data-scroll-container>
    <transition name="fade">
      <div
        v-if="!disableArrows"
        v-show="arrowVisibility.left"
        :class="arrowLeftClasses"
        @click="scrollByAmount('left')"
        >
        <div :class="[ 'icon' ]">
          <fa-icon :icon="faChevronLeft" />
        </div>
      </div>
    </transition>

    <transition name="fade">
      <div
        v-if="!disableArrows" 
        v-show="arrowVisibility.right"
        :class="arrowRightClasses"
        @click="scrollByAmount('right')"
        >
        <div :class="[ 'icon' ]">
          <fa-icon :icon="faChevronRight" />
        </div>
      </div>
    </transition>

    <div
      ref="scrollContainer"
      data-scroll-content
      :class="[ 'inner' ]"
      @scroll.passive="updateArrowVisibility"
      @dragstart.prevent
      @mousedown="onMouseDown"
      @click.capture.prevent
      >
      <slot />
    </div>
  </div>
</template>