import {
  PublicCatalogResponseSchema,
} from '../../../../docs/specs/catalog.aggregate.contract.js';
import { createCatalogProductRepo } from '../../../../src/catalog/repositories/catalogProductRepo.js';
import { createCatalogSourceRepo } from '../../../../src/catalog/repositories/catalogSourceRepo.js';
import { buildCatalogAggregate } from '../../../../src/catalog/services/catalogAggregateService.js';

export async function GET(_request: Request) {
  const catalogProductRepo = createCatalogProductRepo();
  const catalogSourceRepo = createCatalogSourceRepo();
  const aggregate = buildCatalogAggregate({ catalogProductRepo, catalogSourceRepo });
  const items = aggregate.items.filter((item) => item.available === true).map((item) => ({
    id: item.id,
    model: item.model,
    brand: item.brand ?? null,
    available: true,
  }));
  const payload = PublicCatalogResponseSchema.parse({
    updatedAt: aggregate.updatedAt,
    items,
  });
  return Response.json(payload);
}
