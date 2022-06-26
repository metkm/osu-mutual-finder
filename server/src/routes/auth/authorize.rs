use std::{collections::HashMap, sync::Arc};

use axum::{extract::Query, response::{IntoResponse, Redirect}, Extension};
use axum_extra::extract::{CookieJar, cookie::Cookie}
;
use itertools::Itertools;
use postgres_types::ToSql;
use tokio_postgres::Client;
use reqwest::StatusCode;

use crate::{
    api::{get_tokens, get_me_and_friends},
    models::server::ServerState, database::insert_session, utils::{gen_random_str, hashmap},
};

pub async fn authorize(
    Query(query_params): Query<HashMap<String, String>>,
    Extension(server_state): Extension<Arc<ServerState>>,
    Extension(db): Extension<Arc<Client>>,
    jar: CookieJar
) -> Result<impl IntoResponse, impl IntoResponse> {
    let Some(code) = query_params.get("code") else {
        return Err((StatusCode::BAD_REQUEST, "Code is required!"));
    };

    let client = reqwest::Client::new();
    let params: HashMap<&str, &str> = hashmap! {
        "client_id"     => "15483"
        "client_secret" => &server_state.client_secret
        "code"          => code
        "grant_type"    => "authorization_code" 
        "redirect_uri"  => "http://localhost:3001/api/authorize"
    };

    let tokens = get_tokens(&client, &params).await?;
    let (user, mut friends) = get_me_and_friends(&client, &tokens).await?;
    friends.push(user.clone());

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

    if db.execute(&query, &params).await.is_err() {
        return Err((StatusCode::INTERNAL_SERVER_ERROR, "Can't add users!"));
    };
    
    let session_str = gen_random_str();
    insert_session(
        &db,
        &user.id,
        &friend_ids,
        &session_str,
        &tokens.access_token,
        &tokens.refresh_token,
    )
    .await?;

    let updated_jar = jar.add(Cookie::new("osu_session", session_str));
    Ok((updated_jar, Redirect::permanent("https://tauri.localhost/")))
}
