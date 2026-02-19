# PRD – Módulo de Catálogo Log10Music  
**Extensión del sistema existente “Log10Music Lead System”**

---

## 0. Naturaleza del documento (aclaración crítica)

Este PRD **no define un sistema nuevo**. Define un **módulo adicional** que:

- Vive **dentro del mismo proyecto Next.js** en Vercel.
- Reutiliza: autenticación, layout, panel de administración, base de datos, patrones REST y filosofía del sistema actual.
- **No crea un segundo panel**.
- **No borra ni reemplaza** el panel actual.
- **No modifica** la funcionalidad existente (leads, config de scripts, dashboard), salvo para **agregar** navegación/entrada al módulo de catálogo.

Cualquier implementación que:
- cree un `/admin2` o un dashboard paralelo,
- reemplace `/admin/dashboard`,
- duplique auth o layouts,
- o borre secciones actuales,

**es incorrecta y fuera de alcance**.

---

## 1. Objetivo del Módulo Catálogo

Agregar al sistema existente la capacidad de:

- Publicar un **catálogo online de productos disponibles**.
- Alimentado automáticamente desde **listas de importadoras** almacenadas en Google Drive.
- Mostrarlo al público como apoyo comercial (**no e-commerce**).
- Administrarlo desde el **panel de administración existente**.

El catálogo **no reemplaza** la captación de leads: la **refuerza**.

---

## 2. Alcance funcional

### 2.1 Catálogo público (Frontend)

Nueva sección pública:

- Ruta: `/catalogo`

Características:

- Lista de productos **disponibles**.
- Nombre visible del producto = **modelo oficial de la marca** (útil para SEO/GEO).
- **No muestra**:
  - precios,
  - cantidades de stock,
  - ni importadora/proveedor.
- Estado único visible: **“Disponible”**.
- CTA principal: **“Cotizar”** → dirige al flujo de contacto/diagnóstico existente (según implementación actual).

Objetivo:
> Dar confianza, activar intención y elevar la tasa de conversión del lead.

---

### 2.2 Catálogo admin (extensión del panel existente)

El panel de administración actual se **extiende**, no se duplica.

- Ruta sugerida (orientativa): `/admin/dashboard/catalogo`  
  (También puede ser una pestaña interna; el punto es **no crear** un panel paralelo.)

Desde esta sección el administrador puede:

1. **Sincronizar catálogo desde Google Drive**.
2. Ver importadoras detectadas (subcarpetas).
3. Ver archivos fuente y su estado.
4. Ver productos agregados y su disponibilidad.
5. Resolver problemas de parseo (issues) con reglas por importadora.

---

## 3. Integración con el sistema existente

### 3.1 Arquitectura (no se altera)

Se mantiene:

- Next.js 14+ (App Router).
- API Routes existentes.
- Supabase/Postgres (o el storage vigente del proyecto).
- Auth existente (JWT / NextAuth / Supabase Auth, según implementación actual).
- Layout/estilos de Stitch (landing renderizada desde `docs/UI Design/code.html` vía `lib/stitch.ts`, overrides en `app/globals.css`).

El catálogo se implementa como:

- **Nuevo módulo** (Catalog) dentro del mismo repo.
- Nuevas tablas/entidades.
- Nuevos endpoints.
- Nuevas vistas **dentro** del admin existente.

### 3.2 Autenticación y permisos

- El catálogo admin usa el mismo rol/perfil de acceso del panel actual (p. ej. “SuperAdmin”).
- No se crean nuevos roles.
- No se altera el sistema de login.

---

## 4. Fuente de datos (Google Drive)

### 4.1 Estructura de Drive (obligatoria)

Carpeta raíz (configurable por env var) llamada **“Listas de Precios”**:

```
Listas de Precios/
  ├── Importadora A/
  ├── Importadora B/
  └── Importadora C/
```

- Cada **subcarpeta = una importadora**.
- Los archivos:
  - pueden llamarse como sea,
  - pueden cambiar estructura,
  - pueden ser Excel o CSV.
- PDFs:
  - se aceptan como referencia,
  - **no generan productos**.

### 4.2 Identidad de importadora

- `vendorId = folderId` (Drive).
- `vendorName = nombre de subcarpeta`.

---

## 5. Modelo de datos (nuevo)

Se **agregan** tablas; no se modifican las existentes (`leads`, `site_config`, etc.).

### 5.1 Nuevas entidades mínimas

#### `vendors`
- `id` (Drive folderId)
- `name`

#### `source_files`
- `id` (Drive fileId)
- `vendor_id`
- `file_name`
- `mime_type`
- `modified_time`
- `status` enum: `parsed_ok | needs_mapping | failed`
- `parse_report` (json)

#### `source_rows` (producto por importadora)
- `id`
- `vendor_id`
- `file_id`
- `sheet_name` (nullable)
- `row_number` (nullable)
- `raw_row` (json)
- `model` (string)
- `brand` (nullable)
- `stock` (int)
- `price` (nullable, interno)

