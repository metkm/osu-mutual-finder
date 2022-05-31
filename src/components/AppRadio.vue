<script setup lang="ts">
defineProps<{
  label: string,
  modelValue: any
}>();
</script>

<template>
  <div class="flex items-center gap-2">
    <input 
      class="appearance-none w-5 h-5 rounded-full bg-neutral-800 transition-all checked:bg-green-500 border-4 border-neutral-700" 
      type="radio"
      :id="label"
      :value="label"
      :checked="modelValue == label"
      @change="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
    />
    <label :for="label">{{ label }}</label>
  </div>
</template>
