-- Your SQL goes here

CREATE TABLE users (
  user_id INTEGER UNIQUE PRIMARY KEY,
  username TEXT NOT NULL,
  global_rank INTEGER NOT NULL,
  country_code TEXT NOT NULL,
  avatar_url TEXT NOT NULL,
  cover_url TEXT NOT NULL
)
