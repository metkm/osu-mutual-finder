import { App } from "vue";
import { NotificationOptions } from "../types";
import Notification from "./Notification.vue";
import mitt from "mitt";

export default {
  install(app: App) {
    app.component("Notification", Notification);
  }
}

type Events = {
  notify: {
    text: string,
    options?: NotificationOptions
  }
}

export const events = mitt<Events>()
export function notify(text: string, options?: NotificationOptions) {
  events.emit("notify", {
    text,
    options
  })
}
