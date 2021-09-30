<script setup lang="ts">
import SettingsAddFriend from "../components/Settings/SettingsAddFriend.vue";
import SettingsBlacklist from "../components/Settings/SettingsBlacklist.vue";
import SettingsPageLimit from "../components/Settings/SettingsPageLimit.vue";
import SettingsCountries from "../components/Settings/SettingsCountries.vue";
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

    <SettingsAddFriend />
    <SettingsBlacklist />
    <SettingsPageLimit />
    <suspense>
      <SettingsCountries />
      <template #fallback>
        <img src="../assets/loading.svg" class="animate-spin w-10 h-10 mx-auto" >
      </template>
    </suspense>
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
