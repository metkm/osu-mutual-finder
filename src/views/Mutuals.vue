<script setup lang="ts">
import User from "../components/User.vue";
import AppSide from "../components/AppSide.vue";
import AppList from "../components/AppList.vue";
import SettingsIcon from "../components/icons/Settings.vue";
import BaseButtonIcon from "../components/ui/BaseButtonIcon.vue";
import Clear from "../components/icons/Clear.vue";
import { http } from "@tauri-apps/api";

import { ref, onActivated, onDeactivated } from "vue";
import { useRouter } from "vue-router";
import { storeToRefs } from "pinia";

import { addFriend, removeFriend, sleep, randomNumber, getUser } from "../utils";
import { useAuthStore, useSettingsStore } from "../store";
import { Threads, Check, UserObject } from "../types";

const settingsStore = useSettingsStore();
const authStore = useAuthStore();
const router = useRouter();

const { blacklistIds, countries, friends, gamemode, check, addFriend: keepFriend, addBlacklist } = storeToRefs(settingsStore);
const { session, token } = storeToRefs(authStore);

const checking = ref(0);
const currentPage = ref(1);
const checked = ref<UserObject[]>([]);
const mutuals = ref<UserObject[]>([]);

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

  if (friends.value.includes(id) || blacklistIds.value.includes(id)) return;
  if (addBlacklist.value) {
    settingsStore.toggleBlacklistId(id);
  }

  try {
    let newFriendList = await addFriend(id, token.value, session.value);
    if (!newFriendList) return;

    const user = await getUser(id);
    checked.value.push(user);

    let friend = newFriendList.find(fr => fr.target_id == id);
    if (!friend) return;

    if (!friend.mutual) {
      await removeFriend(id, token.value, session.value);
      return;
    }

    if (!keepFriend.value) {
      await removeFriend(id, token.value, session.value);
    }

    mutuals.value.push(user);
  } catch (err: any) {
    console.log(err);
    console.log("can't add", id, err.response.data, err.response.status)
  }
}

const startCheck = async (id: number, code: string) => {
  let limit = settingsStore.getLimit(code) || { countryCode: code, end: 200, start: 1, index: 0 };

  for (let page = limit.start; page <= limit.end; page++) {
    currentPage.value = page;

    let elements = (await getUserElements(page, code)).slice(limit.index);

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
      countryCode: code,
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
      await startCheck(id, country.code);
      await sleep(2500);
    }
  }
}

// start();
onDeactivated(() => {
  console.log("deactivated");
});
onActivated(() => {
  // if (import.meta.env.DEV) return;

  // if (import.meta.env.DEV) {
  //   for (let index = 0; index < 50; index++) {
  //     checked.value.push(10440852);
  //   }
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
</script>

<template>
  <main class="page p-0 flex flex-col">
    <div class="flex grow overflow-hidden">
      <AppSide title="Found Mutuals" :desc="`Total of ${mutuals.length}`">
        <template v-slot:buttons>
          <BaseButtonIcon @click="mutuals = []">
            <Clear />
          </BaseButtonIcon>
        </template>

        <User v-for="user in mutuals" :user="user" :key="user.id" />
      </AppSide>

      <AppSide title="Checked Users" :desc="`Checking ${checking} - Page ${currentPage}`">
        <template v-slot:buttons>
          <BaseButtonIcon @click="checked = []">
            <Clear />
          </BaseButtonIcon>

          <BaseButtonIcon @click="toSettings">
            <SettingsIcon />
          </BaseButtonIcon>
        </template>

        <AppList :items="checked" :itemHeight="76" v-slot="{ item }">
          <User :user="item" :key="item.id" />
        </AppList>
      </AppSide>
    </div>
  </main>
</template>
