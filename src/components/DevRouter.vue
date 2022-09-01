<script setup lang="ts">
import { useRouter } from "vue-router";
const router = useRouter();
</script>

<template>
  <div class="p-2 bg-green-500">
    <div class="flex justify-around gap-2">
      <button class="form-button" v-for="route in router.options.routes" @click="() => router.push(route.path)">{{
          route.name
      }}</button>
    </div>
  </div>
</template>
