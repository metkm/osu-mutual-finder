import { Module } from "vuex";
import { SessionLoginUser, StoreState } from "../types";

export interface UserState {
  user: SessionLoginUser | undefined
}

const user: Module<UserState, StoreState> = {
  state: {
    user: undefined
  },
  mutations: {
    setUser(state, payload: SessionLoginUser) {
      state.user = payload;
    },
  }
}

export default user;
