import { z } from 'zod';
import { PublicCatalogItemSchema } from './catalog.aggregate.contract';

export const CatalogPublicPageModelSchema = z
  .object({
    updatedAt: z.string().datetime(),
    items: z.array(PublicCatalogItemSchema),
  })
  .strict();

export const CatalogPublicPageSchemas = {
  CatalogPublicPageModelSchema,
};
