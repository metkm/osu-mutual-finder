use serde::{Deserialize, Serialize};
use tokio_postgres::Row;

#[derive(Serialize, Deserialize, Debug)]
pub struct User {
    pub user_id: u32,
    pub friend_ids: Vec<u32>,
}

impl From<Row> for User {
    fn from(row: Row) -> Self {
        Self {
            user_id: row.get("user_id"),
            friend_ids: row.get("friend_ids"),
        }
    }
}

#[derive(Debug, Deserialize, Serialize)]
struct Kudosu {
    available: u32,
    total: u32,
}

#[derive(Debug, Deserialize, Serialize)]
enum GameMode {
    fruits,
    mania,
    osu,
    taiko,
}

#[derive(Debug, Deserialize, Serialize)]
struct UserBadge {
    awarded_at: String,
    description: String,
    image_url: String,
    url: String
}

#[derive(Debug, Deserialize, Serialize)]
enum ProfilePage {
    me,
    recent_activity,
    beatmaps,
    historical,
    kudosu,
    top_ranks,
    medals,
}

#[derive(Debug, Deserialize, Serialize)]
struct Country {
    code: String,
    name: String,
}

#[derive(Debug, Deserialize, Serialize)]
struct Cover {
    custom_url: String,
    url: String,
    id: Option<u32>
}

#[derive(Debug, Deserialize, Serialize)]
enum HistoryType {
    note,
    restriction,
    silence
}

#[derive(Debug, Deserialize, Serialize)]
struct ProfileBanner {
    id: u32,
    tournament_id: u32,
    image: String
}

#[derive(Debug, Deserialize, Serialize)]
struct UserAccountHistory {
    description: Option<String>,
    id: u32,
    length: u32,
    timestamp: String,
    #[serde(rename = "type")]
    _type: HistoryType
}

#[derive(Debug, Deserialize, Serialize)]
struct UserGroup {
    colour: Option<String>,
    has_listing: bool,
    has_playmodes: bool,
    id: u32,
    identifier: String,
    is_probationary: bool,
    name: String,
    short_name: String,
    playmodes: Option<Vec<String>>
}

#[derive(Debug, Deserialize, Serialize)]
struct UserMonthlyPlaycount {
    start_date: String,
    count: u32
}

#[derive(Debug, Deserialize, Serialize)]
struct Page {
    html: String,
    raw: String
}

#[derive(Debug, Deserialize, Serialize)]
struct ReplayWatchedCount {
    start_date: String,
    count: u32
}

#[derive(Debug, Deserialize, Serialize)]
struct Level {
    current: u16,
    progress: u16
}

#[derive(Debug, Deserialize, Serialize)]
struct GradeCounts {
    ss: u16,
    ssh: u16,
    s: u16,
    sh: u16,
    a: u16
}

#[derive(Debug, Deserialize, Serialize)]
struct UserRank {
    // global: u32,
    country: Option<u32>
}

#[derive(Debug, Deserialize, Serialize)]
struct UserStatistics {
    level: Level,
    pp: u16,
    global_rank: Option<u32>,
    ranked_score: u64,
    hit_accuracy: f32,
    play_count: u32,
    play_time: u32,
    total_score: u64,
    total_hits: u64,
    maximum_combo: u32,
    replays_watched_by_others: u32,
    is_ranked: bool,
    grade_counts: GradeCounts,
    
    country_rank: Option<u32>,
    rank: UserRank,
}

#[derive(Debug, Deserialize, Serialize)]
struct UserAchievements {
    achieved_at: String,
    achievement_id: u16
}

#[derive(Debug, Deserialize, Serialize)]
struct UserRankHistory {
    mode: GameMode,
    data: Vec<u32>
}

#[derive(Debug, Deserialize, Serialize)]
pub struct OsuUser {
    avatar_url: String,
    country_code: String,
    default_group: String,
    id: u32,
    is_active: bool,
    is_bot: bool,
    is_deleted: bool,
    is_online: bool,
    is_supporter: bool,
    last_visit: Option<String>,
    pm_friends_only: bool,
    profile_colour: Option<String>,
    username: String,
    discord: Option<String>,
    has_supported: bool,
    interests: Option<String>,
    join_date: String,
    kudosu: Kudosu,
    location: Option<String>,
    max_blocks: u16,
    max_friends: u16,
    occupation: Option<String>,
    playmode: GameMode,
    playstyle: Vec<String>,
    post_count: u16,
    profile_order: Vec<ProfilePage>,
    title: Option<String>,
    title_url: Option<String>,
    twitter: Option<String>,
    website: Option<String>,
    country: Country,
    cover: Cover,
    account_history: Vec<UserAccountHistory>,
    active_tournament_banner: Option<ProfileBanner>,
    badges: Vec<UserBadge>,
    favourite_beatmapset_count: u32,
    follower_count: u32,
    graveyard_beatmapset_count: u32,
    groups: Vec<UserGroup>,
    loved_beatmapset_count: u32,
    monthly_playcounts: Vec<UserMonthlyPlaycount>,
    page: Page,
    pending_beatmapset_count: u32,
    previous_usernames: Vec<String>,
    ranked_beatmapset_count: u32,
    replays_watched_counts: Vec<ReplayWatchedCount>,
    scores_first_count: u32,
    statistics: UserStatistics,
    support_level: i16,
    user_achievements: Vec<UserAchievements>,
    rank_history: UserRankHistory,

    ranked_and_approved_beatmapset_count: u32,
    unranked_beatmapset_count: u32,
    beatmap_playcounts_count: u32,
    is_restricted: bool,
}
