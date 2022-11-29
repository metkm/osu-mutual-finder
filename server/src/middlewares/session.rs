use std::sync::Arc;

use axum::extract::State;
use axum::http::Request;
use axum::middleware::Next;
use axum::response::Response;
use axum_extra::extract::CookieJar;

use diesel::prelude::*;
use diesel::{QueryDsl, RunQueryDsl};

use reqwest::StatusCode;

use crate::models::*;
use crate::schema::sessions;

pub async fn session<B>(
    State(state): State<Arc<AppState>>,

    mut req: Request<B>,
    next: Next<B>,
) -> Result<Response, StatusCode>
where
    B: Send + 'static,
{
    let jar = CookieJar::from_headers(req.headers());

    let Some(session_string) = jar.get("osu_session") else {
        return Err(StatusCode::UNAUTHORIZED)
    };

    let connection = &mut state.connection_pool.get().unwrap();
    let value = session_string.value().to_string();
    
    let Ok(session) = sessions::table
        .filter(sessions::osu_session.eq(value))
        .first::<Session>(connection) else {
            return Err(StatusCode::UNAUTHORIZED)
        };
    
    req.extensions_mut()
        .insert(session);

    Ok(next.run(req).await)
}
