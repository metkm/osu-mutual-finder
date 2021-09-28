<script setup lang="ts">
import { getUser } from "../utils";

const props = defineProps({
  userId: Number
});

const userDetails = await getUser(props.userId!);
</script>

<template>
  <a :href="`https://osu.ppy.sh/users/${userId}`" target="_blank" class="flex items-center h-16 rounded-lg gap-4 bg-black my-1 transition-all relative overflow-hidden group">
    <img :src="userDetails.avatar_url" class="h-full w-16 object-cover rounded-lg z-10">
    <p class="font-semibold text-xl z-10">{{ userDetails.username }}</p>

    <img :src="userDetails.cover.url" alt="missing" class="absolute w-full h-full object-cover transition-all opacity-25 group-hover:opacity-50">
  </a>
</template>