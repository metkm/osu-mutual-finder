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
      name: "Login",
      component: Login
    },
    {
      path: "/verify",
      name: "Verify",
      component: Verify
    },
    {
      path: "/mutuals",
      name: "Mutuals",
      component: Mutuals
    },
    {
      path: "/settings",
      name: "Settings",
      component: Settings
    }
  ]
})
