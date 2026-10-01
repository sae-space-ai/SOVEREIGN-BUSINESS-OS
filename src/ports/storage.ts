/**
 * PORTS — Abstracciones de almacenamiento
 * 
 * Contratos para todos los sistemas de almacenamiento.
 * El dominio NO depende de implementaciones concretas.
 * 
 * Principio: Sin vendor lock-in. Todas las implementaciones son intercambiables.
 */

import type { UUID } from '../core/identifiers';
import type { DomainEvent } from '../domain/types';

// ============================================================================
// DATABASE PORT
// ============================================================================

export interface DatabasePort {
  query<T>(sql: string, params?: unknown[]): Promise<T[]>;
  execute(sql: string, params?: unknown[]): Promise<void>;
  transaction<T>(fn: (client: DatabasePort) => Promise<T>): Promise<T>;
  health(): Promise<boolean>;
}

// ============================================================================
// OBJECT STORAGE PORT
// ============================================================================

export interface ObjectStoragePort {
  put(key: string, data: Uint8Array, metadata?: Record<string, string>): Promise<string>;
  get(key: string): Promise<{ data: Uint8Array; metadata: Record<string, string> } | null>;
  delete(key: string): Promise<void>;
  exists(key: string): Promise<boolean>;
  health(): Promise<boolean>;
}

// ============================================================================
// IDENTITY PROVIDER PORT
// ============================================================================

export interface IdentityProviderPort {
  authenticate(credentials: unknown): Promise<{ identityId: UUID; token: string }>;
  validateToken(token: string): Promise<{ identityId: UUID; valid: boolean }>;
  revokeToken(token: string): Promise<void>;
  health(): Promise<boolean>;
}

// ============================================================================
// SECRET PROVIDER PORT
// ============================================================================

export interface SecretProviderPort {
  get(name: string): Promise<string | null>;
  set(name: string, value: string): Promise<void>;
  delete(name: string): Promise<void>;
  rotate(name: string): Promise<void>;
  health(): Promise<boolean>;
}

// ============================================================================
// EVENT STORE PORT
// ============================================================================

export interface EventStorePort {
  append(event: DomainEvent): Promise<void>;
  getByAggregate(aggregateId: UUID): Promise<DomainEvent[]>;
  getByType(type: string): Promise<DomainEvent[]>;
  getById(id: UUID): Promise<DomainEvent | null>;
  health(): Promise<boolean>;
}

// ============================================================================
// EVIDENCE STORE PORT
// ============================================================================

export interface EvidenceStorePort {
  record(evidence: unknown): Promise<UUID>;
  getById(id: UUID): Promise<unknown | null>;
  getByOrganisation(organisationId: UUID): Promise<unknown[]>;
  verifyIntegrity(id: UUID): Promise<{ valid: boolean; reason?: string }>;
  health(): Promise<boolean>;
}
