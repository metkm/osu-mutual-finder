<script setup lang="ts">
defineProps(["modelValue"]);
defineEmits(["update:modelValue"]);
</script>

<template>
  <div class="flex-1 relative rounded overflow-hidden">
    <input  
      :value="modelValue"
      @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
      class="p-2 bg-neutral-800 peer w-full" 
    />
    <div class="h-1 transition-all bg-green-600 absolute bottom-0 w-0 peer-focus:w-full" />
  </div>
</template>