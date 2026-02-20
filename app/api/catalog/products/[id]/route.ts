import {
  CatalogNotFoundSchema,
  CatalogProductAdminSchema,
} from '../../../../../docs/specs/catalog.aggregate.contract.js';
import { createCatalogProductRepo } from '../../../../../src/catalog/repositories/catalogProductRepo.js';
import { createCatalogSourceRepo } from '../../../../../src/catalog/repositories/catalogSourceRepo.js';
import { buildCatalogAggregate } from '../../../../../src/catalog/services/catalogAggregateService.js';

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const catalogProductRepo = createCatalogProductRepo();
  const catalogSourceRepo = createCatalogSourceRepo();
  const aggregate = await buildCatalogAggregate({ catalogProductRepo, catalogSourceRepo });
  const { id } = await params;
  const product = aggregate.items.find((item) => item.id === id) || null;
  if (!product) {
    const payload = CatalogNotFoundSchema.parse({ error: 'Catalog product not found' });
    return Response.json(payload, { status: 404 });
  }
  const payload = CatalogProductAdminSchema.parse(product);
  return Response.json(payload);
}
