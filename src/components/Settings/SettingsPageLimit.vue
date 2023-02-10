<script setup lang="ts">
import { ref, watch } from "vue";
import { storeToRefs } from "pinia";
import { useSettingsStore } from "../../store";
import { jsonCountries } from "../../utils";

import BaseInput from "../Ui/BaseInput.vue";

const settingsStore = useSettingsStore();
const { limits } = storeToRefs(settingsStore);
const selected = ref("");

watch(selected, countryCode => {
  limits.value.push({
    countryCode,
    start: 1,
    end: 200,
    index: 0
  });
})
</script>

<template>
  <div aria-label="page limit setting" class="setting relative">
    <div class="flex items-center justify-around">
      <p>Code</p>
      <p>Start</p>
      <p>End</p>
      <p>Index</p>
    </div>
    <div class="listbox grid gap-1 max-h-72">
      <div v-for="limit in limits" class="flex items-center gap-1">
        <p class="w-full text-center">{{ limit.countryCode }}</p>
        <BaseInput type="number" min="1" max="199" v-model="limit.start" />
        <BaseInput type="number" min="2" max="200" v-model="limit.end " />
        <BaseInput type="number" min="0" max="50" v-model="limit.index" />
      </div>
    </div>

    <select 
      class="border p-2 rounded dark:border-neutral-800 bg-theme focus-outline"
      v-model="selected"
    >
      <option disabled value="">Select a country to add limit</option>
      <option v-for="country in jsonCountries">{{ country.code }}</option>
    </select>
  </div>
</template>
