pub mod osu;

use diesel::{Queryable, Insertable};
use diesel::pg::PgConnection;
use diesel::r2d2::{Pool, ConnectionManager};
use serde::{Deserialize, Serialize};

use crate::database::establish_connection_pool;
use crate::schema::*;

use self::osu::OsuUser;

pub struct AppState {
    pub connection_pool: Pool<ConnectionManager<PgConnection>>,
    pub client_id: String,
    pub client_secret: String,
    pub redirect_uri: String,
    pub auth_redirect_uri: String,
}

impl AppState {
    pub fn new() -> Self {
        let pool = establish_connection_pool();

        Self {
            connection_pool: pool,
            client_id: std::env::var("CLIENT_ID").expect("CLIENT_ID env variable must be set"),
            client_secret: std::env::var("CLIENT_SECRET").expect("CLIENT_SECRET env variable must be set"),
            auth_redirect_uri: std::env::var("AUTH_REDIRECT_URI").expect("AUTH_REDIRECT_URI env variable must be set"),
            redirect_uri: std::env::var("REDIRECT_URI").expect("REDIRECT_URI env variable must be set"),
        }
    }
}

#[derive(Queryable, Insertable, Serialize, Deserialize, Clone)]
#[diesel(table_name = users)]
pub struct User {
    pub user_id: i32,
    pub username: String,
    pub global_rank: i32,
    pub country_code: String,
    pub avatar_url: String,
    pub cover_url: String
}

impl From<OsuUser> for User {
    fn from(osu_user: OsuUser) -> Self {
        Self {
            user_id: osu_user.id,
            username: osu_user.username,
            global_rank: osu_user.statistics.global_rank.unwrap_or_else(|| 0),
            country_code: osu_user.country_code,
            avatar_url: osu_user.avatar_url,
            cover_url: osu_user.cover.url
        }
    }
}

#[derive(Queryable, Insertable, Deserialize, Serialize)]
#[diesel(table_name = sessions)]
pub struct Session {
    pub user_id: i32,
    // https://diesel.rs/guides/migration_guide.html#2-0-0-nullability-of-array-elements
    pub friend_ids: Vec<Option<i32>>,
    pub osu_session: String,
    pub access_token: String,
    pub refresh_token: String
}
