<script setup lang="ts">
import axios from "axios";

import User from "../components/User.vue";
import AppSide from "../components/AppSide.vue";

import { ref, onActivated, onDeactivated, computed } from "vue";
import { addFriend, delUser, sleep } from "../utils";

import { useRouter } from "vue-router";
import { useStore } from "../store";

import { Threads, Check } from "../types";

const store = useStore();
const router = useRouter();

const blacklistedIds = computed(() => store.state.blacklistIds);
const countries = computed(() => store.state.countries);
const friendIds = computed(() => store.state.friends);
const gamemode = computed(() => store.state.gamemode);
const startPage = computed(() => store.state.startPage);
const endPage = computed(() => store.state.endPage);
const check = computed(() => store.state.check);

const shouldAdd = computed(() => store.state.addFriend);
const shouldBlacklist = computed(() => store.state.addBlacklist);

const checking = ref(0);
const currentPage = ref(1);
const checked = ref<number[]>([]);
const mutuals = ref<number[]>([]);

const toSettings = () => {
  router.push({ path: "/settings" })
}

const randomNumber = (): number => {
  return Math.floor(Math.random() * 500);
}

const blacklistId = (id: number) => {
  store.dispatch("addBlacklist", id);
}

const threads: Threads = {}
const getUserElements = async (page: number, country?: string): Promise<Element[]> => {
  const resp = await axios.get(`https://osu.ppy.sh/rankings/${gamemode.value}/performance`, {
    params: {
      page,
      country
    }
  });

  let dom = new DOMParser().parseFromString(resp.data, "text/html");
  return Array.from(dom.getElementsByClassName("ranking-page-table__user-link-text js-usercard"));
}

const add = async (element: Element) => {
  let id = parseInt(element.getAttribute("data-user-id")!);
  checking.value = id;

  if (friendIds.value.includes(id) || blacklistedIds.value.includes(id)) return;
  if (shouldBlacklist.value) {
    blacklistId(id);
  }

  try {
    let newFriendList = await addFriend(id);
    if (!newFriendList) return;

    checked.value.push(id);

    let friend = newFriendList.find(fr => fr.target_id == id);
    if (!friend) return;

    if (!friend.mutual) {
      await delUser(id);
      return;
    }

    if (!shouldAdd.value) {
      await delUser(id);
    }

    mutuals.value.push(id);
  } catch(err: any) {
    console.log("can't add", id, err.response.data, err.response.status)
  }
}

const start = async (id: number) => {
  if (check.value == Check.Global) {
    for (let page = startPage.value; page <= endPage.value; page++) {
      currentPage.value = page;

      for (let element of await getUserElements(page)) {
        if (!threads[id]) return;

        await add(element);
      }
    }
  } else {
    for (let country of countries.value) {
      for (let page = startPage.value; page <= endPage.value; page++) {
        currentPage.value = page;

        for (let element of await getUserElements(page, country)) {
          if (!threads[id]) return;

          await add(element);
        }
      }

      await sleep(2500);
    }
  }
}

// start();
onDeactivated(() => {
  console.log("deactivated");
});
onActivated(() => {
  if (import.meta.env.DEV) {
    checked.value = [10440852, 7512553];
    return
  };

  // Disable all threads
  for (const item in threads) {
    threads[item] = false;
  }

  let id = randomNumber();
  threads[id] = true;

  start(id);
})
</script>

<template>
  <div id="mutuals" class="page flex flex-col gap-1">

    <div class="flex flex-grow w-full gap-2 overflow-hidden">
      <AppSide :title="'Found Mutuals'">
        <User v-for="userId in mutuals" :userId="userId" :key="userId" />
      </AppSide>

      <AppSide :title="'Checked'">
        <User v-for="userId in checked" :userId="userId" :key="userId" />
      </AppSide>
    </div>

    <p class="font-semibold text-center">Checking {{ checking }} - Page {{ currentPage }}</p>
    <button class="col-span-2 bg-green-600 p-2 rounded-lg transition-all font-semibold hover:bg-gray-800"
      @click="toSettings">
      Settings
    </button>

  </div>
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
