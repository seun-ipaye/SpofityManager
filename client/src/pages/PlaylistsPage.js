import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../config/env";

function PlaylistsPage() {
  const navigate = useNavigate();
  const [playlists, setPlaylists] = useState([]);
  const [selectedPlaylists, setSelectedPlaylists] = useState([]);
  const [user, setUser] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchPlaylists();
    fetchUserProfile();
  }, []);

  const fetchPlaylists = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/playlists`, {
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
      const response = await fetch(`${API_BASE_URL}/user`, {
        credentials: "include",
      });
      const data = await response.json();
      setUser(data);
    } catch (error) {
      console.error("Error fetching user profile:", error);
    }
  };

  const handlePlaylistSelect = (playlist) => {
    if (selectedPlaylists.includes(playlist)) return;

    if (selectedPlaylists.length === 1) {
      setSelectedPlaylists([...selectedPlaylists, playlist]);
      setShowModal(true); // Show confirmation popup
    } else {
      setSelectedPlaylists([playlist]);
    }
  };

  const confirmComparison = () => {
    navigate("/comparison", { state: { selectedPlaylists } });
  };

  const handleLogout = async () => {
    try {
      await fetch(`${API_BASE_URL}/logout`, {
        method: "POST",
        credentials: "include",
      });
    } catch (error) {
      console.error("Error logging out:", error);
    } finally {
      navigate("/");
    }
  };

  const cancelComparison = () => {
    setSelectedPlaylists([]);
    setShowModal(false);
  };

  return (
    <div
      style={{
        padding: "2rem",
        backgroundColor: "black",
        minHeight: "100vh",
        color: "white",
      }}
    >
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

      {user && (
        <div
          style={{
            position: "absolute",
            top: "1rem",
            right: "5rem",
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
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
          gridTemplateColumns: "repeat(4, 1fr)",
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
              border: selectedPlaylists.includes(playlist)
                ? "2px solid #1DB954"
                : "1px solid #e2e8f0",
              borderRadius: "0.5rem",
              cursor: "pointer",
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

      {showModal && (
        <div
          style={{
            position: "fixed",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            background: "#222",
            padding: "2rem",
            borderRadius: "0.5rem",
            textAlign: "center",
            zIndex: 1000,
          }}
        >
          <h3 style={{ color: "white", marginBottom: "1rem" }}>
            Do you want to compare "{selectedPlaylists[0].name}" and "
            {selectedPlaylists[1].name}"?
          </h3>
          <button
            onClick={confirmComparison}
            style={{
              backgroundColor: "#1DB954",
              color: "white",
              padding: "0.75rem 1.5rem",
              borderRadius: "0.5rem",
              fontWeight: "bold",
              cursor: "pointer",
              marginRight: "1rem",
            }}
          >
            Confirm
          </button>
          <button
            onClick={cancelComparison}
            style={{
              backgroundColor: "red",
              color: "white",
              padding: "0.75rem 1.5rem",
              borderRadius: "0.5rem",
              fontWeight: "bold",
              cursor: "pointer",
            }}
          >
            Go Back
          </button>
        </div>
      )}
    </div>
  );
}

export default PlaylistsPage;
