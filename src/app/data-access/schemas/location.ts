import { z } from "zod";

import { paginationInfoSchema } from "./shared";

/**
 * Basic resident information (used in location lists)
 */
const residentBasicSchema = z.object({
  id: z.string(),
  name: z.string(),
  image: z.url(),
});

/**
 * Detailed resident information (used in single location)
 */
const residentDetailSchema = z.object({
  id: z.string(),
  name: z.string(),
  status: z.string(),
  species: z.string(),
  image: z.url(),
});

/**
 * Base location schema
 */
const locationSchema = z.object({
  id: z.string(),
  name: z.string(),
  type: z.string(),
  dimension: z.string(),
  residents: z.array(residentBasicSchema),
});

/**
 * Schema for locations query response
 */
export const locationsResponseSchema = z.object({
  locations: z.object({
    info: paginationInfoSchema,
    results: z.array(locationSchema),
  }),
});

/**
 * Schema for location filter parameters
 */
const filterLocationSchema = z
  .object({
    name: z.string().optional(),
    type: z.string().optional(),
    dimension: z.string().optional(),
  })
  .optional();

/**
 * Schema for get locations variables
 */
const getLocationsVariablesSchema = z.object({
  page: z.number().optional(),
  filter: filterLocationSchema,
});

/**
 * Schema for get location variables
 */
export const getLocationVariablesSchema = z.object({
  id: z.string(),
});

export type LocationsResponse = z.infer<typeof locationsResponseSchema>;
export type GetLocationsVariables = z.infer<typeof getLocationsVariablesSchema>;
