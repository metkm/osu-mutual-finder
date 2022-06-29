pub mod server;
pub mod user;
pub mod session;

use serde::{Deserialize, Serialize};

#[derive(Debug, Deserialize, Serialize)]
pub struct Tokens {
    pub token_type: String,
    pub expires_in: i32,
    pub access_token: String,
    pub refresh_token: String,
}
