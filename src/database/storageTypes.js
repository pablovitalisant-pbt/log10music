function getStorageTypes() {
  return {
    relational: 'PostgreSQL (Almacenamiento de leads y scripts).',
    noSql: 'No aplica.',
    search: 'No aplica.',
    cache: 'Redis para almacenar los strings del header/footer y evitar consultas constantes a la DB.',
    objectStorage: 'AWS S3 o Vercel Blob para imágenes de equipos de audio.',
    dataWarehousing: 'No aplica.'
  };
}

module.exports = { getStorageTypes };
