import { fetchPublicCatalog } from '../../src/catalog/publicCatalogClient';

export default async function CatalogoPage() {
  const data = await fetchPublicCatalog();
  return (
    <main>
      <h1>Catálogo</h1>
      <p>Actualizado: {data.updatedAt}</p>
      <ul>
        {data.items.map((item) => (
          <li key={item.id}>{item.model}</li>
        ))}
      </ul>
    </main>
  );
}
