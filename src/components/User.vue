<script setup lang="ts">
import { getUser } from "../utils";
import { jsonCountries } from "../utils";

const props = defineProps({
  userId: Number
});

const userDetails = await getUser(props.userId!);
const country = jsonCountries.find(country => {
  if (userDetails.country_code == country.code) {
    return country
  }

})
</script>

<template>
  <a :href="`https://osu.ppy.sh/users/${userId}`" target="_blank" class="flex flex-col bg-gray-900 p-1 rounded-md">
    <img :src="userDetails.cover.url" class="flex h-12 object-cover rounded-md" />

    <div class="flex px-2 gap-1" style="margin-top: -6px;">
      <img :src="userDetails.avatar_url" class="w-16 h-16 rounded-md" />

      <div class="flex flex-1 items-end justify-between mx-2">
        <div>
          <p v-if="userDetails.statistics.global_rank" class="text-sm font-bold text-gray-500 -my-1">#{{ userDetails.statistics.global_rank }}</p>
          <p class="font-semibold">{{ userDetails.username }}</p>
        </div>

        <img v-if="country" :src="`https://osu.ppy.sh//assets/images/flags/${country.flag_url}`" class="h-10" >
      </div>
    </div>
  </a>
</template>