mod user;
mod routes;

use routes::mutuals;

use axum::{routing::{get, post}, Extension, Router};
use std::{net::SocketAddr, sync::Arc};
use tokio_postgres::{connect, NoTls};

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    let password = std::env::var("PASSWORD").expect("Can't find password environment variable!");
    let connection_string =
        format!("host=localhost user=postgres password={password} dbname=mutuals");

    let (client, connection) = connect(&connection_string, NoTls).await?;

    tokio::spawn(async move {
        if let Err(e) = connection.await {
            eprintln!("Connection error: {}", e);
        }
    });

    client.execute("CREATE TABLE IF NOT EXISTS mutuals (user_id integer UNIQUE, friend_ids integer[])", &[]).await;
    let shared_client = Arc::new(client);

    let app = Router::new()
        .route("/api/mutuals/get/:id", get(mutuals::get))
        .route("/api/mutuals/add", post(mutuals::add))
        .layer(Extension(shared_client));
    let addr = SocketAddr::from(([127, 0, 0, 1], 3000));

    axum::Server::bind(&addr)
        .serve(app.into_make_service())
        .await
        .unwrap();

    Ok(())
}
