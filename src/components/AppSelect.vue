<script setup lang="ts">
defineProps<{
  items: any[],
  modelValue: any
}>();
</script>
<template>
  <select 
    class=" p-2 rounded border" 
    :value="modelValue"
    @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
  >
    <option disabled hidden value="">Select to add a country limit</option>
    <option v-for="item in items.sort()">{{ item }}</option>
  </select>
</template>