import createPersistedState from "vuex-persistedstate";
import { createStore, Store, useStore as baseUseStore } from "vuex";
import { StoreState, Gamemode, Check } from "../types";
import { InjectionKey } from "vue";

export const key: InjectionKey<Store<StoreState>> = Symbol();

export default createStore<StoreState>({
  plugins: [createPersistedState()],
  state: {
    friends: [] as number[],
    blacklistIds: [] as number[],
    countries: [] as string[],
    startPage: 1,
    endPage: 200,
    addFriend: false,
    addBlacklist: false,
    gamemode: Gamemode.osu,
    check: Check.Country
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
    SET_GAMEMODE(state, mode: Gamemode) {
      state.gamemode = mode;
    },
    SET_CHECK(state, check: Check) {
      state.check = check; 
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
    },
    setCheck({ commit }, check: Check) {
      commit("SET_CHECK", check);
    }
  },
});

export function useStore() {
  return baseUseStore(key);
}
