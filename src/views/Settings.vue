<script setup lang="ts">
import SettingsToggle from "../components/Settings/SettingsToggle.vue";
import SettingsBlacklist from "../components/Settings/SettingsBlacklist.vue";
import SettingsPageLimit from "../components/Settings/SettingsPageLimit.vue";
import SettingsCountries from "../components/Settings/SettingsCountries.vue";
import SettingsMode from "../components/Settings/SettingsMode.vue";
import SettingsOther from "../components/Settings/SettingsOther.vue";
import { useRouter } from "vue-router";
import { useUserStore } from "../store";
const router = useRouter();
const userStore = useUserStore();

const goBack = () => {
  router.push({ path: "/mutuals" });
};

</script>

<template>
  <div id="settings" class="page overflow-y-auto">
    <div class="flex justify-between">
      <div class="form-button w-24" @click="goBack">
        <img src="../assets/back.svg" />
        <p>Back</p>
      </div>

      <div class="h-10 flex items-center gap-2 p-1" v-if="userStore.user">
        <img 
          :src="userStore.user.avatar_url"
          class="h-full rounded-lg justify-self-end"
        />
        <p>{{ userStore.user?.username }}</p>
      </div>

    </div>

    <div class="flex flex-col gap-2 mt-2">
      <SettingsToggle />
      <SettingsBlacklist />
      <div class="flex justify-center gap-2">
        <SettingsPageLimit />
        <SettingsMode />
      </div>
      <SettingsCountries />
      <SettingsOther />
    </div>
  </div>
</template>

<style>
.array-enter-active,
.array-leave-active {
  transition: all 500ms ease;
}
.array-leave-active {
  position: absolute;
}
.array-enter-from {
  opacity: 0;
  transform: translateY(20px);
}
.array-leave-to {
  opacity: 0;
  transform: translateY(-20px);
}
.array-move {
  transition: all 500ms ease;
}
</style>
