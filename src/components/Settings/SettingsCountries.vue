<script setup lang="ts">
import { useSettingsStore } from "../../store";
import { computed, ref, watch } from "vue";
import { jsonCountries } from "../../utils";
import { Check } from "../../types";
import AppRadio from "../AppRadio.vue";
import AppInput from "../AppInput.vue";
import Country from "../Country.vue";
const settingsStore = useSettingsStore();

const countriesToCheck = computed(() => settingsStore.countries);
const check = ref(settingsStore.check);

const searchQuery = ref("");
const searchQueryResults = computed(() => {
  return jsonCountries.filter(country => {
    return country.name.toLowerCase().includes(searchQuery.value.toLowerCase())
  })
})

const addCountry = (countryCode: string) => {
  settingsStore.toggleCountry(countryCode);
};
const removeCountry = (countryCode: string) => {
  settingsStore.toggleCountry(countryCode);
}

watch(check, newCheck => {
  settingsStore.check = newCheck;
})
</script>

<template>
  <div class="setting">
    <div class="flex flex-1 justify-around">
      <AppRadio :label="Check.Country" v-model="check" />
      <AppRadio :label="Check.Global" v-model="check" />
    </div>

    <div :class="{ 'opacity-20 pointer-events-none': check != Check.Country }">
      <!-- <p class="font-semibold">Countries</p> -->
      <div class="flex gap-2 h-full max-h-96">
        <div class="flex flex-col flex-1 gap-2 select-none">
          <p>Countries to Add</p>
          <AppInput v-model="searchQuery" type="text" placeholder="Search" />

          <div class="listbox">
            <Country v-for="country in searchQueryResults" :key="country.code" :code="country.code" @dblclick="addCountry(country.code)" />
          </div>
        </div>

        <div class="flex flex-col flex-1 select-none">
          <p>Countries to Check</p>
          <div class="listbox">
            <Country v-for="code in countriesToCheck" :key="code" :code="code" @dblclick="removeCountry(code)" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
