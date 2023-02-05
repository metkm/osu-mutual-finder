<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import { login } from "../api/auth";

import AppVersion from "../components/AppVersion.vue";
import BaseSuspense from "../components/Ui/BaseSuspense.vue";
import BaseButton from "../components/Ui/BaseButton.vue";
import BaseInput from "../components/Ui/BaseInput.vue";
import IconLogin from "../components/Icons/Login.vue";

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


// const username = ref("");
// const password = ref("");
// const cooldown = ref(false);
// const version = await app.getVersion();
// const settingsStore = useSettingsStore();
// const authStore = useAuthStore();
// const userStore = useUserStore();
// const mutuals = ref<UserObject[] | null>();

// if (authStore.access_token) {
//   axios.get<UserObject[]>("/api/mutuals")
//   .then(users => {
//     mutuals.value = users.data;
//   });
// }

// const login = async () => {
//   if (!username.value && !password.value) return;

//   cooldown.value = true;
//   const client = await http.getClient();
//   const response = await client.get("https://osu.ppy.sh/home", { responseType: 2 });

//   let cookies = getCookies(response.rawHeaders);
//   let cookieString = parseCookies(cookies);

//   const sessionResponse = await client.post<Login>("https://osu.ppy.sh/session", {
//     payload: {
//       "_token": cookies["XSRF-TOKEN"],
//       "username": username.value,
//       "password": password.value
//     },
//     type: "Form"
//   }, {
//     headers: {
//       "referer": "https://osu.ppy.sh",
//       "cookie": cookieString
//     }
//   });

//   cooldown.value = false;
//   // // error handling here.
//   if (sessionResponse.status !== 200) {
//     notify(`Login request returned ${sessionResponse.status} code.`, {
//       description: "This is probably because of a change made on osu! website. You can open a github issue."
//     });

//     return;
//   }

//   if (!userStore.user) {
//     settingsStore.toggleBlacklistId(sessionResponse.data.user.id)
//   }

//   userStore.user = sessionResponse.data.user;
//   cookies = getCookies(sessionResponse.rawHeaders);
//   cookieString = parseCookies(cookies);

//   const verifResponse = await client.get("https://osu.ppy.sh/home/account/edit", {
//     headers: {
//       "cookie": cookieString
//     }
//   })

//   if (verifResponse.status !== 401) {
//     notify(`Verification request returned ${verifResponse.status} code.`, {
//       description: "The expected code is 401"
//     });

//     return;
//   }

//   cookies = getCookies(verifResponse.rawHeaders);
//   authStore.session = cookies["osu_session"];
//   authStore.token = cookies["XSRF-TOKEN"];

//   router.push("/verify");
// }

</script>

<template>
  <div class="page flex justify-center items-center">
    <form aria-label="login form" class="grid gap-2 w-full max-w-lg text-sm">
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

        <BaseButton type="submit" :disabled="(!username || !password)" :isLoading="isLoading" @click.prevent="loginHandler">
          <template v-slot:icon>
            <IconLogin />
          </template>
          <p>Login</p>
        </BaseButton>
      </div>
    </form>
  </div>

    <!-- <section
      v-if="mutuals && mutuals.length > 0"
      class="max-h-96 flex flex-col"
    >
      <h1 class="text-center mt-4">Found mutuals from the database</h1>
      <ul class="flex flex-1 flex-col gap-1 overflow-y-auto">
        <User v-for="user in mutuals" :user="user" :userId="user.id" />
      </ul>
    </section> -->
  <!-- </div> -->
</template>
