// import React, { useState, useEffect } from "react";
// import { useNavigate, useLocation } from "react-router-dom";
// import { useDrag, useDrop } from "react-dnd";

// function PlaylistComparison() {
//   const navigate = useNavigate();
//   const location = useLocation();
//   const { playlists } = location.state || { playlists: [] };

//   const [sourcePlaylist, setSourcePlaylist] = useState(playlists[0] || null);
//   const [destinationPlaylist, setDestinationPlaylist] = useState(
//     playlists[1] || null
//   );

//   // ✅ Redirect back if no playlists were selected
//   useEffect(() => {
//     if (!sourcePlaylist || !destinationPlaylist) {
//       navigate("/playlists");
//     }
//   }, [sourcePlaylist, destinationPlaylist, navigate]);

//   const handleAddTrack = async (trackUri) => {
//     try {
//       await fetch("http://localhost:5001/playlists/move-track", {
//         method: "POST",
//         credentials: "include",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           fromPlaylistId: sourcePlaylist.id,
//           toPlaylistId: destinationPlaylist.id,
//           trackUri,
//         }),
//       });

//       // Move the song visually after API success
//       const trackToMove = sourcePlaylist.tracks.items.find(
//         (track) => track.track.uri === trackUri
//       );
//       setDestinationPlaylist((prev) => ({
//         ...prev,
//         tracks: { items: [...prev.tracks.items, trackToMove] },
//       }));
//     } catch (error) {
//       console.error("Error moving track:", error);
//     }
//   };

//   const Track = ({ track, isSource }) => {
//     const [{ isDragging }, drag] = useDrag({
//       type: "track",
//       item: { uri: track.track.uri },
//       collect: (monitor) => ({
//         isDragging: monitor.isDragging(),
//       }),
//     });

//     const [{ isOver }, drop] = useDrop({
//       accept: "track",
//       drop: (item) => {
//         if (isSource) return;
//         handleAddTrack(item.uri);
//       },
//       collect: (monitor) => ({
//         isOver: monitor.isOver(),
//       }),
//     });

//     return (
//       <div
//         ref={isSource ? drag : drop}
//         style={{
//           padding: "0.5rem",
//           border: "1px solid #e2e8f0",
//           borderRadius: "0.5rem",
//           marginBottom: "0.5rem",
//           opacity: isDragging ? 0.5 : 1,
//           backgroundColor: isOver ? "#2e2e2e" : "black",
//           color: "white",
//         }}
//       >
//         <p>{track.track.name}</p>
//       </div>
//     );
//   };

//   if (!sourcePlaylist || !destinationPlaylist) {
//     return null; // Prevent crash while navigating
//   }

//   return (
//     <div
//       style={{
//         display: "flex",
//         justifyContent: "space-between",
//         padding: "2rem",
//         backgroundColor: "black",
//       }}
//     >
//       {/* Back Button */}
//       <div
//         style={{
//           position: "absolute",
//           top: "1rem",
//           left: "1rem",
//           cursor: "pointer",
//           color: "white",
//         }}
//         onClick={() => navigate("/playlists")}
//       >
//         ← Back
//       </div>

//       {/* Source Playlist */}
//       <div style={{ flex: 1, marginRight: "1rem" }}>
//         <h2 style={{ color: "white", marginBottom: "1rem" }}>
//           {sourcePlaylist.name}
//         </h2>
//         {sourcePlaylist.tracks.items.map((track) => (
//           <Track key={track.track.id} track={track} isSource={true} />
//         ))}
//       </div>

//       {/* Destination Playlist */}
//       <div style={{ flex: 1 }}>
//         <h2 style={{ color: "white", marginBottom: "1rem" }}>
//           {destinationPlaylist.name}
//         </h2>
//         {destinationPlaylist.tracks.items.map((track) => (
//           <Track key={track.track.id} track={track} isSource={false} />
//         ))}
//       </div>
//     </div>
//   );
// }

// export default PlaylistComparison;
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

function ComparisonPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const selectedPlaylists = location.state?.selectedPlaylists || [];
  const [tracks, setTracks] = useState({});

  useEffect(() => {
    fetchTracks();
  }, []);

  const fetchTracks = async () => {
    console.log("hi");

    const trackData = {};
    for (const playlist of selectedPlaylists) {
      try {
        console.log(
          `Fetching tracks for playlist: ${playlist.name} (${playlist.id})`
        ); // Log playlist name & ID
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
        console.log(`Received data for ${playlist.name}:`, data); // Log the full response

        trackData[playlist.id] = data.items || []; // Make sure we store an array, even if empty
      } catch (error) {
        console.error(`Error fetching tracks for ${playlist.name}:`, error);
        trackData[playlist.id] = [];
      }
    }
    console.log("Final track data:", trackData); // Log the final processed data
    setTracks(trackData);
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
              width: "400px",
              padding: "1rem",
              backgroundColor: "#1a1a1a",
              borderRadius: "10px",
              boxShadow: "0 0 10px rgba(0, 0, 0, 0.5)",
            }}
          >
            <img
              src={playlist.images?.[0]?.url || "/placeholder.png"}
              alt={playlist.name}
              style={{
                width: "250px",
                height: "250px",
                objectFit: "cover",
                borderRadius: "10px",
                marginBottom: "1rem",
                justifySelf: "center",
              }}
            />
            <h2
              style={{
                fontSize: "1.25rem",
                fontWeight: "bold",
                marginBottom: "1rem",
              }}
            >
              {playlist.name}
            </h2>

            {/* TRACK LIST */}
            <div
              style={{
                backgroundColor: "#1a1a1a",
                borderRadius: "10px",
                padding: "1rem",
                maxHeight: "400px",
                overflowY: "auto",
              }}
            >
              {tracks[playlist.id]?.length > 0 ? (
                tracks[playlist.id].map((track, index) => (
                  <div
                    key={track.track.id}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "1rem",
                      padding: "0.5rem 0",
                      borderBottom: "1px solid #333",
                    }}
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
