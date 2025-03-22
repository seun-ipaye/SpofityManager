import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function PlaylistsPage() {
  const navigate = useNavigate();
  const [playlists, setPlaylists] = useState([]);
  const [selectedPlaylists, setSelectedPlaylists] = useState([]);
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetchPlaylists();
    fetchUserProfile();
  }, []);

  const fetchPlaylists = async () => {
    try {
      const response = await fetch("http://localhost:5001/playlists", {
        credentials: "include",
      });
      const data = await response.json();
      setPlaylists(data.items);
    } catch (error) {
      console.error("Error fetching playlists:", error);
    }
  };

  const fetchUserProfile = async () => {
    try {
      const response = await fetch("http://localhost:5001/user", {
        credentials: "include",
      });
      const data = await response.json();
      setUser(data);
    } catch (error) {
      console.error("Error fetching user profile:", error);
    }
  };

  const handlePlaylistSelect = (playlist) => {
    if (selectedPlaylists.length < 2 && !selectedPlaylists.includes(playlist)) {
      setSelectedPlaylists((prev) => [...prev, playlist]);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch("http://localhost:5001/logout", {
        method: "POST",
        credentials: "include",
      });

      document.cookie.split(";").forEach((c) => {
        document.cookie = c
          .replace(/^ +/, "")
          .replace(/=.*/, `=;expires=${new Date().toUTCString()};path=/`);
      });

      navigate("/");
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  return (
    <div
      style={{
        padding: "2rem",
        position: "relative",
        backgroundColor: "black",
        minHeight: "100vh",
        color: "white",
      }}
    >
      {/* Back Button */}
      <button
        onClick={() => navigate("/")}
        style={{
          position: "absolute",
          top: "1rem",
          left: "1rem",
          background: "transparent",
          border: "none",
          cursor: "pointer",
          fontSize: "1.5rem",
          color: "white",
        }}
      >
        ←
      </button>

      {/* Logout Button */}
      <button
        onClick={handleLogout}
        style={{
          position: "absolute",
          top: "1rem",
          right: "1rem",
          backgroundColor: "red",
          color: "white",
          border: "none",
          padding: "0.5rem 1rem",
          borderRadius: "0.5rem",
          cursor: "pointer",
        }}
      >
        Logout
      </button>

      {/* User Profile */}
      {user && (
        <div
          style={{
            position: "absolute",
            top: "1rem",
            right: "5rem",
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            color: "white",
          }}
        >
          <img
            src={user.images?.[0]?.url || "/placeholder.png"}
            alt="User Avatar"
            style={{
              width: "40px",
              height: "40px",
              borderRadius: "50%",
              border: "2px solid white",
            }}
          />
          <span>{user.display_name}</span>
        </div>
      )}

      {selectedPlaylists.length < 2 ? (
        <div>
          <h2
            style={{
              fontSize: "1.5rem",
              fontWeight: "bold",
              color: "white",
              marginBottom: "1rem",
            }}
          >
            Select two playlists to compare
          </h2>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(2, 1fr)",
              gap: "1rem",
            }}
          >
            {playlists.map((playlist) => (
              <div
                key={playlist.id}
                onClick={() => handlePlaylistSelect(playlist)}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  padding: "1rem",
                  border: "1px solid #e2e8f0",
                  borderRadius: "0.5rem",
                  cursor: "pointer",
                  transition: "background-color 0.2s",
                  backgroundColor: "rgb(15, 15, 15)",
                }}
              >
                <img
                  src={playlist.images?.[0]?.url || "/placeholder.png"}
                  alt={playlist.name}
                  style={{
                    width: "100%",
                    aspectRatio: "1 / 1",
                    objectFit: "cover",
                    marginBottom: "0.5rem",
                  }}
                />
                <h3
                  style={{
                    fontWeight: "bold",
                    marginBottom: "0.25rem",
                    color: "white",
                  }}
                >
                  {playlist.name}
                </h3>
                <p style={{ fontSize: "0.875rem", color: "#64748b" }}>
                  {playlist.tracks.total} tracks
                </p>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div style={{ marginTop: "2rem" }}>
          <h2
            style={{ fontSize: "1.5rem", fontWeight: "bold", color: "white" }}
          >
            Ready to compare!
          </h2>
          <button
            onClick={() =>
              navigate("/comparison", { state: { selectedPlaylists } })
            }
            style={{
              backgroundColor: "#1DB954",
              color: "white",
              padding: "0.75rem 1.5rem",
              borderRadius: "0.5rem",
              fontSize: "1rem",
              fontWeight: "bold",
              cursor: "pointer",
              marginTop: "1rem",
              border: "none",
            }}
          >
            Compare Playlists
          </button>
        </div>
      )}
    </div>
  );
}

export default PlaylistsPage;
