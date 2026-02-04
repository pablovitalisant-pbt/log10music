const { getStorageTypes } = require('../../src/database/storageTypes');

describe('slice-007: tipos de almacenamiento', () => {
  it('define almacenamiento relacional, cache, object storage y exclusiones', () => {
    const storage = getStorageTypes();
    expect(storage.relational).toBe('PostgreSQL (Almacenamiento de leads y scripts).');
    expect(storage.noSql).toBe('No aplica.');
    expect(storage.search).toBe('No aplica.');
    expect(storage.cache).toMatch(/Redis/);
    expect(storage.objectStorage).toBe('AWS S3 o Vercel Blob para imágenes de equipos de audio.');
    expect(storage.dataWarehousing).toBe('No aplica.');
  });
});
