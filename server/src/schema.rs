// @generated automatically by Diesel CLI.

diesel::table! {
    sessions (user_id) {
        user_id -> Int4,
        friend_ids -> Array<Int4>,
        osu_session -> Text,
        access_token -> Text,
        refresh_token -> Text,
    }
}

diesel::table! {
    users (user_id) {
        user_id -> Int4,
        username -> Text,
        global_rank -> Int4,
        country_code -> Text,
        avatar_url -> Text,
        cover_url -> Text,
    }
}

diesel::joinable!(sessions -> users (user_id));

diesel::allow_tables_to_appear_in_same_query!(
    sessions,
    users,
);
