const { z } = require('zod');

const ModelExtractRequestSchema = z
  .object({
    vendorId: z.string(),
    fileId: z.string(),
    sourceRowId: z.string(),
    rawRow: z.object({}).passthrough(),
  })
  .strict();

const ModelExtractResponseSchema = z
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

const ModelExtractBadRequestSchema = z
  .object({
    error: z.string(),
  })
  .strict();

const CatalogModelExtractSchemas = {
  ModelExtractRequestSchema,
  ModelExtractResponseSchema,
  ModelExtractBadRequestSchema,
};

module.exports = {
  ModelExtractRequestSchema,
  ModelExtractResponseSchema,
  ModelExtractBadRequestSchema,
  CatalogModelExtractSchemas,
};
