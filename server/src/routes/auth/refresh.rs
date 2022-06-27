use std::{sync::Arc, collections::HashMap};

use axum::{http::StatusCode, response::IntoResponse, Extension};
use axum_extra::extract::{CookieJar, cookie::Cookie};
use tokio_postgres::Client;

use crate::{
    api::get_tokens,
    models::{server::ServerState, session::Session}, utils::{gen_random_str, hashmap}, database::insert_session,
};

pub async fn refresh(
    Extension(db): Extension<Arc<Client>>,
    Extension(current_session): Extension<Session>,
    Extension(server_state): Extension<Arc<ServerState>>,
    jar: CookieJar
) -> Result<impl IntoResponse, (StatusCode, &'static str)> {
    let client = reqwest::Client::new();

    let params: HashMap<&str, &str> = hashmap! {
        "client_id"     => "15638",
        "client_secret" => &server_state.client_secret,
        "refresh_token" => &current_session.refresh_token,
        "grant_type"    => "refresh_token",
        "redirect_uri"  => "http://127.0.0.1:3000/api/authorize"
    };

    let Ok(tokens) = get_tokens(&client, &params).await else {
        return Err((StatusCode::INTERNAL_SERVER_ERROR, "Can't refresh tokens!"))
    };

    let session_str = gen_random_str();
    insert_session(
        &db,
        &current_session.user_id,
        &current_session.friend_ids,
        &session_str,
        &tokens.access_token,
        &tokens.refresh_token
    ).await?;

    let updated_jar = jar.add(Cookie::new("osu_session", session_str));
    Ok((StatusCode::OK, updated_jar, "Ok!"))
}
