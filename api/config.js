const dotenv = require("dotenv");

dotenv.config();

const PORT = process.env.PORT || 5001;
const API_BASE_URL = process.env.API_BASE_URL || `http://localhost:${PORT}`;
const rawClientBaseUrl =
  process.env.CLIENT_BASE_URL || "http://localhost:3000";
const parsedClientBaseUrls = rawClientBaseUrl
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);
const CLIENT_BASE_URLS =
  parsedClientBaseUrls.length > 0
    ? parsedClientBaseUrls
    : ["http://localhost:3000"];
const CLIENT_BASE_URL = CLIENT_BASE_URLS[0];
const SPOTIFY_REDIRECT_URI =
  process.env.SPOTIFY_REDIRECT_URI || `${API_BASE_URL}/callback`;

module.exports = {
  PORT,
  API_BASE_URL,
  CLIENT_BASE_URL,
  CLIENT_BASE_URLS,
  SPOTIFY_REDIRECT_URI,
};
