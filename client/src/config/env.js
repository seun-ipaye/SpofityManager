const trimTrailingSlash = (value) => value.replace(/\/$/, "");

const apiBaseFallback = "http://localhost:5001";
const clientBaseFallback = "http://localhost:3000";

const API_BASE_URL = trimTrailingSlash(
  process.env.REACT_APP_API_BASE_URL || apiBaseFallback
);

const CLIENT_BASE_URL = trimTrailingSlash(
  process.env.REACT_APP_CLIENT_BASE_URL || clientBaseFallback
);

const SPOTIFY_REDIRECT_URI =
  process.env.REACT_APP_SPOTIFY_REDIRECT_URI || `${API_BASE_URL}/callback`;

export { API_BASE_URL, CLIENT_BASE_URL, SPOTIFY_REDIRECT_URI };
