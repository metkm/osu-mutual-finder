use axum::response::{Redirect, IntoResponse};
use reqwest::StatusCode;

pub async fn login() -> Result<impl IntoResponse, impl IntoResponse> {
    let Ok(url) = reqwest::Url::parse_with_params("https://osu.ppy.sh/oauth/authorize", &[
        ("client_id", "15483"),
        ("redirect_uri", "http://localhost:3001/api/authorize"),
        ("scope", "friends.read identify"),
        ("response_type", "code")
    ]) else {
        return Err((StatusCode::INTERNAL_SERVER_ERROR, "Can't parse auth url!"))
    };

    println!("{}", url.as_str());
    Ok(Redirect::permanent(url.as_str()))
}
