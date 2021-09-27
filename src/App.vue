<script setup lang="ts">
import TitleBar from "./components/AppTitleBar.vue";
</script>

<template>
  <TitleBar />
  <div class="relative flex-1 overflow-hidden">
    <suspense>
      <template #default>
        <router-view v-slot="{ Component, route }">
          <transition name="page">
            <keep-alive>
              <component 
                :is="Component" 
                :key="route.meta.usePathKey ? route.path : undefined" 
              />
            </keep-alive>
          </transition>
        </router-view>
      </template>
      <template #fallback>
        <p>Loading...</p>
      </template>
    </suspense>
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
