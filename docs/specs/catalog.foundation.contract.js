const { z } = require('zod');

const VendorSchema = z.object({
  vendorId: z.string(),
  name: z.string(),
});

const SourceFileSchema = z.object({
  fileId: z.string(),
  vendorId: z.string(),
  fileName: z.string(),
  mimeType: z.string(),
  modifiedTime: z.string().datetime(),
  status: z.enum(['parsed_ok', 'needs_mapping', 'failed']),
  parseReport: z.object({}).passthrough().nullable().optional(),
});

const SourceRowSchema = z.object({
  sourceRowId: z.string(),
  vendorId: z.string(),
  fileId: z.string(),
  sheetName: z.string().nullable().optional(),
  rowNumber: z.number().int().nullable().optional(),
  rawRow: z.object({}).passthrough(),
  model: z.string(),
  brand: z.string().nullable().optional(),
  stock: z.number().int().nonnegative(),
  price: z.number().nullable().optional(),
});

const CatalogProductSchema = z.object({
  id: z.string(),
  model: z.string(),
  brand: z.string().nullable(),
  available: z.boolean(),
  updatedAt: z.string().datetime(),
});

const CatalogSourceSchema = z.object({
  catalogProductId: z.string(),
  sourceRowId: z.string(),
  vendorId: z.string(),
  fileId: z.string(),
});

const IssueSchema = z.object({
  issueId: z.string(),
  type: z.enum(['needs_mapping', 'ambiguous_model', 'parse_failed']),
  vendorId: z.string(),
  fileId: z.string(),
  fileName: z.string(),
  detail: z.object({}).passthrough(),
});

const SourceProfileSchema = z.object({
  vendorId: z.string(),
  headerRowHint: z.number().int().nullable().optional(),
  preferredColumns: z.object({}).passthrough().nullable().optional(),
  regexList: z.array(z.string()).nullable().optional(),
});

const SyncStatsSchema = z.object({
  vendorsDetected: z.number().int(),
  filesScanned: z.number().int(),
  filesProcessed: z.number().int(),
  rowsParsed: z.number().int(),
  productsAvailable: z.number().int(),
  issuesCount: z.number().int(),
});

const SyncRunSchema = z.object({
  runId: z.string(),
  startedAt: z.string().datetime(),
  finishedAt: z.string().datetime().nullable().optional(),
  error: z.string().nullable().optional(),
  stats: SyncStatsSchema,
});

const CatalogFoundationSchemas = {
  VendorSchema,
  SourceFileSchema,
  SourceRowSchema,
  CatalogProductSchema,
  CatalogSourceSchema,
  IssueSchema,
  SourceProfileSchema,
  SyncStatsSchema,
  SyncRunSchema,
};

module.exports = {
  VendorSchema,
  SourceFileSchema,
  SourceRowSchema,
  CatalogProductSchema,
  CatalogSourceSchema,
  IssueSchema,
  SourceProfileSchema,
  SyncStatsSchema,
  SyncRunSchema,
  CatalogFoundationSchemas,
};
