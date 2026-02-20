const { z } = require('zod');

const PublicCatalogItemSchema = z
  .object({
    id: z.string(),
    model: z.string(),
    brand: z.string().nullable().optional(),
    available: z.boolean(),
    imageUrl: z.string().url().nullable().optional(),
    imageSource: z.enum(['ml', 'logokit', 'cache']).nullable().optional(),
    imageUpdatedAt: z.string().datetime().nullable().optional(),
  })
  .strict();

const CatalogSourceSchema = z
  .object({
    vendorId: z.string(),
    vendorName: z.string().nullable().optional(),
    fileId: z.string(),
    fileName: z.string().nullable().optional(),
    sheetName: z.string().nullable().optional(),
    rowNumber: z.number().int().nullable().optional(),
  })
  .strict();

const CatalogProductAdminSchema = z
  .object({
    id: z.string(),
    model: z.string(),
    brand: z.string().nullable().optional(),
    available: z.boolean(),
    imageUrl: z.string().url().nullable().optional(),
    imageSource: z.enum(['ml', 'logokit', 'cache']).nullable().optional(),
    imageUpdatedAt: z.string().datetime().nullable().optional(),
    sourcesAvailable: z.array(CatalogSourceSchema),
    updatedAt: z.string().datetime(),
  })
  .strict();

const PublicCatalogResponseSchema = z
  .object({
    updatedAt: z.string().datetime(),
    items: z.array(PublicCatalogItemSchema),
  })
  .strict();

const CatalogProductsResponseSchema = z
  .object({
    items: z.array(CatalogProductAdminSchema),
  })
  .strict();

const CatalogNotFoundSchema = z
  .object({
    error: z.string(),
  })
  .strict();

const CatalogAggregateSchemas = {
  PublicCatalogItemSchema,
  CatalogSourceSchema,
  CatalogProductAdminSchema,
  PublicCatalogResponseSchema,
  CatalogProductsResponseSchema,
  CatalogNotFoundSchema,
};

module.exports = {
  PublicCatalogItemSchema,
  CatalogSourceSchema,
  CatalogProductAdminSchema,
  PublicCatalogResponseSchema,
  CatalogProductsResponseSchema,
  CatalogNotFoundSchema,
  CatalogAggregateSchemas,
};
