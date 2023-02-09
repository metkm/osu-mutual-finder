<script setup lang="ts">
import { computed, ref, watch } from "vue";
import { useSettingsStore } from "../../store";
import { jsonCountries } from "../../utils";
import BaseInput from "../Ui/BaseInput.vue";
const settingsStore = useSettingsStore();

const limits = computed(() => settingsStore.limits);
const selected = ref("");

const change = (code: string) => {
  let limit = limits.value.find(x => x.countryCode == code);
  if (limit) {
    settingsStore.updateLimit(limit);
  }
}

const removeLimit = (code: string) => {
  settingsStore.removeLimit(code);
}

watch(selected, val => {
  settingsStore.addLimit({
    countryCode: val,
    start: 1,
    end: 200,
    index: 0
  });
});
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

      <div v-for="limit in limits" :key="limit.countryCode"
        class="flex items-center justify-around gap-2" 
        @dblclick="removeLimit(limit.countryCode)"
      >
        <p class="w-full text-center">{{ limit.countryCode }}</p>
        <BaseInput type="number" v-model="limit.start" @keyup="change(limit.countryCode)" />
        <BaseInput type="number" v-model="limit.end" @keyup="change(limit.countryCode)" />
        <BaseInput type="number" v-model="limit.index" @keyup="change(limit.countryCode)" />
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