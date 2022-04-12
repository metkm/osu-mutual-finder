<script setup lang="ts">
import AppRadio from '../AppRadio.vue';
import { ref } from "vue";

const gamemode = ref("osu");
const modes = ["osu", "taiko", "fruits", "mania"];

</script>

<template>
  <div class="setting">
    <p class="font-semibold">Gamemode</p>
    <p>Current Gamemode: {{ gamemode }}</p>

    <template v-for="mode in modes">
      <AppRadio :label="mode" v-model="gamemode" />
    </template>
  </div>
</template>
