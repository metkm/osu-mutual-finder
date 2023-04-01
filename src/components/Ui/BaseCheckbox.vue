<script setup lang="ts">
import SettingsBase from '../Settings/SettingsBase.vue';

defineProps<{
  modelValue: boolean,
  label: string,
  description: string
}>();
const emit = defineEmits<{
  (e: "update:modelValue", value: boolean): void
}>();

const updateModelValue = (event: Event) => {
  if (!event.target) return;
  let target = event.target as HTMLInputElement;
  emit("update:modelValue", target.checked);
}
</script>

<template>
  <SettingsBase>
    <div class="flex items-center gap-2">
      <div class="relative w-12 p-1 rounded-full border dark:border-neutral-800 dark:bg-neutral-900 transition-colors" :class="{ '!bg-green-600': modelValue }">
        <input
          type="checkbox"
          :id="label"
          :checked="modelValue"
          @change="updateModelValue"
          class="absolute inset-0 appearance-none"
        >
        <div 
          class="h-3 w-3 rounded-full bg-neutral-500 dark:bg-white transition-all pointer-events-none" 
          :class="{ 'translate-x-7 !bg-white': modelValue }"
        />
      </div>
      <label :for="label">{{ label }}</label>
    </div>

    <p class="text-neutral-500 text-sm mt-2">{{ description }}</p>
  </SettingsBase>
</template>