const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const SpotifyWebApi = require("spotify-web-api-node");
require("dotenv").config();

const app = express();

// Middleware
const allowedOrigins = [
  "http://localhost:3000",
  process.env.FRONTEND_URL,
].filter(Boolean);

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  }),
);

app.use(cookieParser());
app.use(express.json());

const spotifyApi = new SpotifyWebApi({
  clientId: process.env.SPOTIFY_CLIENT_ID,
  clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
  redirectUri: process.env.SPOTIFY_REDIRECT_URI,
});
console.log("SPOTIFY_CLIENT_ID:", process.env.SPOTIFY_CLIENT_ID);

// Get stored access token
app.get("/token", (req, res) => {
  const accessToken = req.cookies.access_token;
  if (!accessToken) {
    return res.status(401).json({ error: "Access token not found" });
  }
  res.json({ access_token: accessToken });
});

// 🔑 Login Endpoint - Redirects user to Spotify Auth
// Update your /login endpoint
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
  res.redirect(authorizeURL); // ⬅️ redirect instead of res.json
});

app.use((req, res, next) => {
  console.log("Incoming Origin:", req.headers.origin);
  console.log("Request Headers:", req.headers);
  next();
});

// 🔄 Callback Endpoint - Handles Token Exchange
// 🔄 Callback Endpoint - Handles Token Exchange
app.get("/callback", async (req, res) => {
  const { code } = req.query;

  try {
    const data = await spotifyApi.authorizationCodeGrant(code);
    const { access_token, refresh_token } = data.body;

    // ✅ IMPORTANT: include path "/" so cookies apply site-wide and can be cleared later
    const cookieOptions = {
      httpOnly: true,
      secure: true,
      sameSite: "None",
      path: "/",
    };

    res.cookie("access_token", access_token, cookieOptions);
    res.cookie("refresh_token", refresh_token, cookieOptions);

    // Redirect back to frontend route
    res.redirect("/playlists");
  } catch (error) {
    console.error("Error getting tokens:", error);
    res.redirect("/");
  }
});

// 🎵 Get User's Playlists
app.get("/playlists", async (req, res) => {
  const accessToken = req.cookies.access_token;

  // ✅ If no cookie, user is logged out
  if (!accessToken) {
    return res.status(401).json({ error: "Not logged in" });
  }

  spotifyApi.setAccessToken(accessToken);

  try {
    const data = await spotifyApi.getUserPlaylists();
    return res.json(data.body);
  } catch (error) {
    const status = error?.statusCode || error?.status;

    // ✅ If token expired/invalid, treat as logged out
    if (status === 401) {
      return res.status(401).json({ error: "Token expired or invalid" });
    }

    console.error("Error getting playlists:", error);
    return res.status(500).json({ error: "Failed to fetch playlists" });
  }
});

// 🎶 Get Tracks from a Playlist
app.get("/playlist/:playlistId/tracks", async (req, res) => {
  const { playlistId } = req.params;
  const accessToken = req.cookies.access_token;

  if (!accessToken) {
    return res.status(401).json({ error: "Not logged in" });
  }

  spotifyApi.setAccessToken(accessToken);

  try {
    const data = await spotifyApi.getPlaylistTracks(playlistId);
    return res.json(data.body);
  } catch (error) {
    const status = error?.statusCode || error?.status;

    if (status === 401) {
      return res.status(401).json({ error: "Token expired or invalid" });
    }

    console.error("Error getting playlist tracks:", error);
    return res.status(500).json({ error: "Failed to fetch playlist tracks" });
  }
});

// ➕ Add Track to a Playlist
app.post("/playlists/:playlistId/tracks", async (req, res) => {
  const { playlistId } = req.params;
  const { trackUri } = req.body;
  const accessToken = req.cookies.access_token;

  if (!accessToken) {
    return res.status(401).json({ error: "Not logged in" });
  }

  if (!trackUri) {
    return res.status(400).json({ error: "Missing trackUri" });
  }

  spotifyApi.setAccessToken(accessToken);

  try {
    await spotifyApi.addTracksToPlaylist(playlistId, [trackUri]);
    return res.json({ success: true });
  } catch (error) {
    const status = error?.statusCode || error?.status;

    if (status === 401) {
      return res.status(401).json({ error: "Token expired or invalid" });
    }

    console.error("Error adding track:", error);
    return res.status(500).json({ error: "Failed to add track" });
  }
});

// 🚪 Logout Endpoint
app.post("/logout", (req, res) => {
  const cookieOptions = {
    httpOnly: true,
    secure: true, // must be true on HTTPS
    sameSite: "None", // required for cross-site cookies (Vercel/Render split)
    path: "/", // must match what you used when setting
    // domain: ".yourdomain.com" // ONLY if you set a domain originally
  };

  res.clearCookie("access_token", cookieOptions);
  res.clearCookie("refresh_token", cookieOptions);

  return res.status(200).json({ message: "Logged out successfully" });
});

// 🚀 Start Server
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
