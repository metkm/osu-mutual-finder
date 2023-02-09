<script setup lang="ts">
import { ref, watch } from "vue";
import { useSettingsStore } from '../../store';
import BaseRadio from '../Ui/BaseRadio.vue';
const settingsStore = useSettingsStore();

const gamemode = ref(settingsStore.gamemode);
const modes = ["osu", "taiko", "fruits", "mania"];

watch(gamemode, mode => {
  settingsStore.gamemode = mode;
})
</script>

<template>
  <div aria-label="gamemode setting" class="setting">
    <h1>Gamemode</h1>

    <div class="flex flex-col gap-1">
      <BaseRadio v-for="mode in modes" :label="mode" v-model="gamemode" />
    </div>
  </div>
</template>
