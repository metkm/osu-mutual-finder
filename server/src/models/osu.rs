use serde::{Deserialize, Serialize};

#[derive(Debug, Deserialize, Serialize)]
pub struct Tokens {
    pub token_type: String,
    pub expires_in: i32,
    pub access_token: String,
    pub refresh_token: String,
}

#[derive(Deserialize, Serialize, Clone)]
pub struct Cover {
    pub url: String,
}

#[derive(Deserialize, Serialize, Clone)]
pub struct Statistics {
    pub global_rank: Option<i32>,
}

#[derive(Deserialize, Serialize, Clone)]
pub struct OsuUser {
    pub avatar_url: String,
    pub country_code: String,
    pub id: i32,
    pub username: String,
    pub cover: Cover,
    pub statistics: Statistics,
}
