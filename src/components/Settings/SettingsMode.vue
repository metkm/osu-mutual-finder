<script setup lang="ts">
import AppRadio from '../AppRadio.vue';
import { ref, watch } from "vue";
import { useStore } from '../../store';

const store = useStore();

const gamemode = ref(store.state.gamemode);
const modes = ["osu", "taiko", "fruits", "mania"];

watch(gamemode, mode => {
  store.dispatch("setGamemode", mode);
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
