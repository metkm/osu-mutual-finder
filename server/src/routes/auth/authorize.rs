use std::{collections::HashMap, sync::Arc};

use axum::extract::Query;
use axum::response::{IntoResponse, Redirect};
use axum::Extension;
use axum_extra::extract::cookie::{Cookie, CookieJar, SameSite};
use time::{Duration, OffsetDateTime};

use itertools::Itertools;
use postgres_types::ToSql;
use reqwest::StatusCode;
use tokio_postgres::Client;

use crate::api::{get_me_and_friends, get_tokens};
use crate::database::insert_session;
use crate::models::server::ServerState;
use crate::utils::{gen_random_str, hashmap};

pub async fn authorize(
    Query(query_params): Query<HashMap<String, String>>,
    Extension(server_state): Extension<Arc<ServerState>>,
    Extension(db): Extension<Arc<Client>>,
    jar: CookieJar,
) -> Result<impl IntoResponse, impl IntoResponse> {
    let Some(code) = query_params.get("code") else {
        return Err((StatusCode::BAD_REQUEST, "Code is required!"));
    };

    let client = reqwest::Client::new();
    let params: HashMap<&str, &str> = hashmap! {
        "grant_type"    => "authorization_code",
        "client_id"     => &server_state.client_id,
        "client_secret" => &server_state.client_secret,
        "code"          => code,
        "redirect_uri"  => &server_state.auth_redirect_uri
    };

    let tokens = get_tokens(&client, &params).await?;
    let (user, mut friends) = get_me_and_friends(&client, &tokens).await?;
    let friend_ids: Vec<i32> = friends.iter().map(|user| user.id).collect();

    friends.push(user.clone());

    let params: &Vec<&(dyn ToSql + Sync)> = &friends
        .iter()
        .flat_map(|row| {
            [
                &row.id,
                &row.username as &(dyn ToSql + Sync),
                (&row.statistics.global_rank).as_ref().unwrap_or(&0),
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
            .format_with(", ", |(id, username, global_rank, country_code, avatar_url, cover_url), f| {
                f(&format_args!("(${id}, ${username}, ${global_rank}, ${country_code}, ${avatar_url}, ${cover_url})"))
            }),
    );

    if db.execute(&query, params).await.is_err() {
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

    // probably not a good idea to return access_token and refresh token like this.
    let redirect_uri = format!(
        "{}?access_token={}&refresh_token={}",
        &server_state.redirect_uri, &tokens.access_token, &tokens.refresh_token
    );

    let mut now = OffsetDateTime::now_utc();
    now += Duration::weeks(52);

    let cookie = Cookie::build("osu_session", session_str)
        .domain(server_state.domain.clone())
        .same_site(SameSite::None)
        .expires(now)
        .finish();

    let updated_jar = jar.add(cookie);
    Ok((updated_jar, Redirect::permanent(&redirect_uri)))
}
