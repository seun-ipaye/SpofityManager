const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const SpotifyWebApi = require("spotify-web-api-node");
require("dotenv").config();

const app = express();

// Middleware
const allowedOrigins = ["http://localhost:3000", "https://www.sptfymngr.site"];

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  })
);

app.use(cookieParser());
app.use(express.json());

const spotifyApi = new SpotifyWebApi({
  clientId: process.env.SPOTIFY_CLIENT_ID,
  clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
  redirectUri: "https://spotify-manager.vercel.app/callback", // ✅ use this
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
    res.cookie("access_token", access_token, {
      httpOnly: true,
      secure: true,
      sameSite: "None",
    });
    res.cookie("refresh_token", refresh_token, {
      httpOnly: true,
      secure: true,
      sameSite: "None",
    });

    res.redirect("https://www.sptfymngr.site/playlists");
  } catch (error) {
    console.error("Error getting tokens:", error);
    res.redirect("https://www.sptfymngr.site/error");
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

// 🚀 Start Server
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
