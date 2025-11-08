# SpofityManager

## Environment configuration

This project expects aligned client and API environment settings so the React frontend and Express backend agree on shared URLs. Copy the provided templates and adjust them for your deployment targets:

- Copy `client/.env.local.example` to `client/.env.local`.
- Copy `api/.env.example` to `api/.env`.

| Variable | Where it is used | Description |
| --- | --- | --- |
| `REACT_APP_API_BASE_URL` / `API_BASE_URL` | Client & API | Base URL for the API server (Express backend). |
| `REACT_APP_CLIENT_BASE_URL` / `CLIENT_BASE_URL` | Client & API | Public URL of the React client. The API also derives its CORS whitelist from this value. |
| `REACT_APP_SPOTIFY_REDIRECT_URI` / `SPOTIFY_REDIRECT_URI` | Client & API | Spotify callback URL used after authentication. |
| `SPOTIFY_CLIENT_ID`, `SPOTIFY_CLIENT_SECRET` | API only | Credentials from the Spotify dashboard. |

> **Tip:** You can supply multiple client URLs to `CLIENT_BASE_URL` by separating them with commas (e.g. `https://app.example.com,https://staging.example.com`). The first entry is treated as the default redirect location.

## Spotify dashboard setup

Update your Spotify application settings so both your production callback URL and the local development callback URL are present under **Redirect URIs**. This should include:

- Your production redirect, e.g. `https://your-domain.com/api/callback`.
- The local development redirect `http://localhost:5001/callback` (or whatever you choose for local testing).

Remember to keep these values synchronized with `SPOTIFY_REDIRECT_URI` across the client and API configuration files.

## Vercel deployment

- The API has moved to the `api/` directory so that Vercel treats it as a serverless function entry point (`api/index.js`).
- `vercel.json` defines two builds: the React client is exported as static assets from `client/build`, and the API is deployed as a Node serverless function. Routes under `/api/*` are forwarded to the API while all other routes serve the SPA entry point.
- Runtime and build-time environment variables map to Vercel project secrets using the following aliases:

  | Secret name | Injected variables |
  | --- | --- |
  | `api-base-url` | `API_BASE_URL`, `REACT_APP_API_BASE_URL` |
  | `client-base-url` | `CLIENT_BASE_URL`, `REACT_APP_CLIENT_BASE_URL` |
  | `spotify-redirect-uri` | `SPOTIFY_REDIRECT_URI`, `REACT_APP_SPOTIFY_REDIRECT_URI` |
  | `spotify-client-id` | `SPOTIFY_CLIENT_ID` |
  | `spotify-client-secret` | `SPOTIFY_CLIENT_SECRET` |

- Installing dependencies from the repository root (`npm install`) now uses npm workspaces to install both the `client` and `api` packages automatically.
