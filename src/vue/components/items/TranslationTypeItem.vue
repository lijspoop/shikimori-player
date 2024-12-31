<script setup lang="ts">
defineProps<{
  active?: boolean;
  content: string;
  total: number;
}>();
</script>

<template>
  <div class="stat_name">
    <a
      :class="[
        'b-link',
        { 
          active
        }
      ]"
      >
      {{ content }}<span class="size" :data-total="total">
        {{ total }}
      </span>
    </a>
  </div>
</template>