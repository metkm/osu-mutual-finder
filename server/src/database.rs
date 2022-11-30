use dotenvy;

use diesel::PgConnection;
use diesel::r2d2::{ConnectionManager, Pool};

pub fn establish_connection_pool() -> Pool<ConnectionManager<PgConnection>> {
    let env_file = if cfg!(debug_assertions) {
        ".dev.env"
    } else {
        ".prod.env"
    };

    dotenvy::from_filename(env_file).expect("Couldn't load .env file");

    let database_url = std::env::var("DATABASE_URL").expect("DATABASE_URL env varible must be set");

    let connection_manager = ConnectionManager::<PgConnection>::new(&database_url);
    let pool = Pool::builder()
        .build(connection_manager)
        .expect("Failed to create a connection pool");

    pool
}
