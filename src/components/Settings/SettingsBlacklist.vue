<script setup lang="ts">
import { computed, ref } from "vue";
import { useStore } from "vuex";
const store = useStore();

const blacklistIds = computed(() => store.state.blacklistIds);
const blacklistId = ref(null);

const addToBlacklist = () => {
  store.dispatch("addBlacklist", blacklistId.value);
};
const removeBlacklist = (userId: number) => {
  store.dispatch("removeBlacklist", userId);
};
</script>

<template>
  <div class="setting">
    <div class="flex gap-4">
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
</template>