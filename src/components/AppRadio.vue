<script setup lang="ts">
defineProps<{
  label: string,
  modelValue: any
}>();
</script>

<template>
  <div class="flex items-center gap-2">
    <input 
      class="form-tick" 
      type="radio"
      :id="label"
      :value="label"
      :checked="modelValue == label"
      @change="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
    />
    <label :for="label">{{ label }}</label>
  </div>
</template>
