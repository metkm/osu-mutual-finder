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
    addBlacklist: false,
    gamemode: 'osu'
  },
  mutations: {
    SET_FRIENDS(state, friendsList) {
      state.friends = friendsList;
    },
    TOGGLE_ADDFRIEND(state) {
      state.addFriend = !state.addFriend;
    },
    TOGGLE_ADDBLACKLIST(state) {
      state.addBlacklist = !state.addBlacklist;
    },
    ADD_BLACKLIST(state, userId: number) {
      if (state.blacklistIds.includes(userId)) return;
      state.blacklistIds.push(userId);
    },
    REMOVE_BLACKLIST(state, userId: number) {
      let index = state.blacklistIds.findIndex(id => id == userId);
      state.blacklistIds.splice(index, 1);
    },
    CLEAR_BLACKLIST(state) {
      state.blacklistIds = [];
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
    },
    SET_GAMEMODE(state, mode: string) {
      state.gamemode = mode;
    }
  },
  actions: {
    setFriends({ commit }, friendsList: number[]) {
      commit("SET_FRIENDS", friendsList);
    },
    toggleAddFriend({ commit }) {
      commit("TOGGLE_ADDFRIEND");
    },
    toggleAddBlacklist({ commit }) {
      commit("TOGGLE_ADDBLACKLIST");
    },
    addBlacklist({ commit }, userId: number) {
      commit("ADD_BLACKLIST", userId);
    },
    removeBlacklist({ commit }, userId: number) {
      commit("REMOVE_BLACKLIST", userId);
    },
    clearBlacklist({ commit }) {
      commit("CLEAR_BLACKLIST");
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
    },
    setGamemode({ commit }, mode: string) {
      commit("SET_GAMEMODE", mode);
    }
  },
});
