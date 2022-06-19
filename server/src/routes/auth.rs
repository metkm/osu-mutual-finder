use axum::{
    extract::Query,
    response::IntoResponse,
    Extension,
};
use axum_extra::extract::cookie::{Cookie, CookieJar};

use std::{collections::HashMap, sync::Arc};
use tokio_postgres::{types::ToSql, Client};

use itertools::Itertools;
use reqwest::{self, StatusCode};

use crate::api::get_me_and_friends;
use crate::models::server::ServerState;
use crate::{
    api::get_tokens,
    utils::{gen_random_str, hashmap},
};

pub async fn authorize(
    Query(params): Query<HashMap<String, String>>,
    Extension(db): Extension<Arc<Client>>,
    Extension(state): Extension<Arc<ServerState>>,
    jar: CookieJar,
) -> Result<impl IntoResponse, impl IntoResponse> {
    let Some(code) = params.get("code") else {
        return Err((StatusCode::BAD_REQUEST, "Code is required!"));
    };

    let params: HashMap<&str, &str> = hashmap! {
        "client_id"     => "15483"
        "client_secret" => &state.client_secret
        "code"          => code
        "grant_type"    => "authorization_code"
        "redirect_uri"  => "http://127.0.0.1:3000/api/authorize"
    };

    let client = reqwest::Client::new();
    let Ok(tokens) = get_tokens(&client, &params).await else {
        return Err((StatusCode::INTERNAL_SERVER_ERROR, "Can't get tokens!"));
    };

    let (user, mut friends) = get_me_and_friends(&tokens, &client).await?;
    friends.push(user.clone());

    let session_str = gen_random_str();
    let friend_ids: Vec<i32> = friends.iter().map(|user| user.id).collect();

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

    if let Err(_) = db.execute(&query, &params).await {
        return Err((StatusCode::INTERNAL_SERVER_ERROR, "Can't add users!"));
    }

    if db.execute(
        "INSERT INTO sessions VALUES ($1, $2, $3, $4, $5)",
        &[
            &user.id,
            &friend_ids,
            &session_str,
            &tokens.access_token,
            &tokens.refresh_token,
        ],
    ).await.is_err() {
        return Err((StatusCode::INTERNAL_SERVER_ERROR,"Can't add session!"))
    };
    
    let updated_jar = jar.add(Cookie::new("osu_session", session_str));

    return Ok((StatusCode::CREATED, updated_jar, "Ok!"));
}
