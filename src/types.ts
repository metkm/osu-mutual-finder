type events = "minimize" | "maximize" | "close";

interface titleBar {
  event: (event: events) => void;
}

interface Message {
  message: (callback: (message: string) => void) => void;
}

declare global {
  interface Window {
    titleBar: titleBar,
    ipc: Message
  }
}

export interface Threads {
  [key: number]: boolean
}

export enum Gamemode {
  osu,
  taiko,
  fruits,
  mania
}

export enum Check {
  Country = "Country",
  Global = "Global"
}

export interface StoreState {
  friends: number[],
  blacklistIds: number[],
  countries: string[],
  startPage: number,
  endPage: number,
  addFriend: boolean,
  addBlacklist: boolean,
  gamemode: Gamemode,
  check: Check
}

export interface Notification {
  message: string
}

export interface Country {
  code: string;
  name: string;
}

export interface WebCountry extends Country {
  flag_url: string;
}

export interface Cover {
  custom_url: string;
  url: string;
  id?: any;
}

export interface Level {
  current: number;
  progress: number;
}

export interface GradeCounts {
  ss: number;
  ssh: number;
  s: number;
  sh: number;
  a: number;
}

export interface Statistics {
  level: Level;
  global_rank: number;
  pp: number;
  ranked_score: number;
  hit_accuracy: number;
  play_count: number;
  play_time: number;
  total_score: number;
  total_hits: number;
  maximum_combo: number;
  replays_watched_by_others: number;
  is_ranked: boolean;
  grade_counts: GradeCounts;
}

export interface UserObject {
  avatar_url: string;
  country_code: string;
  default_group: string;
  id: number;
  is_active: boolean;
  is_bot: boolean;
  is_deleted: boolean;
  is_online: boolean;
  is_supporter: boolean;
  last_visit: Date;
  pm_friends_only: boolean;
  profile_colour?: any;
  username: string;
  country: Country;
  cover: Cover;
  groups: any[];
  statistics: Statistics;
  support_level: number;
}

export interface UserObjectAdded {
  target_id: number,
  relation_type: string,
  mutual: boolean,
}
