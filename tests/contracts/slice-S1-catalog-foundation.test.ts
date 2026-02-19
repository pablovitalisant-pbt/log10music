const {
  createCatalogStore,
  addVendor,
  listVendors,
  addCatalogProduct,
  listCatalogProducts,
} = require('../../src/catalog');
const {
  VendorSchema,
  CatalogProductSchema,
} = require('../../docs/specs/catalog.foundation.contract');

describe('slice-S1: catalog foundation', () => {
  it('integration: agrega y lista vendors', () => {
    const store = createCatalogStore();
    const vendor = { vendorId: 'vendor-1', name: 'Importadora A' };

    addVendor(store, vendor);
    const vendors = listVendors(store);

    expect(vendors).toHaveLength(1);
    expect(vendors[0]).toEqual(vendor);
  });

  it('contract: valida vendor con schema', () => {
    const store = createCatalogStore();

    let schemaError = null;
    try {
      VendorSchema.parse({ name: 'Importadora A' });
    } catch (error) {
      schemaError = error;
    }
    expect(schemaError !== null).toBe(true);

    let addError = null;
    try {
      addVendor(store, { name: 'Importadora A' });
    } catch (error) {
      addError = error;
    }
    expect(addError !== null).toBe(true);
  });

  it('integration: agrega y lista productos agregados', () => {
    const store = createCatalogStore();
    const product = {
      id: 'yamaha-hs5',
      model: 'Yamaha HS5',
      brand: 'Yamaha',
      available: true,
      updatedAt: '2026-02-19T12:00:00.000Z',
    };

    addCatalogProduct(store, product);
    const products = listCatalogProducts(store);

    expect(products).toHaveLength(1);
    expect(products[0]).toEqual(product);
  });

  it('contract: valida catalog product con schema', () => {
    const store = createCatalogStore();
    const invalidProduct = {
      id: 'x',
      model: 'Yamaha HS5',
      available: true,
      updatedAt: 'no-date',
    };

    let schemaError = null;
    try {
      CatalogProductSchema.parse(invalidProduct);
    } catch (error) {
      schemaError = error;
    }
    expect(schemaError !== null).toBe(true);

    let addError = null;
    try {
      addCatalogProduct(store, invalidProduct);
    } catch (error) {
      addError = error;
    }
    expect(addError !== null).toBe(true);
  });

  it('smoke: flujo base de catalogo', () => {
    const store = createCatalogStore();
    const vendor = { vendorId: 'vendor-2', name: 'Importadora B' };
    const product = {
      id: 'digico-sd12',
      model: 'DiGiCo SD12',
      brand: 'DiGiCo',
      available: true,
      updatedAt: '2026-02-19T12:00:00.000Z',
    };

    addVendor(store, vendor);
    addCatalogProduct(store, product);

    expect(listVendors(store)).toHaveLength(1);
    expect(listCatalogProducts(store)).toHaveLength(1);
  });
});
