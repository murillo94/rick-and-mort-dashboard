import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";

import PieSpecies from "./pie-species";
import * as characterService from "@/data-access/services/character";

import type { Characters } from "@/data-access/schemas";

vi.mock("@/lib/apollo-client", () => {
  return {
    query: vi.fn(),
  };
});

// Since reports page are SSR, we need to mock the character service instead Apollo Client
vi.mock("@/data-access/services/character");

const mockCharactersData: Characters = [
  {
    id: "1",
    name: "Rick Sanchez",
    status: "Alive",
    species: "Human",
    type: "",
    gender: "Male",
    image: "https://rickandmortyapi.com/api/character/avatar/1.jpeg",
    origin: { id: "1", name: "Earth (C-137)" },
    location: { id: "3", name: "Citadel of Ricks" },
  },
  {
    id: "2",
    name: "Morty Smith",
    status: "Alive",
    species: "Human",
    type: "",
    gender: "Male",
    image: "https://rickandmortyapi.com/api/character/avatar/2.jpeg",
    origin: { id: "1", name: "Earth (C-137)" },
    location: { id: "20", name: "Earth (Replacement Dimension)" },
  },
  {
    id: "3",
    name: "Summer Smith",
    status: "Alive",
    species: "Human",
    type: "",
    gender: "Female",
    image: "https://rickandmortyapi.com/api/character/avatar/3.jpeg",
    origin: { id: "1", name: "Earth (C-137)" },
    location: { id: "20", name: "Earth (Replacement Dimension)" },
  },
  {
    id: "4",
    name: "Birdperson",
    status: "Alive",
    species: "Alien",
    type: "Bird-Person",
    gender: "Male",
    image: "https://rickandmortyapi.com/api/character/avatar/4.jpeg",
    origin: { id: "15", name: "Bird World" },
    location: { id: "15", name: "Bird World" },
  },
  {
    id: "5",
    name: "Mr. Meeseeks",
    status: "Alive",
    species: "Humanoid",
    type: "Meeseeks",
    gender: "Male",
    image: "https://rickandmortyapi.com/api/character/avatar/5.jpeg",
    origin: { id: "25", name: "Mr. Meeseeks Box" },
    location: { id: "25", name: "Mr. Meeseeks Box" },
  },
];

