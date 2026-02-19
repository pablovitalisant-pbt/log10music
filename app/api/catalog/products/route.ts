import {
  CatalogProductsResponseSchema,
} from '../../../../docs/specs/catalog.aggregate.contract.js';
import { createCatalogProductRepo } from '../../../../src/catalog/repositories/catalogProductRepo.js';
import { createCatalogSourceRepo } from '../../../../src/catalog/repositories/catalogSourceRepo.js';
import { buildCatalogAggregate } from '../../../../src/catalog/services/catalogAggregateService.js';

const FALLBACK_PRODUCTS = [
  {
    id: 'product-1',
    model: 'Yamaha HS5',
    brand: 'Yamaha',
    available: true,
    updatedAt: '2026-02-19T12:00:00.000Z',
  },
];

const FALLBACK_SOURCES = [
  {
    catalogProductId: 'product-1',
    vendorId: 'vendor-1',
    vendorName: null,
    fileId: 'file-1',
    fileName: null,
    sheetName: null,
    rowNumber: null,
  },
];

export async function GET(_request: Request) {
  const catalogProductRepo = createCatalogProductRepo({ store: { products: FALLBACK_PRODUCTS } });
  const catalogSourceRepo = createCatalogSourceRepo({ store: { sources: FALLBACK_SOURCES } });
  const aggregate = buildCatalogAggregate({ catalogProductRepo, catalogSourceRepo });
  const payload = CatalogProductsResponseSchema.parse({ items: aggregate.items });
  return Response.json(payload);
}
