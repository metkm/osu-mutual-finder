<script setup lang="ts">
import { ref, watchEffect } from "vue";
import { useStore } from "../../store";
import AppInput from "../AppInput.vue";
const store = useStore();

const start = ref(store.state.startPage);
const end = ref(store.state.endPage);

watchEffect(() => {
  store.dispatch("setStartPage", start.value);
  store.dispatch("setEndPage", end.value);

  start.value = store.state.startPage;
  end.value = store.state.endPage;
});
</script>

<template>
  <div class="setting">
    <p class="font-semibold">Page Limit</p>
    <div class="flex gap-4">
      <div class="flex-1" >
        <p class="ml-1" >Start from</p>
        <AppInput v-model.number="start" type="number" min="0" max="200" />
      </div>
      <div class="flex-1" >
        <p class="ml-1">To</p>
        <AppInput v-model.number="end" type="number" min="0" max="200" />
      </div>
    </div>
    <p class="setting-description">This is limit to country page to check. Minimum 1, Maximum 200.</p>
  </div>
</template>