import { defineStore } from "pinia";
import ky from "ky";

interface APIRefreshResponse {
  access_token: string,
  refresh_token: string
}

export const useAuthStore = defineStore("auth", {
  state: () => ({
    token: "",
    session: "",
    access_token: "",
    refresh_token: ""
  }),
  actions: {
    async refreshTokens() {
      const response = await ky.patch(`${import.meta.env.VITE_API_BASE_URL}/api/refresh`, {
        credentials: "include",
      }).json<APIRefreshResponse>();

      this.access_token = response.access_token;
      this.refresh_token = response.refresh_token;
    }
  },
  persist: true
});
