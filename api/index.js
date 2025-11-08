const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const SpotifyWebApi = require("spotify-web-api-node");

const {
  PORT,
  CLIENT_BASE_URLS,
  CLIENT_BASE_URL,
  SPOTIFY_REDIRECT_URI,
} = require("./config");

const app = express();
const baseClientUrl = CLIENT_BASE_URL.replace(/\/$/, "");

// Middleware
app.use(
  cors({
    origin: CLIENT_BASE_URLS,
    credentials: true,
  })
);
app.use(cookieParser());
app.use(express.json());

const spotifyApi = new SpotifyWebApi({
  clientId: process.env.SPOTIFY_CLIENT_ID,
  clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
  redirectUri: SPOTIFY_REDIRECT_URI,
});

// Get stored access token
app.get("/token", (req, res) => {
  const accessToken = req.cookies.access_token;
  if (!accessToken) {
    return res.status(401).json({ error: "Access token not found" });
  }
  res.json({ access_token: accessToken });
});

// 🔑 Login Endpoint - Redirects user to Spotify Auth
app.get("/login", (req, res) => {
  const scopes = [
    "playlist-read-private",
    "playlist-read-collaborative",
    "playlist-modify-public",
    "playlist-modify-private",
    "user-read-private",
    "user-read-email",
  ];
  const authorizeURL = spotifyApi.createAuthorizeURL(scopes);
  res.json({ url: authorizeURL });
});

// 🔄 Callback Endpoint - Handles Token Exchange
app.get("/callback", async (req, res) => {
  const { code } = req.query;

  try {
    const data = await spotifyApi.authorizationCodeGrant(code);
    const { access_token, refresh_token } = data.body;

    // Store tokens in HTTP-only cookies
    res.cookie("access_token", access_token, { httpOnly: true });
    res.cookie("refresh_token", refresh_token, { httpOnly: true });

    res.redirect(`${baseClientUrl}/playlists`);
  } catch (error) {
    console.error("Error getting tokens:", error);
    res.redirect(`${baseClientUrl}/error`);
  }
});

// 🎵 Get User's Playlists
app.get("/playlists", async (req, res) => {
  const accessToken = req.cookies.access_token;
  spotifyApi.setAccessToken(accessToken);

  try {
    const data = await spotifyApi.getUserPlaylists();
    res.json(data.body);
  } catch (error) {
    console.error("Error getting playlists:", error);
    res.status(500).json({ error: "Failed to fetch playlists" });
  }
});

// 🎶 Get Tracks from a Playlist
app.get("/playlist/:playlistId/tracks", async (req, res) => {
  const { playlistId } = req.params;
  const accessToken = req.cookies.access_token;
  spotifyApi.setAccessToken(accessToken);

  try {
    const data = await spotifyApi.getPlaylistTracks(playlistId);
    res.json(data.body);
  } catch (error) {
    console.error("Error getting playlist tracks:", error);
    res.status(500).json({ error: "Failed to fetch playlist tracks" });
  }
});

// ➕ Add Track to a Playlist
app.post("/playlists/:playlistId/tracks", async (req, res) => {
  const { playlistId } = req.params;
  const { trackUri } = req.body;
  const accessToken = req.cookies.access_token;
  spotifyApi.setAccessToken(accessToken);

  try {
    await spotifyApi.addTracksToPlaylist(playlistId, [trackUri]);
    res.json({ success: true });
  } catch (error) {
    console.error("Error adding track:", error);
    res.status(500).json({ error: "Failed to add track" });
  }
});

// 🚪 Logout Endpoint
app.post("/logout", (req, res) => {
  res.clearCookie("access_token");
  res.clearCookie("refresh_token");
  res.status(200).json({ message: "Logged out successfully" });
});

// Helper to refresh access token using stored refresh token
async function refreshAccessToken(req, res) {
  const refreshToken = req.cookies.refresh_token;
  if (!refreshToken) {
    return { error: "Session expired. Please log in again." };
  }

  try {
    spotifyApi.setRefreshToken(refreshToken);
    const { body } = await spotifyApi.refreshAccessToken();
    const newAccessToken = body.access_token;
    res.cookie("access_token", newAccessToken, { httpOnly: true });
    spotifyApi.setAccessToken(newAccessToken);
    return { accessToken: newAccessToken };
  } catch (error) {
    console.error("Error refreshing access token:", error);
    return { error: "Failed to refresh access token." };
  }
}

// 👤 Get current Spotify user profile
app.get("/user", async (req, res) => {
  const accessToken = req.cookies.access_token;

  if (!accessToken) {
    return res.status(401).json({ error: "Access token not found" });
  }

  spotifyApi.setAccessToken(accessToken);

  try {
    const { body } = await spotifyApi.getMe();
    return res.json(body);
  } catch (error) {
    if (error.statusCode === 401) {
      const refreshed = await refreshAccessToken(req, res);
      if (refreshed.error) {
        return res.status(401).json({ error: refreshed.error });
      }

      try {
        const { body } = await spotifyApi.getMe();
        return res.json(body);
      } catch (retryError) {
        console.error("Error fetching user after token refresh:", retryError);
        return res
          .status(500)
          .json({ error: "Failed to fetch user profile. Please try again." });
      }
    }

    console.error("Error getting user profile:", error);
    return res
      .status(500)
      .json({ error: "Failed to fetch user profile. Please try again." });
  }
});

// 🚀 Start Server (only when running this file directly)
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

module.exports = app;

