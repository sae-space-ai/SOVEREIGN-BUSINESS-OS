/**
 * EVIDENCE & BLACK BOX — Sistema de integridad verificable
 * 
 * Implementa hash chain REAL usando Web Crypto API (SHA-256).
 * Cada registro de evidencia incluye un hash que encadena con el anterior.
 * La Black Box es append-only con integridad criptográfica verificable.
 * 
 * PROPIEDAD DE INTEGRIDAD DEMOSTRADA:
 * - Cada evidencia tiene integrityHash = SHA-256(content)
 * - Cada evidencia tiene chainHash = SHA-256(integrityHash + timestamp + previousChainHash)
 * - Alterar cualquier evidencia invalida todos los hashes siguientes
 * - La verificación recalcula y compara hashes
 * 
 * NO es "immutable" por interfaz — es immutable por verificación criptográfica.
 * 
 * Basado en: TRACEABILITY_AUTHORITY_MODEL_V1, DATA_EVENT_MODEL_V1
 */

import type { UUID, Hash, Timestamp } from '../../core/identifiers';
import { createUUID, now, isValidHash } from '../../core/identifiers';
import { EvidenceError } from '../../core/errors';
import type { Evidence, EvidenceType, EvidenceMetadata, ConfidenceLevel } from '../types';

// ============================================================================
// CRYPTO — Hash functions using Web Crypto API
// ============================================================================

/**
 * Calcula SHA-256 de un string.
 * Usa Web Crypto API (disponible en navegadores y Node.js 15+).
 */
export async function sha256(input: string): Promise<Hash> {
  const encoder = new TextEncoder();
  const data = encoder.encode(input);
  
  // Use SubtleCrypto (available in browser and Node.js 15+)
  if (typeof crypto !== 'undefined' && crypto.subtle) {
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    return hashHex as Hash;
  }
  
  // Fallback for environments without SubtleCrypto (should not happen in modern envs)
  throw new EvidenceError(
    'INTERNAL_ERROR',
    'SubtleCrypto not available. Cannot compute SHA-256.'
  );
}

/**
 * Calcula el integrityHash de un contenido.
 */
export async function computeIntegrityHash(content: unknown): Promise<Hash> {
  const serialized = JSON.stringify(content, Object.keys(content as object).sort());
  return sha256(serialized);
}

/**
 * Calcula el chainHash encadenando con el hash anterior.
 */
export async function computeChainHash(
  integrityHash: Hash,
  timestamp: Timestamp,
  previousChainHash: Hash | 'GENESIS'
): Promise<Hash> {
  const input = `${integrityHash}:${timestamp}:${previousChainHash}`;
  return sha256(input);
}

// ============================================================================
// EVIDENCE STORE CONTRACT
// ============================================================================

export interface EvidenceStore {
  /**
   * Registra una nueva evidencia con hash chain.
   * Calcula integrityHash y chainHash automáticamente.
   */
  record(input: EvidenceRecordInput): Promise<Evidence>;

  /**
   * Obtiene una evidencia por ID.
   */
  getById(id: UUID): Promise<Evidence | null>;

  /**
   * Obtiene evidencias por organización.
   */
  getByOrganisation(organisationId: UUID): Promise<Evidence[]>;

  /**
   * Verifica la integridad de una evidencia.
   * Recalcula hashes y compara.
   */
  verifyIntegrity(id: UUID): Promise<IntegrityVerification>;

  /**
   * Verifica la cadena completa de evidencias.
   */
  verifyChain(organisationId: UUID): Promise<ChainVerification>;
}

export interface EvidenceRecordInput {
  organisationId: UUID;
  type: EvidenceType;
  title: string;
  description: string;
  content: unknown;
  sourceId: UUID;
  metadata: EvidenceMetadata;
  relatedFacts?: UUID[];
  relatedDecisions?: UUID[];
  actorId: UUID;
  authorityId: UUID | null;
}

export interface IntegrityVerification {
  evidenceId: UUID;
  integrityValid: boolean;
  chainValid: boolean;
  expectedIntegrityHash: Hash;
  actualIntegrityHash: Hash;
  expectedChainHash: Hash;
  actualChainHash: Hash;
}

