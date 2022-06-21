use reqwest::StatusCode;
use tokio_postgres::Client;

pub async fn insert_session(
    db: &Client,
    id: &i32,
    ids: &Vec<i32>,
    session_str: &str,
    access_token: &str,
    refresh_token: &str,
) -> Result<(), (StatusCode, &'static str)> {
    if db
        .execute(
            "INSERT INTO sessions VALUES ($1, $2, $3, $4, $5)",
            &[&id, &ids, &session_str, &access_token, &refresh_token],
        )
        .await
        .is_err()
    {
        return Err((StatusCode::INTERNAL_SERVER_ERROR, "Can't add session!"));
    };

    Ok(())
}
