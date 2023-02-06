<script setup lang="ts">
// const { blacklistIds, countries, friends, gamemode, check, addFriend: keepFriend, addBlacklist } = storeToRefs(settingsStore);
// const { session, token } = storeToRefs(authStore);

// const add = async (element: Element) => {
//   let id = parseInt(element.getAttribute("data-user-id")!);
//   checking.value = id;

//   if (friends.value.includes(id) || blacklistIds.value.includes(id)) return;
//   if (addBlacklist.value) {
//     settingsStore.toggleBlacklistId(id);
//   }

//   try {
//     let newFriendList = await addFriend(id, token.value, session.value);
//     if (!newFriendList) return;

//     const user = await getUser(id);
//     checked.value.push(user);

//     let friend = newFriendList.find(fr => fr.target_id == id);
//     if (!friend) return;

//     if (!friend.mutual) {
//       await removeFriend(id, token.value, session.value);
//       return;
//     }

//     if (!keepFriend.value) {
//       await removeFriend(id, token.value, session.value);
//     }

//     mutuals.value.push(user);
//   } catch (err: any) {
//     console.log(err);
//     console.log("can't add", id, err.response.data, err.response.status)
//   }
// }

// const startCheck = async (id: number, code: string) => {
//   let limit = settingsStore.getLimit(code) || { countryCode: code, end: 200, start: 1, index: 0 };

//   for (let page = limit.start; page <= limit.end; page++) {
//     currentPage.value = page;

//     let elements = (await getUserElements(page, code)).slice(limit.index);

//     for (const [index, element] of elements.entries()) {
//       if (!threads[id]) return;

//       await add(element);
//       settingsStore.updateLimit({
//         countryCode: limit.countryCode,
//         start: page,
//         end: limit.end,
//         index
//       });
//     }

//     settingsStore.updateLimit({
//       countryCode: code,
//       start: page,
//       end: limit.end,
//       index: 0
//     })

//     // page change sleep. Just in case.
//     await sleep(2000);
//   }
// }

import { ref, onActivated } from "vue";
import { useRouter } from "vue-router";
import { storeToRefs } from "pinia";
import { UserObject, Tasks, Check, UpdateCallback } from "../types";
import { useSettingsStore } from "../store";

import { getUser, startChecking } from "../api/friends";

import Clear from "../components/Icons/Clear.vue";
import SettingsIcon from "../components/Icons/Settings.vue";
import BaseButtonIcon from "../components/Ui/BaseButtonIcon.vue";

import User from "../components/User.vue";
import AppSide from "../components/AppSide.vue";
import AppList from "../components/AppList.vue";

const router = useRouter();
const settingsStore = useSettingsStore();

const { countries } = storeToRefs(settingsStore)

const checked = ref<UserObject[]>([]);
const mutuals = ref<UserObject[]>([]);

const currentUser = ref(0);
const currentPage = ref(0);

const tasks = ref<Tasks>({});
let taskCount = 1;

const updateLists: UpdateCallback = async (checkedUser, foundMutual) => {
  const user = await getUser(foundMutual || checkedUser);
  checked.value.push(user);

  if (foundMutual) {
    mutuals.value.push(user);
  }
}

onActivated(async () => {
  for (const task in tasks.value) {
    tasks.value[task] = false
  }

  taskCount += 1;
  tasks.value[taskCount] = true;

  if (settingsStore.check === Check.Global) {
    await startChecking(taskCount, tasks.value, "GLOBAL", currentUser, currentPage, updateLists);
  } else {
    for (let country of countries.value) {
      await startChecking(taskCount, tasks.value, country.code, currentUser, currentPage, updateLists)
    }
  }
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

        <div class="flex flex-col gap-1 overflow-y-auto p-2">
          <User v-for="user in mutuals" :user="user" :key="user.id" />
        </div>
      </AppSide>

      <AppSide title="Checked Users" :desc="`Checking ${currentUser} - Page ${currentPage}`">
        <template v-slot:buttons>
          <BaseButtonIcon @click="checked = []">
            <Clear />
          </BaseButtonIcon>

          <BaseButtonIcon @click="router.push('/settings')">
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