export interface ChainVerification {
  organisationId: UUID;
  totalEvidences: number;
  verifiedCount: number;
  brokenAt: UUID | null;
  allValid: boolean;
}

// ============================================================================
// IN-MEMORY IMPLEMENTATION (NON_PRODUCTION)
// ============================================================================

/**
 * Evidence store en memoria con hash chain REAL.
 * ETIQUETADO: NON_PRODUCTION — Solo para tests y desarrollo.
 * En producción se debe usar almacenamiento persistente con la misma lógica de hash.
 * 
 * PROPIEDAD VERIFICADA: La integridad se demuestra recalculando hashes,
 * no por confianza en el almacenamiento.
 */
export function createInMemoryEvidenceStore(): EvidenceStore {
  const evidences = new Map<UUID, Evidence>();
  // Store original content for integrity verification (in production, content is in object storage)
  const originalContent = new Map<UUID, unknown>();

  return {
    async record(input: EvidenceRecordInput): Promise<Evidence> {
      // Get last evidence for this organisation (for chain)
      const orgEvidences = Array.from(evidences.values())
        .filter((e) => e.organisationId === input.organisationId)
        .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
      
      const lastEvidence = orgEvidences[orgEvidences.length - 1];
      const previousEvidenceId = lastEvidence?.id || null;
      const previousChainHash: Hash | 'GENESIS' = lastEvidence?.chainHash || 'GENESIS' as const;

      const timestamp = now();
      
      // Compute integrity hash from content
      const integrityHash = await computeIntegrityHash(input.content);
      
      // Compute chain hash
      const chainHash = await computeChainHash(integrityHash, timestamp, previousChainHash);

      const evidence: Evidence = {
        id: createUUID(),
        organisationId: input.organisationId,
        type: input.type,
        title: input.title,
        description: input.description,
        content: input.content,
        sourceId: input.sourceId,
        timestamp,
        integrityHash,
        previousEvidenceId,
        chainHash,
        metadata: input.metadata,
        relatedFacts: input.relatedFacts || [],
        relatedDecisions: input.relatedDecisions || [],
      };

      evidences.set(evidence.id, evidence);
      originalContent.set(evidence.id, input.content);

      return evidence;
    },

    async getById(id: UUID): Promise<Evidence | null> {
      return evidences.get(id) || null;
    },

    async getByOrganisation(organisationId: UUID): Promise<Evidence[]> {
      return Array.from(evidences.values())
        .filter((e) => e.organisationId === organisationId)
        .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
    },

    async verifyIntegrity(id: UUID): Promise<IntegrityVerification> {
      const evidence = evidences.get(id);
      if (!evidence) {
        throw new EvidenceError('EVIDENCE_NOT_FOUND', 'Evidence not found', { id });
      }

      // Recalculate integrity hash from stored content
      const storedContent = originalContent.get(id);
      const recalculatedIntegrity = await computeIntegrityHash(storedContent);

      // Recalculate chain hash
      const previousEvidence = evidence.previousEvidenceId
        ? evidences.get(evidence.previousEvidenceId)
        : null;
      const previousChainHash: Hash | 'GENESIS' = previousEvidence?.chainHash || 'GENESIS' as const;
      const recalculatedChain = await computeChainHash(
        evidence.integrityHash,
        evidence.timestamp,
        previousChainHash
      );

      return {
        evidenceId: id,
        integrityValid: recalculatedIntegrity === evidence.integrityHash,
        chainValid: recalculatedChain === evidence.chainHash,
        expectedIntegrityHash: recalculatedIntegrity,
        actualIntegrityHash: evidence.integrityHash,
        expectedChainHash: recalculatedChain,
        actualChainHash: evidence.chainHash,
      };
    },

    async verifyChain(organisationId: UUID): Promise<ChainVerification> {
      const orgEvidences = await this.getByOrganisation(organisationId);
      
      let verifiedCount = 0;
      let brokenAt: UUID | null = null;

      for (const evidence of orgEvidences) {
        const verification = await this.verifyIntegrity(evidence.id);
        if (verification.integrityValid && verification.chainValid) {
          verifiedCount++;
        } else {
          brokenAt = evidence.id;
          break;
        }
      }

      return {
        organisationId,
        totalEvidences: orgEvidences.length,
        verifiedCount,
        brokenAt,
        allValid: verifiedCount === orgEvidences.length,
      };
    },
  };
}

