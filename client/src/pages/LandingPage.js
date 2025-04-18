import { useState } from "react";

export default function LandingPage() {
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setLoading(true);
    const response = await fetch("/api/login");
    const data = await response.json();
    window.location.href = data.url;
  };

  return (
    <div
      style={{
        height: "100vh",
        backgroundColor: "black",
        color: "white",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <h1>Spotify Manager</h1>
      <button
        onClick={handleLogin}
        style={{
          padding: "1rem 2rem",
          background: "green",
          color: "white",
          border: "none",
          borderRadius: "8px",
        }}
        disabled={loading}
      >
        {loading ? "Connecting..." : "Connect to Spotify"}
      </button>
    </div>
  );
}
