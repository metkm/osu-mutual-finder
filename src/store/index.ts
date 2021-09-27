import { createStore } from "vuex";
import createPersistedState from "vuex-persistedstate";

export default createStore({
  plugins: [createPersistedState()],
  state: {
    friends: [] as number[],
    blacklistIds: [] as number[],
    countries: [] as string[],
    startPage: 1,
    endPage: 200,
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
      state.blacklistIds.splice(index, 1);
    },
    SET_STARTPAGE(state, num: number) {
      if(num < 1 || num > 200) num = 1;
      state.startPage = num;
    },
    SET_ENDPAGE(state, num: number) {
      if (num > 200 || num < 1) num = 200;
      state.endPage = num;
    },
    ADD_COUNTRY(state, countryCode: string) {
      if (state.countries.includes(countryCode)) return;
      state.countries.push(countryCode);
    },
    REMOVE_COUNTRY(state, countryCode: string) {
      let index = state.countries.findIndex(country => country == countryCode);
      state.countries.splice(index, 1);
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
    },
    setStartPage({ commit }, num: number) {
      commit("SET_STARTPAGE", num);
    },
    setEndPage({ commit }, num: number) {
      commit("SET_ENDPAGE", num);
    },
    addCountry({ commit }, countryCode: string) {
      commit("ADD_COUNTRY", countryCode);
    },
    removeCountry({ commit }, countryCode: string) {
      commit("REMOVE_COUNTRY", countryCode);
    }
  },
});
