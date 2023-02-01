<script setup lang="ts">
import { ref } from "vue";
import { http } from "@tauri-apps/api";
import { app } from "@tauri-apps/api";
import { SessionLoginUser, UserObject } from "../types";
import { useAuthStore, useSettingsStore, useUserStore } from "../store";
import { getCookies, parseCookies } from "../utils";
import { notify } from "../plugin/notification";
import axios from "axios";
import router from "../router";

import AppInput from "../components/AppInput.vue";
import User from "../components/User.vue";
import BaseButton from "../components/ui/BaseButton.vue";

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
  if (!username.value && !password.value) return;

  cooldown.value = true;
  const client = await http.getClient();
  const response = await client.get("https://osu.ppy.sh/home", { responseType: 2 });

  let cookies = getCookies(response.rawHeaders);
  let cookieString = parseCookies(cookies);

  const sessionResponse = await client.post<Login>("https://osu.ppy.sh/session", {
    payload: {
      "_token": cookies["XSRF-TOKEN"],
      "username": username.value,
      "password": password.value
    },
    type: "Form"
  }, {
    headers: {
      "referer": "https://osu.ppy.sh",
      "cookie": cookieString
    }
  });

  cooldown.value = false;
  // // error handling here.
  if (sessionResponse.status !== 200) {
    notify(`Login request returned ${sessionResponse.status} code.`, {
      description: "This is probably because of a change made on osu! website. You can open a github issue."
    });

    return;
  }

  if (!userStore.user) {
    settingsStore.toggleBlacklistId(sessionResponse.data.user.id)
  }

  userStore.user = sessionResponse.data.user;
  cookies = getCookies(sessionResponse.rawHeaders);
  cookieString = parseCookies(cookies);

  const verifResponse = await client.get("https://osu.ppy.sh/home/account/edit", {
    headers: {
      "cookie": cookieString
    }
  })

  if (verifResponse.status !== 401) {
    notify(`Verification request returned ${verifResponse.status} code.`, {
      description: "The expected code is 401"
    });

    return;
  }

  cookies = getCookies(verifResponse.rawHeaders);
  authStore.session = cookies["osu_session"];
  authStore.token = cookies["XSRF-TOKEN"];

  router.push("/verify");
}

</script>

<template>
  <div id="login" class="page flex flex-col justify-center max-w-lg mx-auto">
    <form aria-label="login form" class="flex flex-col gap-2">
      <AppInput v-model="username" type="text" placeholder="Username" required />
      <AppInput v-model="password" type="text" placeholder="Password" required />

      <BaseButton type="submit" @click.prevent="login" :disabled="cooldown">Login</BaseButton>
      <p class="text-neutral-500 text-center">Version: {{ version }}</p>
    </form>

    <!-- <section
      v-if="mutuals && mutuals.length > 0"
      class="max-h-96 flex flex-col"
    >
      <h1 class="text-center mt-4">Found mutuals from the database</h1>
      <ul class="flex flex-1 flex-col gap-1 overflow-y-auto">
        <User v-for="user in mutuals" :user="user" :userId="user.id" />
      </ul>
    </section> -->
  </div>
</template>
