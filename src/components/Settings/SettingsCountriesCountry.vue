<script setup lang="ts">
import { ref, computed } from "vue";
import { storeToRefs } from "pinia";
import { useSettingsStore } from "../../store";
import { jsonCountries } from "../../utils";

import BaseInput from "../Ui/BaseInput.vue";

const settingsStore = useSettingsStore();
const { countries } = storeToRefs(settingsStore);

const query = ref("");
const queryResults = computed(() => {
  let search = query.value.toLowerCase();

  return jsonCountries.filter(country => {
    let countryName = country.name.toLowerCase();
    return countryName.includes(search);
  })
})
</script>

<template>
  <div class="grid grid-cols-2 grid-rows-1 gap-2 max-h-96">
    <section class="flex flex-col gap-2">
      <BaseInput v-model="query" placeholder="Query countries" />

      <ul class="overflow-y-auto">
        <li v-for="country in queryResults"
          class="flex items-center gap-2 p-1 rounded-lg hover:bg-neutral-100 hover:dark:bg-neutral-900">
          <input type="checkbox" class="form-tick" :id="country.code" :value="country" v-model="countries" />

          <label :for="country.code" class="w-full select-none">{{ country.name }}</label>
        </li>
      </ul>
    </section>

    <section class="grid gap-2">
      <ul class="overflow-y-auto">
        <template v-if="countries.length > 0">
          <li v-for="country in countries" class="flex items-center gap-2 p-1 rounded-lg hover:bg-neutral-100 hover:dark:bg-neutral-900">
            <input type="checkbox" class="form-tick" :id="country.code" :value="country" v-model="countries" />

            <label :for="country.code" class="w-full select-none">{{ country.name }}</label>
          </li>
        </template>
        <p v-else class="flex h-full items-center justify-center text-neutral-500 text-center px-6">The countries you added will show up here. You can click any country name on the left to start the program.</p>
      </ul>
    </section>
  </div>
</template>
