import { z } from 'zod';

export const CatalogImageRequestSchema = z
  .object({
    query: z.string().min(2),
    limit: z.number().int().min(1).max(5).optional(),
  })
  .strict();

export const CatalogImageItemSchema = z
  .object({
    url: z.string().url(),
    source: z.enum(['ml', 'cache']),
    updatedAt: z.string().datetime(),
  })
  .strict();

export const CatalogImageResponseSchema = z
  .object({
    query: z.string().min(2),
    items: z.array(CatalogImageItemSchema),
  })
  .strict();

export const CatalogProductImageSchema = z
  .object({
    id: z.string(),
    model: z.string(),
    brand: z.string().nullable().optional(),
    imageUrl: z.string().url().nullable().optional(),
    imageSource: z.enum(['ml', 'cache']).nullable().optional(),
    imageUpdatedAt: z.string().datetime().nullable().optional(),
  })
  .strict();

export const CatalogProductsImagesResponseSchema = z
  .object({
    items: z.array(CatalogProductImageSchema),
  })
  .strict();

export const CatalogImageBadRequestSchema = z
  .object({
    error: z.string(),
  })
  .strict();
