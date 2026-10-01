# TRACEABILITY & AUTHORITY MODEL V1
## Modelo de trazabilidad, autoridad humana y evidencia
### Estado: DRAFT — Pendiente aceptación humana

---

## 1. PRINCIPIOS

1. **Toda acción material tiene trazabilidad completa**
2. **La autoridad humana es irrenunciable e intransferible**
3. **La IA no tiene autoridad jurídica, fiscal, económica ni humana**
4. **La evidencia es la única base para afirmaciones**
5. **No evidence, no claim**

---

## 2. MODELO DE TRAZABILIDAD

### 2.1 Cadena de Trazabilidad

```
SOURCE → DATA → RULE → NEED → DECISION → AUTHORITY → ACTION → RESULT → EVIDENCE
```

| Paso | Descripción | Inmutabilidad | Verificable |
|------|-------------|---------------|-------------|
| SOURCE | Origen del dato/hecho | ✅ Una vez registrado | ✅ Hash de fuente |
| DATA | Dato capturado/transformado | ✅ Append-only | ✅ Hash + timestamp |
| RULE | Regla aplicada | ✅ Versión de regla | ✅ Referencia a norma |
| NEED | Necesidad identificada | ✅ Registro completo | ✅ Relación con rules |
| DECISION | Decisión tomada | ✅ Con contexto completo | ✅ Black Box entry |
| AUTHORITY | Quién autorizó | ✅ Identidad verificada | ✅ Credential + timestamp |
| ACTION | Acción ejecutada | ✅ Log de ejecución | ✅ Resultado + evidence |
| RESULT | Resultado obtenido | ✅ Registrado | ✅ Verificable externamente |
| EVIDENCE | Evidencia generada | ✅ Cadena criptográfica | ✅ Hash chain |

### 2.2 Trazabilidad de Datos

```
DataTrace {
  dataId: UUID
  sourceType: SourceType        // manual, api, document, system, ai
  sourceReference: string       // URL, documento, persona, sistema
  sourceTimestamp: Timestamp    // cuándo se originó
  captureTimestamp: Timestamp   // cuándo se capturó
  transformation: string | null // qué transformación sufrió
  confidence: ConfidenceLevel   // nivel de confianza
  verifiedBy: Authority | null  // quién lo verificó
  verifiedAt: Timestamp | null
  integrityHash: string         // hash del contenido
}
```

### 2.3 Trazabilidad de Regulación

```
RegulationTrace {
  regulationId: UUID
  source: string                // BOE, DOUE, etc.
  reference: string             // referencia oficial
  validFrom: Date
  validTo: Date | null
  applicableTo: Jurisdiction[]
  applicableToEntities: EntityCriteria
  lastVerified: Timestamp
  lastVerifiedBy: Authority
  changes: RegulationChange[]
}

RegulationChange {
  changeId: UUID
  detectedAt: Timestamp
  detectedBy: Source            // sistema, humano, fuente oficial
  previousVersion: string
  newVersion: string
  impact: ImpactAssessment
  affectedNeeds: UUID[]
  status: ChangeStatus          // detected, analyzed, applied
}
```

### 2.4 Trazabilidad de IA

```
AITrace {
  traceId: UUID
  blackBoxEntryId: UUID → BlackBoxEntry
  purpose: string               // para qué se usó la IA
  input: JSON                   // datos de entrada
  model: ModelReference         // qué modelo
  modelVersion: string
  prompt: string                // prompt exacto
  output: JSON                  // respuesta
  confidence: ConfidenceLevel   // confianza declarada
  limitations: string[]         // limitaciones conocidas
  humanOverride: boolean        // si humano modificó
  humanOverrideReason: string | null
  result: string                // qué se hizo con el resultado
  wasActionTaken: boolean       // si generó acción
  actionId: UUID | null         // qué acción generó
}
```

---

## 3. MODELO DE AUTORIDAD

### 3.1 Principios de Autoridad

| Principio | Implicación |
|-----------|-------------|
| La autoridad es humana | Solo personas físicas pueden ejercer autoridad jurídica/fiscal/económica |
| La autoridad es identificada | Cada acto de autoridad identifica a la persona |
| La autoridad es informada | No se autoriza sin información suficiente |
| La autoridad es registrada | Todo acto de autoridad genera evidencia |
| La autoridad es delegable (con límites) | Se puede delegar, pero la delegación es trazable |
| La autoridad es revocable | Se puede revocar en cualquier momento |
| La IA NO tiene autoridad | La IA prepara, recomienda, analiza. No decide ni ejecuta materialmente |

### 3.2 Tipos de Autoridad

```
enum AuthorityType {
  LEGAL_REPRESENTATIVE    // Representante legal de la empresa
  DELEGATED_LEGAL         // Delegación de representación legal
  FISCAL_REPRESENTATIVE   // Representante fiscal
  ADMIN_USER              // Usuario administrativo del sistema
  VIEWER                  // Solo lectura
  SYSTEM                  // Sistema (acciones no materiales)
}
```

### 3.3 Modelo de Permisos

