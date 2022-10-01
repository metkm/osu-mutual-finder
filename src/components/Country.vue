<script setup lang="ts">
import { jsonCountries } from '../utils';

const props = defineProps<{
  code: string
}>();

const country = jsonCountries.find(country => country.code == props.code);
</script>

<template>
  <button v-if="country" class="listbox-item gap-2">
    <p class="w-12 text-left truncate">{{ country.code }}</p>
    <p>{{ country.name }}</p>
  </button>
</template>