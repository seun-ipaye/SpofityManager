import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function LandingPage() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const handleLogin = async () => {
    const response = await fetch("http://localhost:5001/login");
    const data = await response.json();
    window.location.href = data.url;
  };

  const handleConnect = () => {
    setIsLoading(true);
    handleLogin();
    // Simulate authentication process
    setTimeout(() => {
      navigate("/playlists");
    }, 1000);
  };

  const buttonStyle = {
    backgroundColor: isHovered ? "green" : "white",
    color: isHovered ? "white" : "black",
    transform: isHovered ? "scale(1.05)" : "scale(1)",
    transition: "all 0.2s ease-in-out",
    padding: "0.5rem 1.5rem",
    border: "none",
    borderRadius: "0.5rem",
    cursor: "pointer",
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
        padding: "1.5rem",
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
        onClick={handleConnect}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        style={{
          ...buttonStyle,
          opacity: isLoading ? 0.5 : 1,
          cursor: isLoading ? "not-allowed" : "pointer",
        }}
        disabled={isLoading}
      >
        {isLoading ? "Connecting..." : "Connect Your Spotify"}
      </button>
    </div>
  );
}
