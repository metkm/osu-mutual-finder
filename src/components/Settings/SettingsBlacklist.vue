<script setup lang="ts">
import { computed, ref } from "vue";
import { useStore } from "../../store";
import AppInput from "../AppInput.vue";
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
        <AppInput type="number" placeholder="User id" v-model="userId" />
        <button class="form-button" @click="addToBlacklist">Add to Blacklist</button>
        <!-- <button class="form-button" @click="removeFriend">Remove Friend</button> -->
        <button class="form-button bg-red-600" @click="clearBlacklist">Clear Blacklist</button>
      </div>

      <div class="listbox select-none max-h-72">
        <p v-for="id in blacklistIds" :key="id" @dblclick="removeBlacklist(id)" class="listbox-item">
          {{ id }}
        </p>
      </div>
    </div>
  </div>
</template>