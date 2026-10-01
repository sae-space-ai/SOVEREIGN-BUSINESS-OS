# DATA & EVENT MODEL V1
## Modelo de datos, eventos, flujos y clasificación
### Estado: DRAFT — Pendiente aceptación humana

---

## 1. PRINCIPIOS DEL MODELO DE DATOS

1. **Event Sourcing**: Los hechos se registran como eventos inmutables. El estado actual se deriva.
2. **Trazabilidad total**: Todo dato tiene SOURCE, RULE (si aplica), CONFIDENCE y AUTHORITY.
3. **Clasificación de confianza**: Todo dato lleva su nivel de confianza.
4. **Separación hecho/interpretación**: Los hechos son inmutables. Las interpretaciones (IA) son versiones.
5. **Inmutabilidad de evidencia**: La evidencia una vez registrada no se modifica. Se añaden correcciones como nuevos eventos.

---

## 2. ENTIDADES PRINCIPALES

### 2.1 BusinessEntity (Empresa)
```
BusinessEntity {
  id: UUID
  legalName: string
  taxId: string (NIF/CIF/VAT)
  jurisdiction: Jurisdiction
  legalForm: LegalForm
  registrationDate: Date
  status: Active | Dormant | Dissolved
  address: Address
  contacts: Contact[]
  profile: BusinessProfile
  createdAt: Timestamp
  updatedAt: Timestamp
}
```

### 2.2 Fact (Hecho registrado)
```
Fact {
  id: UUID
  entityId: UUID → BusinessEntity
  type: FactType
  source: Source
  content: JSON (schema según tipo)
  confidence: ConfidenceLevel
  verifiedBy: Authority | null
  verifiedAt: Timestamp | null
  relatedFacts: UUID[]
  createdAt: Timestamp
  sourceHash: string (integridad)
}

enum ConfidenceLevel {
  FACT                    // Verificado con fuente
  CALCULATED              // Cálculo determinista
  ESTIMATED               // Estimación documentada
  PROJECTION              // Proyección con incertidumbre
  AI_RECOMMENDATION       // Recomendación de IA
  PENDING_VERIFICATION    // Requiere verificación
  UNKNOWN                 // No determinado
}
```

### 2.3 Need (Necesidad)
```
Need {
  id: UUID
  entityId: UUID → BusinessEntity
  type: NeedType
  source: NeedSource
  description: string
  applicableRules: Rule[]
  deadline: Timestamp | null
  priority: Priority
  status: NeedStatus
  confidence: ConfidenceLevel
  relatedFacts: UUID[]
  createdAt: Timestamp
  resolvedAt: Timestamp | null
  resolvedBy: Authority | null
}

enum NeedType {
  OBLIGATORY        // Obligación legal/fiscal
  CONDITIONAL       // Se activa bajo condiciones
  EMERGENT          // Detectada por el sistema
  OPPORTUNITY       // Oportunidad identificada
  RISK_MITIGATION   // Mitigación de riesgo
}

enum NeedStatus {
  DETECTED
  ANALYZED
  PREPARED
  PENDING_AUTHORIZATION
  AUTHORIZED
  EXECUTED
  VERIFIED
  CLOSED
  DISMISSED         // Descartada con justificación
}
```

### 2.4 Decision (Decisión)
```
Decision {
  id: UUID
  entityId: UUID → BusinessEntity
  needId: UUID → Need | null
  type: DecisionType
  content: DecisionContent
  authority: Authority
  basis: DecisionBasis
  confidence: ConfidenceLevel
  evidence: UUID[] → Evidence
  blackBoxEntry: UUID → BlackBoxEntry
  status: DecisionStatus
  createdAt: Timestamp
  executedAt: Timestamp | null
}

enum DecisionType {
  HUMAN_EXCLUSIVE        // Solo humano puede decidir
  AI_PREPARED            // IA prepara, humano autoriza
  SYSTEM_AUTOMATIC       // Sistema ejecuta (sin acción material)
  RULE_BASED             // Regla determinista
}

enum DecisionStatus {
  PREPARED
  VERIFIED
  PENDING_AUTHORIZATION
  AUTHORIZED
  REJECTED
  EXECUTED
  EVIDENCED
}
```

### 2.5 Evidence (Evidencia)
```
Evidence {
  id: UUID
  entityId: UUID → BusinessEntity
  type: EvidenceType
  content: EvidenceContent
  source: Source
  integrityHash: string (SHA-256)
  timestamp: Timestamp
  chainPosition: UUID (previous evidence in chain)
  metadata: EvidenceMetadata
}

enum EvidenceType {
  DOCUMENT            // Documento registrado
  COMMUNICATION       // Comunicación (email, carta, etc.)
  TRANSACTION         // Transacción económica
  DECISION_RECORD     // Registro de decisión
  SYSTEM_EVENT        // Evento del sistema
  EXTERNAL_SOURCE     // Fuente externa verificada
  HUMAN_ATTESTATION   // Declaración humana
}
```

