<script setup lang="ts">
defineProps({
  title: String
});
</script>

<template>
  <div class="flex flex-col flex-1 overflow-hidden gap-1  rounded-lg p-2">
    <div class="flex items-center justify-between">
      <h1 class="text-2xl">{{ title }}</h1>
      <slot></slot>
    </div>

    <div class="flex flex-col gap-1 overflow-y-auto flex-1 rounded-lg">
      <slot name="users"></slot>
    </div>
  </div>
</template>