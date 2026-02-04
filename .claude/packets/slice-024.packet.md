# SLICE PACKET 24

## Metadata
- **Slice:** 24
- **Name:** TESTING: 10.3 Test Data
- **Description:** Implementar lo descrito en: Planificación Exhaustiva de un Proyecto de Software: Log10Music Lead System > 10. Testing > 10.3 Test Data (líneas 192-195).
- **Heading Path:** Planificación Exhaustiva de un Proyecto de Software: Log10Music Lead System > 10. Testing > 10.3 Test Data
- **Lines:** 192-195
- **Estimated Lines:** 8
- **Priority:** high

## Hashes (immutability proof)
- **PRD SHA256:** `c5c09f8f3be3ab29c51b85580d28510e426eeba11654ab6e26c5c489ef5e4cb9`
- **Block SHA256:** `9555d386c2b9494de2231ca8356fae40029fc9b43f46fc6445f0b68215dc25a4`

## PRD Content (exact text for this slice)
```markdown
### 10.3 Test Data

* **Fixtures**: Leads de prueba (`test@test.com`).

```

## Contract
- **Test File:** `tests/contracts/slice-024.test.ts`
- **Requirement:** Cubrir comportamiento descrito en "Planificación Exhaustiva de un Proyecto de Software: Log10Music Lead System > 10. Testing > 10.3 Test Data"
- **RED then GREEN:** YES

## Instructions for Agent

1. Create test in `tests/contracts/slice-024.test.ts`
2. Run `npm run red` → MUST FAIL
3. Implement code (<8 lines)
4. Run `npm run green` → MUST PASS
5. Run `npm run complete 24`
