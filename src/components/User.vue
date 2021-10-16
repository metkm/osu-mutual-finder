<script setup lang="ts">
import { getUser } from "../utils";

const props = defineProps({
  userId: Number
});

const userDetails = await getUser(props.userId!);
</script>

<template>
  <a :href="`https://osu.ppy.sh/users/${userId}`" 
    target="_blank" 
    class="flex items-center h-16 gap-4 relative rounded-lg overflow-hidden group my-1"
  >
    <img :src="userDetails.avatar_url" class="h-full z-10">
    <p class="font-semibold text-xl z-10">{{ userDetails.username }}</p>

    <div
      class="absolute w-full h-full transition-all bg-cover bg-45% opacity-0 group-hover:opacity-100 group-hover:bg-55%"
      :style="{ backgroundImage: `linear-gradient(to right, #000000 25%, rgba(0,0,0,0)), url(${userDetails.cover.url})` }"
    />
  </a>
</template>