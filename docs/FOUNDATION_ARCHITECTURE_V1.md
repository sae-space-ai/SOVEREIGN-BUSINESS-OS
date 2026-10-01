# FOUNDATION ARCHITECTURE V1
## Arquitectura de los cimientos operativos
### Estado: IMPLEMENTED — Orden 2

---

## 1. OBJETIVO

Construir la infraestructura común sobre la que funcionarán todos los módulos de dominio.

**NO incluye:**
- Módulos fiscales, legales, licitaciones, business
- Adaptadores de país productivos
- Integraciones externas reales
- Motores de IA productivos

**SÍ incluye:**
- Contratos de dominio estables
- Motor de autoridad
- Sistema de eventos
- Evidencia con integridad verificable
- Estado empresarial derivado
- Abstracciones de almacenamiento
- UI foundation

---

## 2. CAPAS IMPLEMENTADAS

### Application Core (`src/core/`)
- **identifiers.ts:** UUID, Timestamp, Hash con branded types
- **errors.ts:** Jerarquía de errores con códigos de dominio

### Domain Core (`src/domain/`)
- **types.ts:** 18+ contratos de dominio TypeScript strict
- **authority/engine.ts:** Motor de autoridad con separación IDENTITY/ROLE/AUTHORITY/PERMISSION
- **events/bus.ts:** Event bus con metadata completa
- **evidence/store.ts:** Evidence store + Black Box con hash chain REAL
- **state/business-state.ts:** Derivación de estado empresarial

### Ports (`src/ports/`)
- **storage.ts:** 6 puertos de almacenamiento

### UI Foundation (`src/ui/`)
- **components/SecurityIcon.tsx:** Icono central con estados
- **components/ConfidenceTag.tsx:** Niveles de confianza
- **components/base.tsx:** EmptyState, ErrorBoundary, LoadingState

---

## 3. PROPIEDADES GARANTIZADAS

### 3.1 Autoridad
- **Propiedad:** Ninguna acción material se ejecuta sin autoridad válida
- **Demostración:** Tests en `tests/domain/authority.test.ts`
- **Mecanismo:** AuthorityEngine.checkPermission() + AuthorizationGate

### 3.2 Integridad de evidencia
- **Propiedad:** Alterar evidencia invalida la cadena de hashes
- **Demostración:** Tests en `tests/domain/evidence.test.ts`
- **Mecanismo:** SHA-256 via Web Crypto API, chain hash encadenado

### 3.3 Clasificación epistemológica
- **Propiedad:** UNKNOWN nunca se usa para decisiones
- **Demostración:** Tests en `tests/domain/confidence.test.ts`
- **Mecanismo:** isDecisionGrade() + requiresVerification()

### 3.4 Estado derivado
- **Propiedad:** BusinessState se calcula de hechos, no es hardcodeado
- **Demostración:** Tests en `tests/domain/state.test.ts`
- **Mecanismo:** deriveBusinessState() analiza needs y obligations

### 3.5 Eventos completos
- **Propiedad:** Eventos incompletos son rechazados
- **Demostración:** Tests en `tests/domain/events.test.ts`
- **Mecanismo:** validateEventRequest() verifica campos obligatorios

---

## 4. ETIQUETADO NON_PRODUCTION

Todas las implementaciones in-memory están etiquetadas:

```typescript
/**
 * ETIQUETADO: NON_PRODUCTION — Solo para tests y desarrollo.
 * En producción se debe usar implementación con persistencia real.
 */
```

Esto aplica a:
- `createInMemoryAuthorityStore()`
- `createInMemoryEventBus()`
- `createInMemoryEvidenceStore()`
- `createInMemoryBlackBox()`

---

## 5. DECISIONES ARQUITECTÓNICAS

Ver [docs/ADR/](docs/ADR/) para Architecture Decision Records:
- ADR-001: Event Sourcing
- ADR-002: Separación Authority
- ADR-003: Integridad de Evidencia

---

## 6. DEPENDENCIAS

| Dependency | Version | Purpose |
|-----------|---------|---------|
| React | 18.x | UI framework |
| TypeScript | 5.x (strict) | Type safety |
| Vite | 6.x | Build tool |
| Tailwind CSS | 4.x | Styling |
| Vitest | latest | Testing |
| Framer Motion | 11.x | Animations |
| Lucide React | 0.294 | Icons |

---

*Documento generado como parte de la Orden 2 — Foundation Tier0.*
