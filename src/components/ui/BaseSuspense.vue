<script setup lang="ts">
import Spinner from '../Icons/Spinner.vue';
</script>

<template>
  <Suspense :timeout="0">
    <slot></slot>

    <template #fallback>
      <Spinner />
    </template>
  </Suspense>
</template>
