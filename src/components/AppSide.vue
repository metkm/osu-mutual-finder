<script setup lang="ts">
defineProps<{
  title: string,
  desc: string
}>();
</script>

<template>
  <div role="group" class="flex flex-col flex-1 overflow-hidden gap-1 px-2">
    <div class="flex items-center justify-between flex-wrap p-1">
      <div class="p-1">
        <h1 class="text-xl">{{ title }}</h1>
        <p class="setting-description text-sm">{{ desc }}</p>
      </div>
      <slot></slot>
    </div>

    <ul aria-label="user list" class="flex flex-col gap-1 pb-2 overflow-y-auto flex-1">
      <slot name="users"></slot>
    </ul>
  </div>
</template>
