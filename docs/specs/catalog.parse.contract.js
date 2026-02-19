const { z } = require('zod');

const ParseRequestSchema = z
  .object({
    fileId: z.string(),
    vendorId: z.string(),
    force: z.boolean().optional(),
  })
  .strict();

const ParseResultSchema = z
  .object({
    fileId: z.string(),
    vendorId: z.string(),
    status: z.enum(['parsed_ok', 'needs_mapping', 'failed']),
    rowsParsed: z.number().int().nonnegative(),
    issuesCreated: z.number().int().nonnegative(),
    sample: z.object({}).passthrough().nullable().optional(),
  })
  .strict();

const ParseBadRequestSchema = z
  .object({
    error: z.string(),
  })
  .strict();

const CatalogParseSchemas = {
  ParseRequestSchema,
  ParseResultSchema,
  ParseBadRequestSchema,
};

module.exports = {
  ParseRequestSchema,
  ParseResultSchema,
  ParseBadRequestSchema,
  CatalogParseSchemas,
};
