use std::{collections::HashMap, sync::Arc};

use axum::Json;
use axum::{http::StatusCode, response::IntoResponse, Extension};
use tokio_postgres::Client;

use crate::api::get_tokens;
use crate::models::server::ServerState;
use crate::models::session::Session;
use crate::utils::hashmap;

pub async fn refresh(
    Extension(db): Extension<Arc<Client>>,
    Extension(current_session): Extension<Session>,
    Extension(server_state): Extension<Arc<ServerState>>,
) -> Result<impl IntoResponse, (StatusCode, &'static str)> {
    let client = reqwest::Client::new();

    let params: HashMap<&str, &str> = hashmap! {
        "grant_type"    => "refresh_token",
        "client_id"     => &server_state.client_id,
        "client_secret" => &server_state.client_secret,
        "refresh_token" => &current_session.refresh_token,
        "redirect_uri"  => &server_state.auth_redirect_uri
    };

    let tokens = get_tokens(&client, &params).await?;

    if db
        .execute(
            "UPDATE sessions SET access_token=$1, refresh_token=$2 WHERE osu_session=$3",
            &[&tokens.access_token, &tokens.refresh_token, &current_session.osu_session],
        )
        .await
        .is_err()
    {
        return Err((
            StatusCode::INTERNAL_SERVER_ERROR,
            "Can't update session tokens!",
        ));
    }
    
    Ok((StatusCode::OK, Json(tokens)))
}
