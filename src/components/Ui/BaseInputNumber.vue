<script setup lang="ts">
import BaseButtonIcon from './BaseButtonIcon.vue';

const props = defineProps<{
  min?: number,
  max?: number,
  step: number,
  modelValue: number
}>();

const emit = defineEmits<{
  (e: "update:modelValue", value: number): void
}>();

const decreaseValue = () => {
  let newValue = props.modelValue - props.step;

  emit(
    "update:modelValue",
    props.min ? Math.max(props.min, newValue) : newValue
  );
};
const increaseValue = () => {
  let newValue = props.modelValue + props.step;

  emit(
    "update:modelValue",
    props.max ? Math.min(props.max, newValue) : newValue
  );
};
</script>

<template>
  <div class="flex gap-2 items-center justify-center">
    <BaseButtonIcon @click="decreaseValue">
      <svg xmlns="http://www.w3.org/2000/svg" height="20" viewBox="0 96 960 960" width="20">
        <path d="M240 612v-72h480v72H240Z" />
      </svg>
    </BaseButtonIcon>

    <p class="text-center w-20">{{ modelValue }}</p>

    <BaseButtonIcon @click="increaseValue">
      <svg xmlns="http://www.w3.org/2000/svg" height="20" viewBox="0 96 960 960" width="20">
        <path d="M444 816V612H240v-72h204V336h72v204h204v72H516v204h-72Z" />
      </svg>
    </BaseButtonIcon>
  </div>
</template>
