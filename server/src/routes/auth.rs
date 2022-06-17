use axum::{extract::Query, Extension, response::IntoResponse};
use serde::{Deserialize, Serialize};
use std::{collections::HashMap, sync::Arc};

use reqwest;

use crate::models::server::ServerState;

#[derive(Debug, Deserialize, Serialize)]
struct Tokens {
    token_type: String,
    expires_in: i32,
    access_token: String,
    refresh_token: String
}

pub async fn authorize(
    Query(params): Query<HashMap<String, String>>,
    Extension(state): Extension<Arc<ServerState>>
) -> impl IntoResponse {
    let Some(code) = params.get("code") else {
        return "Code is required!"
    };

    let map: HashMap<&str, &str> = HashMap::from([
        ("client_id", "15483"),
        ("client_secret", &state.client_secret),
        ("code", code),
        ("grant_type", "authorization_code"),
        ("redirect_uri", "http://127.0.0.1:300/api/authorize")
    ]);

    let client = reqwest::Client::new();
    let response = client.post("https://osu.ppy.sh/oauth/token")
        .json(&map)
        .send()
        .await;

    let Ok(resp) = response else {
        return "token request is failed."
    };

    println!("{:?}", &resp.json::<Tokens>().await);

    "Ok"
}
