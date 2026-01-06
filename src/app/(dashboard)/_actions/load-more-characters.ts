"use server";

import { getCharacters } from "@/data-access/services";

import type { GetCharactersVariables } from "@/data-access/schemas";

/**
 * Server action to load more characters
 * This keeps the data fetching on the server while allowing client-side pagination
 */
export async function loadMoreCharacters(variables: GetCharactersVariables) {
  try {
    const { characters } = await getCharacters(variables);

    return {
      results: characters.results,
      info: characters.info,
    };
  } catch (error) {
    console.error("Failed to load more characters:", error);
    return {
      results: [],
      info: {
        count: 0,
        pages: 0,
        next: 0,
        prev: 0,
      },
    };
  }
}
