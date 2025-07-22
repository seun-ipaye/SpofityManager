import { useEffect, useState } from "react";
import axios from "axios";

function App() {
  const [user, setUser] = useState(null);
  const [isHovered, setIsHovered] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [playlists, setPlaylists] = useState([]);

  useEffect(() => {
    axios
      .get("https://spofitymanager.onrender.com/api/me", {
        withCredentials: true,
      })
      .then((res) => {
        setUser(res.data);
        fetchPlaylists();
      })
      .catch(() => console.log("User not logged in"));
  }, []);

  const fetchPlaylists = async () => {
    try {
      const res = await axios.get(
        "https://spofitymanager.onrender.com/api/playlists",
        { withCredentials: true }
      );
      setPlaylists(res.data.items || []);
    } catch (err) {
      console.error("Error fetching playlists:", err);
    }
  };

  const handleLogin = () => {
    setIsLoading(true);
    window.location.href = "https://spofitymanager.onrender.com/api/login";
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "black",
        color: "white",
        minHeight: "100vh",
        textAlign: "center",
        padding: "2rem",
      }}
    >
      {!user ? (
        <>
          <h1
            style={{
              fontSize: "2rem",
              fontWeight: "bold",
              marginBottom: "1rem",
            }}
          >
            Edit Your Playlists!
          </h1>
          <p style={{ fontSize: "1.125rem", marginBottom: "1.5rem" }}>
            Dont modify your Spotify playlists
          </p>
          <button
            onClick={handleLogin}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            style={{
              backgroundColor: isHovered ? "green" : "white",
              color: isHovered ? "white" : "black",
              transform: isHovered ? "scale(1.05)" : "scale(1)",
              transition: "all 0.2s ease-in-out",
              padding: "0.5rem 1.5rem",
              border: "none",
              borderRadius: "0.5rem",
              cursor: isLoading ? "not-allowed" : "pointer",
              opacity: isLoading ? 0.5 : 1,
            }}
            disabled={isLoading}
          >
            {isLoading ? "Connecting..." : "Connect Your Spotify"}
          </button>
        </>
      ) : (
        <>
          <h2
            style={{
              fontSize: "1.5rem",
              fontWeight: "bold",
              marginBottom: "1rem",
            }}
          >
            {user.display_name}'s Playlists
          </h2>
          <ul style={{ listStyle: "none", padding: 0, maxWidth: "600px" }}>
            {playlists.map((playlist) => (
              <li
                key={playlist.id}
                style={{
                  backgroundColor: "#1e1e1e",
                  padding: "1rem",
                  borderRadius: "0.5rem",
                  marginBottom: "0.75rem",
                  textAlign: "left",
                }}
              >
                <strong>{playlist.name}</strong>
                <p style={{ color: "#aaa", fontSize: "0.875rem" }}>
                  {playlist.tracks.total} tracks
                </p>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}

export default App;
