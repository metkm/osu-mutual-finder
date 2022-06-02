// start: country - page
// end: country - page

import { Module } from "vuex";
import { StoreState } from "../types";
import { clampNumber } from "../utils";

interface Limit {
  countryCode: string;
  start: number; // page start
  end: number; // page end
  index: number; // start index (only for start page)
}

export interface LimitState {
  limits: Limit[];
}

export const clampLimit = (limit: Limit) => {
  limit.start = clampNumber(limit.start, 1, 200);
  limit.end = clampNumber(limit.end, 1, 200);
  limit.index = clampNumber(limit.index, 0, 50);
};

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
    updateLimit({ limits }, { data, index }: { data: Limit; index: number }) {
      clampLimit(data);
      limits.splice(index, 1, data);
    },
  },
  actions: {
    updateLimit({ commit, state }, newLimit: Limit) {
      let index = state.limits.findIndex(limit => limit.countryCode == newLimit.countryCode);
      if (index !== -1) {
        commit("updateLimit", { data: newLimit, index });
      } else {
        commit("addLimit", newLimit);
      }
    },
  },
  getters: {
    getLimit: state => (code: string) => {
      return state.limits.find(limit => limit.countryCode == code);
    },
  },
};

export default limit;
