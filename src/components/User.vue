<script setup lang="ts">
import { getUser } from "../utils";

const props = defineProps({
  userId: Number
});

const userDetails = await getUser(props.userId!);
</script>

<template>
  <a :href="`https://osu.ppy.sh/users/${userId}`" target="_blank" class="flex flex-col bg-gray-900 p-1 rounded-md">
    <img :src="userDetails.cover.url" class="flex h-12 object-cover rounded-md" />

    <div class="flex px-2 gap-1" style="margin-top: -6px;">
      <img :src="userDetails.avatar_url" class="w-16 h-16 rounded-md" />

      <div class="flex flex-1 flex-col justify-end p-1">
        <p v-if="userDetails.statistics.global_rank" class="text-sm font-bold text-gray-500 -my-1">#{{ userDetails.statistics.global_rank }}</p>
        <p class="font-semibold">{{ userDetails.username }}</p>
      </div>
    </div>
  </a>
</template>