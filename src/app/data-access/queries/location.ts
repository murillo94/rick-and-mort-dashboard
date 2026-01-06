import { gql, type TypedDocumentNode } from "@apollo/client";
import type { LocationsResponse, GetLocationsVariables } from "../schemas";
import { PAGINATION_INFO_FIELDS, RESIDENT_BASIC_FIELDS } from "./shared";

/**
 * Get all locations with pagination and optional filtering
 *
 * @param page - Page number (optional)
 * @param filter - Filter criteria (optional)
 * @returns Paginated list of locations with basic resident info
 */
export const GET_LOCATIONS: TypedDocumentNode<
  LocationsResponse,
  GetLocationsVariables
> = gql`
  ${PAGINATION_INFO_FIELDS}
  ${RESIDENT_BASIC_FIELDS}
  query GetLocations($page: Int, $filter: FilterLocation) {
    locations(page: $page, filter: $filter) {
      info {
        ...PaginationInfoFields
      }
      results {
        id
        name
        type
        dimension
        residents {
          ...ResidentBasicFields
        }
      }
    }
  }
`;
