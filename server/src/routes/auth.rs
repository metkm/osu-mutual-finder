use axum::{
    extract::Query,
    response::{IntoResponse, Response},
    Extension,
};
use axum_extra::extract::cookie::{Cookie, CookieJar};

use serde::{Deserialize, Serialize};
use std::{collections::HashMap, sync::Arc};
use tokio_postgres::Client;

use rand::{distributions::Alphanumeric, thread_rng, Rng};
use reqwest::{self, StatusCode};

use crate::models::{server::ServerState, user::OsuUser};

#[derive(Debug, Deserialize, Serialize)]
struct Tokens {
    token_type: String,
    expires_in: i32,
    access_token: String,
    refresh_token: String,
}

fn gen_random_str() -> String {
    thread_rng()
        .sample_iter(&Alphanumeric)
        .take(50)
        .map(char::from)
        .collect()
}

pub async fn authorize(
    Query(params): Query<HashMap<String, String>>,
    Extension(db): Extension<Arc<Client>>,
    Extension(state): Extension<Arc<ServerState>>,
    jar: CookieJar
) -> Response {
    let Some(code) = params.get("code") else {
        return (StatusCode::BAD_REQUEST, "Code is required!").into_response()
    };

    let map: HashMap<&str, &str> = HashMap::from([
        ("client_id", "15483"),
        ("client_secret", &state.client_secret),
        ("code", code),
        ("grant_type", "authorization_code"),
        ("redirect_uri", "http://127.0.0.1:3000/api/authorize"),
    ]);

    let client = reqwest::Client::new();
    let response = client
        .post("https://osu.ppy.sh/oauth/token")
        .json(&map)
        .send()
        .await
        .unwrap();

    let Ok(tokens) = &response.json::<Tokens>().await else {
        return (StatusCode::INTERNAL_SERVER_ERROR, "Token parsing failed!").into_response()
    };

    let response = client
        .get("https://osu.ppy.sh/api/v2/me")
        .header("Authorization", format!("Bearer {}", &tokens.access_token))
        .send()
        .await
        .unwrap();

    let Ok(user) = response.json::<OsuUser>().await else {
        return (StatusCode::INTERNAL_SERVER_ERROR, "User parse failed!").into_response()
    };

    let session_str = gen_random_str();
    db.execute(
        "INSERT INTO users VALUES ($1::integer, $2::text, $3::text, $4::text)",
        &[
            &user.id,
            &session_str,
            &tokens.access_token,
            &tokens.refresh_token,
        ],
    )
    .await
    .expect("Can't add user");

    let updated_jar = jar
        .add(Cookie::new("osu_session", session_str));

    (StatusCode::CREATED, updated_jar, "Ok").into_response()
}
