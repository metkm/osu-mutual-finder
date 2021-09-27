<script setup lang="ts">
import axios from "axios";
import User from "../components/User.vue";
import { ref, onActivated, onDeactivated, computed } from "vue";
import { addFriend, delUser } from "../utils";
import { useRouter } from "vue-router";
import { useStore } from "vuex";
const store = useStore();
const router = useRouter();

const countries = computed(() => store.state.countries);
const startPage = computed(() => store.state.startPage);
const endPage = computed(() => store.state.endPage);
const add = computed(() => store.state.addFriend);
const friendIds = computed<number[]>(() => store.state.friends);
const blacklistedIds = computed<number[]>(() => store.state.blacklistIds);

const checking = ref(0);
const checked = ref<number[]>([]);
const mutuals = ref<number[]>([]);

const toSettings = () => {
  router.push({ path: "/settings" })
}

let stopped = false;
async function start() {
  for (const country of countries.value) {
    for (let page = startPage.value; page < endPage.value; page++) {

      let countryPage = await axios.get("https://osu.ppy.sh/rankings/osu/performance", {
        params: { country: country, page: page }
      });

      let countryDom = new DOMParser().parseFromString(countryPage.data, "text/html");
      let userElements = Array.from(countryDom.getElementsByClassName("ranking-page-table__user-link-text js-usercard"));

      for (const userElement of userElements) {
        let userId = parseInt(userElement.getAttribute("data-user-id")!);
        checking.value = userId;

        if (stopped) {
          stopped=false;
          setTimeout(start, 100);
          return;
        };
        if (friendIds.value.includes(userId)) continue;
        if (blacklistedIds.value.includes(userId)) continue;

        try {
          let friendList = await addFriend(userId);
          if (typeof friendList == "undefined") continue;

          for (const friend of friendList) {
            if (friend.target_id != userId) continue;
            if (!friend.mutual) {
              await delUser(userId);
              continue
            } else if (!add.value) {
              await delUser(userId);
            }

            mutuals.value.push(userId);
          }
        } catch (error: any) {
          console.log("can't add", userId, error.response.data, error.response.status)
        }

        checked.value.push(userId);
      }
    }
  }
}

start();
onDeactivated(() => {
  console.log("deactivated");
});
onActivated(() => {
  console.log("active");
  stopped=true;
})
</script>

<template>
  <div id="mutuals" class="page flex flex-col gap-2">

    <div class="flex flex-grow w-full gap-2 overflow-hidden">
      <div class="flex flex-col flex-1 overflow-hidden bg-gray-900 rounded-lg p-2">
        <p class="font-semibold text-2xl">Found Mutuals</p>
        <transition-group name="mutuals" tag="div" class="overflow-y-auto flex-1">
          <User v-for="userId in mutuals" :userId="userId" :key="userId" />
        </transition-group>
        
        <p class="font-semibold">Checking {{ checking }}</p>
      </div>

      <div class="flex flex-col flex-1 overflow-hidden bg-gray-900 rounded-lg p-2">
        <p class="font-semibold text-2xl">Checked</p>
        <transition-group name="mutuals" tag="div" class="overflow-y-auto flex-1">
          <User v-for="userId in checked" :userId="userId" :key="userId" />
        </transition-group>
      </div>
    </div>

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
