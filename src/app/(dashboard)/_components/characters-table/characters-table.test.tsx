import { describe, it, expect, vi } from "vitest";
import { ApolloProvider } from "@apollo/client/react";
import { createMockClient } from "mock-apollo-client";
import { GraphQLError } from "graphql";
import { render, screen } from "@testing-library/react";
import { withNuqsTestingAdapter } from "nuqs/adapters/testing";

import { GET_CHARACTERS } from "@/data-access/queries/characters";
import { CharactersTable } from "./characters-table";

import type { Character } from "@/data-access/schemas";

vi.mock("@/lib/apollo-client", () => {
  return {
    registerApolloClient: () => null,
  };
});

vi.mock("next/navigation", () => import("next-router-mock"));

const mockCharactersData: Character[] = [
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
];

describe("Characters GraphQL Integration", () => {
  it("should render table with correct structure", async () => {
    const mockClient = createMockClient();

    mockClient.setRequestHandler(GET_CHARACTERS, () =>
      Promise.resolve({
        data: {
          characters: {
            info: {
              count: 3,
              pages: 1,
              next: null,
              prev: null,
            },
            results: mockCharactersData,
          },
        },
      })
    );

    render(
      <ApolloProvider client={mockClient}>
        <CharactersTable
          initialData={mockCharactersData}
          paginationInfo={{ count: 3, pages: 1, next: 0, prev: 0 }}
          searchTerm=""
        />
      </ApolloProvider>,
      {
        wrapper: withNuqsTestingAdapter(),
      }
    );

    // Check table headers
    expect(screen.getByText("Name")).toBeInTheDocument();
    expect(screen.getByText("Species")).toBeInTheDocument();
    expect(screen.getByText("Status")).toBeInTheDocument();

    // Check character names
    expect(screen.getByText("Rick Sanchez")).toBeInTheDocument();
    expect(screen.getByText("Morty Smith")).toBeInTheDocument();
    expect(screen.getByText("Summer Smith")).toBeInTheDocument();

    // Check species and status (case-insensitive)
    const humanElements = screen.getAllByText(/human/i);
    expect(humanElements.length).toBeGreaterThan(0);

    const aliveElements = screen.getAllByText(/alive/i);
    expect(aliveElements.length).toBeGreaterThan(0);

    // Check caption
    expect(
      screen.getByText("A list of 3 characters. Scroll to see more.")
    ).toBeInTheDocument();
  });

  it("should filter characters by name", async () => {
    const mockClient = createMockClient();

    const filteredData = [mockCharactersData[0]];

    mockClient.setRequestHandler(GET_CHARACTERS, () =>
      Promise.resolve({
        data: {
          characters: {
            info: {
              count: 1,
              pages: 1,
              next: null,
              prev: null,
            },
            results: filteredData,
          },
        },
      })
    );

    render(
      <ApolloProvider client={mockClient}>
        <CharactersTable
          initialData={filteredData}
          paginationInfo={{ count: 1, pages: 1, next: 0, prev: 0 }}
          searchTerm="rick"
        />
      </ApolloProvider>,
      {
        wrapper: withNuqsTestingAdapter(),
      }
    );

    expect(screen.getByText("Rick Sanchez")).toBeInTheDocument();
    expect(screen.queryByText("Morty Smith")).not.toBeInTheDocument();
    expect(screen.queryByText("Summer Smith")).not.toBeInTheDocument();
    expect(
      screen.getByText("A list of 1 characters. Scroll to see more.")
    ).toBeInTheDocument();
  });

  it("should handle empty results", async () => {
    const mockClient = createMockClient();

    mockClient.setRequestHandler(GET_CHARACTERS, () =>
      Promise.resolve({
        data: {
          characters: {
            info: {
              count: 0,
              pages: 0,
              next: null,
              prev: null,
            },
            results: [],
          },
        },
      })
    );

    render(
      <ApolloProvider client={mockClient}>
        <CharactersTable
          initialData={[]}
          paginationInfo={{ count: 0, pages: 0, next: 0, prev: 0 }}
          searchTerm=""
        />
      </ApolloProvider>,
      {
        wrapper: withNuqsTestingAdapter(),
      }
    );

    expect(screen.getByText("No characters found.")).toBeInTheDocument();
    expect(screen.queryByText("Rick Sanchez")).not.toBeInTheDocument();
  });

  it("should display avatars for each character", async () => {
    const mockClient = createMockClient();

    mockClient.setRequestHandler(GET_CHARACTERS, () =>
      Promise.resolve({
        data: {
          characters: {
            info: {
              count: 3,
              pages: 1,
              next: null,
              prev: null,
            },
            results: mockCharactersData,
          },
        },
      })
    );

    render(
      <ApolloProvider client={mockClient}>
        <CharactersTable
          initialData={mockCharactersData}
          paginationInfo={{ count: 3, pages: 1, next: 0, prev: 0 }}
          searchTerm=""
        />
      </ApolloProvider>,
      {
        wrapper: withNuqsTestingAdapter(),
      }
    );

    // Check that avatars are rendered
    const avatars = screen.getAllByRole("img");
    expect(avatars).toHaveLength(3);
    expect(avatars[0]).toHaveAttribute("alt", "Rick Sanchez");
    expect(avatars[1]).toHaveAttribute("alt", "Morty Smith");
    expect(avatars[2]).toHaveAttribute("alt", "Summer Smith");
  });

  it("should handle GraphQL errors", async () => {
    const mockClient = createMockClient();

    mockClient.setRequestHandler(GET_CHARACTERS, () =>
      Promise.reject({
        graphQLErrors: [new GraphQLError("Failed to fetch characters")],
      })
    );

    render(
      <ApolloProvider client={mockClient}>
        <CharactersTable
          initialData={[]}
          paginationInfo={{ count: 0, pages: 0, next: 0, prev: 0 }}
          searchTerm=""
        />
      </ApolloProvider>,
      {
        wrapper: withNuqsTestingAdapter(),
      }
    );

    expect(screen.getByText("No characters found.")).toBeInTheDocument();
  });

  it("should handle network errors", async () => {
    const mockClient = createMockClient();

    mockClient.setRequestHandler(GET_CHARACTERS, () =>
      Promise.reject(new Error("Network error occurred"))
    );

    render(
      <ApolloProvider client={mockClient}>
        <CharactersTable
          initialData={[]}
          paginationInfo={{ count: 0, pages: 0, next: 0, prev: 0 }}
          searchTerm=""
        />
      </ApolloProvider>,
      {
        wrapper: withNuqsTestingAdapter(),
      }
    );

    expect(screen.getByText("No characters found.")).toBeInTheDocument();
  });
});
