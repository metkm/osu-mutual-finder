<script setup lang="ts">
import { useSettingsStore } from '../../store';
import { storeToRefs } from "pinia";
import BaseRadio from '../Ui/BaseRadio.vue';
import SettingsBase from './SettingsBase.vue';

const settingsStore = useSettingsStore();
const { gamemode } = storeToRefs(settingsStore);

const modes = ["osu", "taiko", "fruits", "mania"];
</script>

<template>
  <SettingsBase>
    <h1 class="mb-4 text-center">Gamemode</h1>

    <div class="flex flex-col gap-1">
      <BaseRadio v-for="mode in modes" :label="mode" v-model="gamemode" />
    </div>
  </SettingsBase>
</template>
