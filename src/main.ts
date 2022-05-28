import { createApp } from "vue";
import App from "./App.vue";
import Router from "./router/index";
import Store, { key } from "./store/index";
import Notification from "./plugin/notification";
import "./index.css";

createApp(App)
.use(Router)
.use(Store, key)
.use(Notification)
.mount("#app");
