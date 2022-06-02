// start: country - page
// end: country - page

import { Module } from "vuex";
import { StoreState } from "../types";
import { clampNumber } from "../utils";

interface Limit {
  countryCode: string,
  start: number, // page start
  end: number, // page end
  index: number // start index (only for start page)
}

export interface LimitState {
  limits: Limit[],
}

export const clampLimit = (limit: Limit) => {
  limit.start = clampNumber(limit.start, 1, 200);
  limit.end = clampNumber(limit.end, 1, 200);
  limit.index = clampNumber(limit.index, 0, 50);
}

const limit: Module<LimitState, StoreState> = {
  state: () => ({
    limits: [],
  }),
  mutations: {
    addLimit({ limits }, payload: Limit) {
      clampLimit(payload);
      limits.push(payload);
    },
    removeLimit({ limits }, code: string) {
      let index = limits.findIndex(limit => limit.countryCode == code);
      limits.splice(index, 1);
    },
    updateLimit({ limits }, newLimit: Limit) {
      clampLimit(newLimit);
      // console.log(newLimit);

      let index = limits.findIndex(limit => limit.countryCode == newLimit.countryCode);
      console.log("index", index, newLimit.index);
      if (index !== -1) {
        limits.splice(index, 1, newLimit);
      }
    }
  },
  getters: {
    getLimit: (state) => (code: string) => {
      return state.limits.find(limit => limit.countryCode == code);
    }
  }
}

export default limit;
