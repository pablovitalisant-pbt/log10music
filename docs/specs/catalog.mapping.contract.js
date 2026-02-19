const { z } = require('zod');

const ModelMappingRequestSchema = z
  .object({
    issueId: z.string(),
    vendorId: z.string(),
    sourceRowId: z.string(),
    model: z.string().min(2),
    brand: z.string().nullable().optional(),
  })
  .strict();

const ModelMappingResponseSchema = z
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

const MappingBadRequestSchema = z
  .object({
    error: z.string(),
  })
  .strict();

const CatalogMappingSchemas = {
  ModelMappingRequestSchema,
  ModelMappingResponseSchema,
  MappingBadRequestSchema,
};

module.exports = {
  ModelMappingRequestSchema,
  ModelMappingResponseSchema,
  MappingBadRequestSchema,
  CatalogMappingSchemas,
};
