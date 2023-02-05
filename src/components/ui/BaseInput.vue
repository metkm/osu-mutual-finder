<script setup lang="ts" generic="T extends any">
defineProps<{
  modelValue: T
}>();

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
}>();

const updateModelValue = (event: Event) => {
  let target = event.target as HTMLInputElement;
  emit('update:modelValue', target.value);
}
</script>

<template>
  <input
    :value="modelValue"
    @input="updateModelValue"
    class="p-2 rounded border dark:border-neutral-800 dark:bg-dark focus-outline"
  />
</template>
