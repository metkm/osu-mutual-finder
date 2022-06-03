<script setup lang="ts">
import AppInput from '../AppInput.vue';
import { ref } from 'vue';
import { removeFriend } from '../../utils';

const userId = ref(0);
const cooldown = ref(false);

const removeFriendClick = () => {
  removeFriend(userId.value);
  cooldown.value = true;
  setTimeout(() => {
    cooldown.value = false;
  }, 1500)
}
</script>
<template>
  <div class="setting">
    <div class="flex flex-col gap-2 max-w-md">
      <AppInput type="number" placeholder="User Id" v-model.number="userId" />
      <button class="form-button" :disabled="cooldown" @click="removeFriendClick">Remove Friend</button>
    </div>
  </div>
</template>