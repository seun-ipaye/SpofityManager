const express = require("express");
const axios = require("axios");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
const querystring = require("querystring");

dotenv.config();

const app = express();
app.use(cookieParser());

const {
  SPOTIFY_CLIENT_ID,
  SPOTIFY_CLIENT_SECRET,
  SPOTIFY_REDIRECT_URI,
  FRONTEND_URI,
} = process.env;

const generateRandomString = (length) => {
  const possible =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  return Array.from({ length }, () =>
    possible.charAt(Math.floor(Math.random() * possible.length))
  ).join("");
};

// /api/login
app.get("/api/login", (req, res) => {
  const state = generateRandomString(16);
  const scope =
    "playlist-read-private playlist-modify-private playlist-modify-public";

  const queryParams = querystring.stringify({
    response_type: "code",
    client_id: SPOTIFY_CLIENT_ID,
    scope: scope,
    redirect_uri: SPOTIFY_REDIRECT_URI,
    state: state,
  });

  res.redirect(`https://accounts.spotify.com/authorize?${queryParams}`);
});

// /api/callback
app.get("/api/callback", async (req, res) => {
  const code = req.query.code || null;

  try {
    const tokenRes = await axios.post(
      "https://accounts.spotify.com/api/token",
      querystring.stringify({
        code: code,
        redirect_uri: SPOTIFY_REDIRECT_URI,
        grant_type: "authorization_code",
      }),
      {
        headers: {
          Authorization:
            "Basic " +
            Buffer.from(
              SPOTIFY_CLIENT_ID + ":" + SPOTIFY_CLIENT_SECRET
            ).toString("base64"),
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );

    const { access_token, refresh_token } = tokenRes.data;

    // Set as HTTP-only cookies
    res.cookie("access_token", access_token, {
      httpOnly: true,
      secure: true,
      sameSite: "Strict",
      maxAge: 3600 * 1000,
    });
    res.cookie("refresh_token", refresh_token, {
      httpOnly: true,
      secure: true,
      sameSite: "Strict",
    });

    res.redirect(`${FRONTEND_URI}`);
  } catch (error) {
    console.error(error);
    res.send("Error retrieving access token");
  }
});

// Optional: Add a test route to check token
app.get("/api/me", async (req, res) => {
  const accessToken = req.cookies.access_token;
  if (!accessToken) return res.status(401).json({ error: "Unauthorized" });

  try {
    const me = await axios.get("https://api.spotify.com/v1/me", {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    res.json(me.data);
  } catch (err) {
    res.status(400).json({ error: "Failed to fetch user" });
  }
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));
