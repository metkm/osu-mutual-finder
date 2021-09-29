import Notification from "./Notification.vue";
import mitt from "mitt";
import { App } from "vue";

export default {
  install(app: App) {
    app.component("Notification", Notification);
  }
}

type Events = {
  notify: string
}

export const events = mitt<Events>()
export function notify(content: string) {
  events.emit("notify", content);
}
