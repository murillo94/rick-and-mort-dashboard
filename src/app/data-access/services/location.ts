import { query } from "@/lib/apollo-client";
import { GET_LOCATIONS } from "../queries/location";
import {
  locationsResponseSchema,
  type GetLocationsVariables,
  type LocationsResponse,
} from "../schemas";

/**
 * Fetches all locations with pagination and optional filtering
 * Returns validated and type-safe data
 *
 * @param variables - Optional page number and filter criteria
 * @returns Promise with validated locations response
 * @throws Error if validation fails
 */
export async function getLocations(
  variables?: GetLocationsVariables
): Promise<LocationsResponse> {
  try {
    const { data } = await query({
      query: GET_LOCATIONS,
      variables,
    });

    const validatedData = locationsResponseSchema.parse(data);

    return validatedData;
  } catch (error) {
    console.error("Failed to fetch locations:", error);
    throw new Error(
      `Failed to fetch locations: ${
        error instanceof Error ? error.message : "Unknown error"
      }`
    );
  }
}

/**
 * Gets all locations without pagination (fetches all pages)
 * Useful for reports and analytics
 *
 * @param filter - Optional filter criteria
 * @returns Promise with all locations across all pages
 */
export async function getAllLocations(
  filter?: GetLocationsVariables["filter"]
): Promise<LocationsResponse["locations"]["results"]> {
  try {
    const firstPage = await getLocations({ page: 1, filter });
    const totalPages = firstPage.locations.info.pages;
    const allLocations = [...firstPage.locations.results];

    if (totalPages > 1) {
      const remainingPages = Array.from(
        { length: totalPages - 1 },
        (_, i) => i + 2
      );

      const results = await Promise.all(
        remainingPages.map((page) => getLocations({ page, filter }))
      );

      results.forEach((result) => {
        allLocations.push(...result.locations.results);
      });
    }

    return allLocations;
  } catch (error) {
    console.error("Failed to fetch all locations:", error);
    throw new Error(
      `Failed to fetch all locations: ${
        error instanceof Error ? error.message : "Unknown error"
      }`
    );
  }
}

/**
 * Gets locations with resident count for analytics
 * Useful for pie charts and location statistics
 *
 * @param filter - Optional filter criteria
 * @returns Promise with locations including resident count
 */
export async function getLocationsWithResidentCount(
  filter?: GetLocationsVariables["filter"]
): Promise<
  Array<{
    id: string;
    name: string;
    type: string;
    dimension: string;
    residentCount: number;
  }>
> {
  try {
    const locations = await getAllLocations(filter);

    return locations.map((location) => ({
      id: location.id,
      name: location.name,
      type: location.type,
      dimension: location.dimension,
      residentCount: location.residents.length,
    }));
  } catch (error) {
    console.error("Failed to fetch locations with resident count:", error);
    throw new Error(
      `Failed to fetch locations with resident count: ${
        error instanceof Error ? error.message : "Unknown error"
      }`
    );
  }
}
