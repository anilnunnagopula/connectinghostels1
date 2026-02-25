import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";

// Mock all hooks/context HostelListings depends on
jest.mock("../../hooks/useQueries", () => ({
  useHostels: jest.fn(),
  useInterestedHostels: jest.fn(),
  useToggleInterested: jest.fn(),
}));

jest.mock("../../context/AuthContext", () => ({
  useAuth: () => ({ user: null }),
}));

jest.mock("@react-google-maps/api", () => ({
  useLoadScript: () => ({ isLoaded: false }),
  GoogleMap: () => null,
  Marker: () => null,
  InfoWindow: () => null,
}));

const { useHostels, useInterestedHostels, useToggleInterested } =
  require("../../hooks/useQueries");

import HostelListings from "../HostelListings";

const renderPage = () =>
  render(
    <MemoryRouter>
      <HostelListings />
    </MemoryRouter>,
  );

describe("HostelListings", () => {
  beforeEach(() => {
    useInterestedHostels.mockReturnValue({ data: [] });
    useToggleInterested.mockReturnValue({ mutate: jest.fn(), isPending: false });
  });

  it("shows 8 skeleton cards while loading", () => {
    useHostels.mockReturnValue({
      isLoading: true,
      isError: false,
      data: undefined,
    });

    renderPage();
    expect(screen.getAllByTestId("skeleton-hostel-card")).toHaveLength(8);
  });

  it("renders hostel cards after loading", () => {
    useHostels.mockReturnValue({
      isLoading: false,
      isError: false,
      data: {
        hostels: [
          {
            _id: "abc123",
            name: "Sunrise Boys Hostel",
            locality: "Mangalpally",
            type: "Boys",
            pricePerMonth: 4500,
            availableRooms: 3,
            images: [],
            amenities: ["WiFi"],
          },
        ],
        pagination: { page: 1, pages: 1, total: 1 },
      },
    });

    renderPage();
    expect(screen.getByText("Sunrise Boys Hostel")).toBeInTheDocument();
  });

  it("shows empty state when no hostels", () => {
    useHostels.mockReturnValue({
      isLoading: false,
      isError: false,
      data: { hostels: [], pagination: { page: 1, pages: 0, total: 0 } },
    });

    renderPage();
    expect(screen.getByText(/No hostels found/i)).toBeInTheDocument();
  });

  it("shows error state on fetch error", () => {
    useHostels.mockReturnValue({
      isLoading: false,
      isError: true,
      data: undefined,
    });

    renderPage();
    expect(screen.getByText(/Could not load hostels/i)).toBeInTheDocument();
  });
});