```
Permission {
  id: UUID
  authorityId: UUID → Authority
  scope: PermissionScope
  actions: Action[]
  conditions: Condition[]
  validFrom: Timestamp
  validTo: Timestamp | null
  grantedBy: Authority
  evidence: UUID → Evidence
}

enum PermissionScope {
  FULL                    // Acceso total (solo representante legal)
  DOMAIN(domainId)        // Acceso a un dominio
  MODULE(moduleId)        // Acceso a un módulo
  READ_ONLY               // Solo lectura
  PREPARE_ONLY            // Puede preparar pero no ejecutar
}

enum Action {
  VIEW                    // Ver información
  CREATE                  // Crear registros
  MODIFY                  // Modificar registros
  DELETE                  // Eliminar registros (soft delete)
  PREPARE_ACTION          // Preparar acción material
  AUTHORIZE_ACTION        // Autorizar acción material
  EXECUTE_ACTION          // Ejecutar acción material (post-autorización)
  DELEGATE                // Delegar permisos
  EXPORT                  // Exportar datos
  ACCESS_EVIDENCE         // Acceder a evidencia
  ACCESS_BLACKBOX         // Acceder a caja negra
}
```

### 3.4 Gate de Autorización Humana

Para toda acción material:

```
AuthorizationGate {
  id: UUID
  actionDescription: string
  preparedBy: System | Authority
  dataBasis: DataBasis[]         // datos en los que se basa
  ruleBasis: RuleBasis[]         // reglas que aplican
  consequenceIfNotDone: string   // qué pasa si no se hace
  consequenceIfDone: string      // qué pasa si se hace
  deadline: Timestamp | null     // plazo para decidir
  evidenceGenerated: Evidence[]  // evidencia que generará
  
  status: GateStatus
  requestedAt: Timestamp
  respondedAt: Timestamp | null
  respondedBy: Authority | null
  response: AUTHORIZED | REJECTED | DEFERRED
  responseReason: string | null
}

enum GateStatus {
  PREPARED
  VERIFIED_BY_SYSTEM
  PRESENTED_TO_HUMAN
  AUTHORIZED
  REJECTED
  DEFERRED
  EXPIRED
}
```

---

## 4. MODELO DE EVIDENCIA

### 4.1 Principios de Evidencia

1. **Inmutabilidad**: Una vez registrada, no se modifica
2. **Integridad**: Hash criptográfico garantiza no alteración
3. **Cadena**: Cada evidencia referencia la anterior (blockchain-like)
4. **Timestamp**: Marca temporal verificable
5. **Fuente**: Origen de la evidencia siempre registrado
6. **Accesible**: Quien tiene permiso puede verificar

### 4.2 Estructura de Evidencia

```
Evidence {
  id: UUID
  entityId: UUID → BusinessEntity
  type: EvidenceType
  title: string
  description: string
  content: EvidenceContent
  source: EvidenceSource
  timestamp: Timestamp
  integrityHash: string           // SHA-256 del contenido
  previousEvidenceId: UUID | null // cadena
  chainHash: string               // hash que incluye anterior
  metadata: EvidenceMetadata
  relatedFacts: UUID[]
  relatedDecisions: UUID[]
  accessibility: Accessibility
}

enum EvidenceType {
  // Documentos
  INVOICE                     // Factura
  CONTRACT                    // Contrato
  OFFICIAL_COMMUNICATION      // Comunicación oficial
  FINANCIAL_DOCUMENT          // Documento financiero
  
  // Registros del sistema
  DECISION_LOG                // Log de decisión
  WORKFLOW_EXECUTION          // Ejecución de workflow
  SYSTEM_EVENT                // Evento del sistema
  AI_INTERACTION              // Interacción con IA (Black Box)
  
  // Externos
  THIRD_PARTY_ATTESTATION     // Atestación de tercero
  REGULATORY_FILING           // Presentación regulatoria
  EXTERNAL_DATA               // Dato de fuente externa
  
  // Humanos
  HUMAN_AUTHORIZATION         // Autorización humana
  HUMAN_ATTESTATION           // Declaración humana
  HUMAN_CORRECTION            // Corrección humana
}
```

### 4.3 Cadena de Integridad

```
Evidence[n].chainHash = SHA256(
  Evidence[n].integrityHash +
  Evidence[n].timestamp +
  Evidence[n-1].chainHash     // o "GENESIS" si es la primera
)
```

Esto crea una cadena donde alterar cualquier evidencia invalidaría todas las siguientes.

### 4.4 Verificación de Evidencia

En cualquier momento:
1. Seleccionar evidencia
2. Recalcular integrityHash del contenido
3. Verificar que coincide con el registrado
4. Recalcular chainHash
5. Verificar cadena completa hasta el génesis
6. Si todo coincide → evidencia íntegra
7. Si algo no coincide → evidencia comprometida

---

## 5. BLACK BOX

### 5.1 Propósito

La Black Box es el registro inmutable de:
- Todas las interacciones con motores de IA
- El contexto completo de cada interacción
- Las decisiones preparadas por IA
- Las limitaciones declaradas
- Las correcciones humanas

