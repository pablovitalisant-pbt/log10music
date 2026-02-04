# Proyecto PBT-ULTRA v2.0-FINAL

Generado automáticamente con enforcement duro.

## Para el Agente AI

**ORDEN DE LECTURA:**

1. `.claude/AGENT_INSTRUCTIONS.md` ← Protocolo completo
2. `.claude/SLICES_PLAN.json` ← Plan de 69 slices  
3. `PRD_EXHAUSTIVO.md` ← Especificación

## Protocolo (7 pasos)

```bash
npm run next      # 1. Genera packet
                  # 2. Leer packet
                  # 3. Crear test
npm run red       # 4. Verifica RED
                  # 5. Implementar
npm run green     # 6. Verifica GREEN
npm run complete N # 7. Completar
```

## Enforcement Duro

- ✅ RED previo obligatorio
- ✅ GREEN posterior obligatorio
- ✅ Line limit <200
- ✅ PRD inmutable
- ✅ Packets inmutables
