use std::sync::Arc;

use axum::{response::IntoResponse, Extension, Json};
use reqwest::StatusCode;
use tokio_postgres::Client;

use crate::models::{session::Session, user::OsuUser};

pub async fn get_mutuals(
    Extension(current_session): Extension<Session>,
    Extension(db): Extension<Arc<Client>>,
) -> Result<impl IntoResponse, (StatusCode, &'static str)> {
    let Ok(rows) = db.query("SELECT * FROM users WHERE user_id=ANY($1)", &[&current_session.friend_ids]).await else {
        return Err((StatusCode::INTERNAL_SERVER_ERROR, "Can't query database"));
    };

    let users: Vec<OsuUser> = rows.into_iter().map(OsuUser::from).collect();

    Ok(Json(users))
}
