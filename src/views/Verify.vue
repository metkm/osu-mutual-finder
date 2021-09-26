<script setup lang="ts">
import axios from "axios";
import { ref } from "vue";
import router from "../router";

const verifyKey = ref(null);
const error = ref("");

const resp = await axios.get("https://osu.ppy.sh/home/friends");
const dom = new DOMParser().parseFromString(resp.data, "text/html");
const token = dom.getElementsByName("csrf-token")[0].getAttribute("content");
axios.defaults.headers.common["x-csrf-token"] = token;
axios.defaults.headers.common["x-requested-with"] = "XMLHttpRequest";


const verify = async () => {
  try {
    await axios.post("https://osu.ppy.sh/home/account/verify", {
      verification_key: verifyKey.value
    });

    router.push({ path: "/mutuals" })
  } catch {
    error.value = "Can't verify the key. Check if it's correct."
  }
}
</script>
<template>
  <div id="login" class="page flex flex-col items-center justify-center gap-2">
    <input v-model="verifyKey" type="text" placeholder="Verification Key" class="form-element">
    <button class="form-element bg-green-600" @click="verify">Login</button>
    <p v-if="error" class="font-semibold text-red-500"> {{ error }} </p>
  </div>
</template>