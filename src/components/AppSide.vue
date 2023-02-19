<script setup lang="ts">
defineProps<{
  title: string,
  desc?: string
}>();
</script>

<template>
  <div class="flex flex-col flex-1 overflow-hidden">
    <div class="flex items-center justify-between p-1 gap-2 border-b dark:border-neutral-800">
      <p class="ml-2 text-sm truncate">{{ title }}</p>
      <p class="text-neutral-400 text-center text-sm truncate">{{ desc }}</p>

      <div class="flex gap-1 justify-self-end">
        <slot name="buttons"></slot>
      </div>
    </div>
    
    <slot></slot>
  </div>
</template>
