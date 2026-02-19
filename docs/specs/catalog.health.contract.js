const { z } = require('zod');

const CatalogHealthResponseSchema = z
  .object({
    status: z.enum(['ok', 'degraded', 'error']),
    lastSyncAt: z.string().datetime().nullable(),
    staleMinutes: z.number().int().nonnegative().nullable(),
    issuesOpen: z.number().int().nonnegative(),
    productsAvailable: z.number().int().nonnegative(),
    reasonCodes: z.array(z.string()),
  })
  .strict();

const CatalogHealthSchemas = {
  CatalogHealthResponseSchema,
};

module.exports = {
  CatalogHealthResponseSchema,
  CatalogHealthSchemas,
};
