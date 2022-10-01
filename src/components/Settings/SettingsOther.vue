<script setup lang="ts">
import AppInput from '../AppInput.vue';
import { computed, ref } from 'vue';
import { removeFriend } from '../../utils';
import { useAuthStore } from '../../store';

const authStore = useAuthStore();

const userId = ref(0);
const cooldown = ref(false);
const token = computed(() => authStore.token);
const session = computed(() => authStore.session);

const removeFriendClick = () => {
  removeFriend(userId.value, token.value, session.value);

  cooldown.value = true;
  setTimeout(() => {
    cooldown.value = false;
  }, 1500)
}
</script>
<template>
  <div aria-label="remove friend setting" class="setting">
    <div class="flex flex-col gap-2 max-w-md">
      <AppInput type="number" placeholder="User Id" v-model.number="userId" />
      <button class="form-button" :disabled="cooldown" @click="removeFriendClick">Remove Friend</button>
    </div>
  </div>
</template>