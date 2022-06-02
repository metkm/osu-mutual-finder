<script setup lang="ts">
import { computed, ref, watch } from "vue";
import { useStore } from "../../store";
import { jsonCountries } from "../../utils";
import AppInput from "../AppInput.vue";
import AppSelect from "../AppSelect.vue";
const store = useStore();

const limits = computed(() => store.state.limit.limits);
const selected = ref("");

const change = (code: string) => {
  let limit = limits.value.find(x => x.countryCode == code);
  store.dispatch("updateLimit", limit);
}

const removeLimit = (code: string) => {
  store.commit("removeLimit", code);
}

watch(selected, val => {
  store.commit("addLimit", {
    countryCode: val,
    start: 1,
    end: 200,
    index: 0
  });
});
</script>

<template>
  <div class="setting relative">
    <div class="listbox max-h-72">
      <div class="flex items-center justify-around border-b-4 border-b-neutral-800 rounded">
        <p>Code</p>
        <p>Start</p>
        <p>End</p>
        <p>Index</p>
      </div>

      <div v-for="limit in limits" :key="limit.countryCode"
        class="flex items-center justify-around overflow-hidden gap-2 my-1" 
        @dblclick="removeLimit(limit.countryCode)"
      >
        <p class="w-full text-center">{{ limit.countryCode }}</p>
        <AppInput v-model="limit.start" @keyup="change(limit.countryCode)" />
        <AppInput v-model="limit.end" @keyup="change(limit.countryCode)" />
        <AppInput v-model="limit.index" @keyup="change(limit.countryCode)" />
      </div>
    </div>

    <AppSelect :items="jsonCountries.map(x => x.code)" v-model="selected" />
  </div>
</template>