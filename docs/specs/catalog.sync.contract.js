const { z } = require('zod');
const { IssueSchema, SyncRunSchema } = require('./catalog.foundation.contract');

const SyncScopeSchema = z
  .object({
    vendorId: z.string().optional(),
    fileId: z.string().optional(),
  })
  .strict();

const SyncRequestSchema = z
  .object({
    scope: SyncScopeSchema.optional(),
    force: z.boolean().optional(),
  })
  .strict();

const SyncRunsResponseSchema = z
  .object({
    items: z.array(SyncRunSchema),
  })
  .strict();

const IssuesResponseSchema = z
  .object({
    items: z.array(IssueSchema),
  })
  .strict();

const SyncBadRequestSchema = z
  .object({
    error: z.string(),
  })
  .strict();

const CatalogSyncSchemas = {
  SyncScopeSchema,
  SyncRequestSchema,
  SyncRunsResponseSchema,
  IssuesResponseSchema,
  SyncBadRequestSchema,
};

module.exports = {
  SyncScopeSchema,
  SyncRequestSchema,
  SyncRunsResponseSchema,
  IssuesResponseSchema,
  SyncBadRequestSchema,
  CatalogSyncSchemas,
};
