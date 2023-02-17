<script setup lang="ts" generic="T extends any">
const { modelModifiers } = defineProps<{
  modelValue: T,
  modelModifiers?: {
    [key: string]: any
  }
}>();

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
}>();

const updateModelValue = (event: Event) => {
  let target = event.target as HTMLInputElement;

  let min = target.getAttribute('min');
  if (modelModifiers?.min && min) {
    target.value = Math.max(parseInt(min), parseInt(target.value)).toString();
  }

  emit('update:modelValue', target.value);
}
</script>

<template>
  <input
    :value="modelValue"
    @input="updateModelValue"
    class="p-2 w-full rounded border dark:border-neutral-800 dark:bg-dark focus-outline"
  />
</template>
