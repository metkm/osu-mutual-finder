export interface Threads {
  [key: number]: boolean
}

export enum Gamemode {
  osu = "osu",
  taiko = "taiko",
  fruits = "fruits",
  mania = "mania"
}

export enum Check {
  Country = "Country",
  Global = "Global"
}

// export interface StoreState {
//   friends: number[],
//   blacklistIds: number[],
//   countries: string[],
//   addFriend: boolean,
//   addBlacklist: boolean,
//   gamemode: Gamemode,
//   check: Check,
//   uploaded: boolean
// }

export interface NotificationOptions {
  delay?: number,
  acceptText?: string,
  rejectText?: string,
  acceptCallback?: () => void,
  rejectCallback?: () => void
}

export interface Notification {
  message: string,
  options?: NotificationOptions
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

export interface SessionLoginUser extends UserObject {
  cover_url: string,
  discord: string,
  has_supported: boolean;
  interests: any;
  join_date: string;
  kudosu: { total: number, available: number };
  location: string;
  max_blocks: number;
  max_friends: number;
  occupation: any;
  playmode: Gamemode;
  playstyle: string[];
  post_count: number;
  profile_order: string[];
  title: string | null;
  title_url: string | null;
  twitter: string;
  website: string;
  is_admin: boolean;
  is_bng: boolean;
  is_full_bn: boolean;
  is_gmt: boolean;
  is_limited_bn: boolean;
  is_moderator: boolean;
  is_nat: boolean;
  is_restricted: boolean;
  is_silenced: boolean;
  blocks: any[];
  follow_user_mapping: string[];
  friends: UserObjectAdded[];
  groups: any[];
  unread_pm_count: number;
  user_preferences: {
    audio_autoplay: boolean;
    audio_muted: boolean;
    audio_volume: number;
    beatmapset_card_size: string;
    beatmapset_download: number;
    beatmapset_show_nsfw: boolean;
    beatmapset_title_show_original: boolean;
    comments_show_deleted: boolean;
    forum_posts_show_deleted: boolean;
    profile_cover_expanded: boolean;
    user_list_filter: string;
    user_list_sort: string;
    user_list_view: string;
  }
}
