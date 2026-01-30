import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

function ComparisonPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const selectedPlaylists = location.state?.selectedPlaylists || [];
  const API_BASE = "http://127.0.0.1:5001";

  const [playlists, setPlaylists] = useState(selectedPlaylists);
  const [tracks, setTracks] = useState({});
  const [selectedSong, setSelectedSong] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [showDuplicateModal, setShowDuplicateModal] = useState(false);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [songToDelete, setSongToDelete] = useState(null);
  const [playlistToDeleteFrom, setPlaylistToDeleteFrom] = useState(null);

  useEffect(() => {
    fetchTracks();
  }, []);

  const fetchTracks = async () => {
    const trackData = {};
    for (const playlist of selectedPlaylists) {
      try {
        const response = await fetch(
          `${API_BASE}/playlist/${playlist.id}/tracks`,
          { credentials: "include" },
        );
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        trackData[playlist.id] = data.items || [];
      } catch (error) {
        trackData[playlist.id] = [];
      }
    }
    setTracks(trackData);
  };

  const deleteSong = async (playlistId, trackUri) => {
    const url = `https://api.spotify.com/v1/playlists/${playlistId}/tracks`;

    try {
      const tokenResponse = await fetch("http://127.0.0.1:5001/token", {
        credentials: "include",
      });
      const tokenData = await tokenResponse.json();
      if (!tokenResponse.ok) {
        throw new Error(`Failed to fetch token: ${JSON.stringify(tokenData)}`);
      }

      const accessToken = tokenData.access_token;

      const requestBody = {
        tracks: [{ uri: trackUri }],
      };

      const response = await fetch(url, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Error removing track: ${JSON.stringify(errorData)}`);
      }

      console.log("Track removed successfully");
      fetchTracks();
    } catch (error) {
      console.error("Failed to remove track:", error);
      alert("Failed to remove track. Please try again.");
    }
  };

  const handleSongClick = (song) => {
    setSelectedSong(song);
  };

  const handleDragStart = (e, song) => {
    e.dataTransfer.setData("songURI", song?.track.uri);
    e.target.style.border = "2px solid green";
  };

  const handleDragEnd = (e) => {
    e.target.style.border = "";
  };

  const handleDrop = async (e, playlistId) => {
    e.preventDefault();
    const songURI = e.dataTransfer.getData("songURI");
    if (!songURI) {
      console.error("No song URI found for drop event.");
      return;
    }

    const strack = tracks[playlistId];

    // Check for duplicates
    for (const t of strack) {
      if (t?.track?.uri === songURI) {
        setShowDuplicateModal(true);
        return;
      }
    }

    const encodedUri = encodeURIComponent(songURI);
    const url = `https://api.spotify.com/v1/playlists/${playlistId}/tracks?uris=${encodedUri}`;

    try {
      const tokenResponse = await fetch("http://127.0.0.1:5001/token", {
        credentials: "include",
      });
      const tokenData = await tokenResponse.json();
      if (!tokenResponse.ok) {
        throw new Error(`Failed to fetch token: ${JSON.stringify(tokenData)}`);
      }

      const accessToken = tokenData.access_token;

      const response = await fetch(url, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Error adding tracks: ${JSON.stringify(errorData)}`);
      }

      console.log("Track added successfully:", await response.json());
      fetchTracks();
    } catch (error) {
      console.error("Failed to add track:", error);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const toggleEditMode = () => {
    setIsEditing(!isEditing);
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
        onClick={() => navigate("/playlists")}
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
        ← Back
      </button>

      <button
        onClick={toggleEditMode}
        style={{
          position: "absolute",
          top: "1rem",
          right: "1rem",
          background: isEditing ? "#1DB954" : "transparent",
          border: "none",
          cursor: "pointer",
          fontSize: "1rem",
          color: "white",
          padding: "0.5rem 1rem",
          borderRadius: "20px",
          display: "flex",
          alignItems: "center",
          gap: "0.5rem",
        }}
      >
        {isEditing ? (
          <>
            <span>Done</span>
          </>
        ) : (
          <>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="currentColor"
              viewBox="0 0 16 16"
            >
              <path d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168l10-10zM11.207 2.5 13.5 4.793 14.793 3.5 12.5 1.207 11.207 2.5zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.293l6.5-6.5zm-9.761 5.175-.106.106-1.528 3.821 3.821-1.528.106-.106A.5.5 0 0 1 5 12.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.468-.325z" />
            </svg>
            <span>Edit</span>
          </>
        )}
      </button>

      <h1 style={{ fontSize: "2rem", fontWeight: "bold", textAlign: "center" }}>
        Playlist Comparison
      </h1>

      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: "4rem",
          marginTop: "2rem",
        }}
      >
        {playlists.map((playlist) => (
          <div
            key={playlist.id}
            style={{
              textAlign: "center",
              width: "500px",
              border: "1px solid #333",
              borderRadius: "10px",
              padding: "1rem",
            }}
            onDrop={(e) => handleDrop(e, playlist.id)}
            onDragOver={handleDragOver}
          >
            <img
              src={playlist.images?.[0]?.url || "/placeholder.png"}
              alt={playlist.name}
              style={{
                width: "250px",
                height: "250px",
                objectFit: "cover",
                borderRadius: "10px",
                justifySelf: "center",
              }}
            />
            <h2 style={{ marginTop: "1rem" }}>{playlist.name}</h2>

            <div
              style={{
                marginTop: "1rem",
                backgroundColor: "#1a1a1a",
                borderRadius: "10px",
                padding: "1rem",
                maxHeight: "400px",
                overflowY: "auto",
              }}
            >
              {tracks[playlist.id]?.length > 0 ? (
                tracks[playlist.id].map((track) => (
                  <div
                    key={track.track.id}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "1rem",
                      padding: "0.5rem 0",
                      borderBottom: "1px solid #333",
                      border:
                        selectedSong?.track.id === track.track.id
                          ? "2px solid green"
                          : "none",
                      position: "relative",
                    }}
                    onClick={(e) => {
                      // Only handle song selection if not in edit mode
                      if (!isEditing) handleSongClick(track);
                    }}
                    draggable
                    onDragStart={(e) => handleDragStart(e, track)}
                    onDragEnd={handleDragEnd}
                  >
                    {isEditing && (
                      <div
                        onClick={(e) => {
                          e.stopPropagation();
                          setSongToDelete(track);
                          setPlaylistToDeleteFrom(playlist.id);
                          setShowDeleteModal(true);
                        }}
                        style={{
                          position: "absolute",
                          top: "-5px",
                          left: "-5px",
                          width: "15px",
                          height: "15px",
                          backgroundColor: "red",
                          borderRadius: "50%",
                          border: "2px solid white",
                          cursor: "pointer",
                          zIndex: 1,
                          ":hover": {
                            transform: "scale(1.2)",
                          },
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.transform = "scale(1.2)";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.transform = "scale(1)";
                        }}
                      />
                    )}
                    <img
                      src={
                        track.track.album.images?.[0]?.url || "/placeholder.png"
                      }
                      alt={track.track.name}
                      style={{
                        width: "50px",
                        height: "50px",
                        borderRadius: "5px",
                      }}
                    />
                    <div style={{ flex: 1 }}>
                      <p
                        style={{
                          fontSize: "1rem",
                          fontWeight: "bold",
                          margin: 0,
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {track.track.name}
                      </p>
                      <p
                        style={{
                          fontSize: "0.875rem",
                          color: "#b3b3b3",
                          margin: 0,
                        }}
                      >
                        {track.track.artists
                          .map((artist) => artist.name)
                          .join(", ")}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <p style={{ color: "#b3b3b3", fontStyle: "italic" }}>
                  No tracks found
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
      {showDeleteModal && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0,0,0,0.7)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1000,
          }}
        >
          <div
            style={{
              backgroundColor: "#282828",
              padding: "2rem",
              borderRadius: "8px",
              width: "300px",
              textAlign: "center",
            }}
          >
            <h3 style={{ marginBottom: "1rem" }}>
              Delete "{songToDelete?.track.name}"?
            </h3>
            <p style={{ color: "#b3b3b3", marginBottom: "2rem" }}>
              This will remove the song from the playlist
            </p>
            <div
              style={{ display: "flex", justifyContent: "center", gap: "1rem" }}
            >
              <button
                onClick={() => setShowDeleteModal(false)}
                style={{
                  padding: "0.5rem 1rem",
                  borderRadius: "20px",
                  border: "none",
                  background: "transparent",
                  color: "white",
                  cursor: "pointer",
                }}
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  deleteSong(playlistToDeleteFrom, songToDelete.track.uri);
                  setShowDeleteModal(false);
                }}
                style={{
                  padding: "0.5rem 1rem",
                  borderRadius: "20px",
                  border: "none",
                  background: "#e22134",
                  color: "white",
                  cursor: "pointer",
                }}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
      {showDuplicateModal && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0,0,0,0.7)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1000,
          }}
        >
          <div
            style={{
              backgroundColor: "#282828",
              padding: "2rem",
              borderRadius: "8px",
              width: "300px",
              textAlign: "center",
            }}
          >
            <h3 style={{ marginBottom: "1rem" }}>
              This song is already in this playlist!
            </h3>

            <div
              style={{ display: "flex", justifyContent: "center", gap: "1rem" }}
            >
              <button
                onClick={() => setShowDuplicateModal(false)}
                style={{
                  padding: "0.5rem 1rem",
                  borderRadius: "20px",
                  border: "none",
                  background: "#5b5b5b",
                  color: "white",
                  cursor: "pointer",
                }}
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ComparisonPage;
