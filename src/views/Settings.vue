<script setup lang="ts">
import SettingsToggle from "../components/Settings/SettingsToggle.vue";
import SettingsBlacklist from "../components/Settings/SettingsBlacklist.vue";
import SettingsPageLimit from "../components/Settings/SettingsPageLimit.vue";
import SettingsCountries from "../components/Settings/SettingsCountries.vue";
import SettingsMode from "../components/Settings/SettingsMode.vue";
import SettingsOther from "../components/Settings/SettingsOther.vue";
import SettingsDelay from "../components/Settings/SettingsDelay.vue";
</script>

<template>
  <div class="h-full overflow-y-auto">
    <div class="max-w-6xl mx-auto p-2 flex flex-col gap-2">
      <SettingsToggle />
      <SettingsBlacklist />
      <SettingsDelay />
      <div class="flex gap-2 flex-wrap">
        <SettingsPageLimit />
        <SettingsMode />
      </div>
      <SettingsCountries />
      <SettingsOther />
    </div>
  </div>
</template>
