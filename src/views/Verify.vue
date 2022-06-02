<script setup lang="ts">
import axios from "axios";
import { ref } from "vue";
import { useRouter } from "vue-router";
import { updateFriends } from "../utils";
import AppInput from "../components/AppInput.vue";

updateFriends();
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
    error.value = "Can't verify the key. Check if it's correct. If you're BN or GMT (anything with extra permissions) this is expected."
  }
}
</script>

<template>
  <div id="verify" class="page flex flex-col items-center justify-center gap-2">
    <p class="setting-description">Check your emails</p>
    <AppInput v-model="verificationKey" type="text" placeholder="Verification Key" class="form-element" />
    <button class="form-button" @click="verify">Login</button>
    <p v-if="error" class="font-semibold text-red-500"> {{ error }} </p>
  </div>
</template>
