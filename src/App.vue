<script setup lang="ts">
import TitleBar from "./components/AppTitleBar.vue";
</script>

<template>
  <TitleBar />
  <div id="content" class="relative w-full flex-grow">
    <router-view v-slot="{ Component }">
      <transition name="page">
        <suspense>
          <template #default>
            <component :is="Component"></component>
          </template>
          <template #fallback>
            <p>Loading</p>
          </template>
        </suspense>
      </transition>
    </router-view>
  </div>
</template>

<style>
.page-enter-active, .page-leave-active {
  transition: all 300ms ease;
  position: absolute;
}
.page-enter-from {
  transform: translateX(100%);
}
.page-leave-to {
  transform: translateX(-100%);
}
</style>
