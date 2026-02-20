import {
  CatalogProductsResponseSchema,
} from '../../../../docs/specs/catalog.aggregate.contract.js';
import { createCatalogProductRepo } from '../../../../src/catalog/repositories/catalogProductRepo.js';
import { createCatalogSourceRepo } from '../../../../src/catalog/repositories/catalogSourceRepo.js';
import { buildCatalogAggregate } from '../../../../src/catalog/services/catalogAggregateService.js';

export async function GET(_request: Request) {
  const catalogProductRepo = createCatalogProductRepo();
  const catalogSourceRepo = createCatalogSourceRepo();
  const aggregate = await buildCatalogAggregate({ catalogProductRepo, catalogSourceRepo });
  const payload = CatalogProductsResponseSchema.parse({ items: aggregate.items });
  return Response.json(payload);
}
