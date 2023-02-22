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
  <div class="h-full overflow-hidden p-2">
    <div class="h-full overflow-y-auto divide-y-4 dark:divide-neutral-900 pr-2">
      <SettingsToggle />
      <SettingsBlacklist />
      <SettingsDelay />
      <div class="flex justify-center gap-2 snap-center">
        <SettingsPageLimit />
        <SettingsMode />
      </div>
      <SettingsCountries />
      <SettingsOther />
    </div>
  </div>
</template>
