import axios from "axios";
import cookie from "cookie";

export default async function handler(req, res) {
  const cookies = cookie.parse(req.headers.cookie || "");
  const access_token = cookies.access_token;

  if (!access_token) {
    return res.status(401).json({ error: "Not authenticated" });
  }

  try {
    const response = await axios.get(
      "https://api.spotify.com/v1/me/playlists",
      {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      }
    );
    res.status(200).json(response.data);
  } catch (error) {
    res.status(400).json({ error: "Failed to fetch playlists" });
  }
}
