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
      <AppCheckbox :label="'Add Friend'" :toggled="addFriend"
        :description="'When a mutual is found, keep it as friend or remove it.'" :onChange="settingsStore.toggleAddFriend" />
      <AppCheckbox :label="'Add To Blacklist'" :toggled="addBlacklist"
        :description="'Add to blacklist when the user is checked once.'" :onChange="settingsStore.toggleAddBlacklist" />
    </div>
  </div>
</template>