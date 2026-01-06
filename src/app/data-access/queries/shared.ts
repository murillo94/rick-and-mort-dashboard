import { gql } from "@apollo/client";

/**
 * Reusable fragment for basic character fields
 * Used across multiple queries to ensure consistency
 */
export const CHARACTER_FIELDS = gql`
  fragment CharacterFields on Character {
    id
    name
    status
    species
    type
    gender
    image
    origin {
      id
      name
    }
    location {
      id
      name
    }
  }
`;

/**
 * Reusable fragment for pagination info
 * Used across all paginated queries
 */
export const PAGINATION_INFO_FIELDS = gql`
  fragment PaginationInfoFields on Info {
    count
    pages
    next
    prev
  }
`;

/**
 * Reusable fragment for basic resident info in locations
 */
export const RESIDENT_BASIC_FIELDS = gql`
  fragment ResidentBasicFields on Character {
    id
    name
    image
  }
`;
