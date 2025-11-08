const dotenv = require("dotenv");

dotenv.config();

const PORT = process.env.PORT || 5001;
const API_BASE_URL = process.env.API_BASE_URL || `http://localhost:${PORT}`;
const defaultClientOrigins = [
  "http://localhost:3000",
  "https://spofitymanager.vercel.app",
];

const rawClientBaseUrl =
  process.env.CLIENT_BASE_URL || defaultClientOrigins.join(",");
const parsedClientBaseUrls = rawClientBaseUrl
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);
const CLIENT_BASE_URLS =
  parsedClientBaseUrls.length > 0
    ? parsedClientBaseUrls
    : defaultClientOrigins;
const CLIENT_BASE_URL = CLIENT_BASE_URLS[0];
const COOKIE_DOMAIN = (() => {
  if (process.env.COOKIE_DOMAIN) {
    return process.env.COOKIE_DOMAIN;
  }

  try {
    return new URL(CLIENT_BASE_URL).hostname;
  } catch (error) {
    return undefined;
  }
})();
const SPOTIFY_REDIRECT_URI =
  process.env.SPOTIFY_REDIRECT_URI || `${API_BASE_URL}/callback`;

module.exports = {
  PORT,
  API_BASE_URL,
  CLIENT_BASE_URL,
  CLIENT_BASE_URLS,
  COOKIE_DOMAIN,
  SPOTIFY_REDIRECT_URI,
};
