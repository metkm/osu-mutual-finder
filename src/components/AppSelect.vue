<script setup lang="ts">
defineProps<{
  items: any[],
  modelValue: any
}>();
</script>
<template>
  <select class="appearance-none p-2 bg-neutral-200 dark:bg-neutral-800 rounded text-center" :value="modelValue"
    @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)">
    <option v-for="item in items.sort()" class="appearance-none hover:bg-green-600">{{ item }}</option>
  </select>
</template>