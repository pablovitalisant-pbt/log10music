# SLICE PACKET 6

## Metadata
- **Slice:** 6
- **Name:** DATABASE: 4.1 Diseño de Datos
- **Description:** Implementar lo descrito en: Planificación Exhaustiva de un Proyecto de Software: Log10Music Lead System > 4. Bases de Datos y Almacenamiento > 4.1 Diseño de Datos (líneas 56-66).
- **Heading Path:** Planificación Exhaustiva de un Proyecto de Software: Log10Music Lead System > 4. Bases de Datos y Almacenamiento > 4.1 Diseño de Datos
- **Lines:** 56-66
- **Estimated Lines:** 22
- **Priority:** critical

## Hashes (immutability proof)
- **PRD SHA256:** `c5c09f8f3be3ab29c51b85580d28510e426eeba11654ab6e26c5c489ef5e4cb9`
- **Block SHA256:** `aaf870d20922a8929a1f343937c95c7f21ffb888336ce53132a7cae8b063117a`

## PRD Content (exact text for this slice)
```markdown
### 4.1 Diseño de Datos

* **Modelo de datos conceptual**: Relación simple entre Configuración de Sitio y Registros de Leads.
* **Esquemas de bases de datos**:
* `leads`: `id` (UUID), `full_name`, `company`, `phone`, `source` (página de origen), `created_at`.
* `site_config`: `id`, `header_code` (TEXT), `footer_code` (TEXT), `updated_at`.


* **Particionamiento/Sharding**: No requerido inicialmente.
* **Versionamiento de esquemas**: Migraciones mediante SQL o Prisma.

```

## Contract
- **Test File:** `tests/contracts/slice-006.test.ts`
- **Requirement:** Cubrir comportamiento descrito en "Planificación Exhaustiva de un Proyecto de Software: Log10Music Lead System > 4. Bases de Datos y Almacenamiento > 4.1 Diseño de Datos"
- **RED then GREEN:** YES

## Instructions for Agent

1. Create test in `tests/contracts/slice-006.test.ts`
2. Run `npm run red` → MUST FAIL
3. Implement code (<22 lines)
4. Run `npm run green` → MUST PASS
5. Run `npm run complete 6`
