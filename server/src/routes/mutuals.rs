use std::sync::Arc;

use axum::Json;
use axum::response::IntoResponse;
use axum::{Extension, extract::State};
use diesel::PgArrayExpressionMethods;
use diesel::QueryDsl;
use diesel::RunQueryDsl;
use diesel::result::Error;
use diesel::ExpressionMethods;
use reqwest::StatusCode;

use crate::models::User;
use crate::models::{Session, AppState}; 
use crate::schema::sessions;
use crate::schema::users;


pub async fn get_mutuals(
    State(state): State<Arc<AppState>>,
    Extension(session): Extension<Session>
) -> Result<impl IntoResponse, (StatusCode, &'static str)> {

    let mut connection = state.connection_pool.get().unwrap();
    let user_id: Vec<i32> = vec![session.user_id];

    let id_query_result: Result<Vec<i32>, Error> = sessions::table
        .select(sessions::user_id)
        .filter(sessions::friend_ids.contains(user_id))
        .load::<i32>(&mut connection);

    let Ok(sessions) = id_query_result else {
        return Err((StatusCode::INTERNAL_SERVER_ERROR, "Error while querying friends"))
    };

    let friend_query_result = users::table
        .filter(users::user_id.eq_any(sessions))
        .load::<User>(&mut connection);

    match friend_query_result {
        Ok(friends) => {
            return Ok((StatusCode::OK, Json(friends)))
        },
        Err(error) => {
            match error {
                Error::NotFound => {
                    return Ok((StatusCode::OK, Json(vec![])))
                },
                _ => {
                    return Err((StatusCode::INTERNAL_SERVER_ERROR, "Error while querying users"))
                }
            }
        }
    }
}
