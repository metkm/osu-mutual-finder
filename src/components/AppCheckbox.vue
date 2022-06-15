<script setup lang="ts">
defineProps<{
  label: string,
  description: string,
  toggled: boolean,
  onChange: () => void;
}>();
</script>

<template>
  <div class="flex flex-col items-center">
    <label :for="label" class="flex items-center gap-2">
      <input type="checkbox" :id="label" v-model="toggled"
        class="form-tick appearance-none w-5 h-5 rounded dark:bg-white bg-neutral-200 checked:bg-green-500" @change="onChange">
      <p class="font-semibold">{{ label }}</p>
    </label>
    <p class="setting-description">{{ description }}</p>
  </div>
</template>