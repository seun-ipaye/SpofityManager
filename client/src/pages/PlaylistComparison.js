import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

function ComparisonPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const selectedPlaylists = location.state?.selectedPlaylists || [];

  const [playlists, setPlaylists] = useState(selectedPlaylists);
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
          { credentials: "include" }
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
    // console.log("tracks:", trackData);
  };

  const handleSongClick = (song) => {
    setSelectedSong(song);
  };

  const handleDragStart = (e, song) => {
    e.dataTransfer.setData("songURI", song?.track.uri); // Store URI directly
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

    console.log("tracks", tracks);
    const strack = tracks[playlistId];
    console.log("strack", strack);

    // Check for duplicates
    for (const t of strack) {
      // Assuming strack is an array of track objects
      console.log("uri", t?.track?.uri);
      if (t?.track?.uri === songURI) {
        alert("This song is already in this playlist!");
        return;
      }
    }

    const encodedUri = encodeURIComponent(songURI);
    const url = `https://api.spotify.com/v1/playlists/${playlistId}/tracks?uris=${encodedUri}`;

    try {
      const tokenResponse = await fetch("http://localhost:5001/token", {
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
      fetchTracks(); // Refresh the tracks after adding
    } catch (error) {
      console.error("Failed to add track:", error);
    }
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
