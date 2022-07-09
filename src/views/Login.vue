<script setup lang="ts">
import { ref } from "vue";
import { http } from "@tauri-apps/api";
import { app } from "@tauri-apps/api";
import { SessionLoginUser, UserObject } from "../types";
import { useAuthStore, useSettingsStore, useUserStore } from "../store";
import { getTokens } from "../utils";

import axios from "axios";
import router from "../router";
import AppInput from "../components/AppInput.vue";
import User from "../components/User.vue";

interface Login {
  header: string,
  header_popup: string,
  user: SessionLoginUser
}


const username = ref("");
const password = ref("");
const cooldown = ref(false);
const version = await app.getVersion();
const settingsStore = useSettingsStore();
const authStore = useAuthStore();
const userStore = useUserStore();
const mutuals = ref<UserObject[] | null>();

if (authStore.access_token) {
  axios.get<UserObject[]>("/api/mutuals")
  .then(users => {
    mutuals.value = users.data;
  });
}

const login = async () => {
  const client = await http.getClient();
  const response = await client.get("https://osu.ppy.sh/home", { responseType: 2 });

  let [token, session] = await getTokens(response.rawHeaders);

  const sessionResponse = await client.post<Login>("https://osu.ppy.sh/session", {
    payload: {
      "_token": token,
      "username": username.value,
      "password": password.value
    },
    type: "Form"
  }, {
    headers: {
      "referer": "https://osu.ppy.sh",
      "cookie": `osu_session=${session}`
    }
  });

  // error handling here.
  if (sessionResponse.status != 200) {
    return;
  }

  if (!userStore.user) {
    settingsStore.toggleBlacklistId(sessionResponse.data.user.id)
  }

  userStore.user = sessionResponse.data.user;
  [token, session] = await getTokens(sessionResponse.rawHeaders);

  const verificationResponse = await client.get("https://osu.ppy.sh/home/account/edit", {
    headers: {
      "cookie": `osu_session=${session}`
    }
  });

  [token, session] = await getTokens(verificationResponse.rawHeaders);
  authStore.session = session;
  authStore.token = token;

  router.push("/verify")
}

</script>

<template>
  <!-- <div id="login" class="page overflow-y-auto flex flex-col items-center justify-center gap-2 max-w-lg mx-auto"> -->
  <div id="login" class="page flex flex-col justify-center max-w-lg mx-auto">
    <div class="flex flex-col gap-2">
      <AppInput v-model="username" type="text" placeholder="Username" />
      <AppInput v-model="password" type="text" placeholder="Password" />

      <button class="form-button" :disabled="cooldown" @click="login">Login</button>
      <p class="setting-description font-semibold">Version: {{ version }}</p>
    </div>

    <div v-if="mutuals && mutuals.length > 0" class="w-full overflow-y-auto rounded-lg">
      <p class="font-semibold">Found mutuals from the database.</p>
      <User v-for="user in mutuals" :user="user" :userId="user.id" />
    </div>
  </div>
</template>
