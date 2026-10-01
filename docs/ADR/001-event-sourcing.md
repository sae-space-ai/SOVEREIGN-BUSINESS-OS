# ADR-001: Event Sourcing
## Estado: ACCEPTED — Orden 2

---

## Contexto

El sistema requiere trazabilidad total de todos los hechos. Cada cambio debe ser registrable, verificable y auditable.

## Decisión

Usar **Event Sourcing** como patrón fundamental de almacenamiento.

Todos los cambios en el sistema se registran como eventos inmutables con:
- ID único
- Tipo de evento
- Aggregate ID y tipo
- Payload completo
- Metadata (userId, systemComponent, confidence, sourceId)
- Timestamp
- Causation ID (qué evento lo provocó)
- Correlation ID (eventos relacionados)
- Sequence number (por aggregate)

## Alternativas consideradas

1. **CRUD tradicional** — Rechazado: no proporciona trazabilidad completa
2. **CQRS sin event sourcing** — Rechazado: pierde historial completo
3. **Logging + DB** — Rechazado: logs no son fuente de verdad

## Consecuencias

### Positivas
- ✅ Trazabilidad total
- ✅ Audit trail completo
- ✅ Posibilidad de reconstruir estado
- ✅ Causación y correlación de eventos
- ✅ Secuencia verificable por aggregate

### Negativas
- ⚠️ Mayor complejidad de implementación
- ⚠️ Requiere event store dedicado
- ⚠️ Queries más complejas (necesitan proyecciones)

## Implementación

- `src/domain/events/bus.ts` — Event bus con validación
- `tests/domain/events.test.ts` — Tests de eventos

## Propiedades verificadas

- Evento incompleto → rechazado
- Secuencia por aggregate
- Metadata obligatoria
- Causación y correlación

---

*Decisión tomada como parte de la Orden 2 — Foundation Tier0.*
