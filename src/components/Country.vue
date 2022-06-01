<script setup lang="ts">
import { jsonCountries } from '../utils';

const props = defineProps<{
  code: string
}>();

const country = jsonCountries.find(country => country.code == props.code);
</script>

<template>
  <div v-if="country" class="listbox-item">
    <p class="w-8">{{ country.code }}</p>
    <p>{{ country.name }}</p>
  </div>
</template>