use axum::{
    extract::Query,
    response::{IntoResponse, Response},
    Extension, Json,
};
use axum_extra::extract::cookie::{Cookie, CookieJar};

use serde::{Deserialize, Serialize};
use std::{collections::HashMap, sync::Arc, time::Instant};
use tokio::join;
use tokio_postgres::{types::ToSql, Client};

use itertools::Itertools;
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
        .take(40)
        .map(char::from)
        .collect()
}

pub async fn authorize(
    Query(params): Query<HashMap<String, String>>,
    Extension(db): Extension<Arc<Client>>,
    Extension(state): Extension<Arc<ServerState>>,
    jar: CookieJar,
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

    let Ok(tokens) = response.json::<Tokens>().await else {
        return (StatusCode::INTERNAL_SERVER_ERROR, "Token parsing failed!").into_response()
    };

    let header_format = format!("Bearer {}", &tokens.access_token);
    let me_future = client
        .get("https://osu.ppy.sh/api/v2/me")
        .header("Authorization", &header_format)
        .send();

    let friends_future = client
        .get("https://osu.ppy.sh/api/v2/friends")
        .header("Authorization", &header_format)
        .send();

    let (Ok(me_response), Ok(friends_response)) = join!(
        me_future,
        friends_future
    ) else {
        return (StatusCode::INTERNAL_SERVER_ERROR, "Can't get user or friends!").into_response()
    };

    let (user, mut friends) = (
        me_response
            .json::<OsuUser>()
            .await
            .expect("Can't parse user!"),
        friends_response
            .json::<Vec<OsuUser>>()
            .await
            .expect("Can't parse friends!"),
    );
    
    friends.push(user.clone());
    let session_str = gen_random_str();
    let friend_ids: Vec<i32> = friends.iter().map(|user| user.id).collect();

    ////
    let params: Vec<&(dyn ToSql + Sync)> = friends
        .iter()
        .flat_map(|row| {
            [
                &row.id,
                &row.username as &(dyn ToSql + Sync),
                &row.country_code,
                &row.avatar_url,
                &row.cover.url,
            ]
        })
        .collect();

    let query = format!(
        "INSERT INTO users VALUES {} ON CONFLICT DO NOTHING",
        (1..=params.len())
            .tuples()
            .format_with(", ", |(i, j, k, l, m), f| {
                f(&format_args!("(${i}, ${j}, ${k}, ${l}, ${m})"))
            }),
    );
    ////

    if let Err(_) = db.execute(&query, &params).await {
        return (StatusCode::INTERNAL_SERVER_ERROR, "Can't add users!").into_response();
    }

    if let Err(_) = db
        .execute(
            "INSERT INTO sessions VALUES ($1, $2, $3, $4, $5)",
            &[
                &user.id,
                &friend_ids,
                &session_str,
                &tokens.access_token,
                &tokens.refresh_token,
            ],
        )
        .await
    {
        return (StatusCode::INTERNAL_SERVER_ERROR, "Can't add session!").into_response();
    };

    let updated_jar = jar
        .add(Cookie::new("osu_session", session_str));

    (StatusCode::CREATED, updated_jar, "Ok").into_response()
}
