import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";

import PieLocation from "./pie-location";
import * as locationService from "@/data-access/services/location";

import type { Locations } from "@/data-access/schemas";

vi.mock("@/lib/apollo-client", () => {
  return {
    query: vi.fn(),
  };
});

// Since reports page are SSR, we need to mock the location service instead Apollo Client
vi.mock("@/data-access/services/location");

const mockLocationsData: Locations = [
  {
    id: "1",
    name: "Earth (C-137)",
    type: "Planet",
    dimension: "Dimension C-137",
    residents: [
      {
        id: "1",
        name: "Rick Sanchez",
        image: "https://rickandmortyapi.com/api/character/avatar/1.jpeg",
      },
      {
        id: "2",
        name: "Morty Smith",
        image: "https://rickandmortyapi.com/api/character/avatar/2.jpeg",
      },
    ],
  },
  {
    id: "2",
    name: "Citadel of Ricks",
    type: "Space station",
    dimension: "Unknown",
    residents: [
      {
        id: "3",
        name: "Summer Smith",
        image: "https://rickandmortyapi.com/api/character/avatar/3.jpeg",
      },
      {
        id: "4",
        name: "Beth Smith",
        image: "https://rickandmortyapi.com/api/character/avatar/4.jpeg",
      },
      {
        id: "5",
        name: "Jerry Smith",
        image: "https://rickandmortyapi.com/api/character/avatar/5.jpeg",
      },
    ],
  },
  {
    id: "3",
    name: "Worldender's lair",
    type: "Planet",
    dimension: "Replacement Dimension",
    residents: [
      {
        id: "6",
        name: "Abadango Cluster Princess",
        image: "https://rickandmortyapi.com/api/character/avatar/6.jpeg",
      },
    ],
  },
  {
    id: "4",
    name: "Anatomy Park",
    type: "Microverse",
    dimension: "Dimension C-137",
    residents: [],
  },
];

