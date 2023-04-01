<script setup lang="ts">
import { ref } from "vue";
import { events } from "./notification";
import { Notification } from "../types";
import { handleBeforeLeave } from "../animation";
import BaseButton from "../components/Ui/BaseButton.vue";

const notifications = ref<Notification[]>([]);

const removeNotification = (text: string) => {
  let index = notifications.value.findIndex(val => val.message == text);
  notifications.value.splice(index, 1);
}

events.on("notify", ({ text, options }) => {
  notifications.value.push({
    message: text,
    options: {
      ...options
    }
  });

  setTimeout(() => removeNotification(text), options?.delay || 5000)
})

events.on("notifyRemove", ({ text }) => {
  removeNotification(text);
})
</script>

<template>
  <TransitionGroup tag="div" name="notif" class="absolute grid gap-3 inset-x-3 bottom-3 max-w-md" @beforeLeave="handleBeforeLeave">
    <div 
      v-for="notification in notifications" 
      :key="notification.message" 
      class="bg-white dark:bg-dark border dark:border-neutral-800 rounded-lg overflow-hidden"
    >
      <div class="p-2">
        <p class="text-sm mb-1">{{ notification.message }}</p>
        <p v-if="notification.options?.description" class="text-neutral-400 text-xs">{{ notification.options.description
        }}</p>
      </div>
      <div v-if="notification.options?.acceptText || notification.options?.rejectText" class="grid grid-flow-col auto-cols-fr">
        <BaseButton v-if="notification.options?.acceptText" @click="notification.options?.acceptCallback"
          class="rounded-none border-x-0 border-b-0">
          {{ notification.options.acceptText }}
        </BaseButton>

        <BaseButton v-if="notification.options.rejectText" @click="notification.options?.rejectCallback"
        class="rounded-none border-x-0 border-b-0 hover:!bg-red-500">
          {{ notification.options.rejectText }}
        </BaseButton>
      </div>
    </div>
  </TransitionGroup>
</template>

<style>
.notif-enter-active,
.notif-leave-active,
.notif-move {
  transition: all 350ms ease;
}

.notif-leave-active {
  position: absolute;
}

.notif-enter-from {
  transform: translateY(100%);
}

.notif-leave-to {
  opacity: 0;
}
</style>
