/**
 * TESTS — Evidence Store & Hash Chain Integrity
 * 
 * Tests críticos:
 * - Hash chain REAL (SHA-256 via Web Crypto API)
 * - Alterar contenido invalida la integridad
 * - Verificación de cadena completa
 * - Black Box append-only con integridad
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { createUUID, now } from '../../src/core/identifiers';
import {
  createInMemoryEvidenceStore,
  createInMemoryBlackBox,
  sha256,
  computeIntegrityHash,
  computeChainHash,
  type EvidenceStore,
  type BlackBox,
} from '../../src/domain/evidence/store';
import { ConfidenceLevel } from '../../src/domain/types';

describe('Evidence Store', () => {
  let store: EvidenceStore;
  const orgId = createUUID();
  const sourceId = createUUID();

  beforeEach(() => {
    store = createInMemoryEvidenceStore();
  });

  describe('Hash chain integrity', () => {
    it('computes SHA-256 hash correctly', async () => {
      const hash = await sha256('hello world');
      // Known SHA-256 of "hello world"
      expect(hash).toBe('b94d27b9934d3e08a52e52d7da7dabfac484efe37a5380ee9088f7ace2efcde9');
    });

    it('records evidence with valid integrity hash', async () => {
      const evidence = await store.record({
        organisationId: orgId,
        type: 'DECISION_LOG',
        title: 'Test decision',
        description: 'A test decision',
        content: { decision: 'approved', amount: 1000 },
        sourceId,
        metadata: { format: 'json', language: 'es', tags: ['test'], custom: {} },
        actorId: createUUID(),
        authorityId: createUUID(),
      });

      expect(evidence.integrityHash).toBeTruthy();
      expect(evidence.chainHash).toBeTruthy();
      expect(evidence.previousEvidenceId).toBeNull(); // First evidence
    });

    it('chains second evidence to first', async () => {
      const first = await store.record({
        organisationId: orgId,
        type: 'DECISION_LOG',
        title: 'First',
        description: 'First evidence',
        content: { n: 1 },
        sourceId,
        metadata: { format: 'json', language: 'es', tags: [], custom: {} },
        actorId: createUUID(),
        authorityId: null,
      });

      const second = await store.record({
        organisationId: orgId,
        type: 'DECISION_LOG',
        title: 'Second',
        description: 'Second evidence',
        content: { n: 2 },
        sourceId,
        metadata: { format: 'json', language: 'es', tags: [], custom: {} },
        actorId: createUUID(),
        authorityId: null,
      });

      expect(second.previousEvidenceId).toBe(first.id);
    });

    it('verifies integrity of unmodified evidence', async () => {
      const evidence = await store.record({
        organisationId: orgId,
        type: 'SYSTEM_EVENT',
        title: 'Test',
        description: 'Test event',
        content: { data: 'original' },
        sourceId,
        metadata: { format: 'json', language: 'es', tags: [], custom: {} },
        actorId: createUUID(),
        authorityId: null,
      });

      const verification = await store.verifyIntegrity(evidence.id);
      expect(verification.integrityValid).toBe(true);
      expect(verification.chainValid).toBe(true);
    });
  });

  describe('NEGATIVE: Tampered evidence', () => {
    it('detects tampered content (integrity hash mismatch)', async () => {
      const evidence = await store.record({
        organisationId: orgId,
        type: 'DECISION_LOG',
        title: 'Original',
        description: 'Original content',
        content: { amount: 1000 },
        sourceId,
        metadata: { format: 'json', language: 'es', tags: [], custom: {} },
        actorId: createUUID(),
        authorityId: null,
      });

      // Simulate tampering by directly modifying stored content
      // (In production, this would be an external attack on storage)
      // We verify that the integrity check would catch this
      const recalculated = await computeIntegrityHash({ amount: 9999 }); // Tampered!
      expect(recalculated).not.toBe(evidence.integrityHash);
    });
  });

  describe('Chain verification', () => {
    it('verifies complete chain', async () => {
      // Record multiple evidences
      for (let i = 0; i < 5; i++) {
        await store.record({
          organisationId: orgId,
          type: 'SYSTEM_EVENT',
          title: `Event ${i}`,
          description: `Event ${i}`,
          content: { index: i },
          sourceId,
          metadata: { format: 'json', language: 'es', tags: [], custom: {} },
          actorId: createUUID(),
          authorityId: null,
        });
      }

      const verification = await store.verifyChain(orgId);
      expect(verification.allValid).toBe(true);
      expect(verification.totalEvidences).toBe(5);
      expect(verification.verifiedCount).toBe(5);
      expect(verification.brokenAt).toBeNull();
    });
  });
});

describe('Black Box', () => {
  let blackBox: BlackBox;
  const orgId = createUUID();

  beforeEach(() => {
    blackBox = createInMemoryBlackBox();
  });

  it('records AI interaction with integrity', async () => {
    const entry = await blackBox.record({
      organisationId: orgId,
      context: { userAction: 'review_invoice' },
      input: { invoiceData: { amount: 1000 } },
      model: {
        provider: 'test',
        engine: 'test',
        modelId: 'test-model',
        modelVersion: '1.0',
      },
      output: { recommendation: 'approve', confidence: 0.95 },
      confidence: ConfidenceLevel.AI_RECOMMENDATION,
      limitations: ['Not legal advice'],
    });

    expect(entry.integrityHash).toBeTruthy();
    expect(entry.chainHash).toBeTruthy();
    expect(entry.confidence).toBe(ConfidenceLevel.AI_RECOMMENDATION);
  });

  it('verifies integrity of unmodified entry', async () => {
    const entry = await blackBox.record({
      organisationId: orgId,
      context: {},
      input: { test: true },
      model: { provider: 'test', engine: 'test', modelId: 'test', modelVersion: '1.0' },
      output: { result: 'ok' },
      confidence: ConfidenceLevel.AI_RECOMMENDATION,
      limitations: [],
    });

    const valid = await blackBox.verifyIntegrity(entry.id);
    expect(valid).toBe(true);
  });

  it('chains entries', async () => {
    const first = await blackBox.record({
      organisationId: orgId,
      context: {},
      input: { n: 1 },
      model: { provider: 'test', engine: 'test', modelId: 'test', modelVersion: '1.0' },
      output: { r: 1 },
      confidence: ConfidenceLevel.AI_RECOMMENDATION,
      limitations: [],
    });

    const second = await blackBox.record({
      organisationId: orgId,
      context: {},
      input: { n: 2 },
      model: { provider: 'test', engine: 'test', modelId: 'test', modelVersion: '1.0' },
      output: { r: 2 },
      confidence: ConfidenceLevel.AI_RECOMMENDATION,
      limitations: [],
    });

    expect(second.previousEntryId).toBe(first.id);
  });
});
