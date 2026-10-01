/**
 * CORE — Identifiers & Primitives
 * 
 * Tipos primitivos del sistema. Todos los identificadores pasan por aquí
 * para garantizar consistencia y trazabilidad.
 */

// Branded types for type safety
declare const __brand: unique symbol;
type Brand<T, B extends string> = T & { readonly [__brand]: B };

export type UUID = Brand<string, 'UUID'>;
export type Timestamp = Brand<string, 'ISO8601'>;
export type Hash = Brand<string, 'SHA256'>;

/**
 * Genera un UUID v4.
 * En producción se debe usar crypto.randomUUID() o equivalente seguro.
 */
export function createUUID(): UUID {
  // Use crypto.randomUUID when available, fallback for test environments
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID() as UUID;
  }
  // Fallback: simple v4 UUID generation (NOT for production security)
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  }) as UUID;
}

/**
 * Timestamp ISO8601 actual.
 */
export function now(): Timestamp {
  return new Date().toISOString() as Timestamp;
}

/**
 * Valida formato UUID.
 */
export function isValidUUID(value: string): value is UUID {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(value);
}

/**
 * Valida formato ISO8601.
 */
export function isValidTimestamp(value: string): value is Timestamp {
  const d = new Date(value);
  return !isNaN(d.getTime());
}

/**
 * Valida formato hash SHA256 (64 hex chars).
 */
export function isValidHash(value: string): value is Hash {
  return /^[a-f0-9]{64}$/i.test(value);
}
