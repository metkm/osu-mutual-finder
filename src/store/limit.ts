// start: country - page
// end: country - page

import { Module } from "vuex";
import { StoreState } from "../types";

interface Limit {
  countryCode: string,
  start: number, // page start
  end: number, // page end
  index: number // start index (only for start page)
}

interface LimitState {
  limits: Limit[],
}

const checkUpperLower = (n: number, start: number, end: number) => {
  if (n < start || n > end) {
    return false;
  }

  return true;
}

const limit: Module<LimitState, StoreState> = {
  state: () => ({
    limits: [{ countryCode: "USD", index: 0, start: 1, end: 200 }],
  }),
  mutations: {
    addLimit({ limits }, payload: Limit) {
      if (checkUpperLower(payload.start, 1, 200)) {
        payload.start = 1;
      }

      if (checkUpperLower(payload.end, 1, 200)) {
        payload.end = 200;
      }

      if (checkUpperLower(payload.index, 0, 50)) {
        payload.end = 0;
      }

      limits.push(payload);
    },
    removeLimit({ limits }, code: string) {
      let index = limits.findIndex(limit => limit.countryCode == code);
      limits.splice(index, 1);
    }
  },
  getters: {
    getLimit: (state) => (code: string) => {
      return state.limits.find(limit => limit.countryCode == code);
    }
  }
}

export default limit;
