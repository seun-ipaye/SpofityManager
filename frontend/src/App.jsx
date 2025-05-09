import { useEffect, useState } from "react";
import axios from "axios";

function App() {
  const [user, setUser] = useState(null);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    axios
      .get("https://spofitymanager.onrender.com/api/me", {
        withCredentials: true,
      })
      .then((res) => setUser(res.data))
      .catch(() => console.log("User not logged in"));
  }, []);

  const handleLogin = () => {
    window.location.href = "https://spofitymanager.onrender.com/api/login";
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
        padding: "2rem",
      }}
    >
      <h1
        style={{
          fontSize: "2.5rem",
          fontWeight: "bold",
          marginBottom: "1.5rem",
        }}
      >
        Edit your playlists!
      </h1>

      {!user ? (
        <button
          onClick={handleLogin}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          style={{
            backgroundColor: isHovered ? "#1DB954" : "white",
            color: isHovered ? "white" : "black",
            transform: isHovered ? "scale(1.05)" : "scale(1)",
            transition: "all 0.2s ease-in-out",
            padding: "0.75rem 2rem",
            border: "none",
            borderRadius: "0.5rem",
            fontWeight: "bold",
            cursor: "pointer",
          }}
        >
          Log in
        </button>
      ) : (
        <p>Welcome, {user.display_name}</p>
      )}
    </div>
  );
}

export default App;
