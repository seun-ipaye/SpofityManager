import { useState } from "react";

export default function LandingPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const handleLogin = () => {
    setIsLoading(true);
    window.location.href = "https://spofitymanager.onrender.com/api/login";
  };

  return (
    <div
      style={{
        padding: "2rem",
        backgroundColor: "black",
        minHeight: "100vh",
        color: "white",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
      }}
    >
      <h1
        style={{
          fontSize: "2.5rem",
          fontWeight: "bold",
          marginBottom: "1rem",
          color: "white",
        }}
      >
        Edit Your Playlists!
      </h1>
      <p style={{ fontSize: "1.125rem", marginBottom: "2rem", color: "#ccc" }}>
        Easily modify and compare your Spotify playlists
      </p>
      <button
        onClick={handleLogin}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        disabled={isLoading}
        style={{
          backgroundColor: isHovered ? "#1DB954" : "white",
          color: isHovered ? "white" : "black",
          transform: isHovered ? "scale(1.05)" : "scale(1)",
          transition: "all 0.2s ease-in-out",
          padding: "0.75rem 2rem",
          border: "none",
          borderRadius: "0.5rem",
          fontWeight: "bold",
          cursor: isLoading ? "not-allowed" : "pointer",
          opacity: isLoading ? 0.6 : 1,
        }}
      >
        {isLoading ? "Connecting..." : "Connect Your Spotify"}
      </button>
    </div>
  );
}
