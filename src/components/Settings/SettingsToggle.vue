<script setup lang="ts">
import { useSettingsStore } from "../../store";
import BaseCheckbox from "../Ui/BaseCheckbox.vue";
const settingsStore = useSettingsStore();
</script>

<template>
  <div aria-label="togglable settings" class="setting">
    <div class="flex justify-evenly text-center">
      <BaseCheckbox :label="'Add Friend'" v-model="settingsStore.addFriend"
        :description="'When a mutual is found, keep it as friend or remove it.'" />
      <BaseCheckbox :label="'Add To Blacklist'" v-model="settingsStore.addBlacklist"
        :description="'Add to blacklist when the user is checked once.'" />
    </div>
  </div>
</template>
