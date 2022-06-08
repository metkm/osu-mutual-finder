<script setup lang="ts">
import AppInput from '../AppInput.vue';
import { computed, ref } from 'vue';
import { removeFriend } from '../../utils';
import { useStore } from '../../store';

const store = useStore();

const userId = ref(0);
const cooldown = ref(false);
const token = computed(() => store.state.auth.token);
const session = computed(() => store.state.auth.session);

const removeFriendClick = () => {
  removeFriend(userId.value, token.value, session.value);

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