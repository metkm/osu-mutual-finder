<script setup lang="ts">
import { ref } from "vue";

defineProps<{
  items: any[],
  modelValue: any,
  placeholder: string
}>();

const visible = ref(false);
const emit = defineEmits(["update:modelValue"]);

const toggleVisible = () => visible.value = !visible.value;
const onlick = (val: string) => {
  toggleVisible();
  emit("update:modelValue", val);
}
</script>
<template>
  <div class="relative">
    <button class="border dark:border-neutral-800 p-2 rounded w-full relative flex justify-center items-center"
      @click="toggleVisible">
      <p>{{ placeholder }}</p>

      <svg width="32" height="32" viewBox="0 0 48 48" class="absolute right-4 transition-transform dark:fill-white" :class="{ 'rotate-180': visible }">
        <path d="M24 31L12.25 19L14.15 17.1L24 27L33.85 17.15L35.7 19L24 31Z"/>
      </svg>
    </button>
    <ul
      class="absolute bottom-12 w-full max-h-48 overflow-y-auto rounded border dark:border-neutral-800 bg-dark mt-2 shadow transition-all"
      :class="{ 'opacity-100': visible, 'hidden opacity-0': !visible }">
      <li v-for="item in items.sort()" @click="() => onlick(item)" class="dark:hover:bg-neutral-900 hover:bg-neutral-100 p-1">{{ item }}</li>
    </ul>
  </div>
</template>