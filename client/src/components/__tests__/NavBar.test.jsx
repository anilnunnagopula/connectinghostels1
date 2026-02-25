import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";

// Mock all context hooks NavBar depends on
jest.mock("../../context/DarkModeContext", () => ({
  useDarkMode: () => ({ darkMode: false, setDarkMode: jest.fn() }),
}));

jest.mock("../../context/AuthContext", () => ({
  useAuth: () => ({ user: null, logout: jest.fn() }),
}));

jest.mock("../../context/SocketContext", () => ({
  useSocket: () => ({ unreadCount: 0, newRequestsCount: 0 }),
}));

import NavBar from "../NavBar";

const renderNavBar = () =>
  render(
    <MemoryRouter>
      <NavBar />
    </MemoryRouter>,
  );

describe("NavBar", () => {
  it("renders without crashing (unauthenticated)", () => {
    const { container } = renderNavBar();
    expect(container).toBeTruthy();
  });

  it("shows Login link when not logged in", () => {
    renderNavBar();
    // Desktop shows a "Login" button; mobile "Login / Sign Up" is only rendered when menu is open
    expect(screen.getByText(/^login$/i)).toBeInTheDocument();
  });
});
