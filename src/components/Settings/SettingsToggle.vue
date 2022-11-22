<script setup lang="ts">
import { ref } from "vue";
import { useSettingsStore } from "../../store";
import AppCheckbox from "../AppCheckbox.vue";
const settingsStore = useSettingsStore();

const addFriend = ref(settingsStore.addFriend);
const addBlacklist = ref(settingsStore.addBlacklist);
</script>

<template>
  <div aria-label="togglable settings" class="setting">
    <div class="flex justify-evenly text-center">
      <AppCheckbox :label="'Add Friend'" v-model="settingsStore.addFriend"
        :description="'When a mutual is found, keep it as friend or remove it.'" />
      <AppCheckbox :label="'Add To Blacklist'" v-model="settingsStore.addBlacklist"
        :description="'Add to blacklist when the user is checked once.'" />
    </div>
  </div>
</template>
