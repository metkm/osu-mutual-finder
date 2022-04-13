<script setup lang="ts">
import { getUser } from "../utils";

const props = defineProps({
  userId: Number
});

const userDetails = await getUser(props.userId!);
</script>

<template>
  <a :href="`https://osu.ppy.sh/users/${userId}`" target="_blank" class="flex flex-col">
    <img :src="userDetails.cover.url" class="flex h-20 object-cover rounded-md" />

    <div class="flex px-2" style="margin-top: -20px;">
      <img :src="userDetails.avatar_url" class="w-20 h-20 rounded-md" />

      <div class="flex flex-1 flex-col justify-end p-1">
        <p class="text-xl font-semibold" >{{ userDetails.username }}</p>
        <p class="font-semibold">#{{ userDetails.statistics.global_rank }}</p>
      </div>
    </div>
  </a>
</template>