use axum::{extract::Query, Extension, response::IntoResponse};
use std::{collections::HashMap, sync::Arc};

use reqwest;

use crate::models::server::ServerState;

pub async fn authorize(
    Query(params): Query<HashMap<String, String>>,
    Extension(state): Extension<Arc<ServerState>>
) -> impl IntoResponse {
    let Some(code) = params.get("code") else {
        return "Code is required!"
    };

    let mut map = HashMap::new();
    map.insert("client_id", "15483");
    map.insert("client_secret", &state.client_secret);
    map.insert("code", code);
    map.insert("grant_type", "authorization_code");
    map.insert("redirect_uri", "http://127.0.0.1:3000/api/authorize");

    let client = reqwest::Client::new();
    let response = client.post("https://osu.ppy.sh/oauth/token")
        .json(&map)
        .send()
        .await;

    let Ok(resp) = response else {
        return "token request is failed."
    };

    println!("{:?}", &resp);

    "Ok"
}
