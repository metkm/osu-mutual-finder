<script setup lang="ts">
defineProps<{
  label: string,
  modelValue: any
}>();
</script>

<template>
  <div
    class="
      px-4 py-2 relative
      rounded-lg border dark:border-neutral-800 shadow-sm
      hover:bg-green-600 hover:text-white transition-colors
    "
    :class="{ 'bg-green-600 text-white': modelValue == label }"
  >
    <input class="appearance-none absolute inset-0" type="radio" :id="label" :value="label" :checked="modelValue == label"
      @change="$emit('update:modelValue', ($event.target as HTMLInputElement).value)" />
    <label :for="label">{{ label }}</label>
  </div>
</template>
