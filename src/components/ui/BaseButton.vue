<script setup lang="ts">
import Spinner from '../Icons/Spinner.vue';

defineProps<{
  isLoading?: boolean,
  disabled?: boolean
}>();
</script>

<template>
  <button class="
      flex justify-center items-center relative
      px-4 py-2 rounded text-white
      bg-green-600 hover:bg-green-700
      disabled:opacity-50 disabled:pointer-events-none
    " :disabled="disabled || isLoading">
    <TransitionGroup name="icon" tag="div" class="grid grid-flow-col items-center gap-2">
      <Spinner v-if="isLoading" key="spinner-icon" />
      <div v-else-if="$slots.icon" key="user-icon">
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
