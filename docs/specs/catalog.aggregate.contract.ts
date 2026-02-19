import { z } from 'zod';

export const PublicCatalogItemSchema = z
  .object({
    id: z.string(),
    model: z.string(),
    brand: z.string().nullable().optional(),
    available: z.boolean(),
  })
  .strict();

export const CatalogSourceSchema = z
  .object({
    vendorId: z.string(),
    vendorName: z.string().nullable().optional(),
    fileId: z.string(),
    fileName: z.string().nullable().optional(),
    sheetName: z.string().nullable().optional(),
    rowNumber: z.number().int().nullable().optional(),
  })
  .strict();

export const CatalogProductAdminSchema = z
  .object({
    id: z.string(),
    model: z.string(),
    brand: z.string().nullable().optional(),
    available: z.boolean(),
    sourcesAvailable: z.array(CatalogSourceSchema),
    updatedAt: z.string().datetime(),
  })
  .strict();

export const PublicCatalogResponseSchema = z
  .object({
    updatedAt: z.string().datetime(),
    items: z.array(PublicCatalogItemSchema),
  })
  .strict();

export const CatalogProductsResponseSchema = z
  .object({
    items: z.array(CatalogProductAdminSchema),
  })
  .strict();

export const CatalogNotFoundSchema = z
  .object({
    error: z.string(),
  })
  .strict();

export const CatalogAggregateSchemas = {
  PublicCatalogItemSchema,
  CatalogSourceSchema,
  CatalogProductAdminSchema,
  PublicCatalogResponseSchema,
  CatalogProductsResponseSchema,
  CatalogNotFoundSchema,
};
