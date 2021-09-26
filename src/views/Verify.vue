<script setup lang="ts">
import axios from "axios";
import { ref } from "vue";
import { useRouter } from "vue-router";
import { updateFriends } from "../utils";

await updateFriends();
const router = useRouter();
const verificationKey = ref(null);
const error = ref("");

const verify = async () => {
  try {
    await axios.post("https://osu.ppy.sh/home/account/verify", {
      verification_key: verificationKey.value
    });

    router.push({ path: "/mutuals" })
  } catch {
    error.value = "Can't verify the key. Check if it's correct."
  }
}
</script>

<template>
  <div id="login" class="page flex flex-col items-center justify-center gap-2">
    <input v-model="verificationKey" type="text" placeholder="Verification Key" class="form-element">
    <button class="form-element bg-green-600" @click="verify">Login</button>
    <p v-if="error" class="font-semibold text-red-500"> {{ error }} </p>
  </div>
</template>
