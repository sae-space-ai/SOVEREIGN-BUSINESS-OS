# ADR-003: Integridad de Evidencia con Hash Chain
## Estado: ACCEPTED — Orden 2

---

## Contexto

El sistema requiere que la evidencia sea verificable criptográficamente. No basta con decir "es inmutable" — hay que demostrarlo.

La evidencia es la base de toda afirmación del sistema ("No evidence, no claim"). Si la evidencia puede ser alterada sin detección, todo el sistema pierde credibilidad.

## Decisión

Implementar **hash chain** usando SHA-256 via Web Crypto API:

1. Cada evidencia tiene `integrityHash = SHA-256(content)`
2. Cada evidencia tiene `chainHash = SHA-256(integrityHash + timestamp + previousChainHash)`
3. La primera evidencia usa "GENESIS" como previousChainHash
4. La verificación recalcula ambos hashes y compara

**Propiedad demostrada:** Alterar cualquier evidencia invalida su integrityHash Y todos los chainHash siguientes.

## Alternativas consideradas

1. **Solo hash por contenido** — Rechazado: no detecta inserción/eliminación
2. **Merkle tree** — Rechazado: excesivo para el caso de uso
3. **Blockchain externa** — Rechazado: dependendencia externa innecesaria
4. **Timestamping service** — Complementario, no sustitutivo

## Consecuencias

### Positivas
- ✅ Integridad demostrable criptográficamente
- ✅ Detección de alteración, inserción y eliminación
- ✅ Sin dependencia de terceros
- ✅ Verificable en cualquier momento

### Negativas
- ⚠️ Coste computacional de hashing
- ⚠️ Verificación de cadena completa puede ser lenta
- ⚠️ Requiere Web Crypto API (disponible en navegadores modernos y Node.js 15+)

## Implementación

- `src/domain/evidence/store.ts` — Evidence store + Black Box
- `tests/domain/evidence.test.ts` — Tests de integridad

## Propiedades verificadas

- Hash SHA-256 correcto (vector conocido: "hello world")
- Evidence con integrityHash + chainHash
- Chain verification completa
- Contenido alterado → hash mismatch detectado

## Vector de prueba

```
SHA-256("hello world") = b94d27b9934d3e08a52e52d7da7dabfac484efe37a5380ee9088f7ace2efcde9
```

Este vector se verifica en `tests/domain/evidence.test.ts`.

---

*Decisión tomada como parte de la Orden 2 — Foundation Tier0.*
