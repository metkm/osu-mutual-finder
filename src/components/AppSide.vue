<script setup lang="ts">
defineProps<{
  title: string,
  desc?: string
}>();
</script>

<template>
  <div class="flex flex-col flex-1 overflow-hidden">
    <div class="grid grid-flow-col auto-cols-fr items-center p-1 border-b dark:border-neutral-800">
      <p class="ml-2 text-sm truncate">{{ title }}</p>
      <p class="text-neutral-400 text-center text-sm truncate">{{ desc }}</p>

      <div class="flex gap-0.5 justify-self-end">
        <slot name="buttons"></slot>
      </div>
    </div>

    <ul 
      aria-label="user list" 
      class="flex flex-col gap-1 flex-1 overflow-y-auto p-2"
    >
      <slot></slot>
    </ul>
  </div>
</template>
