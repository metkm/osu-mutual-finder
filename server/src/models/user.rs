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

#[derive(Serialize, Deserialize)]
enum GameMode {
    #[serde(rename = "fruits")]
    Fruits,
    #[serde(rename = "mania")]
    Mania,
    #[serde(rename = "osu")]
    Osu,
    #[serde(rename = "takio")]
    Takio 
}

#[derive(Serialize, Deserialize)]
enum HistoryType {
    #[serde(rename = "note")]
    Note,
    #[serde(rename = "restriction")]
    Restriction,
    #[serde(rename = "silence")]
    Silence
}

#[derive(Serialize, Deserialize)]
struct UserAccountHistory {
    description: Option<String>,
    id: u32,
    length: u32,
    timestamp: String,
    #[serde(rename = "type")]
    _type: HistoryType
}

#[derive(Serialize, Deserialize)]
struct ProfileBanner {
    id: u32,
    tournament_id: u32,
    image: String
}

#[derive(Debug, Deserialize, Serialize)]
struct UserBadge {
    awarded_at: String,
    description: String,
    image_url: String,
    url: String
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

#[derive(Serialize, Deserialize)]
pub struct OsuUser {
    avatar_url: String,
    country_code: String,
    default_group: String,
    id: i64,
    is_active: bool,
    is_bot: bool,
    is_deleted: bool,
    is_online: bool,
    is_supporter: bool,
    last_visit: Option<String>,
    pm_friends_only: bool,
    profile_colour: Option<String>,
    username: String,
    cover_url: String,
    discord: Option<String>,
    has_supported: bool,
    interests: Option<String>,
    join_date: String,
    kudosu: Kudosu,
    location: Option<String>,
    max_blocks: i64,
    max_friends: i64,
    occupation: Option<String>,
    playmode: GameMode,
    playstyle: Vec<String>,
    post_count: u16,
    profile_order: Vec<String>,
    title: Option<String>,
    title_url: Option<String>,
    twitter: Option<String>,
    website: Option<String>,
    country: Country,
    cover: Cover,
    is_restricted: bool,
    account_history: Vec<UserAccountHistory>,
    active_tournament_banner: Option<ProfileBanner>,
    badges: Vec<UserBadge>,
    beatmap_playcounts_count: u32,
    comments_count: u64,
    favourite_beatmapset_count: u32,
    follower_count: u32,
    graveyard_beatmapset_count: u32,
    groups: Vec<UserGroup>,
    guest_beatmapset_count: u32,
    loved_beatmapset_count: u32,
    mapping_follower_count: u32,
    monthly_playcounts: Vec<UserMonthlyPlaycount>,
    page: Page,
    pending_beatmapset_count: u32,
    previous_usernames: Vec<String>,
    ranked_beatmapset_count: u32,
    replays_watched_counts: Vec<Count>,
    scores_best_count: u32,
    scores_first_count: u32,
    scores_pinned_count: u32,
    scores_recent_count: u32,
    statistics: Statistics,
    statistics_rulesets: StatisticsRulesets,
    support_level: u16,
    user_achievements: Vec<UserAchievement>,
    // #[serde(rename = "rank_history")]
    rank_history: RankHistory,
    // #[serde(rename = "rank_history")]
    // welcome_rank_history: RankHistory,
    ranked_and_approved_beatmapset_count: u32,
    unranked_beatmapset_count: u32,
}

#[derive(Serialize, Deserialize)]
pub struct Country {
    code: String,
    name: String,
}

#[derive(Serialize, Deserialize)]
pub struct Cover {
    custom_url: String,
    url: String,
    id: Option<u32>,
}

#[derive(Serialize, Deserialize)]
pub struct Kudosu {
    total: u16,
    available: u16,
}

#[derive(Serialize, Deserialize)]
pub struct Count {
    start_date: String,
    count: u32,
}

#[derive(Serialize, Deserialize)]
pub struct Page {
    html: String,
    raw: String,
}

#[derive(Serialize, Deserialize)]
pub struct RankHistory {
    mode: String,
    data: Vec<u32>,
}

#[derive(Serialize, Deserialize)]
pub struct Statistics {
    level: Level,
    global_rank: Option<u32>,
    pp: u16,
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
    rank: Option<Rank>,
}

#[derive(Serialize, Deserialize)]
pub struct GradeCounts {
    ss: u16,
    ssh: u16,
    s: u16,
    sh: u16,
    a: u16,
}

#[derive(Serialize, Deserialize)]
pub struct Level {
    current: u8,
    progress: u8,
}

#[derive(Serialize, Deserialize)]
pub struct Rank {
    country: Option<u32>,
}

#[derive(Serialize, Deserialize)]
pub struct StatisticsRulesets {
    osu: Statistics,
    taiko: Statistics,
    fruits: Statistics,
    mania: Statistics,
}

#[derive(Serialize, Deserialize)]
pub struct UserAchievement {
    achieved_at: String,
    achievement_id: u16,
}
