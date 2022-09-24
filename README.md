# sveltekit + postgres + JWT

This auth demo uses Sveltekit form actions and postgres to authenticate user with JWT tokens as sessionID.

# Environment variables

DB_URL: `postgres://user:password@host:port/dbname`. Insert your own URL in .env file.
JWT_KEY: Any key used to sign JWT tokens. Recommend at least 32 characyers. Insert your own key in .env file.
