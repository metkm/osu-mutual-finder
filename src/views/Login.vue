<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import { login } from "../api/auth";

import AppVersion from "../components/AppVersion.vue";
import BaseSuspense from "../components/Ui/BaseSuspense.vue";
import BaseButton from "../components/Ui/BaseButton.vue";
import BaseInput from "../components/Ui/BaseInput.vue";
import IconLogin from "../components/Icons/Login.vue";
import LoginMutuals from "../components/login/LoginMutuals.vue";

const username = ref("");
const password = ref("");

const isLoading = ref(false);
const router = useRouter();

const loginHandler = async () => {
  if (!username.value || !password.value) return;
  
  isLoading.value = true;
  const isSuccess = await login(username.value, password.value);
  isLoading.value = false;

  if (isSuccess) {
    router.push("/verify");
  }
}
</script>

<template>
  <div class="page flex flex-col justify-center items-center gap-4 max-w-lg mx-auto overflow-hidden">
    <form aria-label="login form" class="grid gap-2 w-full text-sm">
      <div class="flex flex-col">
        <label for="username" class="ml-1">Username</label>
        <BaseInput id="username" v-model="username" required />
      </div>

      <div class="flex flex-col">
        <label for="password" class="ml-1">Password</label>
        <BaseInput id="password" v-model="password" required />
      </div>

      <div class="flex items-center justify-between">
        <BaseSuspense>
          <AppVersion />
        </BaseSuspense>

        <BaseButton 
          type="submit" 
          :disabled="(!username || !password)" 
          :isLoading="isLoading" 
          @click.prevent="loginHandler"
        >
          <template v-slot:icon>
            <IconLogin />
          </template>
          <p>Login</p>
        </BaseButton>
      </div>
    </form>

    <BaseSuspense>
      <LoginMutuals />
    </BaseSuspense>
  </div>
</template>
