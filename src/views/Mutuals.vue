<script setup lang="ts">
import { ref, onActivated } from "vue";
import { useRouter } from "vue-router";
import { storeToRefs } from "pinia";
import { UserObject, Tasks, Check, UpdateCallback } from "../types";
import { useSettingsStore } from "../store";

import { getUser } from "../api/user";
import { startChecking } from "../api/friends";
import { randomNumber } from "../utils";

import Clear from "../components/Icons/Clear.vue";
import SettingsIcon from "../components/Icons/Settings.vue";
import BaseButtonIcon from "../components/Ui/BaseButtonIcon.vue";

import User from "../components/User.vue";
import AppSide from "../components/AppSide.vue";

const router = useRouter();
const settingsStore = useSettingsStore();

const { countries } = storeToRefs(settingsStore)

const checked = ref<UserObject[]>([]);
const mutuals = ref<UserObject[]>([]);

const currentUser = ref(0);
const currentPage = ref(0);
const currentCooldown = ref(6);

const tasks = ref<Tasks>({});

let cooldownId: NodeJS.Timeout;
const updateLists: UpdateCallback = async (checkedUser, foundMutual) => {
  currentCooldown.value = 6;
  clearInterval(cooldownId);

  cooldownId = setInterval(() => {
    currentCooldown.value -= 1;
  }, 1000)

  const user = await getUser(foundMutual || checkedUser);
  checked.value.push(user);

  if (foundMutual) {
    mutuals.value.push(user);
  }
}

onActivated(async () => {
  if (import.meta.env.DEV) return;

  for (const task in tasks.value) {
    tasks.value[task] = false
  }

  let id = randomNumber(500);
  tasks.value[id] = true;

  if (settingsStore.check === Check.Global) {
    await startChecking(id, tasks.value, "GLOBAL", currentUser, currentPage, updateLists);
  } else {
    for (let country of countries.value) {
      await startChecking(id, tasks.value, country.code, currentUser, currentPage, updateLists)
    }
  }
})
</script>

<template>
  <main class="page p-0 flex flex-col overflow-hidden">
    <div class="flex grow overflow-hidden">
      <AppSide title="Found Mutuals" :desc="`Total of ${mutuals.length}`">
        <template v-slot:buttons>
          <BaseButtonIcon @click="mutuals = []">
            <Clear />
          </BaseButtonIcon>
        </template>

        <div class="overflow-y-auto grid lg:grid-cols-2 gap-2 p-2">
          <User v-for="user in mutuals" :user="user" :key="user.id" />
        </div>
      </AppSide>

      <AppSide title="Checked Users" :desc="`Cooldown ${currentCooldown} - Checking ${currentUser} - Page ${currentPage}`">
        <template v-slot:buttons>
          <BaseButtonIcon @click="checked = []">
            <Clear />
          </BaseButtonIcon>

          <BaseButtonIcon @click="router.push('/settings')">
            <SettingsIcon />
          </BaseButtonIcon>
        </template>

        <div class="overflow-y-auto grid lg:grid-cols-2 gap-2 p-2">
          <User v-for="user in checked" :user="user" :key="user.id" />
        </div>
      </AppSide>
    </div>
  </main>
</template>
