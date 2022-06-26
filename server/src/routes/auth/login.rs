use axum::response::{Redirect, IntoResponse};
use reqwest::StatusCode;

pub async fn login() -> Result<impl IntoResponse, impl IntoResponse> {
    let mut params = vec![
        ("client_id", "15638"),
        ("scope", "friends.read identify"),
        ("response_type", "code")
    ];

    if cfg!(debug_assertions) {
        params.push(("redirect_uri", "http://localhost:3001/api/authorize"));
    } else {
        params.push(("redirect_uri", "https://tauri.localhost/api/authorize"));
    }

    let Ok(url) = reqwest::Url::parse_with_params("https://osu.ppy.sh/oauth/authorize", &params) else {
        return Err((StatusCode::INTERNAL_SERVER_ERROR, "Can't parse auth url!"))
    };

    Ok(Redirect::permanent(url.as_str()))
}
