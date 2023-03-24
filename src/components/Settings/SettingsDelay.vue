<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { useSettingsStore } from '../../store';
import BaseInputNumber from '../Ui/BaseInputNumber.vue';
import SettingsBase from './SettingsBase.vue';

const settingsStore = useSettingsStore();
const { pageSkipDelay, friendAddDelay } = storeToRefs(settingsStore);
</script>

<template>
  <div class="flex gap-4 flex-wrap">
    <SettingsBase class="flex-1 flex flex-col justify-between">
      <p class="text-neutral-500 mb-2">Cooldown before adding a person to see if an user is mutual or not. In milliseconds</p>
      <BaseInputNumber :min="4500" :step="500" v-model="friendAddDelay" />
    </SettingsBase>
  
    <SettingsBase class="flex-1 flex flex-col justify-between">
      <p class="text-neutral-500 mb-2">Cooldown before skipping to page. In milliseconds</p>
      <BaseInputNumber :min="1000" :step="500" v-model="pageSkipDelay" />
    </SettingsBase>
  </div>
</template>
