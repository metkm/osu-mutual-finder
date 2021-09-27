<script setup lang="ts">
import axios from "axios";
import { ref } from "vue";
import { useRouter } from "vue-router";

const username = ref(null);
const password = ref(null);
const router = useRouter();

const getToken = async (): Promise<string> => {
  const resp = await axios.get("https://osu.ppy.sh/home");
  const doc = new DOMParser().parseFromString(resp.data, "text/html");
  let token = doc.getElementsByName("csrf-token")[0].getAttribute("content");
  return token!
}

const login = async () => {
  const token = await getToken();
  
  await axios.post("https://osu.ppy.sh/session", {
    "_token": token,
    "username": username.value,
    "password": password.value,
  })

  // fire verification
  axios.get("https://osu.ppy.sh/home/account/edit");
  router.push({ path: "/verify" });
}

</script>

<template>
  <div id="login" class="page flex flex-col items-center justify-center gap-2">
    <input v-model="username" type="text" placeholder="username" class="form-element">
    <input v-model="password" type="text" placeholder="password" class="form-element">
    <button class="form-element bg-green-600" @click="login">Login</button>
    <div 
    style="background-image: url('https://osu.ppy.sh/images/layout/avatar-guest.png');
          background-color: white; background-size: contain; background-repeat: no-repeat;
          background-position: 50%;"
    class="w-14 h-14">

    </div>
  </div>
</template>
