<script setup lang="ts">
defineProps({
  label: String,
  modelValue: String
});
</script>

<template>
  <div class="flex items-center gap-2">
    <input 
      class="appearance-none w-5 h-5 rounded-full bg-gray-800 checked:bg-green-500" 
      type="radio"
      :id="label"
      :value="label"
      :checked="modelValue == label"
      @change="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
    />
    <label :for="label">{{ label }}</label>
  </div>
</template>
