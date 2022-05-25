<script setup lang="ts">
import { computed, ref } from "vue";
import { useStore } from "vuex";
import axios from "axios";
const store = useStore();

const blacklistIds = computed(() => store.state.blacklistIds);
const userId = ref(null);

const addToBlacklist = () => {
  store.dispatch("addBlacklist", userId.value);
};
const removeBlacklist = (userId: number) => {
  store.dispatch("removeBlacklist", userId);
};
const clearBlacklist = () => {
  store.dispatch("clearBlacklist");
}
</script>

<template>
  <div class="setting">
    <div class="flex gap-4">
      <div class="flex flex-col gap-2">
        <p class="font-semibold">Blacklist</p>
        <p class="setting-description">User IDs to skip automatically</p>
        <input type="number" placeholder="User id" class="form-element input-number" v-model="userId" />
        <button class="form-button" @click="addToBlacklist">Add to Blacklist</button>
        <!-- <button class="form-button" @click="removeFriend">Remove Friend</button> -->
        <button class="form-button bg-red-600" @click="clearBlacklist">Clear Blacklist</button>
      </div>
      <div class="listbox">
        <p v-for="id in blacklistIds" :key="id" @dblclick="removeBlacklist(id)" class="hover:bg-gray-700 p-1">
          {{ id }}
        </p>
      </div>
    </div>
  </div>
</template>