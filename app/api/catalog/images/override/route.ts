import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { z } from 'zod';
import { ADMIN_COOKIE_NAME, getAdminToken } from '../../../../../lib/auth';
import { createCatalogProductRepo } from '../../../../../src/catalog/repositories/catalogProductRepo.js';
import { createProductImageRepo } from '../../../../../src/catalog/repositories/productImageRepo.js';

const OverrideSchema = z.object({
  productId: z.string().min(2),
  imageUrl: z.string().url(),
  source: z.string().optional(),
  query: z.string().optional(),
  notes: z.string().optional(),
});

async function isAdmin() {
  const cookieStore = await cookies();
  return cookieStore.get(ADMIN_COOKIE_NAME)?.value === getAdminToken();
}

export async function POST(request: Request) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  let body = null;
  try {
    body = await request.json();
  } catch (_error) {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }
  const parsed = OverrideSchema.safeParse(body || {});
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
  }
  const { productId, imageUrl, source, query, notes } = parsed.data;
  const catalogProductRepo = createCatalogProductRepo();
  const product = await catalogProductRepo.getCatalogProductById(productId);
  if (!product) {
    return NextResponse.json({ error: 'Producto no encontrado' }, { status: 404 });
  }
  const productImageRepo = createProductImageRepo();
  const override = await productImageRepo.upsertOverride({
    productId,
    imageUrl,
    source: source || 'manual',
    status: 'approved',
    query: query || '',
    notes: notes || '',
  });
  await catalogProductRepo.upsertCatalogProduct({
    id: product.id,
    model: product.model,
    brand: product.brand || null,
    available: product.available,
    updatedAt: product.updatedAt,
    imageUrl: override.imageUrl,
    imageSource: override.source || 'manual',
    imageUpdatedAt: override.updatedAt,
  });
  return NextResponse.json({ ok: true, override });
}
