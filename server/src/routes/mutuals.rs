use crate::user::User;
use std::sync::Arc;

use axum::{extract::Path, response::IntoResponse, Extension, Json};
use tokio_postgres::Client;

pub async fn get(
    Path(user_id): Path<i32>,
    Extension(client): Extension<Arc<Client>>,
) -> impl IntoResponse {
    println!("XD");

    let query = client
        .query(
            "SELECT * FROM mutuals WHERE $1 = ANY(friend_ids)",
            &[&user_id],
        )
        .await
        .unwrap();

    let users: Vec<User> = query.into_iter().map(|row| User::from(row)).collect();

    Json(users)
}

pub async fn add(
    Json(user): Json<User>,
    Extension(client): Extension<Arc<Client>>
) {
    client.execute(
        "INSERT INTO mutuals(user_id, friend_ids) VALUES ($1, $2) ON CONFLICT (user_id) DO UPDATE SET friend_ids = $2",
        &[&user.user_id, &user.friend_ids]
    ).await
    .expect("Can't add user");
}