#### `catalog_products` (agregado público)
- `id` (canonical key)
- `model`
- `brand` (nullable)
- `available` (bool)
- `updated_at`

#### `catalog_sources` (relación producto ↔ fuentes disponibles)
- `catalog_product_id`
- `source_row_id`
- `vendor_id`
- `file_id`

*(Opcional)* `sync_runs` para auditoría de ejecuciones.

---

## 6. Reglas de negocio (no negociables)

1. Un producto se publica **solo si** existe al menos una importadora con `stock > 0`.
2. El catálogo público **nunca** muestra stock numérico.
3. El catálogo público **nunca** muestra precio.
4. Nombre comercial visible = **modelo oficial de la marca**.
5. El modelo:
   - puede venir en cualquier columna,
   - o embebido en una descripción.
6. Si no se puede extraer `model` y `stock` con confianza:
   - **no se publica**,
   - se crea un **issue** visible en admin.
7. El catálogo **no vende**: habilita cotización/contacto.
8. El admin siempre puede ver trazabilidad completa:
   - importadora,
   - archivo,
   - hoja/fila,
   - y datos raw.

---

## 7. Normalización de datos “tolerante al caos”

### 7.1 Principios
- No confiar en nombres de archivo.
- No confiar en nombres de columna.
- Inferir por contenido y patrones.

### 7.2 Detección automática
- Detección de header row (best effort, escanear primeras N filas).
- Inferir `stock` por distribución numérica (enteros, presencia de 0, etc.).
- Inferir `model` con heurística + regex:
  - tokens alfanuméricos compactos (mezcla letras/números),
  - normalización (quitar guiones/espacios/comillas),
  - filtros anti-ruido (años, pulgadas, números sueltos).

### 7.3 Aprendizaje por importadora (SourceProfile)
Guardar reglas por `vendorId` para mejorar precisión:

- `headerRowHint` (opcional).
- `preferredColumns` (opcional).
- `regexList` para extraer modelo (opcional).
- Normalizaciones adicionales.

Cuando un archivo/fila cae en issue, el admin puede definir reglas y reprocesar.

---

## 8. Panel de administración – Catálogo (dentro del admin existente)

### 8.1 Funciones nuevas
- Botón **“Sincronizar desde Drive”** (+ opción “sincronización completa/force”).
- Estado:
  - última sync,
  - productos disponibles,
  - issues pendientes,
  - métricas de procesamiento.
- Secciones/pestañas:
  - Productos
  - Importadoras
  - Archivos
  - Issues

### 8.2 Resolución de issues
- Para `needs_mapping` / `ambiguous_model`:
  - definir regex de modelo,
  - definir columnas preferidas,
  - reprocesar archivos afectados.

---

## 9. API (extensión REST)

Se agregan endpoints; **no se modifican** los existentes (`/api/leads`, `/api/config`, etc.).

Sugeridos:

- `POST /api/catalog/sync` (admin-only)
- `GET /api/catalog/status` (admin-only)
- `GET /api/catalog/public` (público; cacheable)
- `GET /api/catalog/products` (admin-only)
- `GET /api/catalog/issues` (admin-only)
- `POST /api/catalog/issues/{id}/resolve` (admin-only)

---

## 10. Frontend

### 10.1 Público
- Ruta `/catalogo`:
  - consume `GET /api/catalog/public`
  - renderiza cards coherentes con el estilo actual (Stitch + globals.css)
  - búsqueda por modelo
  - CTA Cotizar integrado con el flujo actual

### 10.2 Admin
- Extiende el dashboard existente con un módulo “Catálogo”.
- Respeta componentes/layout actuales; no reemplaza nada.

---

## 11. Testing (extensión de la estrategia existente)

- Unit tests:
  - parseo tabular,
  - extracción de modelo,
  - inferencia de stock.
- Integration tests:
  - Sync Drive → persistencia → agregado.
- E2E (Playwright):
  - producto aparece/desaparece según stock,
  - admin ve trazabilidad,
  - público no ve stock/precio.

---

## 12. Riesgos y mitigación

| Riesgo | Mitigación |
|---|---|
| Excels caóticos / columnas raras | Heurísticas + SourceProfile por importadora |
| Publicar productos erróneos | No publicar si hay duda; issues en admin |
| Codex crea un segundo admin | No-negociable: extender panel existente; rutas dentro de dashboard actual |
| Performance al procesar Drive | Sync manual + incremental; procesar solo modificados |

---

## 13. Criterios de aceptación

1. El admin existente sigue funcionando **sin cambios regresivos**.
2. El catálogo aparece como **sección nueva dentro del panel existente**.
3. Ningún producto con stock 0 aparece en `/catalogo`.
4. En `/catalogo` **no** se muestra precio ni stock numérico.
5. El nombre visible del producto es el **modelo**.
6. El admin puede rastrear origen exacto por producto:
   - importadora + archivo + hoja/fila.
7. Archivos no interpretables se registran como issues sin romper la sincronización completa.

---