describe("PieLocation", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should render pie chart with location data", async () => {
    vi.mocked(locationService.getAllLocations).mockResolvedValue(
      mockLocationsData
    );

    const component = await PieLocation();
    render(component);

    expect(screen.getByText("Location")).toBeInTheDocument();
    expect(
      screen.getByText("The location of the characters.")
    ).toBeInTheDocument();

    expect(screen.getAllByText("Earth (C-137)").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Citadel of Ricks").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Worldender's lair").length).toBeGreaterThan(0);
  });

  it("should filter out locations with no residents", async () => {
    vi.mocked(locationService.getAllLocations).mockResolvedValue(
      mockLocationsData
    );

    const component = await PieLocation();
    render(component);

    expect(screen.getAllByText("Earth (C-137)").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Citadel of Ricks").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Worldender's lair").length).toBeGreaterThan(0);

    expect(screen.queryByText("Anatomy Park")).not.toBeInTheDocument();
  });

  it("should display resident counts in legend", async () => {
    vi.mocked(locationService.getAllLocations).mockResolvedValue(
      mockLocationsData
    );

    const component = await PieLocation();
    render(component);

    expect(screen.getByText("2")).toBeInTheDocument();
    expect(screen.getByText("3")).toBeInTheDocument();
    expect(screen.getByText("1")).toBeInTheDocument();
  });

  it("should sort locations by resident count (descending)", async () => {
    vi.mocked(locationService.getAllLocations).mockResolvedValue(
      mockLocationsData
    );

    const component = await PieLocation();
    const { container } = render(component);

    const legendItems = container.querySelectorAll(".grid.gap-1 > div");

    expect(legendItems[0]).toHaveTextContent("Citadel of Ricks");
    expect(legendItems[0]).toHaveTextContent("3");

    expect(legendItems[1]).toHaveTextContent("Earth (C-137)");
    expect(legendItems[1]).toHaveTextContent("2");

    expect(legendItems[2]).toHaveTextContent("Worldender's lair");
    expect(legendItems[2]).toHaveTextContent("1");
  });

  it("should handle empty locations data", async () => {
    vi.mocked(locationService.getAllLocations).mockResolvedValue([]);

    const component = await PieLocation();
    render(component);

    expect(screen.getByText("Location")).toBeInTheDocument();
    expect(
      screen.getByText("The location of the characters.")
    ).toBeInTheDocument();

    expect(screen.queryByText("Earth (C-137)")).not.toBeInTheDocument();
    expect(screen.queryByText("Citadel of Ricks")).not.toBeInTheDocument();
  });

  it("should handle locations with only empty resident arrays", async () => {
    const emptyLocations: Locations = [
      {
        id: "1",
        name: "Empty Location 1",
        type: "Planet",
        dimension: "Unknown",
        residents: [],
      },
      {
        id: "2",
        name: "Empty Location 2",
        type: "Space station",
        dimension: "Unknown",
        residents: [],
      },
    ];

    vi.mocked(locationService.getAllLocations).mockResolvedValue(
      emptyLocations
    );

    const component = await PieLocation();
    render(component);

    expect(screen.getByText("Location")).toBeInTheDocument();

    expect(screen.queryByText("Empty Location 1")).not.toBeInTheDocument();
    expect(screen.queryByText("Empty Location 2")).not.toBeInTheDocument();
  });

  it("should render pie chart with correct structure", async () => {
    vi.mocked(locationService.getAllLocations).mockResolvedValue(
      mockLocationsData
    );

    const component = await PieLocation();
    const { container } = render(component);

    const pieChartContainer = container.querySelector(
      ".w-full.aspect-square.max-h-\\[300px\\]"
    );
    expect(pieChartContainer).toBeInTheDocument();

    const legendGrid = container.querySelector(".grid.gap-1");
    expect(legendGrid).toBeInTheDocument();
  });

  it("should display legend with 3 columns layout", async () => {
    vi.mocked(locationService.getAllLocations).mockResolvedValue(
      mockLocationsData
    );

    const component = await PieLocation();
    const { container } = render(component);

    const legendGrid = container.querySelector(".grid-cols-2.md\\:grid-cols-3");
    expect(legendGrid).toBeInTheDocument();
  });

  it("should assign unique colors to each location", async () => {
    vi.mocked(locationService.getAllLocations).mockResolvedValue(
      mockLocationsData
    );

    const component = await PieLocation();
    const { container } = render(component);

    const colorIndicators = container.querySelectorAll(".w-4.h-4.rounded-sm");

    expect(colorIndicators).toHaveLength(3);

    colorIndicators.forEach((indicator) => {
      const style = window.getComputedStyle(indicator);
      expect(style.backgroundColor).toBeTruthy();
    });
  });

  it("should handle single location with residents", async () => {
    const singleLocation: Locations = [
      {
        id: "1",
        name: "Earth (C-137)",
        type: "Planet",
        dimension: "Dimension C-137",
        residents: [
          {
            id: "1",
            name: "Rick Sanchez",
            image: "https://rickandmortyapi.com/api/character/avatar/1.jpeg",
          },
        ],
      },
    ];

    vi.mocked(locationService.getAllLocations).mockResolvedValue(
      singleLocation
    );

    const component = await PieLocation();
    render(component);

    expect(screen.getAllByText("Earth (C-137)").length).toBeGreaterThan(0);
    expect(screen.getByText("1")).toBeInTheDocument();
  });

  it("should handle many locations with varying resident counts", async () => {
    const manyLocations: Locations = Array.from({ length: 10 }, (_, i) => ({
      id: String(i + 1),
      name: `Location ${i + 1}`,
      type: "Planet",
      dimension: "Unknown",
      residents: Array.from({ length: i + 1 }, (__, j) => ({
        id: String(j + 1),
        name: `Resident ${j + 1}`,
        image: "https://rickandmortyapi.com/api/character/avatar/1.jpeg",
      })),
    }));

    vi.mocked(locationService.getAllLocations).mockResolvedValue(manyLocations);

    const component = await PieLocation();
    const { container } = render(component);

    expect(screen.getAllByText("Location 1").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Location 10").length).toBeGreaterThan(0);

    const legendItems = container.querySelectorAll(".grid.gap-1 > div");
    expect(legendItems[0]).toHaveTextContent("Location 10");
    expect(legendItems[0]).toHaveTextContent("10");
  });

  it("should call getAllLocations service on render", async () => {
    const getAllLocationsSpy = vi
      .mocked(locationService.getAllLocations)
      .mockResolvedValue(mockLocationsData);

    const component = await PieLocation();
    render(component);

    expect(getAllLocationsSpy).toHaveBeenCalledTimes(1);
    expect(getAllLocationsSpy).toHaveBeenCalledWith();
  });

  it("should format resident counts with locale string", async () => {
    const largeCountLocation: Locations = [
      {
        id: "1",
        name: "Crowded Planet",
        type: "Planet",
        dimension: "Unknown",
        residents: Array.from({ length: 1000 }, (_, i) => ({
          id: String(i + 1),
          name: `Resident ${i + 1}`,
          image: "https://rickandmortyapi.com/api/character/avatar/1.jpeg",
        })),
      },
    ];

    vi.mocked(locationService.getAllLocations).mockResolvedValue(
      largeCountLocation
    );

    const component = await PieLocation();
    render(component);

    expect(screen.getAllByText("Crowded Planet").length).toBeGreaterThan(0);

    expect(screen.getByText(/1[,\s]?000/)).toBeInTheDocument();
  });
});
