<script setup lang="ts">
import { ref } from "vue";
import { useStore } from "../../store";
import AppCheckbox from "../AppCheckbox.vue";
const store = useStore();

const addFriend = ref(store.state.addFriend);
const addBlacklist = ref(store.state.addBlacklist);

const toggleAddFriend = () => {
  store.dispatch("toggleAddFriend");
};

const toggleAddBlacklist = () => {
  store.dispatch("toggleAddBlacklist");
}
</script>

<template>
  <div class="setting">
    <div class="flex justify-evenly text-center">
      <AppCheckbox :label="'Add Friend'" :toggled="addFriend"
        :description="'When a mutual is found, keep it as friend or remove it.'" :onChange="toggleAddFriend" />
      <AppCheckbox :label="'Add To Blacklist'" :toggled="addBlacklist"
        :description="'Add to blacklist when the user is checked once.'" :onChange="toggleAddBlacklist" />
    </div>
  </div>
</template>