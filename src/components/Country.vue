<script setup lang="ts">
import { jsonCountries, countryFromCode } from '../utils';

const props = defineProps<{
  code: string
}>();

const country = jsonCountries.find(country => country.code == props.code);
</script>

<template>
  <div v-if="country" class="flex items-center gap-2 hover:bg-neutral-800 p-1 rounded">
    <img class="h-7 flag" :src="countryFromCode(country.code)">
    <p>{{ country.name }}</p>
  </div>
</template>