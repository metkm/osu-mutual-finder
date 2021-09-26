import { createRouter, createWebHistory } from "vue-router";

import Login from "../views/Login.vue";
import Verify from "../views/Verify.vue";
import Mutuals from "../views/Mutuals.vue";
import Settings from "../views/Settings.vue";

export default createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/",
      name: "login",
      component: Login
    },
    {
      path: "/verify",
      name: "verify",
      component: Verify
    },
    {
      path: "/mutuals",
      name: "mutuals",
      component: Mutuals
    },
    {
      path: "/settings",
      name: "settings",
      component: Settings
    }
  ]
})
