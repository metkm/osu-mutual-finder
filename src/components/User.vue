<script setup lang="ts">
import { getUser, jsonCountries } from "../utils";
import { UserObject } from "../types";
import { open } from "@tauri-apps/api/shell";

const props = defineProps<{
  userId: number,
  user?: UserObject
}>();

const userDetails = props.user || await getUser(props.userId);
const country = jsonCountries.find(country => {
  if (userDetails.country_code == country.code) {
    return country
  }
})

const countryFromCode = (code: string) => {
  let country = jsonCountries.find(country => country.code == code);
  return import.meta.env.DEV ? `/flags/${country?.code.toLowerCase()}.svg` : `./flags/${country?.code.toLowerCase()}.svg`;
}

const openLink = () => {
  open(`https://osu.ppy.sh/users/${props.userId}`);
}
</script>

<template>
  <li class="h-min cursor-pointer rounded overflow-hidden dark:bg-neutral-900">
    <a @click="openLink">
      <img :src="userDetails.cover.url" class="h-10 w-full object-cover" />

      <div class="flex items-end gap-2 p-1.5 -mt-8">
        <img :src="userDetails.avatar_url" class="rounded h-14 object-cover" />
        <p>{{ userDetails.username }}</p>
        <p v-if="true" class="text-sm text-neutral-500">#12345</p>

        <img v-if="country" :src="countryFromCode(country.code)" class="h-6 contrast-75 ml-auto" />
      </div>
    </a>
  </li>
</template>