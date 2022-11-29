mod middlewares;
mod database;
mod models;
mod schema;
mod routes;
mod utils;
mod api;

use axum::{Router, middleware};
use axum::routing::{get, patch};
use tower_http::cors::CorsLayer;

use models::AppState;
use std::net::SocketAddr;
use std::sync::Arc;


#[tokio::main]
async fn main() {
    let cors = CorsLayer::very_permissive().allow_credentials(true);

    let state = Arc::new(AppState::new());
    let session_layer = middleware::from_fn_with_state(state.clone(), middlewares::session::session);

    let app = Router::new()
        .route("/api/mutuals", get(routes::mutuals::get_mutuals))
        .route("/api/refresh", patch(routes::auth::refresh))
        .route_layer(session_layer)
        .route("/api/login", get(routes::auth::login))
        .route("/api/authorize", get(routes::auth::authorize))
        .with_state(state)
        .layer(cors);

    axum::Server::bind(&SocketAddr::from(([127, 0, 0, 1], 3001)))
        .serve(app.into_make_service())
        .await
        .unwrap();
}
