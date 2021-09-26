<script setup lang="ts">
import { useStore } from "vuex";
import { useRouter } from "vue-router";
import { computed, ref } from "vue";
const store = useStore();
const router = useRouter();
const blacklistId = ref(null);

const isToggled = computed(() => store.state.addFriend);
const blacklistIds = computed(() => store.state.blacklistIds);

const toggleAddFriend = () => {
  store.dispatch("toggleAddFriend")
}
const goBack = () => {
  router.push({ path: "/mutuals" })
}
const addToBlacklist = () => {
  store.dispatch("addBlacklist", blacklistId.value)
}
const removeBlacklist = (userId: number) => {
  store.dispatch("removeBlacklist", userId)
}

</script>

<template>
  <div id="settings" class="page">
    <div class="p-2 w-24 bg-green-600 rounded-lg flex items-center group" @click="goBack">
      <img src="../assets/back.svg" class="group-hover:-translate-x-1 transition-all">
      <p>Back</p>
    </div>

    <div class="setting">
      <label for="addfriend" class="flex items-center gap-2">
        <input 
          type="checkbox" 
          id="addfriend" 
          class="form-tick appearance-none w-5 h-5 rounded bg-white checked:bg-green-500"
          v-model="isToggled"
          @change="toggleAddFriend"
        >
        <p class="font-semibold">Add Friend</p>
      </label>
      <p class="setting-description">When a mutual is found, keep it as friend or remove it.</p>
    </div>

    <div class="setting">
      <div class="flex max-h-44 gap-4">
        <div class="flex flex-col gap-2">
          <p class="font-semibold">Blacklist</p>
          <p class="setting-description">User IDs to skip automatically</p>
          <input type="number" placeholder="User id" class="form-element input-number" v-model="blacklistId">
          <button class="form-element bg-green-500" @click="addToBlacklist">Add to Blacklist</button>
        </div>
        <transition-group name="blacklist-ids" tag="div" class="overflow-y-auto relative bg-gray-800 w-full rounded-lg">
          <p 
            v-for="id in blacklistIds"
            :key="id"
            @dblclick="removeBlacklist(id)"
            class="hover:bg-gray-700 p-1"
          >
          {{ id }}
          </p>
        </transition-group>
      </div>
    </div>

  </div>
</template>

<style>
.blacklist-ids-enter-active, .blacklist-ids-leave-active {
  transition: all 1s ease;
  position: absolute;
}
.blacklist-ids-enter-from {
  opacity: 0;
  transform: translateY(20px);
}
.blacklist-ids-leave-to {
  opacity: 0;
  transform: translateY(-20px);
}
.blacklist-ids-move {
  transition: all 1s ease;
}
</style>
