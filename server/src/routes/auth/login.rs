use std::sync::Arc;

use axum::{response::{Redirect, IntoResponse}, Extension};
use reqwest::StatusCode;

use crate::models::server::ServerState;

pub async fn login(
    Extension(server_state): Extension<Arc<ServerState>>
) -> Result<impl IntoResponse, impl IntoResponse> {
    let params = vec![
        ("client_id", "15638"),
        ("scope", "friends.read public"),
        ("response_type", "code"),
        ("redirect_uri", &server_state.auth_redirect_uri)
    ];

    let Ok(url) = reqwest::Url::parse_with_params("https://osu.ppy.sh/oauth/authorize", &params) else {
        return Err((StatusCode::INTERNAL_SERVER_ERROR, "Can't parse auth url!"))
    };

    Ok(Redirect::permanent(url.as_str()))
}
