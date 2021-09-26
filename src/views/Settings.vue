<script setup lang="ts">
import { useStore } from "vuex";
const store = useStore();

const isToggled = store.state.addFriend;
const toggleAddFriend = () => {
  store.dispatch("toggleAddFriend")
}

</script>

<template>
  <div id="settings" class="page">

    <label for="addfriend" class="flex items-center gap-2">
      <input 
        type="checkbox" 
        id="addfriend" 
        class="form-tick appearance-none w-5 h-5 rounded bg-white checked:bg-green-500"
        v-model="isToggled"
        @change="toggleAddFriend"
      >
      Add Friend
    </label>

  </div>
</template>

