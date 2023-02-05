<script setup lang="ts">
defineProps<{
  red?: boolean
}>();
</script>

<template>
  <button
    class="
      flex justify-center gap-2
      px-4 py-2 rounded text-white
      bg-green-600 focus-outline
    ">
    <slot></slot>
  </button>
</template>
