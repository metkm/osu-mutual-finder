use tokio_postgres::Row;

#[derive(Debug, Clone)]
pub struct Session {
    pub user_id: i32,
    pub friend_ids: Vec<i32>,
    pub osu_session: String,
    pub access_token: String,
    pub refresh_token: String,
}

impl From<Row> for Session {
    fn from(row: Row) -> Self {
        Self {
            user_id: row.get("user_id"),
            friend_ids: row.get("friend_ids"),
            osu_session: row.get("osu_session"),
            access_token: row.get("access_token"),
            refresh_token: row.get("refresh_token")
        }
    }
}
