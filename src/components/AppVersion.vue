<script setup lang="ts">
import { app } from '@tauri-apps/api';

const version = await app.getVersion();
</script>

<template>
  <div>
    <p class="text-sm -mb-1 text-neutral-500">version</p>
    <p>{{ version }}</p>
  </div>
</template>
