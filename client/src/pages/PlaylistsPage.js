// client/src/pages/PlaylistsPage.js
import React, { useState, useEffect } from "react";

function PlaylistsPage() {
  const [playlists, setPlaylists] = useState([]);
  const [selectedPlaylists, setSelectedPlaylists] = useState([]);

  useEffect(() => {
    fetchPlaylists();
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

  const handlePlaylistSelect = (playlist) => {
    if (selectedPlaylists.length < 2 && !selectedPlaylists.includes(playlist)) {
      setSelectedPlaylists((prev) => [...prev, playlist]);
    }
  };

  return (
    <div style={{ padding: "2rem" }}>
      {selectedPlaylists.length < 2 ? (
        <div>
          <h2
            style={{
              fontSize: "1.5rem",
              fontWeight: "bold",
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
                  ":hover": {
                    backgroundColor: "#f8f8f8",
                  },
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

                <h3 style={{ fontWeight: "bold", marginBottom: "0.25rem" }}>
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
        <div>
          <h2
            style={{
              fontSize: "1.5rem",
              fontWeight: "bold",
              marginBottom: "1rem",
            }}
          >
            playlists are selected
          </h2>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: "1rem",
            }}
          >
            assume the drag drop
          </div>
        </div>
      )}
    </div>
  );
}

export default PlaylistsPage;
