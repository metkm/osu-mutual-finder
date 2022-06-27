#![feature(let_else)]

mod api;
mod database;
mod middlewares;
mod models;
mod routes;
mod utils;

use models::user;
use routes::{auth, mutuals};

use axum::{
    middleware,
    routing::{get, patch},
    Extension, Router,
};
use utils::load_env_variables;
use std::{net::SocketAddr, sync::Arc};
use tokio_postgres::{connect, NoTls};

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    let state = load_env_variables();

    let connection_string = format!(
        "host=localhost user=postgres password={} dbname=mutuals",
        &state.db_password
    );
    let (client, connection) = connect(&connection_string, NoTls).await?;

    tokio::spawn(async move {
        if let Err(e) = connection.await {
            eprintln!("Connection error: {}", e);
        }
    });

    client
        .batch_execute(
    "CREATE TABLE IF NOT EXISTS users (user_id integer UNIQUE PRIMARY KEY, username TEXT, country_code TEXT, avatar_url TEXT, cover_url TEXT);
        CREATE TABLE IF NOT EXISTS sessions (user_id integer REFERENCES users(user_id), friend_ids INTEGER[], osu_session TEXT, access_token TEXT, refresh_token TEXT)")
        .await?;

    let shared_client = Arc::new(client);
    let shared_state = Arc::new(state);

    let app = Router::new()
        .route("/api/mutuals", get(mutuals::get_mutuals))
        .route("/api/refresh", patch(auth::refresh))
        .route_layer(middleware::from_fn(middlewares::session::session))
        .route("/api/authorize", get(auth::authorize))
        .route("/api/login", get(auth::login))
        .layer(Extension(shared_client))
        .layer(Extension(shared_state));

    let addr = SocketAddr::from(([127, 0, 0, 1], 3001));

    axum::Server::bind(&addr)
        .serve(app.into_make_service())
        .await
        .unwrap();

    Ok(())
}
