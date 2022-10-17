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

const handleBeforeLeave = (element: Element) => {
  // @ts-ignore
  element.setAttribute("style", `width: ${element.offsetWidth!}px`);
}
</script>

<template>
  <div aria-label="country setting" class="setting">
    <div class="flex flex-1 justify-around">
      <AppRadio :label="Check.Country" v-model="check" />
      <AppRadio :label="Check.Global" v-model="check" />
    </div>

    <div :class="{ 'opacity-20 pointer-events-none': check != Check.Country }">
      <!-- <p class="font-semibold">Countries</p> -->
      <div class="flex gap-2 h-full max-h-96">
        <section aria-label="countries to add" class="flex flex-col flex-1 gap-2">
          <AppInput v-model="searchQuery" type="text" placeholder="Search countries " />

          <ul class="listbox">
            <Country v-for="country in searchQueryResults" :key="country.code" :code="country.code"
              @click="addCountry(country.code)" />
          </ul>
        </section>

        <div class="w-1 rounded-full h-full bg-neutral-200 dark:bg-neutral-900"></div>

        <section aria-label="countries added" class="flex flex-col flex-1 justify-center gap-2">
          <p class="setting-description max-w-xs mx-auto opacity-75 text-center" v-if="countriesToCheck.length == 0">
            The countries that program will check will be listed here.
            You can click on a country name once
            to add it.
          </p>

          <transition-group v-else name="array" tag="ol" class="listbox" @before-leave="handleBeforeLeave">
            <Country v-for="code in countriesToCheck" :key="code" :code="code" @click="removeCountry(code)" />
          </transition-group>
        </section>
      </div>
    </div>
  </div>
</template>
