<script setup lang="ts">
import User from "../components/User.vue";
import AppSide from "../components/AppSide.vue";

import { ref, onActivated, onDeactivated, computed } from "vue";
import { addFriend, removeFriend, sleep } from "../utils";
import { Threads, Check } from "../types";

import { useRouter } from "vue-router";
import { useStore } from "../store";
import { http } from "@tauri-apps/api";

const store = useStore();
const router = useRouter();

const blacklistedIds = computed(() => store.state.blacklistIds);
const countries = computed(() => store.state.countries);
const friendIds = computed(() => store.state.friends);
const gamemode = computed(() => store.state.gamemode);
const check = computed(() => store.state.check);

const shouldAdd = computed(() => store.state.addFriend);
const shouldBlacklist = computed(() => store.state.addBlacklist);

const session = computed(() => store.state.auth.session);
const token = computed(() => store.state.auth.token);

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

const threads: Threads = {}
const getUserElements = async (page: number, country?: string): Promise<Element[]> => {
  const response = await http.fetch<string>(`https://osu.ppy.sh/rankings/${gamemode.value}/performance?page=${page}&country=${country}`, {
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
    store.dispatch("addBlacklist", id);
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

const startCheck = async (id: number, country?: string) => {
  let limit = {
    countryCode: "?",
    start: 1,
    end: 200,
    index: 0
  }
  
  if (country) {
    let countryLimit = store.getters.getLimit(country);
    if (countryLimit) {
      limit = countryLimit;
    }
  }

  for (let page = limit.start; page <= limit.end; page++) {
    currentPage.value = page;

    let elements = (await getUserElements(page, country)).slice((store.getters.getLimit(country)?.index || 0));

    for (const [index, element] of elements.entries()) {
      if (!threads[id]) return;

      await add(element);
      if (country) {
        store.dispatch("updateLimit", {
          countryCode: country,
          start: page,
          end: limit.end,
          index
        });
      }
    }

    if (country) {
      store.dispatch("updateLimit", {
        countryCode: country,
        start: page,
        end: limit.end,
        index: 0
      })
    }

    // page change sleep. Just in case.
    await sleep(1500);
  }
}

const start = async (id: number) => {
  if (check.value == Check.Global) {
    await startCheck(id);
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

  let id = randomNumber();
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
  <div id="mutuals" class="page flex flex-col gap-1">

    <div class="flex flex-grow w-full gap-2 overflow-hidden">
      <AppSide :title="'Found Mutuals'">
        <template v-slot:users>
          <User v-for="userId in mutuals" :userId="userId" :key="userId" />
        </template>

        <button class="p-2 rounded text-white bg-red-600 hover:bg-red-800 transition-all" @click="clearMutuals">Clear</button>
      </AppSide>

      <AppSide :title="'Checked'">
        <template v-slot:users>
          <User v-slot:users v-for="userId in checked" :userId="userId" :key="userId" />
        </template>

        <button class="p-2 rounded text-white bg-red-600 hover:bg-red-800 transition-all" @click="clearChecked">Clear</button>
      </AppSide>
    </div>

    <p class="font-semibold text-center">Checking {{ checking }} - Page {{ currentPage }}</p>
    <button class="form-button max-w-full" @click="toSettings">
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