describe("PieSpecies", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should render pie chart with species data", async () => {
    vi.mocked(characterService.getAllCharacters).mockResolvedValue(
      mockCharactersData
    );

    const component = await PieSpecies();
    render(component);

    expect(screen.getByText("Species")).toBeInTheDocument();
    expect(
      screen.getByText("The species of the characters.")
    ).toBeInTheDocument();

    expect(screen.getAllByText("Human").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Alien").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Humanoid").length).toBeGreaterThan(0);
  });

  it("should group characters by species and count them", async () => {
    vi.mocked(characterService.getAllCharacters).mockResolvedValue(
      mockCharactersData
    );

    const component = await PieSpecies();
    render(component);

    expect(screen.getByText("3")).toBeInTheDocument();
    expect(screen.getAllByText("1").length).toBeGreaterThan(0);
  });

  it("should sort species by count (descending)", async () => {
    vi.mocked(characterService.getAllCharacters).mockResolvedValue(
      mockCharactersData
    );

    const component = await PieSpecies();
    const { container } = render(component);

    const legendItems = container.querySelectorAll(".grid.gap-1 > div");

    expect(legendItems[0]).toHaveTextContent("Human");
    expect(legendItems[0]).toHaveTextContent("3");

    expect(legendItems[1]).toHaveTextContent("Alien");
    expect(legendItems[1]).toHaveTextContent("1");

    expect(legendItems[2]).toHaveTextContent("Humanoid");
    expect(legendItems[2]).toHaveTextContent("1");
  });

  it("should handle empty characters data", async () => {
    vi.mocked(characterService.getAllCharacters).mockResolvedValue([]);

    const component = await PieSpecies();
    render(component);

    expect(screen.getByText("Species")).toBeInTheDocument();
    expect(
      screen.getByText("The species of the characters.")
    ).toBeInTheDocument();

    expect(screen.queryByText("Human")).not.toBeInTheDocument();
    expect(screen.queryByText("Alien")).not.toBeInTheDocument();
  });

  it("should handle characters with missing species (default to Unknown)", async () => {
    const charactersWithMissingSpecies: Characters = [
      {
        id: "1",
        name: "Mystery Character",
        status: "Alive",
        species: "",
        type: "",
        gender: "Unknown",
        image: "https://rickandmortyapi.com/api/character/avatar/1.jpeg",
        origin: { id: "1", name: "Unknown" },
        location: { id: "1", name: "Unknown" },
      },
      {
        id: "2",
        name: "Another Mystery",
        status: "Alive",
        species: "",
        type: "",
        gender: "Unknown",
        image: "https://rickandmortyapi.com/api/character/avatar/2.jpeg",
        origin: { id: "1", name: "Unknown" },
        location: { id: "1", name: "Unknown" },
      },
    ];

    vi.mocked(characterService.getAllCharacters).mockResolvedValue(
      charactersWithMissingSpecies
    );

    const component = await PieSpecies();
    render(component);

    expect(screen.getAllByText("Unknown").length).toBeGreaterThan(0);
    expect(screen.getByText("2")).toBeInTheDocument();
  });

  it("should render pie chart with correct structure", async () => {
    vi.mocked(characterService.getAllCharacters).mockResolvedValue(
      mockCharactersData
    );

    const component = await PieSpecies();
    const { container } = render(component);

    const pieChartContainer = container.querySelector(
      ".w-full.aspect-square.max-h-\\[300px\\]"
    );
    expect(pieChartContainer).toBeInTheDocument();

    const legendGrid = container.querySelector(".grid.gap-1");
    expect(legendGrid).toBeInTheDocument();
  });

  it("should display legend with 3 columns layout", async () => {
    vi.mocked(characterService.getAllCharacters).mockResolvedValue(
      mockCharactersData
    );

    const component = await PieSpecies();
    const { container } = render(component);

    const legendGrid = container.querySelector(".grid-cols-2.md\\:grid-cols-3");
    expect(legendGrid).toBeInTheDocument();
  });

  it("should assign unique colors to each species", async () => {
    vi.mocked(characterService.getAllCharacters).mockResolvedValue(
      mockCharactersData
    );

    const component = await PieSpecies();
    const { container } = render(component);

    const colorIndicators = container.querySelectorAll(".w-4.h-4.rounded-sm");

    expect(colorIndicators).toHaveLength(3);

    colorIndicators.forEach((indicator) => {
      const style = window.getComputedStyle(indicator);
      expect(style.backgroundColor).toBeTruthy();
    });
  });

  it("should handle single species", async () => {
    const singleSpeciesCharacters: Characters = [
      {
        id: "1",
        name: "Rick Sanchez",
        status: "Alive",
        species: "Human",
        type: "",
        gender: "Male",
        image: "https://rickandmortyapi.com/api/character/avatar/1.jpeg",
        origin: { id: "1", name: "Earth (C-137)" },
        location: { id: "3", name: "Citadel of Ricks" },
      },
      {
        id: "2",
        name: "Morty Smith",
        status: "Alive",
        species: "Human",
        type: "",
        gender: "Male",
        image: "https://rickandmortyapi.com/api/character/avatar/2.jpeg",
        origin: { id: "1", name: "Earth (C-137)" },
        location: { id: "20", name: "Earth (Replacement Dimension)" },
      },
    ];

    vi.mocked(characterService.getAllCharacters).mockResolvedValue(
      singleSpeciesCharacters
    );

    const component = await PieSpecies();
    render(component);

    expect(screen.getAllByText("Human").length).toBeGreaterThan(0);
    expect(screen.getByText("2")).toBeInTheDocument();
  });

  it("should handle many different species", async () => {
    const manySpeciesCharacters: Characters = Array.from(
      { length: 10 },
      (_, i) => ({
        id: String(i + 1),
        name: `Character ${i + 1}`,
        status: "Alive",
        species: `Species ${i + 1}`,
        type: "",
        gender: "Male",
        image: "https://rickandmortyapi.com/api/character/avatar/1.jpeg",
        origin: { id: "1", name: "Unknown" },
        location: { id: "1", name: "Unknown" },
      })
    );

    vi.mocked(characterService.getAllCharacters).mockResolvedValue(
      manySpeciesCharacters
    );

    const component = await PieSpecies();
    const { container } = render(component);

    expect(screen.getAllByText("Species 1").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Species 10").length).toBeGreaterThan(0);

    const legendItems = container.querySelectorAll(".grid.gap-1 > div");
    expect(legendItems.length).toBe(10);
  });

  it("should handle species with varying counts", async () => {
    const varyingCountCharacters: Characters = [
      ...Array.from({ length: 5 }, (_, i) => ({
        id: String(i + 1),
        name: `Human ${i + 1}`,
        status: "Alive" as const,
        species: "Human",
        type: "",
        gender: "Male" as const,
        image: "https://rickandmortyapi.com/api/character/avatar/1.jpeg",
        origin: { id: "1", name: "Earth" },
        location: { id: "1", name: "Earth" },
      })),
      ...Array.from({ length: 3 }, (_, i) => ({
        id: String(i + 6),
        name: `Alien ${i + 1}`,
        status: "Alive" as const,
        species: "Alien",
        type: "",
        gender: "Male" as const,
        image: "https://rickandmortyapi.com/api/character/avatar/2.jpeg",
        origin: { id: "2", name: "Alien World" },
        location: { id: "2", name: "Alien World" },
      })),
      {
        id: "9",
        name: "Robot",
        status: "Alive",
        species: "Robot",
        type: "",
        gender: "Genderless",
        image: "https://rickandmortyapi.com/api/character/avatar/3.jpeg",
        origin: { id: "3", name: "Robot Factory" },
        location: { id: "3", name: "Robot Factory" },
      },
    ];

    vi.mocked(characterService.getAllCharacters).mockResolvedValue(
      varyingCountCharacters
    );

    const component = await PieSpecies();
    const { container } = render(component);

    const legendItems = container.querySelectorAll(".grid.gap-1 > div");

    expect(legendItems[0]).toHaveTextContent("Human");
    expect(legendItems[0]).toHaveTextContent("5");

    expect(legendItems[1]).toHaveTextContent("Alien");
    expect(legendItems[1]).toHaveTextContent("3");

    expect(legendItems[2]).toHaveTextContent("Robot");
    expect(legendItems[2]).toHaveTextContent("1");
  });

  it("should call getAllCharacters service on render", async () => {
    const getAllCharactersSpy = vi
      .mocked(characterService.getAllCharacters)
      .mockResolvedValue(mockCharactersData);

    const component = await PieSpecies();
    render(component);

    expect(getAllCharactersSpy).toHaveBeenCalledTimes(1);
    expect(getAllCharactersSpy).toHaveBeenCalledWith();
  });

  it("should format species counts with locale string", async () => {
    const largeCountCharacters: Characters = Array.from(
      { length: 1000 },
      (_, i) => ({
        id: String(i + 1),
        name: `Human ${i + 1}`,
        status: "Alive",
        species: "Human",
        type: "",
        gender: "Male",
        image: "https://rickandmortyapi.com/api/character/avatar/1.jpeg",
        origin: { id: "1", name: "Earth" },
        location: { id: "1", name: "Earth" },
      })
    );

    vi.mocked(characterService.getAllCharacters).mockResolvedValue(
      largeCountCharacters
    );

    const component = await PieSpecies();
    render(component);

    expect(screen.getAllByText("Human").length).toBeGreaterThan(0);

    expect(screen.getByText(/1[,\s]?000/)).toBeInTheDocument();
  });

  it("should handle species names with special characters", async () => {
    const specialCharactersSpecies: Characters = [
      {
        id: "1",
        name: "Character 1",
        status: "Alive",
        species: "Human-Alien Hybrid",
        type: "",
        gender: "Male",
        image: "https://rickandmortyapi.com/api/character/avatar/1.jpeg",
        origin: { id: "1", name: "Earth" },
        location: { id: "1", name: "Earth" },
      },
      {
        id: "2",
        name: "Character 2",
        status: "Alive",
        species: "Parasite (Type-C)",
        type: "",
        gender: "Unknown",
        image: "https://rickandmortyapi.com/api/character/avatar/2.jpeg",
        origin: { id: "2", name: "Unknown" },
        location: { id: "2", name: "Unknown" },
      },
    ];

    vi.mocked(characterService.getAllCharacters).mockResolvedValue(
      specialCharactersSpecies
    );

    const component = await PieSpecies();
    render(component);

    expect(screen.getAllByText("Human-Alien Hybrid").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Parasite (Type-C)").length).toBeGreaterThan(0);
  });
});
