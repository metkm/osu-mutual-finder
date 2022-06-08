<script setup lang="ts">
import { ref } from "vue";
import { http } from "@tauri-apps/api";

import { useRouter } from "vue-router";
import { useStore } from "../store";

import AppInput from "../components/AppInput.vue";
import { getTokens } from "../utils";

// updateFriends();
const router = useRouter();
const store = useStore();

const code = ref(null);
const error = ref("");

const verify = async () => {
  const client = await http.getClient();
  const response = await client.post("https://osu.ppy.sh/home/account/verify", {
    payload: {
      verification_key: code.value
    },
    type: "Json"
  }, {
    headers: {
      "cookie": `osu_session=${store.state.auth.session}; XSRF-TOKEN=${store.state.auth.token}`,
      "referer": "https://osu.ppy.sh",
      "x-csrf-token": store.state.auth.token
    }
  });

  if (response.status != 200) {
    error.value = "Can't verify the key. Check if it's correct. If you're BN or GMT (anything with extra permissions) this is expected.";
    return;
  }

  let [token, session] = await getTokens(response.rawHeaders);
  store.commit("setSession", session);
  store.commit("setToken", token);
  
  await router.push("/mutuals");
}

</script>

<template>
  <div id="verify" class="page flex flex-col items-center justify-center gap-2 max-w-lg mx-auto">
    <p class="setting-description">Check your emails</p>
    <AppInput v-model="code" type="text" placeholder="Verification Key" class="form-element" />
    <button class="form-button" @click="verify">Login</button>
    <p v-if="error" class="font-semibold text-red-500"> {{ error }} </p>
  </div>
</template>
