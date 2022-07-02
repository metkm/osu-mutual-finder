<script setup lang="ts">
import { ref } from "vue";
import { useSettingsStore } from "../../store";
import AppInput from "../AppInput.vue";

const settingsStore = useSettingsStore();
const userId = ref(null);

const addToBlacklist = () => {
  if (userId.value) {
    settingsStore.toggleBlacklistId(userId.value);
  }
};
const removeBlacklist = (userId: number) => {
  settingsStore.toggleBlacklistId(userId);
};
const clearBlacklist = () => {
  settingsStore.blacklistIds = [];
}
</script>

<template>
  <div class="setting">
    <div class="flex gap-4">
      <div class="flex flex-col gap-2">
        <p class="font-semibold">Blacklist</p>
        <p class="setting-description">User IDs to skip automatically</p>
        <AppInput type="number" placeholder="User id" v-model="userId" />
        
        <button class="form-button" @click="addToBlacklist">Add to Blacklist</button>
        <button class="form-button bg-red-600 hover:bg-red-800" @click="clearBlacklist">Clear Blacklist</button>
      </div>

      <div class="listbox select-none max-h-72">
        <p v-for="id in settingsStore.blacklistIds" :key="id" @dblclick="removeBlacklist(id)" class="listbox-item">
          {{ id }}
        </p>
      </div>
    </div>
  </div>
</template>