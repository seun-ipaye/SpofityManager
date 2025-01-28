// client/src/__tests__/App.test.js
import { render, screen } from "@testing-library/react";
import App from "../App";

test("renders login button", () => {
  render(<App />);
  const loginButton = screen.getByText(/Connect with Spotify/i);
  expect(loginButton).toBeInTheDocument();
});

// client/src/__tests__/PlaylistsPage.test.js
import { render, screen } from "@testing-library/react";
import PlaylistsPage from "../components/PlaylistsPage";

test("displays playlist selection message", () => {
  render(<PlaylistsPage />);
  const message = screen.getByText(/Select two playlists to compare/i);
  expect(message).toBeInTheDocument();
});
