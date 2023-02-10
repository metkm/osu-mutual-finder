<script setup lang="ts">
import { useSettingsStore } from '../../store';
import { storeToRefs } from "pinia";
import BaseRadio from '../Ui/BaseRadio.vue';

const settingsStore = useSettingsStore();
const { gamemode } = storeToRefs(settingsStore);

const modes = ["osu", "taiko", "fruits", "mania"];
</script>

<template>
  <div aria-label="gamemode setting" class="setting">
    <h1>Gamemode</h1>

    <div class="flex flex-col gap-1">
      <BaseRadio v-for="mode in modes" :label="mode" v-model="gamemode" />
    </div>
  </div>
</template>
