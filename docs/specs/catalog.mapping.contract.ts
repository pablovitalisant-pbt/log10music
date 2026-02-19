import { z } from 'zod';

export const ModelMappingRequestSchema = z
  .object({
    issueId: z.string(),
    vendorId: z.string(),
    sourceRowId: z.string(),
    model: z.string().min(2),
    brand: z.string().nullable().optional(),
  })
  .strict();

export const ModelMappingResponseSchema = z
  .object({
    issueId: z.string(),
    vendorId: z.string(),
    sourceRowId: z.string(),
    resolved: z.boolean(),
    model: z.string().min(2),
    brand: z.string().nullable().optional(),
    issuesResolved: z.number().int().nonnegative(),
  })
  .strict();

export const MappingBadRequestSchema = z
  .object({
    error: z.string(),
  })
  .strict();

export const CatalogMappingSchemas = {
  ModelMappingRequestSchema,
  ModelMappingResponseSchema,
  MappingBadRequestSchema,
};
