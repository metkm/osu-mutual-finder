<script setup lang="ts">
import { onMounted, ref } from "vue";
import { http } from "@tauri-apps/api";

import { useRouter } from "vue-router";
import { useAuthStore, useSettingsStore } from "../store";

import AppInput from "../components/AppInput.vue";
import BaseButton from "../components/ui/BaseButton.vue";
import { getCookies } from "../utils";
import { UserObject } from "../types";

const router = useRouter();
const authStore = useAuthStore();
const settingsStore = useSettingsStore();

const code = ref(null);
const error = ref("");

const updateFriends = async () => {
  const client = await http.getClient();
  const response = await client.get<string>("https://osu.ppy.sh/home/friends", {
    responseType: 2,
    headers: {
      "cookie": `osu_session=${authStore.session}`
    }
  });

  const dom = new DOMParser().parseFromString(response.data, "text/html");
  let jsonUsers = JSON.parse(dom.getElementById("json-users")!.innerText) as UserObject[];

  settingsStore.friends = jsonUsers.map(user => user.id);
}

onMounted(updateFriends);
const verify = async () => {
  const client = await http.getClient();
  const response = await client.post("https://osu.ppy.sh/home/account/verify", {
    payload: {
      verification_key: code.value
    },
    type: "Json"
  }, {
    headers: {
      "cookie": `osu_session=${authStore.session}; XSRF-TOKEN=${authStore.token}`,
      "referer": "https://osu.ppy.sh",
      "x-csrf-token": authStore.token 
    }
  });

  if (response.status != 200) {
    error.value = "Can't verify the key. Check if it's correct. If you're BN or GMT (anything with extra permissions) this is expected.";
    return;
  }

  let cookies = getCookies(response.rawHeaders);
  authStore.session = cookies["osu_session"];
  authStore.token = cookies["XSRF-TOKEN"];
  
  await router.push("/mutuals");
}

</script>

<template>
  <div class="page flex flex-col justify-center max-w-lg mx-auto">
    <form aria-label="verify form" class="flex flex-col gap-2">
      <p class="text-neutral-500 text-center">Check your emails</p>
      <AppInput v-model="code" type="text" placeholder="Verification Key" class="form-element" required />
  
      <BaseButton type="submit" @click.prevent="verify">Verify</BaseButton>
      <p v-if="error" class="font-semibold text-red-500">{{ error }}</p>
    </form>
  </div>
</template>
