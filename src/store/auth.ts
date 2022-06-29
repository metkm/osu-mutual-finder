import { defineStore } from "pinia";

export const useAuthStore = defineStore("auth", {
  state: () => ({
    token: "",
    session: "",
    access_token: "",
    refresh_token: ""
  }),
  persist: true
});
