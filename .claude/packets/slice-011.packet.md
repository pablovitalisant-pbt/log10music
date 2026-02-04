# SLICE PACKET 11

## Metadata
- **Slice:** 11
- **Name:** APIS: 5.2 Endpoints Detallados
- **Description:** Implementar lo descrito en: Planificación Exhaustiva de un Proyecto de Software: Log10Music Lead System > 5. APIs y Contratos de Interfaz > 5.2 Endpoints Detallados (líneas 90-96).
- **Heading Path:** Planificación Exhaustiva de un Proyecto de Software: Log10Music Lead System > 5. APIs y Contratos de Interfaz > 5.2 Endpoints Detallados
- **Lines:** 90-96
- **Estimated Lines:** 14
- **Priority:** high

## Hashes (immutability proof)
- **PRD SHA256:** `c5c09f8f3be3ab29c51b85580d28510e426eeba11654ab6e26c5c489ef5e4cb9`
- **Block SHA256:** `82245a9278134b94eb73d85b28b4e04a142eaa58d8450ed7c8256a09742d0515`

## PRD Content (exact text for this slice)
```markdown
### 5.2 Endpoints Detallados

* `POST /api/leads`: Recibe datos del formulario de la landing.
* `GET /api/config`: Obtiene los scripts para inyectar (público pero cacheado).
* `PUT /api/config`: Actualiza los scripts (requiere Auth).
* `GET /api/leads`: Lista de capturas para el admin (requiere Auth).

```

## Contract
- **Test File:** `tests/contracts/slice-011.test.ts`
- **Requirement:** Cubrir comportamiento descrito en "Planificación Exhaustiva de un Proyecto de Software: Log10Music Lead System > 5. APIs y Contratos de Interfaz > 5.2 Endpoints Detallados"
- **RED then GREEN:** YES

## Instructions for Agent

1. Create test in `tests/contracts/slice-011.test.ts`
2. Run `npm run red` → MUST FAIL
3. Implement code (<14 lines)
4. Run `npm run green` → MUST PASS
5. Run `npm run complete 11`
