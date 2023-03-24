<script setup lang="ts">
import { ref } from "vue";
import { storeToRefs } from "pinia";
import { useSettingsStore } from "../../store";
import BaseButton from "../Ui/BaseButton.vue";
import BaseInput from "../Ui/BaseInput.vue";
import SettingsBase from "./SettingsBase.vue";

const settingsStore = useSettingsStore();
const { blacklistIds } = storeToRefs(settingsStore);

const userId = ref<number | null>(null);

const addToBlacklist = () => {
  if (userId.value) {
    settingsStore.toggleBlacklistId(userId.value);
    userId.value = null;
  }
};
const removeBlacklist = (userId: number) => {
  settingsStore.toggleBlacklistId(userId);
};
</script>

<template>
  <SettingsBase class="grid gap-4">
    <p class="text-neutral-500 text-center">User IDs to skip automatically</p>

    <div class="flex items-center gap-2">
      <BaseInput pattern="[0-9]*" placeholder="user id" v-model="userId" @keyup.enter="addToBlacklist" />

      <BaseButton @click="addToBlacklist">Add to Blacklist</BaseButton>
      <BaseButton @click="blacklistIds = []" class="hover:bg-red-500">Clear Blacklist</BaseButton>
    </div>

    <ul v-if="settingsStore.blacklistIds.length > 0" class="rounded border dark:border-neutral-800 max-h-72 overflow-y-auto">
      <template v-for="id in blacklistIds" :key="id">
        <li class="p-2 hover:dark:bg-neutral-800 select-none" 
          @dblclick="removeBlacklist(id)">
          {{ id }}
        </li>
      </template>
    </ul>
  </SettingsBase>
</template>
