<script setup lang="ts">
import { useRouter } from "vue-router";
const router = useRouter();

const returnHome = () => {
  router.push({ path: "/" })
}
</script>

<template>
  <button class="py-2 px-8 bg-gray-800 rounded-lg" @click="returnHome">Return</button>
</template>
