import { query } from "@/lib/apollo-client";
import { GET_CHARACTERS, GET_CHARACTER } from "../queries/characters";
import {
  charactersResponseSchema,
  characterResponseSchema,
  type GetCharactersVariables,
  type GetCharacterVariables,
  type CharactersResponse,
  type CharacterResponse,
  type Characters,
} from "../schemas";

/**
 * Fetches all characters with pagination and optional filtering
 * Returns validated and type-safe data
 *
 * @param variables - Optional page number and filter criteria
 * @returns Promise with validated characters response
 * @throws Error if validation fails
 */
export async function getCharacters(
  variables?: GetCharactersVariables
): Promise<CharactersResponse> {
  try {
    const { data } = await query({
      query: GET_CHARACTERS,
      variables,
    });

    const validatedData = charactersResponseSchema.parse(data);

    return validatedData;
  } catch (error) {
    console.error("Failed to fetch characters:", error);
    throw new Error(
      `Failed to fetch characters: ${
        error instanceof Error ? error.message : "Unknown error"
      }`
    );
  }
}

/**
 * Fetches a single character by ID with episode information
 * Returns validated and type-safe data
 *
 * @param variables - Character ID
 * @returns Promise with validated character response
 * @throws Error if validation fails
 */
export async function getCharacter(
  variables: GetCharacterVariables
): Promise<CharacterResponse> {
  try {
    const { data } = await query({
      query: GET_CHARACTER,
      variables,
    });

    const validatedData = characterResponseSchema.parse(data);

    return validatedData;
  } catch (error) {
    console.error("Failed to fetch character:", error);
    throw new Error(
      `Failed to fetch character: ${
        error instanceof Error ? error.message : "Unknown error"
      }`
    );
  }
}

/**
 * Gets all characters without pagination (fetches all pages)
 * Useful for reports and analytics
 *
 * @param filter - Optional filter criteria
 * @returns Promise with all characters across all pages
 */
export async function getAllCharacters(
  filter?: GetCharactersVariables["filter"]
): Promise<Characters> {
  try {
    const firstPage = await getCharacters({ page: 1, filter });
    const totalPages = firstPage.characters.info.pages;
    const allCharacters = [...firstPage.characters.results];

    if (totalPages > 1) {
      const remainingPages = Array.from(
        { length: totalPages - 1 },
        (_, i) => i + 2
      );

      const results = await Promise.all(
        remainingPages.map((page) => getCharacters({ page, filter }))
      );

      results.forEach((result) => {
        allCharacters.push(...result.characters.results);
      });
    }

    return allCharacters;
  } catch (error) {
    console.error("Failed to fetch all characters:", error);
    throw new Error(
      `Failed to fetch all characters: ${
        error instanceof Error ? error.message : "Unknown error"
      }`
    );
  }
}
