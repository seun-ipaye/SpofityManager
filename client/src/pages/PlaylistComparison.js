// client/src/pages/PlaylistComparison.js
import React from "react";
import { useNavigate } from "react-router-dom";

function PlaylistComparison({ playlists }) {
  const navigate = useNavigate();

  return (
    <div style={{ padding: "2rem", position: "relative" }}>
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
          color: "black",
        }}
      >
        ←
      </button>

      <h1>HI EVERYOEN</h1>
    </div>
  );

  //   return (
  //     <div>
  //       <h2
  //         style={{
  //           fontSize: "1.5rem",
  //           fontWeight: "bold",
  //           marginBottom: "1rem",
  //         }}
  //       >
  //         playlists are selected
  //       </h2>
  //       <div
  //         style={{
  //           display: "grid",
  //           gridTemplateColumns: "repeat(3, 1fr)",
  //           gap: "1rem",
  //         }}
  //       >
  //         assume the drag drop
  //       </div>
  //     </div>
  //   );
}

export default PlaylistComparison;
