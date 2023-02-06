<script setup lang="ts">
import BaseInput from '../Ui/BaseInput.vue';
import { ref } from 'vue';
import { removeFriend } from '../../api/friends';
import BaseButton from '../Ui/BaseButton.vue';

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
  <div aria-label="remove friend setting" class="setting">
    <div class="flex flex-col gap-2 max-w-md">
      <BaseInput type="number" placeholder="User Id" v-model.number="userId" />
      <BaseButton :disabled="cooldown" @click="removeFriendClick">
        Remove friend
      </BaseButton>
    </div>
  </div>
</template>