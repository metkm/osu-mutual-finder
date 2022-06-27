import { defineStore } from "pinia";
import { SessionLoginUser } from "../types";

export const useUserStore = defineStore<"user",{ user?: SessionLoginUser }>("user", {
  state: () => ({
    user: undefined
  }),
  persist: true
});
