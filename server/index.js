const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const axios = require("axios");
const serverless = require("serverless-http"); // NEW

require("dotenv").config();

const app = express();

app.use(
  cors({
    origin: "https://sptfymngr.site",
    credentials: true,
  })
);
app.use(cookieParser());
app.use(express.json());

const client_id = process.env.SPOTIFY_CLIENT_ID;
const client_secret = process.env.SPOTIFY_CLIENT_SECRET;
const redirect_uri = process.env.SPOTIFY_REDIRECT_URI;

// app.get("/login", (req, res) => {
//   const scope = "playlist-read-private user-read-email";
//   const authURL = `https://accounts.spotify.com/authorize?response_type=code&client_id=${client_id}&scope=${encodeURIComponent(
//     scope
//   )}&redirect_uri=${encodeURIComponent(redirect_uri)}`;
//   res.json({ url: authURL });
// });

app.get("/login", (req, res) => {
  const scope = "playlist-read-private user-read-email";
  const authURL = `https://accounts.spotify.com/authorize?response_type=code&client_id=${client_id}&scope=${encodeURIComponent(
    scope
  )}&redirect_uri=${encodeURIComponent(redirect_uri)}`;

  res.setHeader("Content-Type", "application/json"); // <- this helps Vercel cache right
  res.json({ url: authURL });
});

app.get("/auth/callback", async (req, res) => {
  const code = req.query.code || null;
  const response = await axios.post(
    "https://accounts.spotify.com/api/token",
    new URLSearchParams({
      grant_type: "authorization_code",
      code: code,
      redirect_uri: redirect_uri,
      client_id,
      client_secret,
    }),
    {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    }
  );

  const { access_token, refresh_token } = response.data;

  res.cookie("access_token", access_token, {
    httpOnly: true,
    secure: true,
    sameSite: "None",
  });

  res.redirect("https://sptfymngr.site/playlists");
});

app.get("/playlists", async (req, res) => {
  const access_token = req.cookies.access_token;
  try {
    const response = await axios.get(
      "https://api.spotify.com/v1/me/playlists",
      {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      }
    );
    res.json(response.data);
  } catch (error) {
    res.status(400).json({ error: "Failed to fetch playlists" });
  }
});

// ⛔️ REMOVE THIS FOR VERCEL:
// app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

// ✅ EXPORT for Vercel serverless:
module.exports = serverless(app);
