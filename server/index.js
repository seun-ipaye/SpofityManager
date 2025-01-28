// server/index.js
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const SpotifyWebApi = require("spotify-web-api-node");
require("dotenv").config();

const app = express();

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);
app.use(cookieParser());
app.use(express.json());

const spotifyApi = new SpotifyWebApi({
  clientId: process.env.SPOTIFY_CLIENT_ID,
  clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
  redirectUri: "http://localhost:3000/callback",
});

// Login endpoint
app.get("/login", (req, res) => {
  const scopes = [
    "playlist-read-private",
    "playlist-read-collaborative",
    "playlist-modify-public",
    "playlist-modify-private",
  ];

  const authorizeURL = spotifyApi.createAuthorizeURL(scopes);
  res.json({ url: authorizeURL });
});

// Callback endpoint
app.get("/callback", async (req, res) => {
  const { code } = req.query;

  try {
    const data = await spotifyApi.authorizationCodeGrant(code);
    const { access_token, refresh_token } = data.body;

    // Store tokens in cookie
    res.cookie("access_token", access_token, { httpOnly: true });
    res.cookie("refresh_token", refresh_token, { httpOnly: true });

    res.redirect("http://localhost:3000/playlists");
  } catch (error) {
    console.error("Error getting tokens:", error);
    res.redirect("http://localhost:3000/error");
  }
});

// Get user's playlists
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

// Add track to playlist
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

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
