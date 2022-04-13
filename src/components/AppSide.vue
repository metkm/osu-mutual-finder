<script setup lang="ts">
defineProps({
  title: String
});
</script>

<template>
  <div class="flex flex-col flex-1 overflow-hidden gap-1  rounded-lg p-2">
    <p class="font-semibold text-2xl">Checked {{ title }}</p>
    <div class="flex flex-col gap-3 overflow-y-auto flex-1 rounded-lg">
      <slot></slot>
    </div>
  </div>
</template>