const { z } = require('zod');
const { PublicCatalogItemSchema } = require('./catalog.aggregate.contract');

const CatalogPublicPageModelSchema = z
  .object({
    updatedAt: z.string().datetime(),
    items: z.array(PublicCatalogItemSchema),
  })
  .strict();

const CatalogPublicPageSchemas = {
  CatalogPublicPageModelSchema,
};

module.exports = {
  CatalogPublicPageModelSchema,
  CatalogPublicPageSchemas,
};
