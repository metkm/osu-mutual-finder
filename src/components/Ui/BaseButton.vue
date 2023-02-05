<script setup lang="ts">
import Spinner from '../Icons/Spinner.vue';

defineProps<{
  isLoading?: boolean,
  disabled?: boolean
}>();
</script>

<template>
  <button
    class="flex items-center justify-center gap-2 relative overflow-hidden
    px-4 py-2 rounded
    bg-green-600 hover:bg-green-700 text-white transition-colors
    disabled:bg-neutral-500 disabled:opacity-50 disabled:pointer-events-none"
    :disabled="disabled || isLoading"
  >
    <Transition name="spinner-icon">
      <div v-if="isLoading">
        <Spinner />
      </div>
      <slot v-else name="icon"></slot>
    </Transition>
      <slot></slot>
  </button>
</template>

<style scoped>
.spinner-icon-leave-active,
.spinner-icon-enter-active {
  transition: all 250ms ease-in-out;
}

.spinner-icon-leave-active {
  position: absolute;
  left: 1rem;
}

.spinner-icon-enter-from {
  transform: translateY(-50px);
}

.spinner-icon-leave-to {
  opacity: 0;
  transform: translatey(50px);
}
</style>
