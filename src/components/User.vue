<script setup lang="ts">
import { jsonCountries } from "../utils";
import { UserObject } from "../types";
import { open } from "@tauri-apps/api/shell";

const { user } = defineProps<{
  user: UserObject
}>();

const country = jsonCountries.find(country => {
  if (user.country_code == country.code) {
    return country
  }
})

const countryFromCode = (code: string) => {
  let country = jsonCountries.find(country => country.code == code);
  return import.meta.env.DEV ? `/flags/${country?.code.toLowerCase()}.svg` : `./flags/${country?.code.toLowerCase()}.svg`;
}

const openLink = () => {
  open(`https://osu.ppy.sh/users/${user.id}`);
}
</script>

<template>
  <li class="shadow h-min cursor-pointer rounded overflow-hidden bg-theme">
    <a @click="openLink">
      <img :src="user.cover.url" class="h-10 w-full object-cover" />

      <div class="flex items-end gap-2 p-1.5 -mt-8">
        <img :src="user.avatar_url" class="rounded h-14 object-cover" />
        <p class="truncate">{{ user.username }}</p>
        <p v-if="user.statistics?.global_rank" class="text-sm text-neutral-500">#{{ user.statistics.global_rank }}</p>

        <img v-if="country" :src="countryFromCode(country.code)" class="h-6 contrast-75 ml-auto" />
      </div>
    </a>
  </li>
</template>