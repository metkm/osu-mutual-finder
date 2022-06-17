use axum::{extract::Query, Extension, response::{Response, IntoResponse}, Json};
use serde::{Deserialize, Serialize};
use tokio_postgres::Client;
use std::{collections::HashMap, sync::Arc};

use reqwest::{self, StatusCode};
use rand::{
    thread_rng, distributions::Alphanumeric, Rng
};

use crate::models::{server::ServerState, user::OsuUser};

#[derive(Debug, Deserialize, Serialize)]
struct Tokens {
    token_type: String,
    expires_in: i32,
    access_token: String,
    refresh_token: String
}

fn gen_random_str() -> String {
    thread_rng()
        .sample_iter(&Alphanumeric)
        .take(20)
        .map(char::from)
        .collect()
}

pub async fn authorize(
    Query(params): Query<HashMap<String, String>>,
    Extension(client): Extension<Arc<Client>>,
    Extension(state): Extension<Arc<ServerState>>
) -> Response {
    let Some(code) = params.get("code") else {
        return (StatusCode::BAD_REQUEST, "Code is required!").into_response()
    };

    let map: HashMap<&str, &str> = HashMap::from([
        ("client_id", "15483"),
        ("client_secret", &state.client_secret),
        ("code", code),
        ("grant_type", "authorization_code"),
        ("redirect_uri", "http://127.0.0.1:3000/api/authorize")
    ]);

    let client = reqwest::Client::new();
    let response = client.post("https://osu.ppy.sh/oauth/token")
        .json(&map)
        .send()
        .await
        .unwrap();

    let Ok(parsed) = &response.json::<Tokens>().await else {
        return (StatusCode::INTERNAL_SERVER_ERROR, "Token parsing failed!").into_response()
    };

    let session_str = gen_random_str();
    let response = client.get("https://osu.ppy.sh/api/v2/me")
        .header(
            "Authorization",
            format!("Bearer {}", &parsed.access_token)
        )
        .send()
        .await
        .unwrap();

    // println!("{:?}", &response.text().await.unwrap());
    match &response.json::<OsuUser>().await {
        Ok(parsed) => {
            return (StatusCode::OK, Json(parsed)).into_response()
        },
        Err(e) => {
            println!("{:?}", e);
            return (StatusCode::INTERNAL_SERVER_ERROR, "Token parsing failed!").into_response()
        },
    };
    
    "Ok".into_response()
}
