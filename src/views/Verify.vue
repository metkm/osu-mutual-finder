<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import { emailVerification } from '../api/auth';
import { updateFriends } from '../api/friends';

import BaseButton from '../components/Ui/BaseButton.vue';
import BaseInput from '../components/Ui/BaseInput.vue';

const router = useRouter();

onMounted(updateFriends);

const code = ref();
const isLoading = ref(false);

const verifyHandler = async () => {
  if (!code.value) return;
  
  isLoading.value = true;
  const isSuccess = await emailVerification(code.value);
  isLoading.value = false;

  if (isSuccess) {
    router.push("/mutuals");
  }
}
</script>

<template>
  <div class="page flex flex-col justify-center items-center gap-4 max-w-lg mx-auto">
    <form aria-label="verify form" class="grid gap-2 w-full text-sm">
      <div class="flex flex-col">
        <label for="code" class="ml-1">Verification Code</label>
        <BaseInput id="code" v-model="code" required />
      </div>
      
      <div class="flex">
        <p class="text-neutral-500 ml-1 mr-auto">Check your emails. There should be verification code.</p>
        <BaseButton :disabled="!code" :isLoading="isLoading" @click.prevent="verifyHandler">Verify</BaseButton>
      </div>
    </form>
  </div>
</template>
