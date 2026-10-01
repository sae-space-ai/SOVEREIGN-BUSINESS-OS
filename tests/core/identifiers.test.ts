/**
 * TESTS — Core Identifiers
 */

import { describe, it, expect } from 'vitest';
import { createUUID, now, isValidUUID, isValidTimestamp, isValidHash } from '../../src/core/identifiers';

describe('Identifiers', () => {
  describe('createUUID', () => {
    it('genera UUIDs válidos', () => {
      const uuid = createUUID();
      expect(isValidUUID(uuid)).toBe(true);
    });

    it('genera UUIDs únicos', () => {
      const uuids = new Set(Array.from({ length: 100 }, () => createUUID()));
      expect(uuids.size).toBe(100);
    });
  });

  describe('now', () => {
    it('genera timestamp ISO8601 válido', () => {
      const timestamp = now();
      expect(isValidTimestamp(timestamp)).toBe(true);
    });
  });

  describe('isValidUUID', () => {
    it('acepta UUIDs válidos', () => {
      expect(isValidUUID('550e8400-e29b-41d4-a716-446655440000')).toBe(true);
    });

    it('rechaza strings no UUID', () => {
      expect(isValidUUID('not-a-uuid')).toBe(false);
      expect(isValidUUID('')).toBe(false);
      expect(isValidUUID('550e8400')).toBe(false);
    });
  });

  describe('isValidTimestamp', () => {
    it('acepta timestamps ISO8601 válidos', () => {
      expect(isValidTimestamp('2024-01-01T00:00:00.000Z')).toBe(true);
    });

    it('rechaza strings no timestamp', () => {
      expect(isValidTimestamp('not-a-date')).toBe(false);
    });
  });

  describe('isValidHash', () => {
    it('acepta hashes SHA256 válidos (64 hex chars)', () => {
      const validHash = 'a'.repeat(64);
      expect(isValidHash(validHash)).toBe(true);
    });

    it('rechaza hashes inválidos', () => {
      expect(isValidHash('too-short')).toBe(false);
      expect(isValidHash('g'.repeat(64))).toBe(false); // 'g' no es hex
    });
  });
});
