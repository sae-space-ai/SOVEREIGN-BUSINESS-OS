/**
 * CORE — Error Hierarchy
 * 
 * Sistema centralizado de errores con clasificación por dominio.
 * Todo error debe ser trazable y categorizable.
 */

export type ErrorCode = 
  // Authority errors
  | 'AUTHORITY_REQUIRED'
  | 'AUTHORITY_INSUFFICIENT'
  | 'AUTHORITY_EXPIRED'
  | 'AUTHORITY_REVOKED'
  | 'IDENTITY_NOT_VERIFIED'
  // Validation errors
  | 'VALIDATION_FAILED'
  | 'REQUIRED_FIELD_MISSING'
  | 'INVALID_FORMAT'
  | 'INVALID_TRANSITION'
  // Confidence errors
  | 'CONFIDENCE_INSUFFICIENT'
  | 'UNKNOWN_DATA_USED_AS_FACT'
  // Evidence errors
  | 'EVIDENCE_TAMPERED'
  | 'EVIDENCE_CHAIN_BROKEN'
  | 'EVIDENCE_NOT_FOUND'
  // State errors
  | 'INVALID_STATE_TRANSITION'
  | 'STATE_DERIVATION_FAILED'
  // Event errors
  | 'EVENT_INCOMPLETE'
  | 'EVENT_SEQUENCE_GAP'
  // Storage errors
  | 'STORAGE_UNAVAILABLE'
  | 'STORAGE_WRITE_FAILED'
  | 'STORAGE_READ_FAILED'
  // General
  | 'NOT_FOUND'
  | 'INTERNAL_ERROR'
  | 'NOT_IMPLEMENTED';

export class DomainError extends Error {
  public readonly code: ErrorCode;
  public readonly details: Record<string, unknown>;
  public readonly timestamp: string;
  public readonly cause?: Error;

  constructor(
    code: ErrorCode,
    message: string,
    details: Record<string, unknown> = {},
    cause?: Error
  ) {
    super(message);
    this.name = 'DomainError';
    this.code = code;
    this.details = details;
    this.timestamp = new Date().toISOString();
    this.cause = cause;
  }

  toJSON() {
    return {
      name: this.name,
      code: this.code,
      message: this.message,
      details: this.details,
      timestamp: this.timestamp,
      cause: this.cause?.message,
    };
  }
}

// Specialized error factories
export class AuthorityError extends DomainError {
  constructor(code: ErrorCode, message: string, details: Record<string, unknown> = {}) {
    super(code, message, details);
    this.name = 'AuthorityError';
  }
}

export class ValidationError extends DomainError {
  constructor(message: string, details: Record<string, unknown> = {}) {
    super('VALIDATION_FAILED', message, details);
    this.name = 'ValidationError';
  }
}

export class ConfidenceError extends DomainError {
  constructor(message: string, details: Record<string, unknown> = {}) {
    super('CONFIDENCE_INSUFFICIENT', message, details);
    this.name = 'ConfidenceError';
  }
}

export class EvidenceError extends DomainError {
  constructor(code: ErrorCode, message: string, details: Record<string, unknown> = {}) {
    super(code, message, details);
    this.name = 'EvidenceError';
  }
}

export class StateError extends DomainError {
  constructor(message: string, details: Record<string, unknown> = {}) {
    super('INVALID_STATE_TRANSITION', message, details);
    this.name = 'StateError';
  }
}

/**
 * Error handler central.
 * En producción debe integrar con sistema de logging y alertas.
 */
export function handleError(error: unknown): DomainError {
  if (error instanceof DomainError) {
    return error;
  }
  if (error instanceof Error) {
    return new DomainError('INTERNAL_ERROR', error.message, {}, error);
  }
  return new DomainError('INTERNAL_ERROR', String(error));
}
