import { defineStore } from "pinia";
import { Check, Country, Gamemode, WebCountry } from "../types";
import { clampNumber } from "../utils";

interface Limit {
  countryCode: string;
  start: number; // page start
  end: number; // page end
  index: number; // start index (only for start page)
}

const toggleSetting = <T>(array: T[], item: T) => {
  if (!array.includes(item)) {
    array.push(item);
    return;
  }

  let index = array.findIndex(x => x == item);
  if (index !== -1) {
    array.splice(index, 1);
  }
}

export const clampLimit = (limit: Limit) => {
  limit.start = clampNumber(limit.start, 1, 200);
  limit.end = clampNumber(limit.end, 1, 200);
  limit.index = clampNumber(limit.index, 0, 50);
};

export const useSettingsStore = defineStore("settings", {
  state: () => ({
    friends: [] as number[],
    blacklistIds: [] as number[],
    countries: [] as WebCountry[],
    limits: [] as Limit[],
    addFriend: false,
    addBlacklist: false,
    gamemode: Gamemode.osu,
    check: Check.Country,
    uploaded: false
  }),
  actions: {
    toggleAddBlacklist() {
      this.addBlacklist = !this.addBlacklist;
    },
    toggleBlacklistId(userId: number) {
      toggleSetting(this.blacklistIds, userId);
    },
    toggleCountry(country: Country) {
      toggleSetting(this.countries, country)
    },
    updateLimit(newLimit: Limit) {
      clampLimit(newLimit);

      let index = this.limits.findIndex(x => x.countryCode == newLimit.countryCode);
      if (index !== -1) {
        this.limits.splice(index, 1, newLimit);        
      } else {
        this.limits.push(newLimit);
      }
    }
  },
  getters: {
    getLimit: (state) => {
      return (code: string) => state.limits.find(limit => limit.countryCode == code)
    }
  },
  persist: true
});
