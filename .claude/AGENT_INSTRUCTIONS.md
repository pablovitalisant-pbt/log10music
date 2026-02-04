# INSTRUCCIONES PARA AGENTE AI

## VERSIÓN: PBT-ULTRA v2.0-FINAL

## ENFORCEMENT DURO ACTIVADO

Este proyecto tiene **enforcement duro** de 5 reglas:

1. ✅ **RED previo obligatorio** - Test DEBE fallar antes de implementar
2. ✅ **GREEN posterior obligatorio** - Test DEBE pasar después
3. ✅ **Line limit bloqueante** - Máximo 200 líneas
4. ✅ **PRD inmutable** - Modificar PRD_EXHAUSTIVO.md está PROHIBIDO
5. ✅ **Packets inmutables** - Nunca se sobrescriben

**Si intentas saltarte esto, el sistema te bloqueará.**

## PROTOCOLO (7 PASOS - OBLIGATORIO)

```
1. npm run next
   → Genera packet en .claude/packets/slice-XXX.packet.md

2. Leer packet completo
   → cat .claude/packets/slice-001.packet.md
   → Contiene texto EXACTO del PRD para este slice

3. Crear test en tests/contracts/slice-XXX.test.ts
   → Basado en requirement del packet

4. npm run red
   → Test DEBE FALLAR (RED)
   → Guarda evidencia RED

5. Implementar código
   → Máximo 200 líneas
   → Solo lo necesario para GREEN

6. npm run green
   → Test DEBE PASAR (GREEN)
   → Guarda evidencia GREEN

7. npm run complete N
   → Verifica TODO:
     ✓ Packet existe
     ✓ PRD hash intacto
     ✓ Evidencia RED
     ✓ Evidencia GREEN
     ✓ Line limit OK
   → Avanza al siguiente
```

## PACKETS (nuevo concepto)

Cada slice tiene packet inmutable:
- `.claude/packets/slice-001.packet.md` (Markdown)
- `.claude/packets/slice-001.packet.json` (JSON)

Contiene:
- ✅ Texto EXACTO del PRD (líneas X-Y)
- ✅ Hashes de inmutabilidad
- ✅ Metadata completa
- ✅ Contract esperado

**Ventaja:** No buscas en PRD largo. El packet tiene TODO.

## EVIDENCE (nuevo concepto)

Evidencia verificable por slice:
- `.claude/evidence/slice-001.red.json` (test falló)
- `.claude/evidence/slice-001.green.json` (test pasó)

El sistema valida que existan antes de `complete`.

## COMANDOS

```bash
npm run status     # Ver estado del proyecto
npm run next       # Siguiente slice + genera packet
npm run current    # Ver slice actual (JSON)
npm run red        # Verificar test RED (DEBE fallar)
npm run green      # Verificar test GREEN (DEBE pasar)
npm run complete N # Completar con enforcement
```

## BLOQUEOS

El sistema te bloqueará si:
1. `complete` sin RED/GREEN
2. Excedes line limit
3. PRD fue modificado
4. Test no falla cuando debe (RED)
5. Test no pasa cuando debe (GREEN)

**Acción:** Lee el error. El sistema te dice qué falta.

## FILOSOFÍA

> "Si no está escrito, no existe."
> "Si no está probado, no funciona."
> "Si el test no está en RED, no implementes."

---

**Última actualización:** $(date +%Y-%m-%d)
**Versión:** 2.0-FINAL
