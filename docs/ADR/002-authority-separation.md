# ADR-002: Separación IDENTITY ≠ ROLE ≠ AUTHORITY ≠ PERMISSION
## Estado: ACCEPTED — Orden 2

---

## Contexto

El sistema requiere un modelo de control de acceso que refleje la realidad jurídica:
- Una persona es quien es (IDENTITY)
- Desempeña una función (ROLE)
- Tiene capacidad de autorizar (AUTHORITY) — solo personas físicas
- Tiene permisos concretos (PERMISSION)

Mezclar estos conceptos lleva a errores de seguridad donde la IA o el sistema pueden ejecutar acciones materiales sin autorización humana.

## Decisión

Separar explícitamente los cuatro conceptos:

| Concepto | Qué es | Quién puede tenerlo |
|----------|--------|-------------------|
| IDENTITY | Autenticación — quién es | Personas, sistemas, servicios |
| ROLE | Función — qué hace | Personas con identidad |
| AUTHORITY | Capacidad de autorizar — quién decide | Solo personas físicas |
| PERMISSION | Permiso concreto — qué puede hacer | Derivado de ROLE o AUTHORITY |

**Regla crítica:** Solo IDENTITY de tipo PERSON puede tener AUTHORITY para acciones materiales.

## Alternativas consideradas

1. **RBAC simple** — Rechazado: no distingue authority de permission
2. **ABAC puro** — Rechazado: demasiado complejo sin la separación clara
3. **Todo en uno** — Rechazado: permite que IA tenga authority

## Consecuencias

### Positivas
- ✅ La IA NUNCA puede autorizar acciones materiales
- ✅ Claridad semántica en el código
- ✅ Auditoría clara de quién autorizó qué
- ✅ Delegación trazable

### Negativas
- ⚠️ Más entidades que gestionar
- ⚠️ Lógica de verificación más compleja

## Implementación

- `src/domain/types.ts` — Tipos Identity, Role, Authority, Permission
- `src/domain/authority/engine.ts` — Motor de verificación
- `tests/domain/authority.test.ts` — Tests de autoridad

## Propiedades verificadas

- Acción sin autoridad → BLOCKED
- IDENTITY sin AUTHORITY no puede actuar materialmente
- Gate requiere tipo de autoridad correcto
- Responder a gate sin autoridad → rechazado

---

*Decisión tomada como parte de la Orden 2 — Foundation Tier0.*
