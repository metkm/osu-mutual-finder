<script setup lang="ts">
import { useStore } from "vuex";
import { computed, ref } from "vue";
import { getCountries } from "../../utils";
const store = useStore();

let jsonCountries = await getCountries()
const countriesToCheck = computed(() => store.state.countries);

const searchQuery = ref("");
const searchQueryResults = computed(() => {
  return jsonCountries.filter(country => {
    return country.name.toLowerCase().includes(searchQuery.value.toLowerCase())
  })
})

const addCountry = (countryCode: string) => {
  store.dispatch("addCountry", countryCode);
};
const removeCountry = (countryCode: string) => {
  store.dispatch("removeCountry", countryCode);
}
</script>

<template>
  <div class="setting">
    <p class="font-semibold">Countries</p>
    <div class="flex gap-2 h-full max-h-64">
      <div class="flex flex-col flex-1 gap-2">
        <p>Countries to Add</p>
        <input v-model="searchQuery" type="text" placeholder="Search" class="form-element max-w-full">
        <transition-group name="array" tag="div" class="listbox">
          <p 
            v-for="country in searchQueryResults" 
            :key="country.code" 
            class="hover:bg-gray-700 p-1"
            @dblclick="addCountry(country.code)"
          >
            {{ country.code }} - {{ country.name }}
          </p>
        </transition-group>
      </div>
      <div class="flex flex-col flex-1">
        <p>Countries to Check</p>
        <transition-group name="array" tag="div" class="listbox">
          <p 
            v-for="countryCode in countriesToCheck" 
            :key="countryCode" 
            class="hover:bg-gray-700 p-1"
            @dblclick="removeCountry(countryCode)"
          >
            {{ countryCode }}
          </p>
        </transition-group>
      </div>
    </div>
  </div>
</template>
