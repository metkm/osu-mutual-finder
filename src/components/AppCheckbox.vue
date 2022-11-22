<script setup lang="ts">
defineProps(['modelValue', 'label', 'description'])
defineEmits(["update:modelValue"]);
</script>

<template>
  <div class="flex flex-col items-center">
    <div class="flex items-center gap-2">
      <input 
        type="checkbox"
        class="form-tick"
        :id="label"
        :checked="modelValue"
        @change="$emit('update:modelValue', ($event.target! as HTMLInputElement).checked)"
      >
      <label :for="label">{{ label }}</label>
    </div>
    <p class="setting-description">{{ description }}</p>
  </div>
</template>