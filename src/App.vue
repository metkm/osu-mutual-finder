<script setup lang="ts">
import TitleBar from "./components/AppTitleBar.vue";
import axios from "axios";


</script>

<template>
  <TitleBar />
  <router-view v-slot="{ Component }">
    <Suspense>
      <template #default>
        <component :is="Component"></component>
      </template>
      <template #fallback>
        <p>Loading</p>
      </template>
    </Suspense>
  </router-view>
</template>
