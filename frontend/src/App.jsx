import { useEffect, useState } from "react";
import axios from "axios";

function App() {
  const [user, setUser] = useState(null);

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
    <div>
      <h1>Spotify Playlist Manager</h1>
      {!user ? (
        <button onClick={handleLogin}>Login with Spotify</button>
      ) : (
        <div>
          <p>Welcome, {user.display_name}</p>
        </div>
      )}
    </div>
  );
}

export default App;
