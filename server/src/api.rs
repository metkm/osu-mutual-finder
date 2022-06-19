use std::collections::HashMap;

use axum::response::{IntoResponse, Response};
use reqwest::{Client, StatusCode};
use tokio::join;

use crate::models::Tokens;
use crate::user::OsuUser;

async fn get_me(client: &Client, token: &str) -> Result<OsuUser, reqwest::Error> {
    let response = client
        .get("https://osu.ppy.sh/api/v2/me")
        .header("Authorization", format!("Bearer {}", &token))
        .send()
        .await?;

    let me = response.json::<OsuUser>().await?;

    Ok(me)
}

async fn get_friends(client: &Client, token: &str) -> Result<Vec<OsuUser>, reqwest::Error> {
    let response = client
        .get("https://osu.ppy.sh/api/v2/friends")
        .header("Authorization", format!("Bearer {}", &token))
        .send()
        .await?;

    let friends = response.json::<Vec<OsuUser>>().await?;

    Ok(friends)
}

pub async fn get_me_and_friends(
    tokens: &Tokens,
    client: &Client,
) -> Result<(OsuUser, Vec<OsuUser>), (StatusCode, &'static str)> {
    let (user, friends) = join!(
        get_me(client, &tokens.access_token),
        get_friends(client, &tokens.access_token)
    );

    let Ok(user) = user else {
        return Err((StatusCode::INTERNAL_SERVER_ERROR, "Can't get user!"));
    };

    let Ok(friends) = friends else {
        return Err((StatusCode::INTERNAL_SERVER_ERROR, "Can't get friends!"));
    };

    Ok((user, friends))
}

pub async fn get_tokens(
    client: &Client,
    params: &HashMap<&str, &str>,
) -> Result<Tokens, reqwest::Error> {
    let response = client
        .post("https://osu.ppy.sh/oauth/token")
        .json(params)
        .send()
        .await?;

    let tokens = response.json::<Tokens>().await?;
    Ok(tokens)
}
