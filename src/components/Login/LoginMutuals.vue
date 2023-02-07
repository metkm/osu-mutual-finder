<script setup lang="ts">
import { ref } from "vue";
import { useAuthStore } from '../../store';
import { UserObject } from "../../types";
import ky from "ky";

import AppList from "../AppList.vue";
import User from "../User.vue";

const authStore = useAuthStore();
const users = ref<UserObject[]>([]);

if (authStore.access_token) {
  const response = await ky.get(`${import.meta.env.VITE_API_BASE_URL}/api/mutuals`, {
    credentials: "include"
  }).json<UserObject[]>();
  
  users.value = response;
}
</script>

<template>
  <section v-if="users.length > 0"
    class="flex flex-col w-full max-h-96 overflow-hidden rounded border dark:border-neutral-800">
    <div class="p-2">
      <p>Found Mutuals</p>
      <p class="text-sm text-neutral-500">mutuals that are found from the database of mutual finder.</p>
    </div>

    <AppList :items="users" :itemHeight="76" v-slot="{ item }">
      <User :user="item" />
    </AppList>
  </section>
</template>
