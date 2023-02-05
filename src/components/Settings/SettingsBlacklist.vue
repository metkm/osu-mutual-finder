<script setup lang="ts">
import { ref } from "vue";
import { useSettingsStore } from "../../store";
import BaseButton from "../ui/BaseButton.vue";
import BaseInput from "../ui/BaseInput.vue";

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
</script>

<template>
  <div class="setting">
    <div class="flex gap-4">
      <div class="flex flex-col gap-2">
        <p>Blacklist</p>
        <p class="text-neutral-500">User IDs to skip automatically</p>
        <BaseInput type="number" placeholder="User id" v-model="userId" />
        
        <BaseButton @click="addToBlacklist">
          Add to Blacklist
        </BaseButton>

        <BaseButton :red="true" @click="settingsStore.blacklistIds = []">
          Clear Blacklist
        </BaseButton>
      </div>

      <ul aria-label="blacklisted ids" class="listbox select-none max-h-72">
        <li v-for="id in settingsStore.blacklistIds" :key="id" @dblclick="removeBlacklist(id)" class="listbox-item">
          {{ id }}
        </li>
      </ul>
    </div>
  </div>
</template>