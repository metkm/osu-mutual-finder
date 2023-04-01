<script setup lang="ts">
import Spinner from '../Icons/Spinner.vue';

defineProps<{
  isLoading?: boolean,
  disabled?: boolean
}>();
</script>

<template>
  <button 
    class="
      group text-sm
      px-4 py-2 shrink-0
      rounded-lg shadow-sm border dark:border-neutral-800
      hover:text-white hover:bg-green-600 transition-colors
      dark:bg-neutral-900
    "
    :disabled="disabled || isLoading"
  >
    <TransitionGroup name="icon" tag="div" class="grid grid-flow-col items-center gap-2">
      <Spinner v-if="isLoading" key="spinner-icon" />
      <div v-else-if="$slots.icon" 
        key="user-icon" 
        class="dark:fill-white group-hover:fill-white transition-colors"
      >
        <slot name="icon"></slot>
      </div>

      <div key="content">
        <slot></slot>
      </div>
    </TransitionGroup>
  </button>
</template>

<style scoped>
.icon-leave-active,
.icon-enter-active,
.icon-move {
  transition: all 350ms ease;
}

.icon-leave-to,
.icon-enter-from {
  opacity: 0;
  scale: 0;
}

.icon-leave-active {
  position: absolute;
}
</style>
