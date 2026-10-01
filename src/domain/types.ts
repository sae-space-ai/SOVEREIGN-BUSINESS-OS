/**
 * DOMAIN TYPES — Contratos fundamentales del dominio
 * 
 * Define todas las entidades, value objects y enums del sistema.
 * Estos contratos son estables y migrables.
 * 
 * Basado en: ARCHITECTURE_MASTER_V1, DATA_EVENT_MODEL_V1, TRACEABILITY_AUTHORITY_MODEL_V1
 */

import type { UUID, Timestamp, Hash } from '../core/identifiers';

// ============================================================================
// CLASSIFICACIÓN EPISTEMOLÓGICA (Confianza de datos)
// ============================================================================

/**
 * Nivel de confianza de todo dato en el sistema.
 * CRÍTICO: Nunca se presenta incertidumbre como certeza.
 * CRÍTICO: UNKNOWN nunca se usa para decisiones.
 * CRÍTICO: AI_RECOMMENDATION nunca se ejecuta sin autorización humana.
 */
export const ConfidenceLevel = {
  FACT: 'FACT',                           // Verificado con fuente
  CALCULATED: 'CALCULATED',               // Cálculo determinista reproducible
  ESTIMATED: 'ESTIMATED',                 // Estimación con método documentado
  PROJECTION: 'PROJECTION',               // Proyección con incertidumbre cuantificada
  AI_RECOMMENDATION: 'AI_RECOMMENDATION', // Recomendación de IA (no ejecutable sin humano)
  PENDING_VERIFICATION: 'PENDING_VERIFICATION', // Requiere verificación humana
  UNKNOWN: 'UNKNOWN',                     // No determinado — NO USAR PARA DECISIONES
} as const;

export type ConfidenceLevel = typeof ConfidenceLevel[keyof typeof ConfidenceLevel];

/**
 * Clasifica si un nivel de confianza permite tomar decisiones.
 */
export function isDecisionGrade(confidence: ConfidenceLevel): boolean {
  return confidence === ConfidenceLevel.FACT || confidence === ConfidenceLevel.CALCULATED;
}

/**
 * Clasifica si un nivel de confianza requiere verificación antes de actuar.
 */
export function requiresVerification(confidence: ConfidenceLevel): boolean {
  return (
    confidence === ConfidenceLevel.PENDING_VERIFICATION ||
    confidence === ConfidenceLevel.UNKNOWN ||
    confidence === ConfidenceLevel.AI_RECOMMENDATION
  );
}

// ============================================================================
// IDENTIDAD Y PERSONAS
// ============================================================================

export interface Person {
  id: UUID;
  givenName: string;
  familyName: string;
  email?: string;
  identifiers: PersonIdentifier[];
  createdAt: Timestamp;
}

export interface PersonIdentifier {
  type: 'DNI' | 'NIE' | 'PASSPORT' | 'TAX_ID' | 'OTHER';
  value: string;
  jurisdiction?: string;
}

// ============================================================================
// ORGANIZACIÓN
// ============================================================================

