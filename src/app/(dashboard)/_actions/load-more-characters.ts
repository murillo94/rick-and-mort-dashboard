"use server";

import { getCharacters } from "@/data-access/services";

import type { Character, GetCharactersVariables } from "@/data-access/schemas";

type LoadMoreResult =
  | {
      success: true;
      results: Character[];
      info: {
        count: number;
        pages: number;
        next: number;
        prev: number;
      };
    }
  | {
      success: false;
      error: string;
    };

/**
 * Server action to load more characters
 * This keeps the data fetching on the server while allowing client-side pagination
 */
export async function loadMoreCharacters(
  variables: GetCharactersVariables
): Promise<LoadMoreResult> {
  try {
    const { characters } = await getCharacters(variables);

    return {
      success: true,
      results: characters.results,
      info: characters.info,
    };
  } catch (error) {
    console.error("Failed to load more characters:", error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Failed to load more characters",
    };
  }
}
