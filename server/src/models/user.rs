use serde::{ Serialize, Deserialize };
use tokio_postgres::Row;

#[derive(Serialize, Deserialize, Debug)]
pub struct User {
    pub user_id: i32,
    pub friend_ids: Vec<i32>
}

impl From<Row> for User {
    fn from(row: Row) -> Self {
        Self {
            user_id: row.get("user_id"),
            friend_ids: row.get("friend_ids")
        }
    }
}
