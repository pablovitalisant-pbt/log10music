# SLICE PACKET 9

## Metadata
- **Slice:** 9
- **Name:** AUTH: 6. Autenticación y Autorización
- **Description:** Implementar lo descrito en: Planificación Exhaustiva de un Proyecto de Software: Log10Music Lead System > 6. Autenticación y Autorización (líneas 103-111).
- **Heading Path:** Planificación Exhaustiva de un Proyecto de Software: Log10Music Lead System > 6. Autenticación y Autorización
- **Lines:** 103-111
- **Estimated Lines:** 18
- **Priority:** critical

## Hashes (immutability proof)
- **PRD SHA256:** `c5c09f8f3be3ab29c51b85580d28510e426eeba11654ab6e26c5c489ef5e4cb9`
- **Block SHA256:** `fdc7afb794a45be56fe47d584e5f6f9f79f73c60429e13cc2b04ef0cf6b4a607`

## PRD Content (exact text for this slice)
```markdown
## 6. Autenticación y Autorización

* **Método de autenticación**: JWT (JSON Web Tokens).
* **Providers**: NextAuth.js o Supabase Auth.
* **Modelo de permisos**: RBAC (Admin solamente).
* **Roles y permisos**: Único rol "SuperAdmin" con acceso total al panel.
* **Gestión de tokens**: Almacenados en cookies HttpOnly para seguridad.
* **MFA**: Recomendado para el acceso al panel de control.

```

## Contract
- **Test File:** `tests/contracts/slice-009.test.ts`
- **Requirement:** Cubrir comportamiento descrito en "Planificación Exhaustiva de un Proyecto de Software: Log10Music Lead System > 6. Autenticación y Autorización"
- **RED then GREEN:** YES

## Instructions for Agent

1. Create test in `tests/contracts/slice-009.test.ts`
2. Run `npm run red` → MUST FAIL
3. Implement code (<18 lines)
4. Run `npm run green` → MUST PASS
5. Run `npm run complete 9`