export interface Organisation {
  id: UUID;
  legalName: string;
  taxId: string; // NIF/CIF/VAT
  jurisdiction: Jurisdiction;
  legalForm: LegalForm;
  registrationDate: Timestamp | null;
  status: OrganisationStatus;
  address: Address | null;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export type OrganisationStatus = 'ACTIVE' | 'DORMANT' | 'DISSOLVED' | 'PENDING_VERIFICATION';

export type LegalForm = 
  | 'SL' | 'SA' | 'SLU' | 'AUTONOMO' 
  | 'COOPERATIVA' | 'ASOCIACION' | 'FUNDACION'
  | 'OTHER';

export interface Jurisdiction {
  countryCode: string; // ISO 3166-1 alpha-2
  regionCode?: string;
  taxAuthority?: string;
}

export interface Address {
  street: string;
  city: string;
  postalCode: string;
  region?: string;
  countryCode: string;
}

// ============================================================================
// BUSINESS PROFILE
// ============================================================================

export interface BusinessProfile {
  organisationId: UUID;
  activities: EconomicActivity[];
  certifications: Certification[];
  employees: number | null; // null = UNKNOWN
  annualRevenue: MonetaryAmount | null; // null = UNKNOWN
  bankAccounts: BankAccount[];
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface EconomicActivity {
  code: string; // CNAE/NACE
  description: string;
  isPrimary: boolean;
}

export interface Certification {
  type: string;
  reference: string;
  validFrom: Timestamp;
  validTo: Timestamp | null;
  issuer: string;
}

export interface MonetaryAmount {
  value: number;
  currency: string; // ISO 4217
  confidence: ConfidenceLevel;
}

export interface BankAccount {
  iban: string;
  bic?: string;
  institution: string;
  isPrimary: boolean;
}

// ============================================================================
// IDENTITY ≠ ROLE ≠ AUTHORITY ≠ PERMISSION
// Separación explícita según Orden 2.
// ============================================================================

/**
 * IDENTITY: Quién es (autenticación)
 */
export interface Identity {
  id: UUID;
  type: 'PERSON' | 'SYSTEM' | 'SERVICE';
  personId?: UUID; // Si type === 'PERSON'
  systemName?: string; // Si type === 'SYSTEM'
  credentials: Credential[];
  status: 'ACTIVE' | 'SUSPENDED' | 'REVOKED';
  createdAt: Timestamp;
}

export interface Credential {
  type: 'PASSWORD' | 'CERTIFICATE' | 'API_KEY' | 'BIOMETRIC' | 'FEDERATED';
  reference: string; // No el secreto, solo referencia
  expiresAt: Timestamp | null;
}

/**
 * ROLE: Qué función desempeña (agrupación de permisos)
 */
export interface Role {
  id: UUID;
  name: string;
  description: string;
  permissions: PermissionGrant[];
  scope: RoleScope;
  createdAt: Timestamp;
}

export type RoleScope = 'GLOBAL' | 'DOMAIN' | 'MODULE' | 'ENTITY';

export interface PermissionGrant {
  action: Action;
  resource: string; // Patrón de recurso
  conditions?: Condition[];
}

/**
 * AUTHORITY: Capacidad de autorizar acciones materiales (humana, irrenunciable)
 * 
 * CRÍTICO: Solo personas físicas pueden tener AUTHORITY para acciones materiales.
 * CRÍTICO: La IA NUNCA tiene Authority para acciones materiales.
 */
export interface Authority {
  id: UUID;
  identityId: UUID; // Debe ser type === 'PERSON'
  type: AuthorityType;
  scope: AuthorityScope;
  grantedBy: UUID; // Identity que otorgó esta autoridad
  grantedAt: Timestamp;
  validFrom: Timestamp;
  validTo: Timestamp | null;
  status: 'ACTIVE' | 'SUSPENDED' | 'REVOKED' | 'EXPIRED';
  evidenceId: UUID; // Evidencia del otorgamiento
}

export type AuthorityType = 
  | 'LEGAL_REPRESENTATIVE'    // Representante legal
  | 'DELEGATED_LEGAL'         // Delegación de representación
  | 'FISCAL_REPRESENTATIVE'   // Representante fiscal
  | 'ADMIN_USER'              // Usuario administrativo
  | 'VIEWER';                 // Solo lectura

export type AuthorityScope = 
  | 'FULL'                    // Toda la empresa
  | 'DOMAIN'                  // Un dominio específico
  | 'MODULE'                  // Un módulo específico
  | 'TRANSACTION_LIMITED';    // Limitado a transacciones específicas

/**
 * PERMISSION: Qué puede hacer concretamente (granular)
 */
export interface Permission {
  id: UUID;
  identityId: UUID;
  source: 'ROLE' | 'DIRECT' | 'AUTHORITY';
  sourceId: UUID; // Role ID o Authority ID
  action: Action;
  resource: string;
  conditions: Condition[];
  validFrom: Timestamp;
  validTo: Timestamp | null;
  grantedAt: Timestamp;
}

export type Action = 
  | 'VIEW'
  | 'CREATE'
  | 'MODIFY'
  | 'DELETE'
  | 'PREPARE_ACTION'
  | 'AUTHORIZE_ACTION'
  | 'EXECUTE_ACTION'
  | 'DELEGATE'
  | 'EXPORT'
  | 'ACCESS_EVIDENCE'
  | 'ACCESS_BLACKBOX';

export interface Condition {
  type: 'TIME' | 'AMOUNT' | 'RESOURCE_TYPE' | 'CUSTOM';
  expression: string;
}

// ============================================================================
// NECESIDADES Y OBLIGACIONES
// ============================================================================

export interface Need {
  id: UUID;
  organisationId: UUID;
  type: NeedType;
  source: NeedSource;
  title: string;
  description: string;
  applicableRules: UUID[];
  deadline: Timestamp | null;
  priority: Priority;
  status: NeedStatus;
  confidence: ConfidenceLevel;
  relatedFacts: UUID[];
  createdAt: Timestamp;
  resolvedAt: Timestamp | null;
  resolvedBy: UUID | null; // Authority ID
}

export type NeedType = 
  | 'OBLIGATORY'        // Obligación legal/fiscal
  | 'CONDITIONAL'       // Se activa bajo condiciones
  | 'EMERGENT'          // Detectada por el sistema
  | 'OPPORTUNITY'       // Oportunidad identificada
  | 'RISK_MITIGATION';  // Mitigación de riesgo

export type NeedSource = 'REGULATION' | 'CONTRACT' | 'SYSTEM_DETECTION' | 'HUMAN_DECLARATION' | 'EXTERNAL_SOURCE';

export type Priority = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';

export type NeedStatus = 
  | 'DETECTED'
  | 'ANALYZED'
  | 'PREPARED'
  | 'PENDING_AUTHORIZATION'
  | 'AUTHORIZED'
  | 'EXECUTED'
  | 'VERIFIED'
  | 'CLOSED'
  | 'DISMISSED';

export interface Obligation {
  id: UUID;
  organisationId: UUID;
  source: UUID; // Regulation or Contract ID
  type: ObligationType;
  description: string;
  deadline: Timestamp | null;
  recurrence: Recurrence | null;
  status: ObligationStatus;
  createdAt: Timestamp;
  fulfilledAt: Timestamp | null;
}

export type ObligationType = 'FISCAL' | 'LEGAL' | 'LABORAL' | 'CONTRACTUAL' | 'REGULATORY';

export type ObligationStatus = 'PENDING' | 'IN_PROGRESS' | 'FULFILLED' | 'OVERDUE' | 'WAIVED';

export interface Recurrence {
  frequency: 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'QUARTERLY' | 'ANNUAL';
  nextDue: Timestamp;
}

// ============================================================================
// DECISIONES Y ACCIONES
// ============================================================================

export interface Decision {
  id: UUID;
  organisationId: UUID;
  needId: UUID | null;
  type: DecisionType;
  title: string;
  rationale: string;
  authorityId: UUID | null; // null si aún no autorizada
  basis: DecisionBasis;
  confidence: ConfidenceLevel;
  evidenceIds: UUID[];
  blackBoxEntryId: UUID | null;
  status: DecisionStatus;
  createdAt: Timestamp;
  executedAt: Timestamp | null;
}

export type DecisionType = 
  | 'HUMAN_EXCLUSIVE'        // Solo humano puede decidir
  | 'AI_PREPARED'            // IA prepara, humano autoriza
  | 'SYSTEM_AUTOMATIC'       // Sistema ejecuta (sin acción material)
  | 'RULE_BASED';            // Regla determinista

export type DecisionStatus = 
  | 'PREPARED'
  | 'VERIFIED'
  | 'PENDING_AUTHORIZATION'
  | 'AUTHORIZED'
  | 'REJECTED'
  | 'EXECUTED'
  | 'EVIDENCED';

export interface DecisionBasis {
  facts: UUID[];
  rules: UUID[];
  calculations: Calculation[];
  aiRecommendations: UUID[]; // Black Box entry IDs
}

export interface Calculation {
  description: string;
  formula: string;
  inputs: Record<string, unknown>;
  output: unknown;
  confidence: ConfidenceLevel;
}

/**
 * MaterialAction: Acción ejecutable que produce un efecto material.
 * Distinta de Action (tipo de permiso: VIEW, CREATE, etc.)
 */
export interface MaterialAction {
  id: UUID;
  decisionId: UUID;
  type: string;
  description: string;
  requiresAuthorization: boolean;
  authorizationGate: AuthorizationGate | null;
  status: ActionStatus;
  executedAt: Timestamp | null;
  result: ActionResult | null;
}

export type ActionStatus = 
  | 'PREPARED'
  | 'VERIFIED'
  | 'PENDING_AUTHORIZATION'
  | 'BLOCKED'               // Sin autoridad válida
  | 'AUTHORIZED'
  | 'EXECUTED'
  | 'FAILED'
  | 'EVIDENCED';

export interface AuthorizationGate {
  id: UUID;
  actionId: UUID;
  requiredAuthority: AuthorityType[];
  presentedAt: Timestamp;
  respondedAt: Timestamp | null;
  respondedBy: UUID | null;
  response: 'AUTHORIZED' | 'REJECTED' | 'DEFERRED' | 'EXPIRED' | null;
  responseReason: string | null;
}

export interface ActionResult {
  success: boolean;
  output: unknown;
  evidenceIds: UUID[];
  errorMessage: string | null;
}

// ============================================================================
// WORKFLOWS
// ============================================================================

export interface Workflow {
  id: UUID;
  organisationId: UUID;
  type: string;
  name: string;
  steps: WorkflowStep[];
  currentStepIndex: number;
  status: WorkflowStatus;
  context: Record<string, unknown>;
  evidenceIds: UUID[];
  createdAt: Timestamp;
  completedAt: Timestamp | null;
}

export interface WorkflowStep {
  id: UUID;
  name: string;
  type: 'AUTOMATIC' | 'HUMAN_GATE' | 'DECISION' | 'NOTIFICATION';
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'FAILED' | 'SKIPPED';
  startedAt: Timestamp | null;
  completedAt: Timestamp | null;
}

export type WorkflowStatus = 'INITIATED' | 'IN_PROGRESS' | 'WAITING_AUTHORIZATION' | 'COMPLETED' | 'FAILED' | 'CANCELLED';

// ============================================================================
// DOCUMENTOS
// ============================================================================

export interface Document {
  id: UUID;
  organisationId: UUID;
  type: DocumentType;
  title: string;
  description: string;
  storageRef: string; // Reference to object storage
  mimeType: string;
  sizeBytes: number;
  contentHash: Hash;
  version: number;
  previousVersionId: UUID | null;
  metadata: Record<string, unknown>;
  confidence: ConfidenceLevel;
  createdAt: Timestamp;
  createdBy: UUID;
}

export type DocumentType = 
  | 'INVOICE' | 'CONTRACT' | 'OFFICIAL_COMMUNICATION' | 'FINANCIAL'
  | 'LEGAL' | 'CORPORATE' | 'LABORAL' | 'FISCAL'
  | 'IDENTITY' | 'CERTIFICATION' | 'OTHER';

// ============================================================================
// FUENTES
// ============================================================================

export interface Source {
  id: UUID;
  type: SourceType;
  name: string;
  reference: string; // URL, documento, persona, sistema
  reliability: SourceReliability;
  jurisdiction: Jurisdiction | null;
  lastVerified: Timestamp | null;
  createdAt: Timestamp;
}

export type SourceType = 'MANUAL' | 'API' | 'DOCUMENT' | 'SYSTEM' | 'AI' | 'REGULATION' | 'THIRD_PARTY';

export type SourceReliability = 'VERIFIED' | 'TRUSTED' | 'UNVERIFIED' | 'SUSPECT';

// ============================================================================
// EVIDENCIA
// ============================================================================

export interface Evidence {
  id: UUID;
  organisationId: UUID;
  type: EvidenceType;
  title: string;
  description: string;
  content: unknown;
  sourceId: UUID;
  timestamp: Timestamp;
  integrityHash: Hash;
  previousEvidenceId: UUID | null;
  chainHash: Hash;
  metadata: EvidenceMetadata;
  relatedFacts: UUID[];
  relatedDecisions: UUID[];
}

export type EvidenceType = 
  | 'INVOICE' | 'CONTRACT' | 'OFFICIAL_COMMUNICATION' | 'FINANCIAL_DOCUMENT'
  | 'DECISION_LOG' | 'WORKFLOW_EXECUTION' | 'SYSTEM_EVENT' | 'AI_INTERACTION'
  | 'THIRD_PARTY_ATTESTATION' | 'REGULATORY_FILING' | 'EXTERNAL_DATA'
  | 'HUMAN_AUTHORIZATION' | 'HUMAN_ATTESTATION' | 'HUMAN_CORRECTION';

export interface EvidenceMetadata {
  format: string;
  language: string;
  tags: string[];
  custom: Record<string, unknown>;
}

// ============================================================================
// EVENTOS
// ============================================================================

export interface DomainEvent {
  id: UUID;
  type: DomainEventType;
  aggregateId: UUID;
  aggregateType: AggregateType;
  payload: Record<string, unknown>;
  metadata: EventMetadata;
  timestamp: Timestamp;
  causationId: UUID | null;
  correlationId: UUID;
  sequenceNumber: number;
}

export type AggregateType = 
  | 'ORGANISATION' | 'PERSON' | 'NEED' | 'DECISION' | 'ACTION'
  | 'WORKFLOW' | 'DOCUMENT' | 'EVIDENCE' | 'OBLIGATION' | 'AUTHORITY';

export type DomainEventType = 
  // Organisation
  | 'ORGANISATION_CREATED' | 'ORGANISATION_UPDATED' | 'ORGANISATION_STATUS_CHANGED'
  // Identity & Authority
  | 'IDENTITY_CREATED' | 'IDENTITY_SUSPENDED' | 'IDENTITY_REVOKED'
  | 'AUTHORITY_GRANTED' | 'AUTHORITY_SUSPENDED' | 'AUTHORITY_REVOKED'
  | 'PERMISSION_GRANTED' | 'PERMISSION_REVOKED'
  // Needs & Obligations
  | 'NEED_DETECTED' | 'NEED_ANALYZED' | 'NEED_PREPARED' | 'NEED_AUTHORIZED' | 'NEED_EXECUTED' | 'NEED_CLOSED' | 'NEED_DISMISSED'
  | 'OBLIGATION_REGISTERED' | 'OBLIGATION_FULFILLED' | 'OBLIGATION_OVERDUE'
  // Decisions & Actions
  | 'DECISION_PREPARED' | 'DECISION_VERIFIED' | 'DECISION_AUTHORIZED' | 'DECISION_REJECTED' | 'DECISION_EXECUTED'
  | 'ACTION_PREPARED' | 'ACTION_BLOCKED' | 'ACTION_AUTHORIZED' | 'ACTION_EXECUTED' | 'ACTION_FAILED'
  // Workflows
  | 'WORKFLOW_INITIATED' | 'WORKFLOW_STEP_COMPLETED' | 'WORKFLOW_COMPLETED' | 'WORKFLOW_FAILED'
  // Evidence & Black Box
  | 'EVIDENCE_RECORDED' | 'BLACKBOX_ENTRY_CREATED'
  // Documents
  | 'DOCUMENT_CREATED' | 'DOCUMENT_VERSIONED'
  // System
  | 'SYSTEM_HEALTH_CHECK' | 'SYSTEM_ERROR' | 'SECURITY_INCIDENT';

export interface EventMetadata {
  userId: UUID | null;
  systemComponent: string;
  modelProvider: string | null;
  modelVersion: string | null;
  confidence: ConfidenceLevel;
  sourceId: UUID;
  processingTimeMs: number;
  retryCount: number;
}

// ============================================================================
// AUDITORÍA
// ============================================================================

export interface AuditRecord {
  id: UUID;
  organisationId: UUID;
  timestamp: Timestamp;
  actorId: UUID;
  action: string;
  resource: string;
  resourceId: UUID;
  details: Record<string, unknown>;
  result: 'SUCCESS' | 'FAILURE' | 'BLOCKED';
  reason: string | null;
  evidenceId: UUID | null;
}

// ============================================================================
// BUSINESS STATE (Estados humanos)
// ============================================================================

/**
 * El estado empresarial derivado de hechos/criterios reales.
 * NO es decoración UI. Se calcula a partir de necesidades, obligaciones y eventos.
 */
export type BusinessState = 'SEGURO' | 'ATENCIÓN' | 'DECISIÓN';

export interface BusinessStateDerivation {
  state: BusinessState;
  computedAt: Timestamp;
  reasons: StateReason[];
  metrics: StateMetrics;
}

export interface StateReason {
  code: string;
  severity: 'INFO' | 'WARNING' | 'CRITICAL';
  message: string;
  relatedNeedId: UUID | null;
  relatedObligationId: UUID | null;
}

export interface StateMetrics {
  totalNeeds: number;
  pendingAuthorization: number;
  overdueObligations: number;
  upcomingDeadlines: number;
  activeAlerts: number;
}
