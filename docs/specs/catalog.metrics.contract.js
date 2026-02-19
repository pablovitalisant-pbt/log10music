const { z } = require('zod');

const CatalogMetricsResponseSchema = z
  .object({
    windowHours: z.number().int(),
    runsTotal: z.number().int().nonnegative(),
    runsLast24h: z.number().int().nonnegative(),
    issuesTotal: z.number().int().nonnegative(),
    issuesAmbiguous: z.number().int().nonnegative(),
    filesProcessedTotal: z.number().int().nonnegative(),
    rowsParsedTotal: z.number().int().nonnegative(),
  })
  .strict();

const CatalogMetricsSchemas = {
  CatalogMetricsResponseSchema,
};

module.exports = {
  CatalogMetricsResponseSchema,
  CatalogMetricsSchemas,
};
