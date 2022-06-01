<script setup lang="ts">
defineProps(["modelValue"]);
defineEmits(["update:modelValue"]);
</script>

<template>
  <div class="shrink-0 relative rounded overflow-hidden w-full">
    <input
      v-bind="$attrs"
      :value="modelValue"
      @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
      class="p-2 bg-neutral-200 dark:bg-neutral-800 peer w-full input-number" 
    />
    <div class="h-1 transition-all bg-green-600 absolute bottom-0 w-0 peer-focus:w-full" />
  </div>
</template>