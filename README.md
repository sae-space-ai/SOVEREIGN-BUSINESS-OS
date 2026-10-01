# Sovereign Business OS — Foundation Tier0

> **Estado:** DRAFT — Pendiente aceptación humana
> **Orden:** 2 (Foundation)
> **Repositorio canónico:** sae-space-ai/SOVEREIGN-BUSINESS-OS

---

## Visión

Construir los cimientos operativos sobre los que funcionará el Servicio Empresarial Europeo de Seguridad y Gobierno.

**NO es** un ERP, dashboard, landing, colección de apps ni chatbot.

**ES** la infraestructura común sobre la que todos los módulos de dominio (fiscal, legal, licitaciones, business) deberán funcionar.

---

## Principios

1. **PRESERVE BEFORE EXTEND** — No romper trabajo válido
2. **Autoridad humana irrenunciable** — La IA prepara, el humano decide
3. **Trazabilidad total** — SOURCE → DATA → RULE → NEED → DECISION → AUTHORITY → ACTION → RESULT → EVIDENCE
4. **Sin capacidades falsas** — Toda UI requiere backend real
5. **No evidence, no claim** — La evidencia es la única base para afirmaciones
6. **Sin vendor lock-in** — Motores reemplazables por contrato

---

## Estructura

```
src/
├── core/                    # Application Core
│   ├── identifiers.ts       # UUID, Timestamp, Hash (branded types)
│   └── errors.ts            # Error hierarchy
├── domain/                  # Domain Core
│   ├── types.ts             # 18+ contratos de dominio
│   ├── authority/           # Authority Engine
│   │   └── engine.ts        # IDENTITY ≠ ROLE ≠ AUTHORITY ≠ PERMISSION
│   ├── events/              # Event System
│   │   └── bus.ts           # Event sourcing con metadata completa
│   ├── evidence/            # Evidence & Black Box
│   │   └── store.ts         # Hash chain REAL (SHA-256)
│   └── state/               # Business State
│       └── business-state.ts # Derivado de hechos, no decorado
├── ports/                   # Storage Abstractions
│   └── storage.ts           # 6 puertos (DB, Object, Identity, etc.)
├── ui/                      # UI Foundation
│   └── components/          # Security Icon, Confidence Tag, etc.
└── App.tsx                  # Shell funcional

tests/                       # Test Suite
├── core/                    # Tests de core
└── domain/                  # Tests de dominio

docs/                        # Documentación
├── ARCHITECTURE_MASTER_V1.md
├── MODULE_MAP_V1.md
├── UX_UI_SYSTEM_V1.md
├── TECHNOLOGY_DECISIONS_V1.md
├── DATA_EVENT_MODEL_V1.md
├── TRACEABILITY_AUTHORITY_MODEL_V1.md
├── FOUNDATION_ARCHITECTURE_V1.md
├── TESTING_STRATEGY.md
├── SECURITY_BASELINE.md
└── ADR/                     # Architecture Decision Records
```

---

## Foundation implementada

### ✅ Application Core
- Identificadores con branded types (UUID, Timestamp, Hash)
- Jerarquía de errores con códigos de dominio
- Validación de formatos

### ✅ Domain Core
18+ contratos TypeScript strict:
- Organisation, Person, Identity, Role, Authority, Permission
- BusinessProfile, Jurisdiction, Need, Obligation
- Decision, MaterialAction, Workflow, Document, Source
- Evidence, DomainEvent, AuditRecord
- ConfidenceLevel (clasificación epistemológica)

### ✅ Authority Core
**Separación explícita:** IDENTITY ≠ ROLE ≠ AUTHORITY ≠ PERMISSION

- Motor de verificación de permisos
- Gates de autorización humana
- Política: toda acción material requiere autorización
- **Acción sin autoridad → BLOCKED, nunca ejecutada silenciosamente**

### ✅ Event + Traceability Core
- Event bus con metadata completa
- Secuencia por aggregate
- Causación y correlación
- Validación de eventos incompletos

### ✅ Evidence + Black Box Foundation
- **Hash chain REAL** usando Web Crypto API (SHA-256)
- Cada evidencia: integrityHash + chainHash
- Verificación de integridad recalculando hashes
- Black Box append-only para interacciones IA
- **Propiedad demostrada:** Alterar contenido invalida hashes

### ✅ Business State Core
- Estados: SEGURO, ATENCIÓN, DECISIÓN
- **Derivado de hechos reales** (needs, obligations)
- NO es decoración UI
- Transiciones válidas entre estados

### ✅ UI Foundation
- Shell responsive
- Security Icon con estados derivados
- Confidence Tag (7 niveles)
- EmptyState, ErrorBoundary, LoadingState
- Accesibilidad (ARIA, keyboard navigation)

### ✅ Storage Abstractions
6 puertos definidos:
- DatabasePort
- ObjectStoragePort
- IdentityProviderPort
- SecretProviderPort
- EventStorePort
- EvidenceStorePort

### ✅ Test Foundation
- Vitest configurado
- Tests reales (no mocks vacíos)
- Tests negativos:
  - Acción sin autoridad → BLOCKED
  - Evidencia alterada → detectada
  - UNKNOWN como FACT → rechazado
  - Evento incompleto → rechazado
  - Transición inválida → rechazada

---

## Comandos

```bash
# Desarrollo
npm run dev

# Typecheck
npm run typecheck

# Tests
npm run test
npm run test:watch

# Build
npm run build
```

---

## Limitaciones del entorno actual

| Componente | Estado | Causa |
|-----------|--------|-------|
| Git/GitHub | NOT_VERIFIABLE | Sandbox sin Git |
| CI (GitHub Actions) | NOT_EXECUTED | No disponible en sandbox |
| Database real | NOT_AVAILABLE | Solo in-memory NON_PRODUCTION |
| Object storage real | NOT_AVAILABLE | Solo in-memory NON_PRODUCTION |
| Identity provider real | NOT_AVAILABLE | Solo in-memory NON_PRODUCTION |
| GPU / IA | NOT_AVAILABLE | Requiere infraestructura |

**Etiquetado:** Todas las implementaciones in-memory están etiquetadas `NON_PRODUCTION`.

---

## Próximos pasos

1. **Orden 3:** Implementar módulos de dominio específicos (fiscal, legal, etc.)
2. Configurar infraestructura real (hosting EU, DB, object storage)
3. Implementar adaptadores de país (Tax, SS, Registry)
4. Integrar motores de IA (MODEL_PROVIDER, INFERENCE_ENGINE)
5. Configurar CI/CD en repositorio canónico

---

## Documentación

- [Arquitectura Master](docs/ARCHITECTURE_MASTER_V1.md)
- [Mapa de Módulos](docs/MODULE_MAP_V1.md)
- [UX/UI System](docs/UX_UI_SYSTEM_V1.md)
- [Decisiones Tecnológicas](docs/TECHNOLOGY_DECISIONS_V1.md)
- [Modelo de Datos](docs/DATA_EVENT_MODEL_V1.md)
- [Trazabilidad & Autoridad](docs/TRACEABILITY_AUTHORITY_MODEL_V1.md)
- [Arquitectura Foundation](docs/FOUNDATION_ARCHITECTURE_V1.md)
- [Estrategia de Testing](docs/TESTING_STRATEGY.md)
- [Baseline de Seguridad](docs/SECURITY_BASELINE.md)
- [ADRs](docs/ADR/)

---

*Generado como parte de la Orden 2 — Foundation Tier0.*
*Pendiente de aceptación humana antes de proceder a implementación de módulos de dominio.*
