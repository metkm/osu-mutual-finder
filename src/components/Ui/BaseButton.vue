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
      flex justify-center items-center relative
      px-4 py-2 rounded text-white
      bg-green-600 hover:bg-green-700
      disabled:opacity-50 disabled:pointer-events-none
    "
    :disabled="disabled || isLoading"
  >
    <TransitionGroup appear name="icon" tag="div" class="grid grid-flow-col items-center gap-2">
      <div v-if="isLoading" :key="1">
        <Spinner />
      </div>
      <div v-else :key="2">
        <slot name="icon"></slot>
      </div>
      <div :key="3">
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
