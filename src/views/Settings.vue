<script setup lang="ts">
import axios from "axios";
import { useStore } from "vuex";
import { useRouter } from "vue-router";
import { computed, ref, watchEffect } from "vue";
const store = useStore();
const router = useRouter();
const blacklistId = ref(null);

interface country {
  code: string,
  name: string,
  display: number
}

const response = await axios.get("https://osu.ppy.sh/rankings/osu/country");
const dom = new DOMParser().parseFromString(response.data, "text/html");
const jsonCountries = JSON.parse(dom.getElementById("json-countries")!.innerText) as country[];

const blacklistIds = computed(() => store.state.blacklistIds);
const countriesToCheck = computed(() => store.state.countries);
const isToggled = ref(store.state.addFriend);
const start = ref(store.state.startPage);
const end = ref(store.state.endPage);
const countriesToAdd = ref(jsonCountries);

const toggleAddFriend = () => {
  store.dispatch("toggleAddFriend");
};
const goBack = () => {
  router.push({ path: "/mutuals" });
};
const addToBlacklist = () => {
  store.dispatch("addBlacklist", blacklistId.value);
};
const removeBlacklist = (userId: number) => {
  store.dispatch("removeBlacklist", userId);
};
const addCountry = (countryCode: string) => {
  store.dispatch("addCountry", countryCode);
};
const removeCountry = (countryCode: string) => {
  store.dispatch("removeCountry", countryCode);
}
watchEffect(() => {
  store.dispatch("setStartPage", start.value);
  store.dispatch("setEndPage", end.value);
  start.value = store.state.startPage;
  end.value = store.state.endPage;
});
</script>

<template>
  <div id="settings" class="page">
    <div class="p-2 w-24 bg-green-600 rounded-lg flex items-center group font-semibold" @click="goBack">
      <img src="../assets/back.svg" class="group-hover:-translate-x-1 transition-all" />
      <p class="group-hover:-translate-x-1 transition-all">Back</p>
    </div>

    <div class="setting">
      <label for="addfriend" class="flex items-center gap-2">
        <input
          type="checkbox"
          id="addfriend"
          class="form-tick appearance-none w-5 h-5 rounded bg-white checked:bg-green-500"
          v-model="isToggled"
          @change="toggleAddFriend"
        />
        <p class="font-semibold">Add Friend</p>
      </label>
      <p class="setting-description">When a mutual is found, keep it as friend or remove it.</p>
    </div>

    <div class="setting">
      <div class="flex h-44 max-h-44 gap-4">
        <div class="flex flex-col gap-2">
          <p class="font-semibold">Blacklist</p>
          <p class="setting-description">User IDs to skip automatically</p>
          <input type="number" placeholder="User id" class="form-element input-number" v-model="blacklistId" />
          <button class="form-button" @click="addToBlacklist">Add to Blacklist</button>
        </div>
        <transition-group name="array" tag="div" class="listbox">
          <p v-for="id in blacklistIds" :key="id" @dblclick="removeBlacklist(id)" class="hover:bg-gray-700 p-1">
            {{ id }}
          </p>
        </transition-group>
      </div>
    </div>

    <div class="setting">
      <p class="font-semibold">Page Limit</p>
      <div class="flex gap-4">
        <div>
          <p>Start from</p>
          <input v-model="start" type="number" min="0" max="200" class="form-element input-number" />
        </div>
        <div>
          <p>To</p>
          <input v-model="end" type="number" min="0" max="200" class="form-element input-number" />
        </div>
        <p class="setting-description">This is limit to country page to check. Minimum 1, Maximum 200.</p>
      </div>
    </div>

    <div class="setting">
      <p class="font-semibold">Countries</p>
      <div class="flex gap-2 h-44 max-h-44">
        <div class="flex flex-col flex-1">
          <p>Countries to Add</p>
          <transition-group name="array" tag="div" class="listbox">
            <p 
              v-for="country in countriesToAdd" 
              :key="country.code" 
              class="hover:bg-gray-700 p-1"
              @dblclick="addCountry(country.code)"
            >
              {{ country.code }} - {{ country.name }}
            </p>
          </transition-group>
        </div>
        <div class="flex flex-col flex-1">
          <p>Countries to Check</p>
          <transition-group name="array" tag="div" class="listbox">
            <p 
              v-for="countryCode in countriesToCheck" 
              :key="countryCode" 
              class="hover:bg-gray-700 p-1"
              @dblclick="removeCountry(countryCode)"
            >
              {{ countryCode }}
            </p>
          </transition-group>
        </div>
      </div>
    </div>
  </div>
</template>

<style>
.array-enter-active,
.array-leave-active {
  transition: all 500ms ease;
  position: absolute;
}
.array-enter-from {
  opacity: 0;
  transform: translateY(20px);
}
.array-leave-to {
  opacity: 0;
  transform: translateY(-20px);
}
.array-move {
  transition: all 500ms ease;
}
</style>
