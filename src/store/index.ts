import { createStore } from "vuex";

export default createStore({
  state: {
    friends: []
  },
  mutations: {
    SET_FRIENDS(state, payload) {
      state.friends = payload.friendsList;
    }
  },
  actions: {
    setFriends({ commit }, friendsList) {
      commit("SET_FRIENDS", friendsList)
    }
  }
})
