<script setup lang="ts">
import BaseInput from '../Ui/BaseInput.vue';
import { ref } from 'vue';
import { removeFriend } from '../../api/friends';
import BaseButton from '../Ui/BaseButton.vue';
import SettingsBase from './SettingsBase.vue';

const userId = ref(0);
const cooldown = ref(false);

const removeFriendClick = async () => {
  cooldown.value = true;
  await removeFriend(userId.value);
  cooldown.value = false;
}
</script>
<template>
  <SettingsBase class="flex gap-4 max-w-md">
    <BaseInput pattern="[0-9]*" placeholder="User Id" v-model="userId" />
    <BaseButton :isLoading="cooldown" @click="removeFriendClick">
      Remove friend
    </BaseButton>
  </SettingsBase>
</template>
