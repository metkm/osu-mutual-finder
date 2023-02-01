<script setup lang="ts">
defineProps<{
  red?: boolean
}>();
</script>

<template>
  <button class="
    py-2 px-4 rounded
    text-white
    disabled:bg-neutral-600 disabled:opacity-50"
    :class="{
      'bg-red-600 hover:bg-red-800': red,
      'bg-green-600 hover:bg-green-700': !red
    }"
  >
    <slot></slot>
  </button>
</template>
