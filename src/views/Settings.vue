<script setup lang="ts">
import SettingsToggle from "../components/Settings/SettingsToggle.vue";
import SettingsBlacklist from "../components/Settings/SettingsBlacklist.vue";
import SettingsPageLimit from "../components/Settings/SettingsPageLimit.vue";
import SettingsCountries from "../components/Settings/SettingsCountries.vue";
import SettingsMode from "../components/Settings/SettingsMode.vue";
import { useRouter } from "vue-router";
import { useStore } from "../store";
const router = useRouter();
const store = useStore();

const goBack = () => {
  router.push({ path: "/mutuals" });
};

</script>

<template>
  <div id="settings" class="page overflow-y-auto">
    <div class="grid grid-cols-3 items-center  py-2">
      <div class="form-button w-24" @click="goBack">
        <img src="../assets/back.svg" />
        <p>Back</p>
      </div>

      <p class="font-bold text-center">Settings</p>

      <img v-if="store.state.user.user" 
        :src="store.state.user.user.avatar_url"
        class="h-10 rounded-full justify-self-end"
      />
    </div>

    <div class="flex flex-col gap-2 mt-2">
      <SettingsToggle />
      <SettingsBlacklist />
      <div class="flex justify-center gap-2">
        <SettingsPageLimit />
        <SettingsMode />
      </div>
      <SettingsCountries />
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
