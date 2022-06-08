import { Module } from "vuex";
import { StoreState } from "../types";

export interface AuthState {
  token: string,
  session: string
}

const Auth: Module<AuthState, StoreState> = {
  state: {
    token: "",
    session: ""
  },
  mutations: {
    setToken(state, token) {
      if (token) {
        state.token = token;
      }
    },
    setSession(state, session) {
      if (session) {
        state.session = session;
      }
    }
  },
  getters: {
    getCookies({ token, session }) {
      return `XSRF-TOKEN=${token}; osu_session=${session}`;
    }
  }
}

export default Auth;