// ============================================================================
// BLACK BOX — Append-only log de interacciones IA
// ============================================================================

export interface BlackBoxEntry {
  id: UUID;
  organisationId: UUID;
  timestamp: Timestamp;
  context: Record<string, unknown>;
  input: Record<string, unknown>;
  model: ModelReference;
  output: Record<string, unknown>;
  confidence: ConfidenceLevel;
  limitations: string[];
  humanOverride: boolean;
  humanCorrection: unknown | null;
  humanReason: string | null;
  integrityHash: Hash;
  previousEntryId: UUID | null;
  chainHash: Hash;
}

export interface ModelReference {
  provider: string;
  engine: string;
  modelId: string;
  modelVersion: string;
}

export interface BlackBox {
  /**
   * Registra una interacción con IA.
   */
  record(input: BlackBoxRecordInput): Promise<BlackBoxEntry>;

  /**
   * Obtiene una entrada por ID.
   */
  getById(id: UUID): Promise<BlackBoxEntry | null>;

  /**
   * Verifica integridad de una entrada.
   */
  verifyIntegrity(id: UUID): Promise<boolean>;
}

export interface BlackBoxRecordInput {
  organisationId: UUID;
  context: Record<string, unknown>;
  input: Record<string, unknown>;
  model: ModelReference;
  output: Record<string, unknown>;
  confidence: ConfidenceLevel;
  limitations: string[];
}

/**
 * Black Box en memoria.
 * ETIQUETADO: NON_PRODUCTION
 */
export function createInMemoryBlackBox(): BlackBox {
  const entries = new Map<UUID, BlackBoxEntry>();
  const originalData = new Map<UUID, { input: Record<string, unknown>; output: Record<string, unknown> }>();

  return {
    async record(input: BlackBoxRecordInput): Promise<BlackBoxEntry> {
      const orgEntries = Array.from(entries.values())
        .filter((e) => e.organisationId === input.organisationId)
        .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());

      const lastEntry = orgEntries[orgEntries.length - 1];
      const previousEntryId = lastEntry?.id || null;
      const previousChainHash: Hash | 'GENESIS' = lastEntry?.chainHash || 'GENESIS' as const;

      const timestamp = now();
      const content = { context: input.context, input: input.input, output: input.output, model: input.model };
      const integrityHash = await computeIntegrityHash(content);
      const chainHash = await computeChainHash(integrityHash, timestamp, previousChainHash);

      const entry: BlackBoxEntry = {
        id: createUUID(),
        organisationId: input.organisationId,
        timestamp,
        context: input.context,
        input: input.input,
        model: input.model,
        output: input.output,
        confidence: input.confidence,
        limitations: input.limitations,
        humanOverride: false,
        humanCorrection: null,
        humanReason: null,
        integrityHash,
        previousEntryId,
        chainHash,
      };

      entries.set(entry.id, entry);
      originalData.set(entry.id, { input: input.input, output: input.output });

      return entry;
    },

    async getById(id: UUID): Promise<BlackBoxEntry | null> {
      return entries.get(id) || null;
    },

    async verifyIntegrity(id: UUID): Promise<boolean> {
      const entry = entries.get(id);
      if (!entry) return false;

      const original = originalData.get(id);
      if (!original) return false;

      const content = { context: entry.context, input: original.input, output: original.output, model: entry.model };
      const recalculated = await computeIntegrityHash(content);
      
      const previousEntry = entry.previousEntryId ? entries.get(entry.previousEntryId) : null;
      const previousChainHash: Hash | 'GENESIS' = previousEntry?.chainHash || 'GENESIS' as const;
      const recalculatedChain = await computeChainHash(entry.integrityHash, entry.timestamp, previousChainHash);

      return recalculated === entry.integrityHash && recalculatedChain === entry.chainHash;
    },
  };
}
