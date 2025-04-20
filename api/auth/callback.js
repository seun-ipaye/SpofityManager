import axios from "axios";

const client_id = process.env.SPOTIFY_CLIENT_ID;
const client_secret = process.env.SPOTIFY_CLIENT_SECRET;
const redirect_uri = process.env.SPOTIFY_REDIRECT_URI;

export default async function handler(req, res) {
  const code = req.query.code;

  try {
    const response = await axios.post(
      "https://accounts.spotify.com/api/token",
      new URLSearchParams({
        grant_type: "authorization_code",
        code: code,
        redirect_uri,
        client_id,
        client_secret,
      }),
      {
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
      }
    );

    const { access_token } = response.data;

    res.setHeader(
      "Set-Cookie",
      `access_token=${access_token}; HttpOnly; Path=/; SameSite=None; Secure`
    );
    res.writeHead(302, { Location: "https://sptfymngr.site/playlists" });
    res.end();
  } catch (error) {
    res.status(400).json({ error: "Token exchange failed" });
  }
}
