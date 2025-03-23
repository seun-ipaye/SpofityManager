import { useState } from "react";

export default function LandingPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const handleLogin = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("http://localhost:5001/login");
      const data = await response.json();
      window.location.href = data.url; // Redirect user to Spotify login
    } catch (error) {
      console.error("Error during login:", error);
      setIsLoading(false);
    }
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        backgroundColor: "black",
        color: "white",
        textAlign: "center",
      }}
    >
      <h1
        style={{ fontSize: "2rem", fontWeight: "bold", marginBottom: "1rem" }}
      >
        Edit Your Playlists!
      </h1>
      <p style={{ fontSize: "1.125rem", marginBottom: "1.5rem" }}>
        Easily modify your Spotify playlists
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
    </div>
  );
}
