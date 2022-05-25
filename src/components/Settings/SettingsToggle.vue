<script setup lang="ts">
import { ref } from "vue";
import { useStore } from "vuex";
const store = useStore();

const isToggled = ref(store.state.addFriend);

const toggleAddFriend = () => {
  store.dispatch("toggleAddFriend");
};
</script>

<template>
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
</template>