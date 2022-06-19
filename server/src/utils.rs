use rand::{thread_rng, Rng, distributions::Alphanumeric};
use std::collections::HashMap;

macro_rules! hashmap {
    ($($k: expr => $v: expr)*) => {{
        let map = HashMap::from([
            $(
                ($k, $v),
            )*
        ]);

        map
    }};
}
pub(crate) use hashmap;

pub fn gen_random_str() -> String {
    thread_rng()
        .sample_iter(&Alphanumeric)
        .take(40)
        .map(char::from)
        .collect()
}
