<script setup lang="ts">
import { useSettingsStore } from "../../store";
import { computed, ref, watch } from "vue";
import { handleBeforeLeave } from "../../animation";
import { jsonCountries } from "../../utils";
import { Check, Country as CountryInterface } from "../../types";
import AppRadio from "../AppRadio.vue";
import BaseInput from "../ui/BaseInput.vue";
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

const addCountry = (country: CountryInterface) => {
  settingsStore.toggleCountry(country);
};
const removeCountry = (country: CountryInterface) => {
  settingsStore.toggleCountry(country);
}

watch(check, newCheck => {
  settingsStore.check = newCheck;
})
</script>

<template>
  <div aria-label="country setting" class="setting relative">
    <div class="flex flex-1 justify-around">
      <AppRadio :label="Check.Country" v-model="check" />
      <AppRadio :label="Check.Global" v-model="check" />
    </div>

    <div :class="{ 'opacity-20 pointer-events-none': check != Check.Country }">
      <div class="flex gap-2 h-full max-h-96 divide-x dark:divide-neutral-800">
        <section aria-label="countries to add" class="flex flex-col flex-1 gap-2">
          <BaseInput v-model="searchQuery" type="text" placeholder="Search countries " />

          <ul class="listbox">
            <Country v-for="country in searchQueryResults" :key="country.code" :country="country"
              @click="addCountry(country)" />
          </ul>
        </section>

        <section aria-label="countries added" class="flex flex-col flex-1 justify-center gap-2">
          <p class="text-neutral-500 max-w-xs mx-auto opacity-75 text-center" v-if="countriesToCheck.length == 0">
            The countries that program will check will be listed here.
            You can click on a country name once
            to add it.
          </p>

          <TransitionGroup v-else name="array" tag="ol" class="listbox" @before-leave="handleBeforeLeave">
            <Country v-for="country in countriesToCheck" :key="country.code" :country="country"
              @click="removeCountry(country)" />
          </TransitionGroup>
        </section>
      </div>
    </div>
  </div>
</template>
