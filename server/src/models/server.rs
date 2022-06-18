use std::env;

pub struct ServerState {
    pub db_password: String,
    pub client_secret: String
}

impl ServerState {
    pub fn new() -> Self {
        let db_password = env::var("PASSWORD").expect("password env variable is not found!");
        let client_secret = env::var("CLIENT_SECRET").expect("CLIENT_SECRET env variable is not found!");

        Self {
            db_password,
            client_secret
        }
    }
}
