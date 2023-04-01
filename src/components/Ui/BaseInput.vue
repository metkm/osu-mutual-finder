<script setup lang="ts" generic="T extends any">
const props = defineProps<{
  modelValue: T,
}>();

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
}>();

const updateModelValue = (event: Event) => {
  let element = event.target as HTMLInputElement;
  if (element.validity.patternMismatch) {
    element.value = props.modelValue as string;
    return;
  }

  emit("update:modelValue", element.value);
}
</script>

<template>
  <input
    :value="modelValue"
    @input="updateModelValue"
    class="p-2 w-full rounded-lg border dark:border-neutral-800 dark:bg-dark focus-outline"
  />
</template>
