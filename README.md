# SpofityManager

## Environment configuration

This project expects aligned client and server environment settings so the React frontend and Express backend agree on shared URLs. Copy the provided templates and adjust them for your deployment targets:

- Copy `client/.env.local.example` to `client/.env.local`.
- Copy `server/.env.example` to `server/.env`.

| Variable | Where it is used | Description |
| --- | --- | --- |
| `REACT_APP_API_BASE_URL` / `API_BASE_URL` | Client & server | Base URL for the API server (Express backend). |
| `REACT_APP_CLIENT_BASE_URL` / `CLIENT_BASE_URL` | Client & server | Public URL of the React client. The server also derives its CORS whitelist from this value. |
| `REACT_APP_SPOTIFY_REDIRECT_URI` / `SPOTIFY_REDIRECT_URI` | Client & server | Spotify callback URL used after authentication. |
| `SPOTIFY_CLIENT_ID`, `SPOTIFY_CLIENT_SECRET` | Server only | Credentials from the Spotify dashboard. |

> **Tip:** You can supply multiple client URLs to `CLIENT_BASE_URL` by separating them with commas (e.g. `https://app.example.com,https://staging.example.com`). The first entry is treated as the default redirect location.

## Spotify dashboard setup

Update your Spotify application settings so both your production callback URL and the local development callback URL are present under **Redirect URIs**. This should include:

- Your production redirect, e.g. `https://your-domain.com/api/callback`.
- The local development redirect `http://localhost:5001/callback` (or whatever you choose for local testing).

Remember to keep these values synchronized with `SPOTIFY_REDIRECT_URI` across the client and server configuration files.
