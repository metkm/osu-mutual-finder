<script setup lang="ts">
import User from "../components/User.vue";
import AppSide from "../components/AppSide.vue";
import SettingsIcon from "../components/icons/Settings.vue";

import { ref, onActivated, onDeactivated, computed } from "vue";
import { addFriend, removeFriend, sleep, randomNumber } from "../utils";
import { Threads, Check } from "../types";

import { useRouter } from "vue-router";
import { useAuthStore, useSettingsStore } from "../store";
import { http } from "@tauri-apps/api";

const settingsStore = useSettingsStore();
const authStore = useAuthStore();
const router = useRouter();

const blacklistedIds = computed(() => settingsStore.blacklistIds);
const countries = computed(() => settingsStore.countries);
const friendIds = computed(() => settingsStore.friends);
const gamemode = computed(() => settingsStore.gamemode);
const check = computed(() => settingsStore.check);

const shouldAdd = computed(() => settingsStore.addFriend);
const shouldBlacklist = computed(() => settingsStore.addBlacklist);

const session = computed(() => authStore.session);
const token = computed(() => authStore.token);

const checking = ref(0);
const currentPage = ref(1);
const checked = ref<number[]>([]);
const mutuals = ref<number[]>([]);

const toSettings = () => {
  router.push({ path: "/settings" })
}

const threads: Threads = {}
const getUserElements = async (page: number, country: string): Promise<Element[]> => {
  let countryParam = country == "GLOBAL" ? "" : `&country=${country}`;

  const response = await http.fetch<string>(`https://osu.ppy.sh/rankings/${gamemode.value}/performance?page=${page}${countryParam}`, {
    method: "GET",
    responseType: 2
  })

  let dom = new DOMParser().parseFromString(response.data, "text/html");
  return Array.from(dom.getElementsByClassName("ranking-page-table__user-link-text js-usercard"));
}

const add = async (element: Element) => {
  let id = parseInt(element.getAttribute("data-user-id")!);
  checking.value = id;

  if (friendIds.value.includes(id) || blacklistedIds.value.includes(id)) return;
  if (shouldBlacklist.value) {
    settingsStore.toggleBlacklistId(id);
  }

  try {
    let newFriendList = await addFriend(id, token.value, session.value);
    if (!newFriendList) return;

    checked.value.push(id);

    let friend = newFriendList.find(fr => fr.target_id == id);
    if (!friend) return;

    if (!friend.mutual) {
      await removeFriend(id, token.value, session.value);
      return;
    }

    if (!shouldAdd.value) {
      await removeFriend(id, token.value, session.value);
    }

    mutuals.value.push(id);
  } catch (err: any) {
    console.log(err);
    console.log("can't add", id, err.response.data, err.response.status)
  }
}

const startCheck = async (id: number, country: string) => {
  let limit = settingsStore.getLimit(country) || { countryCode: country, end: 200, start: 1, index: 0 };
  
  for (let page = limit.start; page <= limit.end; page++) {
    currentPage.value = page;

    let elements = (await getUserElements(page, country)).slice(limit.index);

    for (const [index, element] of elements.entries()) {
      if (!threads[id]) return;

      await add(element);
      settingsStore.updateLimit({
        countryCode: limit.countryCode,
        start: page,
        end: limit.end,
        index
      });
    }

    settingsStore.updateLimit({
      countryCode: country,
      start: page,
      end: limit.end,
      index: 0
    })

    // page change sleep. Just in case.
    await sleep(2000);
  }
}

const start = async (id: number) => {
  if (check.value == Check.Global) {
    await startCheck(id, "GLOBAL");
  } else {
    for (let country of countries.value) {
      await startCheck(id, country);
      await sleep(2500);
    }
  }
}

// start();
onDeactivated(() => {
  console.log("deactivated");
});
onActivated(() => {
  // if (import.meta.env.DEV) {
  //   checked.value = [10440852];
  //   return
  // };

  // Disable all threads
  for (const item in threads) {
    threads[item] = false;
  }

  let id = randomNumber(500);
  threads[id] = true;

  start(id);
})

const clearMutuals = () => {
  mutuals.value = [];
}
const clearChecked = () => {
  checked.value = [];
}
</script>

<template>
  <main id="mutuals" class="page p-0 flex flex-col">
    <div class="flex flex-grow w-full overflow-hidden divide-x dark:divide-neutral-800">
      <AppSide :title="'Found Mutuals'" :desc="`Total of ${mutuals.length}`">
        <template v-slot:users>
          <User v-for="userId in mutuals" :userId="userId" :key="userId" />
        </template>

        <button class="clear-button" aria-label="clear found mutuals" @click="clearMutuals">Clear</button>
      </AppSide>

      <AppSide :title="'Checked Users'" :desc="`Checking ${checking} - Page ${currentPage}`">
        <template v-slot:users>
          <User v-slot:users v-for="userId in checked" :userId="userId" :key="userId" />
        </template>

        <div class="flex gap-2">
          <button class="clear-button" aria-label="clear checked mutuals" @click="clearChecked">Clear</button>
          <button class="form-button py-0 px-2 flex items-center gap-1" @click="toSettings"><SettingsIcon /> Settings</button>
        </div>
      </AppSide>
    </div>
  </main>
</template>

<style>
.mutuals-enter-from {
  opacity: 0;
  transform: translateY(40px);
}

.mutuals-move {
  transition: all 1s ease;
  position: absolute;
}
</style>
