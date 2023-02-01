<script setup lang="ts">
import { Country } from '../types';

const { country } = defineProps<{
  country: Country
}>();
</script>

<template>
  <button class="listbox-item gap-2">
    <p class="w-12 text-left truncate">{{ country.code }}</p>
    <p>{{ country.name }}</p>
  </button>
</template>