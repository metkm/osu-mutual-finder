<script setup lang="ts">
import { ref } from "vue";
import { events } from "./notification";
import { Notification } from "../types";
import { handleBeforeLeave } from "../animation";
import BaseButton from "../components/ui/BaseButton.vue";

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
  <transition-group tag="div" class="absolute bottom-3 left-3 flex flex-col gap-1 max-w-md" name="notif" appear @before-leave="handleBeforeLeave">
    <div v-for="notification in notifications" 
        :key="notification.message" 
        class="rounded-md overflow-hidden border 
        dark:border-neutral-800 bg-theme">
      <div class="p-3">
        <p>{{ notification.message }}</p>
        <p v-if="notification.options?.description" class="text-neutral-400 text-sm">{{ notification.options.description }}</p>
      </div>
      <div v-if="notification.options?.acceptText || notification.options?.rejectText" class="grid grid-flow-col auto-cols-fr">
        <BaseButton
          v-if="notification.options?.acceptText"
          @click="notification.options?.acceptCallback"
          class="rounded-none"
        >
          {{ notification.options.acceptText }}
        </BaseButton>

        <BaseButton
          v-if="notification.options.rejectText"
          @click="notification.options?.rejectCallback"
          class="rounded-none"
          :red="true"
        >
          {{ notification.options.rejectText }}
        </BaseButton>
      </div>
    </div>
  </transition-group>
</template>

<style>
.notif-enter-active,
.notif-move {
  transition: all 500ms ease;
}

.notif-leave-active {
  transition: all 500ms ease;
  position: absolute;
}

.notif-enter-from {
  transform: translateY(400%);
}

.notif-leave-to {
  transform: translateY(400%);
}
</style>
