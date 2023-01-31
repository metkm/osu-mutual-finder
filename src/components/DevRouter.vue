<script setup lang="ts">
import { useRouter } from "vue-router";
import BaseButton from "./ui/BaseButton.vue";
const router = useRouter();
</script>

<template>
  <div class="p-1 bg-black dark:bg-white">
    <div class="grid grid-flow-col gap-2">
      <BaseButton v-for="route in router.options.routes" @click="router.push(route.path)">
        {{ route.name }}
      </BaseButton>
    </div>
  </div>
</template>
