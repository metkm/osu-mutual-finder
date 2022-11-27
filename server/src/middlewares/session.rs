use std::sync::Arc;

use axum::extract::{FromRequest, State};
use axum::http::Request;
use axum::middleware::Next;
use axum::response::Response;
use axum_extra::extract::CookieJar;

use diesel::r2d2::{ConnectionManager, PooledConnection};
use diesel::PgConnection;

use reqwest::StatusCode;
use tokio_postgres::Client;

use crate::models::AppState;

// use crate::models::session::Session;


pub async fn session<B>(
    State(state): State<Arc<AppState>>,

    req: Request<B>,
    next: Next<B>
) -> Result<Response, StatusCode>
where
    B: Send,
{
    // let mut request_parts = RequestPart

    // let connection = req.extensions()
    //     .get::<Arc<AppState>>()
    //     .unwrap()
    //     .to_owned();

    Ok(next.run(req).await)

    // let db = req.extensions().get::<Arc<Client>>().unwrap().to_owned();

    // let mut request_parts = RequestParts::new(req);
    // let cookie_jar = CookieJar::from_request(&mut request_parts).await.unwrap();

    // let Some(session) = cookie_jar.get("osu_session") else {
    //     return Err(StatusCode::UNAUTHORIZED)
    // };

    // let Ok(query_result) = db
    //     .query_one("SELECT * FROM sessions WHERE osu_session=$1", &[&session.value()])
    //     .await
    // else {
    //     return Err(StatusCode::UNAUTHORIZED)
    // };

    // if query_result.is_empty() {
    //     return Err(StatusCode::UNAUTHORIZED);
    // }

    // let mut req = request_parts.try_into_request().unwrap();
    // req.extensions_mut().insert(Session::from(query_result));

    // Ok(next.run(req).await)
}
