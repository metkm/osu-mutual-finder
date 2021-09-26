import { createStore } from "vuex";
import createPersistedState from "vuex-persistedstate";

export default createStore({
  plugins: [createPersistedState()],
  state: {
    friends: [] as number[],
    blacklistIds: [] as number[],
    addFriend: false,
  },
  mutations: {
    SET_FRIENDS(state, friendsList) {
      state.friends = friendsList;
    },
    TOGGLE_ADDFRIEND(state) {
      state.addFriend = !state.addFriend;
    },
    ADD_BLACKLIST(state, userId: number) {
      if (state.blacklistIds.includes(userId)) return;
      state.blacklistIds.push(userId);
    },
    REMOVE_BLACKLIST(state, userId: number) {
      let index = state.blacklistIds.findIndex(id => id == userId);
      console.log(index);
      state.blacklistIds.splice(index, 1);
    }
  },
  actions: {
    setFriends({ commit }, friendsList: number[]) {
      commit("SET_FRIENDS", friendsList);
    },
    toggleAddFriend({ commit }) {
      commit("TOGGLE_ADDFRIEND");
    },
    addBlacklist({ commit }, userId: number) {
      commit("ADD_BLACKLIST", userId);
    },
    removeBlacklist({ commit }, userId: number) {
      commit("REMOVE_BLACKLIST", userId);
    }
  },
});
