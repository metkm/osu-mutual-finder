<script setup lang="ts">
import SettingsToggle from "../components/Settings/SettingsToggle.vue";
import SettingsBlacklist from "../components/Settings/SettingsBlacklist.vue";
import SettingsPageLimit from "../components/Settings/SettingsPageLimit.vue";
import SettingsCountries from "../components/Settings/SettingsCountries.vue";
import SettingsMode from "../components/Settings/SettingsMode.vue";
import SettingsOther from "../components/Settings/SettingsOther.vue";
import { useUserStore } from "../store";

const userStore = useUserStore();

</script>

<template>
  <div id="settings" class="page overflow-y-auto">
    <img
      v-if="userStore.user"
      :src="userStore.user?.cover.url"
      class="h-52 object-cover absolute top-0 left-0 right-0 w-full -z-10"
      style="mask-image: linear-gradient(to bottom, rgba(0, 0, 0, 0.35) 0%, rgba(0, 0, 0, 0) 100%);" 
    />

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
