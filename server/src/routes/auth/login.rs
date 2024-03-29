use std::sync::Arc;

use axum::extract::State;
use axum::response::{Redirect, IntoResponse};
use reqwest::{StatusCode, Url};

use crate::models::AppState;

pub async fn login(
    State(server_state): State<Arc<AppState>>
) -> Result<impl IntoResponse, impl IntoResponse> {
    let params = vec![
        ("scope", "friends.read public"),
        ("client_id", &server_state.client_id),
        ("response_type", "code"),
        ("redirect_uri", &server_state.auth_redirect_uri)
    ];

    let Ok(url) = Url::parse_with_params("https://osu.ppy.sh/oauth/authorize", &params) else {
        return Err((StatusCode::INTERNAL_SERVER_ERROR, "Can't parse auth url!"))
    };

    let redirect = Redirect::permanent(url.as_str());
    Ok(redirect)
}
