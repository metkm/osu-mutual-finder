<script lang="ts">
export default {
  inheritAttrs: false
}
</script>

<script setup lang="ts">
defineProps(["modelValue"]);
defineEmits(["update:modelValue"]);
</script>

<template>
  <div class="relative rounded-lg overflow-hidden w-full border dark:border-neutral-900">
    <input
      v-bind="$attrs"
      :value="modelValue"
      @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
      class="p-2 bg-theme-sec peer w-full input-number" 
    />
    <div class="h-0.5 transition-all bg-green-600 absolute bottom-0 w-0 peer-focus:w-full" />
  </div>
</template>