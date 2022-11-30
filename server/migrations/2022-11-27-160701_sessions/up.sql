-- Your SQL goes here

CREATE TABLE sessions (
  user_id INTEGER PRIMARY KEY REFERENCES users(user_id),
  friend_ids INTEGER[] NOT NULL,
  osu_session TEXT NOT NULL,
  access_token TEXT NOT NULL,
  refresh_token TEXT NOT NULL
)
