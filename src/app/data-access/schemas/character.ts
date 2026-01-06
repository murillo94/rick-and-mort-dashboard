import { z } from "zod";

import { paginationInfoSchema } from "./shared";

/**
 * Schema for origin/location reference
 */
const locationReferenceSchema = z.object({
  id: z.string().nullable(),
  name: z.string(),
});

/**
 * Schema for episode information
 */
const episodeSchema = z.object({
  id: z.string().nullable(),
  name: z.string(),
  episode: z.string(),
  air_date: z.string(),
});

/**
 * Base character schema with all standard fields
 */
const characterSchema = z.object({
  id: z.string().nullable(),
  name: z.string(),
  status: z.string(),
  species: z.string(),
  type: z.string(),
  gender: z.string(),
  image: z.url(),
  origin: locationReferenceSchema,
  location: locationReferenceSchema,
});

/**
 * Detailed character schema including episodes
 */
const characterDetailSchema = characterSchema.extend({
  episode: z.array(episodeSchema),
});

/**
 * Schema for characters query response
 */
export const charactersResponseSchema = z.object({
  characters: z.object({
    info: paginationInfoSchema,
    results: z.array(characterSchema),
  }),
});

/**
 * Schema for single character query response
 */
export const characterResponseSchema = z.object({
  character: characterDetailSchema,
});

/**
 * Schema for character filter parameters
 */
export const filterCharacterSchema = z
  .object({
    name: z.string().optional(),
    status: z.string().optional(),
    species: z.string().optional(),
    type: z.string().optional(),
    gender: z.string().optional(),
  })
  .optional();

/**
 * Schema for get characters variables
 */
export const getCharactersVariablesSchema = z.object({
  page: z.number().optional(),
  filter: filterCharacterSchema,
});

/**
 * Schema for get character variables
 */
export const getCharacterVariablesSchema = z.object({
  id: z.string().nullable(),
});

export type Character = z.infer<typeof characterSchema>;
export type CharactersResponse = z.infer<typeof charactersResponseSchema>;
export type CharacterResponse = z.infer<typeof characterResponseSchema>;
export type GetCharactersVariables = z.infer<
  typeof getCharactersVariablesSchema
>;
export type GetCharacterVariables = z.infer<typeof getCharacterVariablesSchema>;
