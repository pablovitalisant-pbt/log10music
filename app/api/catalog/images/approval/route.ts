import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { z } from 'zod';
import { ADMIN_COOKIE_NAME, getAdminToken } from '../../../../../lib/auth';
import { createCatalogProductRepo } from '../../../../../src/catalog/repositories/catalogProductRepo.js';
import { createProductImageRepo } from '../../../../../src/catalog/repositories/productImageRepo.js';

const ApprovalSchema = z.object({
  productId: z.string().min(2),
  approved: z.boolean(),
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
  const parsed = ApprovalSchema.safeParse(body || {});
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
  }
  const { productId, approved } = parsed.data;
  const catalogProductRepo = createCatalogProductRepo();
  const productImageRepo = createProductImageRepo();
  const product = await catalogProductRepo.getCatalogProductById(productId);
  if (!product) {
    return NextResponse.json({ error: 'Producto no encontrado' }, { status: 404 });
  }

  if (approved) {
    if (!product.imageUrl) {
      return NextResponse.json({ error: 'Producto sin imagen para aprobar' }, { status: 400 });
    }
    const override = await productImageRepo.upsertOverride({
      productId,
      imageUrl: product.imageUrl,
      source: 'manual',
      status: 'approved',
      query: '',
      notes: 'approved',
    });
    await catalogProductRepo.upsertCatalogProduct({
      id: product.id,
      model: product.model,
      brand: product.brand || null,
      available: product.available,
      updatedAt: product.updatedAt,
      imageUrl: override.imageUrl,
      imageSource: override.source,
      imageUpdatedAt: override.updatedAt,
    });
    return NextResponse.json({ ok: true, override });
  }

  await productImageRepo.deleteOverride(productId);
  await catalogProductRepo.upsertCatalogProduct({
    id: product.id,
    model: product.model,
    brand: product.brand || null,
    available: product.available,
    updatedAt: product.updatedAt,
    imageUrl: null,
    imageSource: null,
    imageUpdatedAt: null,
  });
  return NextResponse.json({ ok: true });
}