### 2.6 BlackBoxEntry (Caja Negra)
```
BlackBoxEntry {
  id: UUID
  entityId: UUID → BusinessEntity
  timestamp: Timestamp
  context: BlackBoxContext
  input: JSON (datos de entrada)
  model: ModelReference (qué motor de IA se usó)
  modelVersion: string
  prompt: string (prompt exacto)
  output: JSON (respuesta del modelo)
  reasoning: string (cadena de razonamiento si disponible)
  confidence: ConfidenceLevel
  integrityHash: string
  previousEntry: UUID | null
}
```

### 2.7 Workflow (Flujo de trabajo)
```
Workflow {
  id: UUID
  entityId: UUID → BusinessEntity
  type: WorkflowType
  name: string
  steps: WorkflowStep[]
  currentStep: number
  status: WorkflowStatus
  context: JSON
  evidence: UUID[]
  createdAt: Timestamp
  completedAt: Timestamp | null
}

enum WorkflowStatus {
  INITIATED
  IN_PROGRESS
  WAITING_AUTHORIZATION
  COMPLETED
  FAILED
  CANCELLED
}
```

### 2.8 Case (Expediente)
```
Case {
  id: UUID
  entityId: UUID → BusinessEntity
  type: CaseType
  reference: string (referencia legible)
  title: string
  description: string
  status: CaseStatus
  relatedFacts: UUID[]
  relatedDocuments: UUID[]
  relatedDecisions: UUID[]
  relatedEvidence: UUID[]
  timeline: TimelineEntry[]
  createdAt: Timestamp
  closedAt: Timestamp | null
}

enum CaseType {
  FISCAL              // Expediente fiscal
  LEGAL               // Expediente legal
  TENDER              // Licitación
  CONTRACT            // Contrato
  INCIDENT            // Incidente
  AUDIT               // Auditoría
  GENERAL             // General
}
```

---

## 3. EVENTOS DEL SISTEMA

### 3.1 Tipos de eventos

```
DomainEvent {
  id: UUID
  type: EventType
  aggregateId: UUID
  aggregateType: string
  payload: JSON
  metadata: EventMetadata
  timestamp: Timestamp
  causationId: UUID | null  // qué evento causó este
  correlationId: UUID       // correlación de eventos relacionados
}

enum EventType {
  // Business Core
  BUSINESS_PROFILE_CREATED
  BUSINESS_PROFILE_UPDATED
  FACT_RECORDED
  FACT_VERIFIED
  NEED_DETECTED
  NEED_ANALYZED
  NEED_PREPARED
  NEED_AUTHORIZED
  NEED_EXECUTED
  NEED_CLOSED
  
  // Decisions
  DECISION_PREPARED
  DECISION_VERIFIED
  DECISION_AUTHORIZED
  DECISION_REJECTED
  DECISION_EXECUTED
  
  // Money & Tax
  INVOICE_CREATED
  INVOICE_SENT
  PAYMENT_RECEIVED
  PAYMENT_MADE
  TAX_OBLIGATION_CALCULATED
  TAX_OBLIGATION_DUE
  TAX_OBLIGATION_FULFILLED
  
  // Legal
  CONTRACT_CREATED
  CONTRACT_SIGNED
  OBLIGATION_REGISTERED
  DEADLINE_APPROACHING
  DEADLINE_REACHED
  REGULATION_CHANGED
  
  // Tenders
  TENDER_PUBLISHED
  TENDER_DETECTED
  TENDER_EVALUATED
  TENDER_ELIGIBLE
  TENDER_INELIGIBLE
  TENDER_DISCARDED_WITH_REASON
  
  // Intelligence
  ANTICIPATION_GENERATED
  ANOMALY_DETECTED
  RISK_UPDATED
  OPPORTUNITY_IDENTIFIED
  FORECAST_UPDATED
  
  // Security
  EVIDENCE_RECORDED
  BLACKBOX_ENTRY_CREATED
  INCIDENT_REPORTED
  BACKUP_COMPLETED
  AUTHORIZATION_GRANTED
  AUTHORIZATION_REVOKED
}
```

### 3.2 EventMetadata
```
EventMetadata {
  userId: UUID | null       // quién provocó el evento
  systemComponent: string   // qué módulo lo generó
  modelProvider: string | null  // si involucra IA
  modelVersion: string | null
  confidence: ConfidenceLevel
  source: Source
  processingTime: number    // ms
  retryCount: number
}
```

