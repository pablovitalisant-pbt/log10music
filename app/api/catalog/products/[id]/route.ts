import {
  CatalogNotFoundSchema,
  CatalogProductAdminSchema,
} from '../../../../../docs/specs/catalog.aggregate.contract.js';
import { createCatalogProductRepo } from '../../../../../src/catalog/repositories/catalogProductRepo.js';
import { createCatalogSourceRepo } from '../../../../../src/catalog/repositories/catalogSourceRepo.js';
import { buildCatalogAggregate } from '../../../../../src/catalog/services/catalogAggregateService.js';

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

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const catalogProductRepo = createCatalogProductRepo({ store: { products: FALLBACK_PRODUCTS } });
  const catalogSourceRepo = createCatalogSourceRepo({ store: { sources: FALLBACK_SOURCES } });
  const aggregate = buildCatalogAggregate({ catalogProductRepo, catalogSourceRepo });
  const { id } = await params;
  const product = aggregate.items.find((item) => item.id === id) || null;
  if (!product) {
    const payload = CatalogNotFoundSchema.parse({ error: 'Catalog product not found' });
    return Response.json(payload, { status: 404 });
  }
  const payload = CatalogProductAdminSchema.parse(product);
  return Response.json(payload);
}
