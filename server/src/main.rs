mod middlewares;
mod database;
mod models;
mod schema;
mod routes;
mod utils;
mod api;

use axum::{Router, middleware};
use axum::routing::get;
use tower_http::cors::CorsLayer;

use models::AppState;
use std::net::SocketAddr;
use std::sync::Arc;


#[tokio::main]
async fn main() {
    let cors = CorsLayer::very_permissive().allow_credentials(true);

    let state = Arc::new(AppState::new());

    let app = Router::new()
        .route_layer(middleware::from_fn_with_state(state.clone(), middlewares::session::session))
        .route("/api/login", get(routes::auth::login))
        .route("/api/authorize", get(routes::auth::authorize))
        .with_state(state)
        .layer(cors);

    axum::Server::bind(&SocketAddr::from(([127, 0, 0, 1], 3001)))
        .serve(app.into_make_service())
        .await
        .unwrap();

    // let shared_client = Arc::new(client);
    // let shared_state = Arc::new(state);

    // let app = Router::new()
    //     .route("/api/mutuals", get(mutuals::get_mutuals))
    //     .route("/api/refresh", patch(auth::refresh))
    //     .route_layer(middleware::from_fn(middlewares::session::session))
    //     .route("/api/authorize", get(auth::authorize))
    //     .route("/api/login", get(auth::login))
    //     .layer(Extension(shared_client))
    //     .layer(Extension(shared_state))
    //     .layer(cors);

    // let addr = SocketAddr::from(([127, 0, 0, 1], 3001));

    // axum::Server::bind(&addr)
    //     .serve(app.into_make_service())
    //     .await
    //     .unwrap();

    // Ok(())
}
