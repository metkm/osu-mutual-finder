<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { useSettingsStore } from '../../store';
import BaseInput from '../Ui/BaseInput.vue';

const settingsStore = useSettingsStore();
const { pageSkipDelay, friendAddDelay } = storeToRefs(settingsStore);
</script>

<template>
  <div class="setting grid grid-cols-2">
    <div class="flex flex-col justify-between">
      <p class="text-neutral-500">Cooldown before adding a person to see if an user is mutual or not. In milliseconds</p>
      <BaseInput type="number" min="4500" step="500" v-model.number="friendAddDelay" />
    </div>
  
    <div class="flex flex-col justify-between">
      <p class="text-neutral-500">Cooldown before skipping to page. In milliseconds</p>
      <BaseInput type="number" min="1000" step="500" v-model.number="pageSkipDelay" />
    </div>
  </div>
</template>
