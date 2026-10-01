# TESTING STRATEGY
## Estrategia de pruebas del sistema
### Estado: IMPLEMENTED — Orden 2

---

## 1. PRINCIPIOS

1. **Tests reales, no simulados** — Cada test verifica comportamiento real
2. **Tests negativos obligatorios** — Verificar que lo incorrecto es rechazado
3. **No fingir PASS** — Prohibido `skip`, `only`, `todo`, `|| true`
4. **Cobertura de propiedades** — No solo cobertura de líneas
5. **Reproducibilidad** — Tests deterministas, sin dependencias externas

---

## 2. NIVELES DE TEST

### Unit Tests (`tests/`)
- Contratos de dominio
- Motor de autoridad
- Sistema de eventos
- Evidencia e integridad
- Business state derivation
- Clasificación epistemológica

### Integration Tests (futuro)
- Flujos completos de autorización
- Cadena de evidencia end-to-end
- Publicación y consumo de eventos

### E2E Tests (futuro)
- Flujos de usuario completos
- Verificación de UI states

---

## 3. TESTS NEGATIVOS OBLIGATORIOS

| Escenario | Test | Archivo |
|-----------|------|---------|
| Acción sin autoridad | `BLOCKS action when identity has no authority` | authority.test.ts |
| Identidad suspendida | `BLOCKS action when identity is suspended` | authority.test.ts |
| Gate sin autoridad requerida | `rejects gate response from identity without required authority` | authority.test.ts |
| Evidencia alterada | `detects tampered content` | evidence.test.ts |
| UNKNOWN como FACT | `UNKNOWN nunca debe pasar como decision-grade` | confidence.test.ts |
| Evento incompleto | `rejects event without type` | events.test.ts |
| Evento sin sourceId | `rejects event without sourceId in metadata` | events.test.ts |
| Verificar gate no autorizado | `verifyGateForExecution throws if not authorized` | authority.test.ts |

---

## 4. PROPIEDADES VERIFICADAS

### Autoridad
- ✅ Acción sin autoridad → BLOCKED
- ✅ IDENTITY sin AUTHORITY no puede actuar materialmente
- ✅ Gate requiere autoridad del tipo correcto
- ✅ verifyGateForExecution lanza error si no autorizado

### Integridad
- ✅ Hash SHA-256 correcto (vector conocido)
- ✅ Evidence con integrityHash + chainHash
- ✅ Chain verification completa
- ✅ Contenido alterado → hash mismatch

### Epistemología
- ✅ FACT es decision-grade
- ✅ CALCULATED es decision-grade
- ✅ UNKNOWN NO es decision-grade
- ✅ AI_RECOMMENDATION requiere verificación

### Estado
- ✅ SEGURO cuando no hay needs/obligations
- ✅ ATENCIÓN cuando hay needs detectadas
- ✅ DECISIÓN cuando hay needs pendientes de autorización
- ✅ Transiciones válidas entre estados

### Eventos
- ✅ Evento válido se publica
- ✅ Secuencia por aggregate
- ✅ Evento sin tipo → rechazado
- ✅ Evento sin metadata → rechazado

---

## 5. HERRAMIENTAS

| Herramienta | Uso |
|------------|-----|
| Vitest | Test runner |
| @testing-library/react | Tests de componentes UI |
| @testing-library/jest-dom | Matchers DOM |
| jsdom | Entorno DOM para tests |

---

## 6. EJECUCIÓN

```bash
# Todos los tests
npm run test

# Watch mode
npm run test:watch

# Con cobertura
npm run test:coverage
```

---

## 7. PROHIBICIONES

- ❌ `test.skip()` para ocultar fallos
- ❌ `test.only()` en CI
- ❌ `test.todo()` para fingir cobertura
- ❌ `|| true` en scripts
- ❌ `continue-on-error` para ocultar fallos
- ❌ Debilitar tests para aprobar
- ❌ Mocks que no verifiquen comportamiento real

---

*Documento generado como parte de la Orden 2 — Foundation Tier0.*
