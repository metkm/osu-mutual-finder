<script setup lang="ts">
import axios from "axios";
import User from "../components/User.vue";
import { ref, onActivated, onDeactivated, computed } from "vue";
import { addFriend, delUser, sleep } from "../utils";
import { useRouter } from "vue-router";
import { mapState } from "vuex";
import { useStore } from "../store";
import { StoreState } from "../types";
import AppSide from "../components/AppSide.vue";
const store = useStore();
const router = useRouter();

const countries = computed(() => store.state.countries);
const startPage = computed(() => store.state.startPage);
const endPage = computed(() => store.state.endPage);
const friendIds = computed<number[]>(() => store.state.friends);
const blacklistedIds = computed<number[]>(() => store.state.blacklistIds);
const gamemode = computed(() => store.state.gamemode);

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

interface Threads {
  [key: number]: boolean
}

const blacklistId = (id: number) => {
  store.dispatch("addBlacklist", id);
}

const threads: Threads = {}

async function start(id: number) {
  for (const country of countries.value) {
    for (let page = startPage.value; page <= endPage.value; page++) {
      currentPage.value = page

      let countryPage = await axios.get(`https://osu.ppy.sh/rankings/${gamemode.value}/performance`, {
        params: { country: country, page: page }
      });

      let countryDom = new DOMParser().parseFromString(countryPage.data, "text/html");
      let userElements = Array.from(countryDom.getElementsByClassName("ranking-page-table__user-link-text js-usercard"));

      for (const userElement of userElements) {
        if (!threads[id]) {
          return;
        }

        let userId = parseInt(userElement.getAttribute("data-user-id")!);
        checking.value = userId;
        
        // Already added friend. Skip.
        if (friendIds.value.includes(userId)) continue;
        // The userid is in the blacklist. Skip.
        if (blacklistedIds.value.includes(userId)) continue;

        // Add the userId to blacklist.
        if (shouldBlacklist.value) {
          blacklistId(userId);
        }

        try {
          // New friend list.
          let friendList = await addFriend(userId);
          if (typeof friendList == "undefined") continue;

          for (const friend of friendList) {
            if (friend.target_id != userId) continue;

            // The added friend is not mutual. Delete it.
            if (!friend.mutual) {
              await delUser(userId);
              continue;
            } 

            // Add friend settings is not enabled.
            if (!shouldAdd.value) {
              await delUser(userId);
            }

            mutuals.value.push(userId);
          }
        } catch (error: any) {
          console.log("can't add", userId, error.response.data, error.response.status)
        }

        checked.value.push(userId);
      }

      // Sleep on every page change
      await sleep(2000);
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
    <button class="col-span-2 bg-green-600 p-2 rounded-lg transition-all font-semibold hover:bg-gray-800" @click="toSettings">
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
