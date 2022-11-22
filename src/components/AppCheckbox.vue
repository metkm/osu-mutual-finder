<script setup lang="ts">
defineProps<{
  label: string,
  description: string,
  toggled: boolean,
  onChange: () => void;
}>();

defineEmits(["update:modelValue"]);
</script>

<template>
  <div class="flex flex-col items-center">
    <div class="flex items-center gap-2">
      <input 
        type="checkbox"
        :id="label"
        class="form-tick"
        @change="onChange"
        @input="$emit('update:modelValue', ($event.target! as HTMLInputElement).value)"
      >
      <label :for="label">{{ label }}</label>
    </div>
    <p class="setting-description">{{ description }}</p>
  </div>
</template>