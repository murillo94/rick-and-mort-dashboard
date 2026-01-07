import { gql, type TypedDocumentNode } from "@apollo/client";

import { CHARACTER_FIELDS, PAGINATION_INFO_FIELDS } from "./shared";

import type {
  CharactersResponse,
  CharacterResponse,
  GetCharactersVariables,
  GetCharacterVariables,
} from "../schemas";

/**
 * Get all characters with pagination and optional filtering
 *
 * @param page - Page number (optional)
 * @param filter - Filter criteria (optional)
 * @returns Paginated list of characters with metadata
 */
export const GET_CHARACTERS: TypedDocumentNode<
  CharactersResponse,
  GetCharactersVariables
> = gql`
  ${CHARACTER_FIELDS}
  ${PAGINATION_INFO_FIELDS}
  query GetCharacters($page: Int, $filter: FilterCharacter) {
    characters(page: $page, filter: $filter) {
      info {
        ...PaginationInfoFields
      }
      results {
        ...CharacterFields
      }
    }
  }
`;

/**
 * Get a single character by ID with their episode appearances
 *
 * @param id - Character ID (required)
 * @returns Detailed character information including episodes
 */
export const GET_CHARACTER: TypedDocumentNode<
  CharacterResponse,
  GetCharacterVariables
> = gql`
  ${CHARACTER_FIELDS}
  query GetCharacter($id: ID!) {
    character(id: $id) {
      ...CharacterFields
      episode {
        id
        name
        episode
        air_date
      }
    }
  }
`;
