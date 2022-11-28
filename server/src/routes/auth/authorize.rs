use std::collections::HashMap;
use std::sync::Arc;

use axum::response::{IntoResponse, Redirect};
use axum::extract::{Query, State};
use axum_extra::extract::CookieJar;
use axum_extra::extract::cookie::{Cookie, SameSite};

use time::{OffsetDateTime, Duration};
use diesel::RunQueryDsl;
use reqwest::StatusCode;

use crate::utils::gen_random_str;
use crate::api::{get_tokens, get_me_and_friends};
use crate::models::{AppState, Session};

use crate::schema;

pub async fn authorize(
    Query(params): Query<HashMap<String, String>>,
    State(state): State<Arc<AppState>>,
    jar: CookieJar

) -> Result<impl IntoResponse, impl IntoResponse> {

    let Some(code) = params.get("code") else {
        return Err((StatusCode::BAD_REQUEST, "missing code"));
    };

    let client = reqwest::Client::new();
    let params = HashMap::from([
        ("grant_type", "authorization_code"),
        ("client_id", &state.client_id),
        ("client_secret", &state.client_secret),
        ("code", code),
        ("redirect_uri", &state.auth_redirect_uri),
    ]);

    let tokens = get_tokens(&client, &params).await?;
    let (user, mut friends) = get_me_and_friends(&client, &tokens).await?;
    let friend_ids = friends.iter().map(|user| Some(user.user_id)).collect();
    friends.push(user.clone());

    let mut connection = state.connection_pool.get().unwrap();
    diesel::insert_into(schema::users::table)
        .values(friends)
        .on_conflict_do_nothing()
        .execute(&mut connection)
        .ok();

    let session_string = gen_random_str();
    let redirect_uri = format!(
        "{}?access_token={}&refresh_token={}",
        &state.redirect_uri, &tokens.access_token, &tokens.refresh_token
    );

    let session = Session {
        user_id: user.user_id,
        osu_session: session_string.clone(),
        friend_ids,
        access_token: tokens.access_token,
        refresh_token: tokens.refresh_token
    };

    diesel::insert_into(schema::sessions::table)
        .values(session)
        .execute(&mut connection)
        .ok();

    let mut expire_date = OffsetDateTime::now_utc();
    expire_date += Duration::weeks(52);

    let cookie = Cookie::build("osu_session", session_string)
        .same_site(SameSite::None)
        .expires(expire_date)
        .finish();

    Ok((jar.add(cookie), Redirect::permanent(&redirect_uri)))
}
