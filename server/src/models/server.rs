use std::env;

pub struct ServerState {
    pub db_password: String,
    pub client_secret: String,
    pub auth_redirect_uri: String,
    pub redirect_uri: String,
}

impl ServerState {
    pub fn new() -> Self {
        Self {
            db_password: env::var("PASSWORD").expect("password env variable is not found!"),
            client_secret: env::var("CLIENT_SECRET").expect("client_secret env variable is not found!"),
            auth_redirect_uri: env::var("AUTH_REDIRECT_URI").expect("auth_redirect_uri env variable is not found!"),
            redirect_uri: env::var("REDIRECT_URI").expect("redirect_uri env variable is not found!")
        }
    }
}
