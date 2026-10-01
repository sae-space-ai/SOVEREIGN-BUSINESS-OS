# SECURITY BASELINE
## Línea base de seguridad del sistema
### Estado: IMPLEMENTED — Orden 2

---

## 1. PRINCIPIOS DE SEGURIDAD

1. **Autoridad humana irrenunciable** — Solo personas físicas autorizan acciones materiales
2. **Defensa en profundidad** — Múltiples capas de verificación
3. **Integridad criptográfica** — Hash chains verificables
4. **Trazabilidad total** — Todo hecho es rastreable
5. **Mínimo privilegio** — Permisos granulares
6. **No evidence, no claim** — Solo afirmaciones con evidencia

---

## 2. CONTROLES IMPLEMENTADOS

### 2.1 Control de Autoridad
- **Mecanismo:** AuthorityEngine con gates de autorización
- **Propiedad:** Acción sin autoridad → BLOCKED
- **Verificación:** Tests en `tests/domain/authority.test.ts`
- **Estado:** ✅ IMPLEMENTED

### 2.2 Integridad de Datos
- **Mecanismo:** Hash chain SHA-256 (Web Crypto API)
- **Propiedad:** Alterar datos invalida hashes
- **Verificación:** Tests en `tests/domain/evidence.test.ts`
- **Estado:** ✅ IMPLEMENTED

### 2.3 Clasificación Epistemológica
- **Mecanismo:** ConfidenceLevel con validación
- **Propiedad:** UNKNOWN nunca usado para decisiones
- **Verificación:** Tests en `tests/domain/confidence.test.ts`
- **Estado:** ✅ IMPLEMENTED

### 2.4 Trazabilidad
- **Mecanismo:** Event sourcing con metadata completa
- **Propiedad:** Todo evento tiene SOURCE, causation, correlation
- **Verificación:** Tests en `tests/domain/events.test.ts`
- **Estado:** ✅ IMPLEMENTED

---

## 3. CONTROLES PENDIENTES (Requieren infraestructura)

| Control | Estado | Dependencia |
|---------|--------|-------------|
| Cifrado en tránsito (TLS 1.3) | NOT_AVAILABLE | Infraestructura |
| Cifrado en reposo (AES-256) | NOT_AVAILABLE | Database |
| Autenticación real (OIDC/SAML) | NOT_AVAILABLE | Identity Provider |
| Gestión de secretos | NOT_AVAILABLE | Secret Provider |
| Auditoría de acceso | NOT_AVAILABLE | Logging infrastructure |
| Rate limiting | NOT_AVAILABLE | API Gateway |
| WAF | NOT_AVAILABLE | Infrastructure |
| Backup/Restore | NOT_AVAILABLE | Object Storage |
| Monitoring/Alerting | NOT_AVAILABLE | Observability stack |
| Penetration testing | NOT_AVAILABLE | External audit |

---

## 4. MODELO DE AMENAZAS (STRIDE)

| Amenaza | Control | Estado |
|---------|---------|--------|
| **S**poofing | Identity verification | ✅ Contratos definidos |
| **T**ampering | Hash chain integrity | ✅ IMPLEMENTED |
| **R**epudiation | Evidence + Black Box | ✅ IMPLEMENTED |
| **I**nformation Disclosure | Encryption | ⚠️ Pendiente |
| **D**enial of Service | Rate limiting | ⚠️ Pendiente |
| **E**levation of Privilege | Authority engine | ✅ IMPLEMENTED |

---

## 5. PROPIEDADES DE SEGURIDAD DEMOSTRADAS

### 5.1 No ejecución sin autoridad
```typescript
// Test: BLOCKS action when identity has no authority
const result = await engine.checkPermission({ identityId, action: 'CREATE', resource: 'fiscal/invoice' });
expect(result.blocked).toBe(true);
```

### 5.2 Integridad verificable
```typescript
// Test: detects tampered content
const recalculated = await computeIntegrityHash({ amount: 9999 }); // Tampered
expect(recalculated).not.toBe(evidence.integrityHash);
```

### 5.3 UNKNOWN no es FACT
```typescript
// Test: UNKNOWN nunca debe pasar como decision-grade
expect(isDecisionGrade(ConfidenceLevel.UNKNOWN)).toBe(false);
```

---

## 6. RECOMENDACIONES PARA PRODUCCIÓN

1. **Implementar cifrado TLS 1.3** en todas las comunicaciones
2. **Cifrar datos en reposo** con AES-256
3. **Usar Identity Provider** real (Keycloak, Authelia)
4. **Implementar gestión de secretos** (HashiCorp Vault)
5. **Configurar monitoring** (Prometheus + Grafana)
6. **Realizar pentesting** antes de producción
7. **Auditoría de seguridad** anual
8. **Plan de respuesta a incidentes** documentado
9. **Backup verificado** regularmente
10. **Cumplimiento RGPD** con DPO asignado

---

## 7. CUMPLIMIENTO NORMATIVO

| Norma | Estado | Acción requerida |
|-------|--------|-----------------|
| RGPD | Contratos definidos | Implementar DPO, registros |
| EU AI Act | Contratos definidos | Clasificar sistemas IA |
| ENS (España) | No evaluado | Requiere auditoría |
| ISO 27001 | No evaluado | Requiere certificación |
| SOC 2 | No evaluado | Requiere auditoría |

---

*Documento generado como parte de la Orden 2 — Foundation Tier0.*
*Requiere actualización cuando se implementen controles de producción.*
