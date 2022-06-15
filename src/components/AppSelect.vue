<script setup lang="ts">
defineProps<{
  items: any[],
  modelValue: any
}>();
</script>
<template>
  <select 
    class="bg-neutral-200 dark:bg-neutral-900 p-2 rounded" 
    :value="modelValue"
    @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
  >
    <option disabled hidden value="">Select to add a country limit</option>
    <option v-for="item in items.sort()">{{ item }}</option>
  </select>
</template>