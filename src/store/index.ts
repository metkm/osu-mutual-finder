import { createStore } from "vuex";
import createPersistedState from "vuex-persistedstate";

export default createStore({
  plugins: [createPersistedState()],
  state: {
    friends: [],
    addFriend: false,
  },
  mutations: {
    SET_FRIENDS(state, friendsList) {
      state.friends = friendsList;
    },
    TOGGLE_ADDFRIEND(state) {
      state.addFriend = !state.addFriend;
    }
  },
  actions: {
    setFriends({ commit }, friendsList: number[]) {
      console.log("ac", friendsList)
      commit("SET_FRIENDS", friendsList)
    },
    toggleAddFriend({ commit }) {
      commit("TOGGLE_ADDFRIEND")
    }
  }
})
