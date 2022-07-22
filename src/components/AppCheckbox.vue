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
    <div class="flex items-center gap-2">
      <input type="checkbox" :id="label" v-model="toggled" class="form-tick" @change="onChange">
      <label :for="label">{{ label }}</label>
    </div>
    <p class="setting-description">{{ description }}</p>
  </div>
</template>