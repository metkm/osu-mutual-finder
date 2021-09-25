import { createRouter, createWebHistory } from "vue-router";

export default createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/",
      name: "login",
      component: () => import("../views/Login.vue")
    },
    {
      path: "/verify",
      name: "verify",
      component: () => import("../views/Verify.vue")
    },
    {
      path: "/mutuals",
      name: "mutuals",
      component: () => import("../views/Mutuals.vue")
    },
    {
      path: "/settings",
      name: "settings",
      component: () => import("../views/Settings.vue")
    }
  ]
})