---

## 4. FLUJOS DE DATOS PRINCIPALES

### 4.1 Flujo: Detección de Necesidad
```
[Evento externo/interno]
  → Engine detecta patrón o cambio
  → Genera Need (PENDING_VERIFICATION)
  → Attention Engine evalúa urgencia
  → Si urgente: estado DECISIÓN
  → Si informativo: estado ATENCIÓN
  → Si no relevante: registra, no interrumpe
```

### 4.2 Flujo: Acción con Autorización
```
[Need detectada]
  → Sistema prepara acción (Workflow)
  → Sistema verifica consistencia
  → Presenta al humano:
    - Qué se va a hacer
    - Base (datos + reglas)
    - Evidencia que generará
    - Consecuencia de no actuar
  → Humano autoriza
  → Sistema ejecuta
  → Sistema registra evidencia
  → Black Box registra contexto IA
```

### 4.3 Flujo: Licitación
```
[Source publica licitación]
  → Monitoring detecta
  → Search indexa
  → Eligibility evalúa vs Business Profile
  → Si elegible: Alerta al usuario
  → Si no elegible: Discard Explainer genera explicación
  → Si elegible + interesada: abre Case
  → Deadlines vigilan plazos
  → Documentation prepara documentos requeridos
```

### 4.4 Flujo: Trazabilidad completa
```
[Hecho material ocurre]
  → SOURCE: origen identificado
  → DATA: dato capturado con metadata
  → RULE: regla aplicada (si corresponde)
  → NEED: necesidad generada
  → DECISION: decisión tomada (con authority)
  → AUTHORITY: quién autorizó
  → ACTION: acción ejecutada
  → RESULT: resultado obtenido
  → EVIDENCE: evidencia generada (con hash)
  → Todo registrado en Black Box
```

---

## 5. MODELO DE ALMACENAMIENTO

### 5.1 PostgreSQL Schema (conceptual)

```sql
-- Tablas principales
business_entities (id, legal_name, tax_id, jurisdiction, ...)
facts (id, entity_id, type, source, content, confidence, ...)
needs (id, entity_id, type, source, status, deadline, ...)
decisions (id, entity_id, need_id, type, authority_id, status, ...)
evidence (id, entity_id, type, content, integrity_hash, ...)
black_box_entries (id, entity_id, timestamp, context, input, output, ...)
workflows (id, entity_id, type, status, current_step, ...)
cases (id, entity_id, type, reference, status, ...)

-- Tablas de eventos (event sourcing)
domain_events (id, type, aggregate_id, aggregate_type, payload, metadata, timestamp, ...)

-- Tablas de referencia
rules (id, type, jurisdiction, content, valid_from, valid_to, ...)
authorities (id, entity_id, type, scope, delegated_by, ...)
sources (id, type, name, url, reliability, ...)
documents (id, entity_id, type, storage_ref, metadata, ...)

-- Índices
-- Por entity_id en todas las tablas principales
-- Por timestamp en events
-- Por status en needs, decisions, workflows
-- Full-text search en facts, documents
-- Vector search (pgvector) en facts para búsqueda semántica
```

### 5.2 Separación de responsabilidades

| Capa | Almacén | Propósito |
|------|---------|-----------|
| Transaccional | PostgreSQL | Estado actual, queries |
| Event Store | PostgreSQL (domain_events) | Event sourcing, audit trail |
| Documentos | MinIO | Archivos, PDFs, imágenes |
| Búsqueda vectorial | pgvector / Qdrant | Embeddings para RAG |
| Cache | Redis | Sesiones, estado temporal |
| Black Box | Append-only table + hash chain | Inmutabilidad verificable |

---

## 6. INTEGRIDAD Y AUDITORÍA

### 6.1 Cadena de evidencia
```
Evidence[n].integrityHash = SHA256(
  Evidence[n].content +
  Evidence[n].timestamp +
  Evidence[n-1].integrityHash  // cadena
)
```

### 6.2 Black Box chain
```
BlackBoxEntry[n].integrityHash = SHA256(
  BlackBoxEntry[n].input +
  BlackBoxEntry[n].output +
  BlackBoxEntry[n].timestamp +
  BlackBoxEntry[n-1].integrityHash
)
```

### 6.3 Verificación
En cualquier momento se puede:
1. Recalcular hash de un evento
2. Verificar cadena completa
3. Confirmar que no ha habido alteración
4. Demostrar integridad ante terceros

---

*Documento generado como parte de la Orden 0. Pendiente de aceptación humana.*
