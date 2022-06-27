<script setup lang="ts">
import AppRadio from '../AppRadio.vue';
import { ref, watch } from "vue";
import { useSettingsStore } from '../../store';
const settingsStore = useSettingsStore();

const gamemode = ref(settingsStore.gamemode);
const modes = ["osu", "taiko", "fruits", "mania"];

watch(gamemode, mode => {
  settingsStore.gamemode = mode;
})
</script>

<template>
  <div class="setting">
    <p class="font-semibold">Gamemode</p>

    <div class="flex flex-col gap-1">
      <AppRadio v-for="mode in modes" :label="mode" v-model="gamemode" />
    </div>
  </div>
</template>
