use rand::{thread_rng, Rng, distributions::Alphanumeric};

macro_rules! hashmap {
    ($($k: expr => $v: expr),*) => {{
        let map = HashMap::from([
            $(
                ($k, $v),
            )*
        ]);

        map
    }};
}
pub(crate) use hashmap;

use crate::models::server::ServerState;

pub fn gen_random_str() -> String {
    thread_rng()
        .sample_iter(&Alphanumeric)
        .take(40)
        .map(char::from)
        .collect()
}

pub fn load_env_variables() -> ServerState {
    let env_filename = if cfg!(debug_assertions) {
        ".dev.env"
    } else {
        ".prod.env"
    };
    dotenvy::from_filename(env_filename).expect("Can't load .env file!");

    ServerState::new()
}
