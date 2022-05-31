<script setup lang="ts">
import { useStore } from "../../store";
import { computed, ref, watch } from "vue";
import { jsonCountries, countryFromCode } from "../../utils";
import { Check } from "../../types";
import AppRadio from "../AppRadio.vue";
import AppInput from "../AppInput.vue";
const store = useStore();

const countriesToCheck = computed(() => store.state.countries);
const check = ref(store.state.check);

const searchQuery = ref("");
const searchQueryResults = computed(() => {
  return jsonCountries.filter(country => {
    return country.name.toLowerCase().includes(searchQuery.value.toLowerCase())
  })
})

const addCountry = (countryCode: string) => {
  store.dispatch("addCountry", countryCode);
};
const removeCountry = (countryCode: string) => {
  store.dispatch("removeCountry", countryCode);
}

watch(check, newCheck => {
  store.dispatch("setCheck", newCheck);
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
        <div class="flex flex-col flex-1 gap-2">
          <p>Countries to Add</p>
          <AppInput v-model="searchQuery" type="text" placeholder="Search" />

          <div class="listbox">
            <div v-for="country in searchQueryResults" :key="country.code"
              class="flex items-center gap-2 hover:bg-neutral-800 p-1 rounded" @dblclick="addCountry(country.code)">
              <img class="h-8 flag"
                :src="`https://osu.ppy.sh//assets/images/flags/${countryFromCode(country.code)?.flag_url}`" />
              <p class="font-medium">{{ country.name }}</p>
            </div>
          </div>
        </div>

        <div class="flex flex-col flex-1">
          <p>Countries to Check</p>
          <div class="listbox">
            <p v-for="countryCode in countriesToCheck" :key="countryCode" class="hover:bg-neutral-700 p-1"
              @dblclick="removeCountry(countryCode)">
              {{ countryCode }}
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
