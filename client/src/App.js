// client/src/App.js
import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import LandingPage from "./pages/LandingPage";

function Login() {
  const handleLogin = async () => {
    const response = await fetch("http://localhost:5001/login");
    const data = await response.json();
    window.location.href = data.url;
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <button
        onClick={handleLogin}
        className="px-6 py-3 text-white bg-green-500 rounded-full hover:bg-green-600"
      >
        Connect with Spotify
      </button>
    </div>
  );
}

function PlaylistsPage() {
  const [playlists, setPlaylists] = useState([]);
  const [selectedPlaylists, setSelectedPlaylists] = useState([]);

  useEffect(() => {
    fetchPlaylists();
  }, []);

  const fetchPlaylists = async () => {
    try {
      const response = await fetch("http://localhost:5001/playlists", {
        credentials: "include",
      });
      const data = await response.json();
      setPlaylists(data.items);
    } catch (error) {
      console.error("Error fetching playlists:", error);
    }
  };

  const handlePlaylistSelect = (playlist) => {
    if (selectedPlaylists.length < 2 && !selectedPlaylists.includes(playlist)) {
      setSelectedPlaylists([...selectedPlaylists, playlist]);
    }
  };

  return (
    <div className="p-8">
      {selectedPlaylists.length < 2 ? (
        <div>
          <h2 className="text-2xl font-bold mb-4">
            Select two playlists to compare
          </h2>
          <div className="grid grid-cols-3 gap-4">
            {playlists.map((playlist) => (
              <div
                key={playlist.id}
                onClick={() => handlePlaylistSelect(playlist)}
                className="p-4 border rounded cursor-pointer hover:bg-gray-100"
              >
                <img
                  src={playlist.images?.[0]?.url || "/placeholder.png"}
                  alt={playlist.name}
                  className="w-full aspect-square object-cover mb-2"
                />

                <h3 className="font-bold">{playlist.name}</h3>
                <p className="text-sm text-gray-600">
                  {playlist.tracks.total} tracks
                </p>
              </div>
            ))}
          </div>
        </div>
      ) : (
        // <PlaylistComparison playlists={selectedPlaylists} />
        <div>
          <h2>playlists are selected</h2>
          <div className="grid grid-cols-3 gap-4">assume the drag drop</div>
        </div>
      )}
    </div>
  );
}

function App() {
  return (
    <DndProvider backend={HTML5Backend}>
      <Router>
        <Routes>
          {/* <Route path="/" element={<Login />} /> */}
          {/* <Route path="/callback" element={<Navigate to="/playlists" />} /> */}
          <Route path="/playlists" element={<PlaylistsPage />} />
          <Route path="/" element={<LandingPage />} />
        </Routes>
      </Router>
    </DndProvider>
  );
}

export default App;
