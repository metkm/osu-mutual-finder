<script setup lang="ts">
import { ref, watchEffect } from "vue";
import { useStore } from "vuex";
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
</template>