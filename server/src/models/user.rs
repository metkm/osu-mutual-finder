use serde::{Deserialize, Serialize};
use tokio_postgres::Row;
use postgres_types::ToSql;

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
pub enum GameMode {
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
pub struct UserAccountHistory {
    description: Option<String>,
    id: u32,
    length: u32,
    timestamp: String,
    #[serde(rename = "type")]
    _type: HistoryType
}

#[derive(Serialize, Deserialize)]
pub struct ProfileBanner {
    id: u32,
    tournament_id: u32,
    image: String
}

#[derive(Debug, Deserialize, Serialize)]
pub struct UserBadge {
    awarded_at: String,
    description: String,
    image_url: String,
    url: String
}

#[derive(Debug, Deserialize, Serialize)]
pub struct UserGroup {
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
pub struct UserMonthlyPlaycount {
    start_date: String,
    count: u32
}

#[derive(Debug, Clone, Serialize, Deserialize, ToSql)]
pub struct OsuUser {
    pub avatar_url: String,
    pub country_code: String,
    // pub default_group: String,
    pub id: i32,
    // pub is_active: bool,
    // pub is_bot: bool,
    // pub is_deleted: bool,
    // pub is_online: bool,
    // pub is_supporter: bool,
    // pub last_visit: Option<String>,
    // pub pm_friends_only: bool,
    // pub profile_colour: Option<String>,
    pub username: String,
    // pub cover_url: String,
    // pub discord: Option<String>,
    // pub has_supported: bool,
    // pub interests: Option<String>,
    // pub join_date: String,
    // pub kudosu: Kudosu,
    // pub location: Option<String>,
    // pub max_blocks: i64,
    // pub max_friends: i64,
    // pub occupation: Option<String>,
    // pub playmode: GameMode,
    // pub playstyle: Vec<String>,
    // pub post_count: u16,
    // pub profile_order: Vec<String>,
    // pub title: Option<String>,
    // pub title_url: Option<String>,
    // pub twitter: Option<String>,
    // pub website: Option<String>,
    // pub country: Country,
    pub cover: Cover,
    // pub is_restricted: bool,
    // pub account_history: Vec<UserAccountHistory>,
    // pub active_tournament_banner: Option<ProfileBanner>,
    // pub badges: Vec<UserBadge>,
    // pub beatmap_playcounts_count: u32,
    // pub comments_count: u64,
    // pub favourite_beatmapset_count: u32,
    // pub follower_count: u32,
    // pub graveyard_beatmapset_count: u32,
    // pub groups: Vec<UserGroup>,
    // pub guest_beatmapset_count: u32,
    // pub loved_beatmapset_count: u32,
    // pub mapping_follower_count: u32,
    // pub monthly_playcounts: Vec<UserMonthlyPlaycount>,
    // pub page: Page,
    // pub pending_beatmapset_count: u32,
    // pub previous_usernames: Vec<String>,
    // pub ranked_beatmapset_count: u32,
    // pub replays_watched_counts: Vec<Count>,
    // pub scores_best_count: u32,
    // pub scores_first_count: u32,
    // pub scores_pinned_count: u32,
    // pub scores_recent_count: u32,
    // pub statistics: Statistics,
    // pub statistics_rulesets: StatisticsRulesets,
    // pub support_level: u16,
    // pub user_achievements: Vec<UserAchievement>,
    // // #[serde(rename = "rank_history")]
    // pub rank_history: RankHistory,
    // // #[serde(rename = "rank_history")]
    // // pub welcome_rank_history: RankHistory,
    // pub ranked_and_approved_beatmapset_count: u32,
    // pub unranked_beatmapset_count: u32,
}

#[derive(Debug, Serialize, Deserialize, ToSql)]
pub struct Country {
    code: String,
    name: String,
}

#[derive(Debug, Clone, Serialize, Deserialize, ToSql)]
pub struct Cover {
    pub custom_url: Option<String>,
    pub url: String,
    pub id: Option<String>, // wtf is this a string????? org: Option<u32>
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
