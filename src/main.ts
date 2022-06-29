import { createApp } from "vue";
import { createPinia } from "pinia";
import piniaPluginPersistedState from "pinia-plugin-persistedstate";
import App from "./App.vue";
import Router from "./router/index";
import Notification from "./plugin/notification";
import "./index.css";

const pinia = createPinia();
pinia.use(piniaPluginPersistedState);

createApp(App)
.use(Router)
.use(pinia)
.use(Notification)
.mount("#app");
