use std::sync::Arc;

use axum::{
    extract::{FromRequest, RequestParts},
    http::Request,
    middleware::Next,
    response::Response,
};
use axum_extra::extract::CookieJar;
use reqwest::StatusCode;
use tokio_postgres::Client;

use crate::models::session::Session;

pub async fn session<B>(req: Request<B>, next: Next<B>) -> Result<Response, StatusCode>
where
    B: Send,
{
    let db = req.extensions().get::<Arc<Client>>().unwrap().to_owned();

    let mut request_parts = RequestParts::new(req);
    let cookie_jar = CookieJar::from_request(&mut request_parts).await.unwrap();

    let Some(session) = cookie_jar.get("osu_session") else {
        return Err(StatusCode::UNAUTHORIZED)
    };

    let Ok(query_result) = db
        .query_one("SELECT * FROM sessions WHERE osu_session=$1", &[&session.value()])
        .await
    else {
        return Err(StatusCode::UNAUTHORIZED)
    };

    if query_result.is_empty() {
        return Err(StatusCode::UNAUTHORIZED);
    }

    let mut req = request_parts.try_into_request().unwrap();
    req.extensions_mut().insert(Session::from(query_result));

    Ok(next.run(req).await)
}
