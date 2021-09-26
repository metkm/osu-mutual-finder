<script setup lang="ts">
import axios from "axios";
import User from "../components/User.vue";
import { ref, onMounted } from "vue";
import { getIdsOfFriends, addFriend, delUser } from "../utils";

const countries = ["TR"];
const startPage = 1;
const endPage = 200;
const friendIds = await getIdsOfFriends();

const checking = ref(0);
const checked = ref<number[]>([]);
const mutuals = ref<number[]>([]);

onMounted(async () => {
  for (const country of countries) {
    for (let page = startPage; page < endPage; page++) {

      let countryPage = await axios.get("https://osu.ppy.sh/rankings/osu/performance", {
        params: { country: country, page: page }
      });

      let countryDom = new DOMParser().parseFromString(countryPage.data, "text/html");
      let userElements = Array.from(countryDom.getElementsByClassName("ranking-page-table__user-link-text js-usercard"));

      for (const userElement of userElements) {
        let userId = parseInt(userElement.getAttribute("data-user-id")!);
        checking.value = userId;

        if (friendIds.includes(userId)) continue;
        try {
          let friendList = await addFriend(userId);
          if (typeof friendList == "undefined") continue;

          for (const friend of friendList) {
            if (friend.target_id != userId) continue;
            if (!friend.mutual) {
              await delUser(userId);
              continue
            };
            mutuals.value.push(userId);
          }
        } catch (error: any) {
          console.log("can't add", userId, error.response.data, error.response.status)
        }

        checked.value.push(userId);
      }
    }
  }
})
</script>

<template>
  <div id="mutuals" class="page grid grid-cols-2 gap-2">

    <div class="flex flex-col overflow-hidden bg-gray-800 rounded-lg p-2">
      <p class="font-semibold text-2xl">Found Mutuals</p>
      <transition-group name="mutuals" tag="div" class="overflow-y-auto flex-1">
        <User v-for="userId in mutuals" :userId="userId" :key="userId" />
      </transition-group>
      
      <p class="font-semibold">Checking {{ checking }}</p>
    </div>

    <div class="flex flex-col overflow-hidden bg-gray-800 rounded-lg p-2">
      <p class="font-semibold text-2xl">Checked</p>
      <transition-group name="mutuals" tag="div" class="overflow-y-auto flex-1">
        <User v-for="userId in checked" :userId="userId" :key="userId" />
      </transition-group>
    </div>

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
