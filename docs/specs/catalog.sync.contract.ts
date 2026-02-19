import { z } from 'zod';
import { IssueSchema, SyncRunSchema } from './catalog.foundation.contract';

export const SyncScopeSchema = z
  .object({
    vendorId: z.string().optional(),
    fileId: z.string().optional(),
  })
  .strict();

export const SyncRequestSchema = z
  .object({
    scope: SyncScopeSchema.optional(),
    force: z.boolean().optional(),
  })
  .strict();

export const SyncRunsResponseSchema = z
  .object({
    items: z.array(SyncRunSchema),
  })
  .strict();

export const IssuesResponseSchema = z
  .object({
    items: z.array(IssueSchema),
  })
  .strict();

export const SyncBadRequestSchema = z
  .object({
    error: z.string(),
  })
  .strict();

export const CatalogSyncSchemas = {
  SyncScopeSchema,
  SyncRequestSchema,
  SyncRunsResponseSchema,
  IssuesResponseSchema,
  SyncBadRequestSchema,
};
