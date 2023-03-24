<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { useSettingsStore } from '../../store';

import BaseRadio from '../Ui/BaseRadio.vue';
import SettingsBase from './SettingsBase.vue';
import SettingsCountriesCountry from './SettingsCountriesCountry.vue';
import SettingsCountriesGlobal from './SettingsCountriesGlobal.vue';

const settingsStore = useSettingsStore();
const { check } = storeToRefs(settingsStore);

const dynamicPages = {
  'Country': SettingsCountriesCountry,
  'Global': SettingsCountriesGlobal
}
</script>

<template>
  <SettingsBase>
    <div class="flex gap-1 mb-4">
      <BaseRadio label="Country" v-model="check" />
      <BaseRadio label="Global" v-model="check" />
    </div>

    <component :is="dynamicPages[check]" />
  </SettingsBase>
</template>
