<script setup lang="ts">
import { useRouter } from "vue-router";
import BaseButton from "./Ui/BaseButton.vue";
const router = useRouter();
</script>

<template>
  <div class="p-1 border-b dark:border-b-neutral-800">
    <div class="grid grid-flow-col gap-2">
      <BaseButton 
        v-for="route in router.options.routes" 
        @click="router.push(route.path)"
      >
        <p>{{ route.name }}</p>
      </BaseButton>
    </div>
  </div>
</template>
