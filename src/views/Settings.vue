<script setup lang="ts">
import SettingsToggle from "../components/Settings/SettingsToggle.vue";
import SettingsBlacklist from "../components/Settings/SettingsBlacklist.vue";
import SettingsPageLimit from "../components/Settings/SettingsPageLimit.vue";
import SettingsCountries from "../components/Settings/SettingsCountries.vue";
import SettingsMode from "../components/Settings/SettingsMode.vue";
import { useRouter } from "vue-router";
const router = useRouter();

const goBack = () => {
  router.push({ path: "/mutuals" });
};

</script>

<template>
  <div id="settings" class="page overflow-y-auto">
    <div class="p-2 w-24 bg-green-600 rounded-lg flex items-center group font-semibold" @click="goBack">
      <img src="../assets/back.svg" class="group-hover:-translate-x-1 transition-all" />
      <p class="group-hover:-translate-x-1 transition-all">Back</p>
    </div>

    <div class="flex flex-col gap-2">
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
