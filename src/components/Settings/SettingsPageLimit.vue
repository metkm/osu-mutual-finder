<script setup lang="ts">
import { ref, watch } from "vue";
import { storeToRefs } from "pinia";
import { useSettingsStore } from "../../store";
import { jsonCountries } from "../../utils";

import BaseInput from "../Ui/BaseInput.vue";
import BaseButtonIcon from "../Ui/BaseButtonIcon.vue";
import SettingsBase from "./SettingsBase.vue";

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

const removeLimit = (code: string) => {
  let limitIndex = limits.value.findIndex(limit => limit.countryCode === code);
  if (limitIndex === -1) return;
  limits.value.splice(limitIndex, 1);
}
</script>

<template>
  <SettingsBase class="flex flex-col gap-4">
    <h1 class="text-center">Country Limits</h1>

    <div class="flex items-center justify-around">
      <p>Code</p>
      <p>Start</p>
      <p>End</p>
      <p>Index</p>
    </div>

    <ul class="max-h-72 overflow-y-auto">
      <li v-for="limit in limits" class="flex gap-2 p-1">
        <BaseButtonIcon class="w-full" @dblclick="removeLimit(limit.countryCode)">
          {{ limit.countryCode }}
        </BaseButtonIcon>
        <BaseInput type="number" min="1" max="199" v-model="limit.start" />
        <BaseInput type="number" min="2" max="200" v-model="limit.end " />
        <BaseInput type="number" min="0" max="50" v-model="limit.index" />
      </li>
    </ul>

    <select 
      class="p-2 rounded bg-neutral-200 dark:bg-neutral-900 focus-outline"
      v-model="selected"
    >
      <option disabled value="">Select a country to add limit</option>
      <option v-for="country in jsonCountries" :value="country.code">{{ country.name }}</option>
    </select>
  </SettingsBase>
</template>
