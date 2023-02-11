<script setup lang="ts">
import { useRouter } from "vue-router";
import BaseButton from "./Ui/BaseButton.vue";
const router = useRouter();
</script>

<template>
  <div class="grid grid-flow-col auto-cols-fr gap-1 p-1">
    <BaseButton
      v-for="route in router.options.routes"
      @click="router.push(route.path)"
    >
      {{ route.name }}
    </BaseButton>
  </div>
</template>
