use rand::{thread_rng, Rng, distributions::Alphanumeric};

pub fn gen_random_str() -> String {
    thread_rng()
        .sample_iter(&Alphanumeric)
        .take(300)
        .map(char::from)
        .collect()
}