### 5.2 Inmutabilidad

La Black Box es append-only. No se puede:
- Modificar una entrada existente
- Eliminar una entrada
- Alterar el orden

Solo se puede:
- Añadir nuevas entradas
- Referenciar entradas anteriores
- Verificar la cadena de integridad

### 5.3 Contenido de entrada

```
BlackBoxEntry {
  id: UUID
  entityId: UUID
  timestamp: Timestamp
  
  // Contexto
  context: {
    userAction: string          // qué estaba haciendo el usuario
    systemState: JSON           // estado del sistema
    relevantFacts: UUID[]       // hechos relevantes
    applicableRules: UUID[]     // reglas aplicables
    pendingNeeds: UUID[]        // necesidades pendientes
  }
  
  // Input al modelo
  input: {
    prompt: string              // prompt exacto
    data: JSON                  // datos proporcionados
    constraints: JSON           // restricciones aplicadas
    outputFormat: string        // formato requerido
  }
  
  // Modelo utilizado
  model: {
    provider: string            // MODEL_PROVIDER usado
    engine: string              // INFERENCE_ENGINE usado
    modelId: string             // identificador del modelo
    modelVersion: string        // versión exacta
    parameters: JSON            // parámetros usados
  }
  
  // Output del modelo
  output: {
    raw: JSON                   // respuesta cruda
    parsed: JSON                // respuesta parseada
    confidence: ConfidenceLevel // confianza declarada
    limitations: string[]       // limitaciones indicadas
  }
  
  // Post-procesamiento
  postProcessing: {
    validation: ValidationResult
    humanReview: boolean
    humanCorrection: JSON | null
    humanReason: string | null
    actionTaken: string         // qué se hizo con el resultado
  }
  
  // Integridad
  integrityHash: string
  previousEntryId: UUID | null
  chainHash: string
}
```

---

## 6. MATRIZ COMPLETA: NEED → UI

| Need | Objective | Capability | Module | Data | Engine/Tool | Action | Authority | Result | Criterion | Evidence | UI |
|------|-----------|-----------|--------|------|-------------|--------|-----------|--------|-----------|----------|-----|
| Cumplir obligación fiscal | Calcular y presentar | Fiscal calculation + filing | M&T | Financial data + tax rules | Fiscal Engine + Tax Adapter | Prepare + Human authorize | Legal representative | Filing submitted | On time, correct amount | Filing receipt + payment proof | StatusBadge + EvidencePanel |
| No perder plazo legal | Vigilar y avisar | Deadline monitoring | Legal | Contract dates + law deadlines | Rules Engine + Attention Engine | Alert human | Human reads | Human informed | Before deadline | Alert log + read receipt | DeadlineAlert component |
| Facturar correctamente | Emitir factura conforme | Invoice generation | M&T | Service/product data + client | Invoicing Engine + E-Invoicing Adapter | Prepare + Human authorize | Legal representative | Invoice issued | Format compliant | Invoice document + hash | InvoiceRow + AuthorityGate |
| Encontrar licitación | Detectar oportunidad | Tender search + filter | Tenders Free | Public sources + business profile | Search Engine + Eligibility Engine | Alert human | Human decides interest | Opportunity identified | Matches profile | Tender card + eligibility | TenderCard + CaseFile |
| Anticipar problema | Detectar antes de crisis | Pattern detection | Intelligence | Historical data + current state | Anticipation + Deterioration Engines | Alert if necessary | Human informed | Risk mitigated | Before impact | Detection log | SecurityIcon state change |
| Demostrar cumplimiento | Probar ante terceros | Evidence generation | Security | All traces + decisions | Evidence Engine + Black Box | Generate report | Legal representative | Report generated | Complete trace | Evidence chain + hashes | EvidencePanel + Timeline |
| Preparar acción | Automatizar con control | Workflow preparation | SBC | Context + rules + data | Workflow Engine + AI preparation | Human authorize | Legal representative | Action ready | Complete + verified | Preparation log + context | AuthorityGate + DecisionCard |

---

## 7. AUDITORÍA

### 7.1 Tipos de auditoría

| Tipo | Frecuencia | Alcance | Responsable |
|------|-----------|---------|-------------|
| Interna continua | Automática | Todos los eventos | Sistema |
| Interna periódica | Mensual | Muestras + cadenas | Sistema + humano |
| Externa fiscal | Anual | Obligaciones fiscales | Auditor externo |
| Externa legal | Bajo demanda | Expedientes legales | Abogado |
| Externa seguridad | Anual | Infraestructura + procesos | Auditor seguridad |
| RGPD | Anual | Tratamiento de datos | DPO |

### 7.2 Informe de auditoría

Cada informe debe poder demostrar:
1. Qué datos se procesaron
2. Qué reglas se aplicaron
3. Qué decisiones se tomaron
4. Quién autorizó cada decisión
5. Qué evidencia se generó
6. Qué IA se utilizó y con qué contexto
7. Que la cadena de integridad es válida

---

*Documento generado como parte de la Orden 0. Pendiente de aceptación humana.*
