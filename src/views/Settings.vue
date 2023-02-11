<script setup lang="ts">
import SettingsToggle from "../components/Settings/SettingsToggle.vue";
import SettingsBlacklist from "../components/Settings/SettingsBlacklist.vue";
import SettingsPageLimit from "../components/Settings/SettingsPageLimit.vue";
import SettingsCountries from "../components/Settings/SettingsCountries.vue";
import SettingsMode from "../components/Settings/SettingsMode.vue";
import SettingsOther from "../components/Settings/SettingsOther.vue";
</script>

<template>
  <div id="settings" class="page overflow-y-auto snap-y">
    <div class="flex flex-col gap-2">
      <SettingsToggle class="snap-start" />
      <SettingsBlacklist class="snap-center" />
      <div class="flex justify-center gap-2 snap-center">
        <SettingsPageLimit />
        <SettingsMode />
      </div>
      <SettingsCountries class="snap-center" />
      <SettingsOther class="snap-end" />
    </div>
  </div>
</template>
