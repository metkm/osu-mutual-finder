use std::{collections::HashMap, sync::Arc};

use axum::Json;
use axum::{response::IntoResponse, Extension};
use axum::extract::State;
use reqwest::StatusCode;

use diesel::prelude::*;

use crate::api::get_tokens;
use crate::models::{Session, AppState};
use crate::schema::sessions;

pub async fn refresh(
    State(state): State<Arc<AppState>>,
    Extension(session): Extension<Session>
) -> Result<impl IntoResponse, impl IntoResponse> {
    let client = reqwest::Client::new();

    let params = HashMap::from([
        ("grant_type", "refresh_token"),
        ("client_id", &state.client_id),
        ("client_secret", &state.client_secret),
        ("refresh_token", &session.refresh_token),
        ("redirect_uri", &state.auth_redirect_uri)
    ]);

    let tokens = get_tokens(&client, &params).await?;
    let mut connection = state.connection_pool.get().unwrap();

    let update = diesel::update(
        sessions::table.filter(sessions::osu_session.eq(session.osu_session))
    )
    .set((
        sessions::access_token.eq(&tokens.access_token),
        sessions::refresh_token.eq(&tokens.refresh_token)
    ))
    .execute(&mut connection);

    if update.is_err() {
        return Err((
            StatusCode::INTERNAL_SERVER_ERROR,
            "Can't update session tokens"
        ))
    }

    Ok((StatusCode::OK, Json(tokens)))
}
