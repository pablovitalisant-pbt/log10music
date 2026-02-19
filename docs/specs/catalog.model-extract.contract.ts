import { z } from 'zod';

export const ModelExtractRequestSchema = z
  .object({
    vendorId: z.string(),
    fileId: z.string(),
    sourceRowId: z.string(),
    rawRow: z.object({}).passthrough(),
  })
  .strict();

export const ModelExtractResponseSchema = z
  .object({
    vendorId: z.string(),
    fileId: z.string(),
    sourceRowId: z.string(),
    status: z.enum(['extracted', 'ambiguous', 'failed']),
    model: z.string().nullable().optional(),
    brand: z.string().nullable().optional(),
    issuesCreated: z.number().int().nonnegative(),
  })
  .strict();

export const ModelExtractBadRequestSchema = z
  .object({
    error: z.string(),
  })
  .strict();

export const CatalogModelExtractSchemas = {
  ModelExtractRequestSchema,
  ModelExtractResponseSchema,
  ModelExtractBadRequestSchema,
};
