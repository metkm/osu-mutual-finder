<script setup lang="ts">
import TitleBar from "./components/AppTitleBar.vue";
</script>

<template>
  <TitleBar />
  <div id="content" class="relative w-full flex-grow">
    <Suspense>
      <template #default>
        <router-view v-slot="{ Component, route }">
          <transition name="page">
              <component 
                :is="Component" 
                :key="route.meta.usePathKey ? route.path : undefined" 
              />
          </transition>
        </router-view>
      </template>
      <template #fallback>
        <p>Loading...</p>
      </template>
    </Suspense>
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
