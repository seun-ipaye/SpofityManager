import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

function ComparisonPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const selectedPlaylists = location.state?.selectedPlaylists || [];
  const [tracks, setTracks] = useState({});
  const [selectedSong, setSelectedSong] = useState(null);

  useEffect(() => {
    fetchTracks();
  }, []);

  const fetchTracks = async () => {
    const trackData = {};
    for (const playlist of selectedPlaylists) {
      try {
        const response = await fetch(
          `http://localhost:5001/playlist/${playlist.id}/tracks`,
          {
            credentials: "include",
          }
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

  const handleSongClick = (song) => {
    setSelectedSong(song);
  };

  const handleDragStart = (e, song) => {
    e.dataTransfer.setData("song", JSON.stringify(song));
    e.target.style.border = "2px solid green"; // Add green border on drag
  };

  const handleDragEnd = (e) => {
    e.target.style.border = ""; // Remove green border after drag
  };

  const handleDrop = (e, targetPlaylistId) => {
    e.preventDefault();
    const songData = e.dataTransfer.getData("song");
    const song = JSON.parse(songData);
    if (!song) return;

    // Add the song to the target playlist
    const updatedTracks = { ...tracks };
    updatedTracks[targetPlaylistId] = [
      ...(updatedTracks[targetPlaylistId] || []),
      song,
    ];

    // Update the state
    setTracks(updatedTracks);

    // Optionally, make an API call to add the track to the playlist on the server
    // Example:
    // fetch(`http://localhost:5001/playlists/${targetPlaylistId}/tracks`, {
    //   method: "POST",
    //   headers: {
    //     "Content-Type": "application/json",
    //   },
    //   body: JSON.stringify({ trackUri: song.track.uri }),
    //   credentials: "include",
    // });
  };

  const handleDragOver = (e) => {
    e.preventDefault();
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
      {/* BACK BUTTON */}
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

      {/* PAGE TITLE */}
      <h1 style={{ fontSize: "2rem", fontWeight: "bold", textAlign: "center" }}>
        Playlist Comparison
      </h1>

      {/* PLAYLISTS DISPLAY */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: "4rem",
          marginTop: "2rem",
        }}
      >
        {selectedPlaylists.map((playlist) => (
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
                          : "none", // Highlight selected song
                    }}
                    onClick={() => handleSongClick(track)}
                    draggable
                    onDragStart={(e) => handleDragStart(e, track)}
                    onDragEnd={handleDragEnd}
                  >
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
    </div>
  );
}

export default ComparisonPage;
