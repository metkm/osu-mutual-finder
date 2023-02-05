<script setup lang="ts">
import { ref } from "vue";
import { useAuthStore } from '../../store';
import { UserObject } from "../../types";
import axios from "axios";

import AppList from "../AppList.vue";
import User from "../User.vue";

const authStore = useAuthStore();
const users = ref<UserObject[]>([]);

if (authStore.access_token) {
  const response = await axios.get<UserObject[]>("/api/mutuals");
  users.value = response.data;
}
</script>

<template>
  <section 
    v-if="users.length > 0" 
    class="flex flex-col w-full max-h-96 overflow-hidden rounded border dark:border-neutral-800"
  >
    <div class="p-2">
      <p>Found Mutuals</p>
      <p class="text-sm text-neutral-500">mutuals that are found from the database of mutual finder.</p>
    </div>

    <AppList :items="users" :itemHeight="76" v-slot="{ item }">
      <User :user="item" />
    </AppList>
  </section>
</template>
