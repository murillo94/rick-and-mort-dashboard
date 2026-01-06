import { z } from "zod";

const nullableNumber = z
  .number()
  .nullable()
  .transform((v) => v ?? 0);

/**
 * Schema for pagination information
 */
export const paginationInfoSchema = z.object({
  count: nullableNumber,
  pages: nullableNumber,
  next: nullableNumber,
  prev: nullableNumber,
});

export type PaginationInfo = z.infer<typeof paginationInfoSchema>;
