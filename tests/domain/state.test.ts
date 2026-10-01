/**
 * TESTS — Business State Derivation
 * 
 * Tests críticos:
 * - State se deriva de hechos reales (needs, obligations)
 * - No es hardcodeado ni decoración UI
 * - Transiciones válidas entre estados
 */

import { describe, it, expect } from 'vitest';
import { createUUID, now } from '../../src/core/identifiers';
import { deriveBusinessState, isValidStateTransition } from '../../src/domain/state/business-state';
import type { Need, Obligation } from '../../src/domain/types';
import { ConfidenceLevel } from '../../src/domain/types';

describe('Business State', () => {
  const orgId = createUUID();

  describe('SEGURO state', () => {
    it('returns SEGURO when no needs and no obligations', () => {
      const result = deriveBusinessState({
        organisationId: orgId,
        needs: [],
        obligations: [],
      });

      expect(result.state).toBe('SEGURO');
      expect(result.reasons).toHaveLength(0);
      expect(result.metrics.totalNeeds).toBe(0);
    });

    it('returns SEGURO when all needs are closed', () => {
      const needs: Need[] = [
        {
          id: createUUID(),
          organisationId: orgId,
          type: 'OBLIGATORY',
          source: 'REGULATION',
          title: 'Tax filing',
          description: 'Quarterly tax filing',
          applicableRules: [],
          deadline: null,
          priority: 'MEDIUM',
          status: 'CLOSED',
          confidence: ConfidenceLevel.FACT,
          relatedFacts: [],
          createdAt: now(),
          resolvedAt: now(),
          resolvedBy: createUUID(),
        },
      ];

      const result = deriveBusinessState({ organisationId: orgId, needs, obligations: [] });
      expect(result.state).toBe('SEGURO');
    });
  });

  describe('ATENCIÓN state', () => {
    it('returns ATENCIÓN when needs are detected but not requiring action', () => {
      const needs: Need[] = [
        {
          id: createUUID(),
          organisationId: orgId,
          type: 'EMERGENT',
          source: 'SYSTEM_DETECTION',
          title: 'New regulation detected',
          description: 'A new regulation may affect the business',
          applicableRules: [],
          deadline: null,
          priority: 'LOW',
          status: 'DETECTED',
          confidence: ConfidenceLevel.PENDING_VERIFICATION,
          relatedFacts: [],
          createdAt: now(),
          resolvedAt: null,
          resolvedBy: null,
        },
      ];

      const result = deriveBusinessState({ organisationId: orgId, needs, obligations: [] });
      expect(result.state).toBe('ATENCIÓN');
      expect(result.reasons.length).toBeGreaterThan(0);
    });

    it('returns ATENCIÓN when obligations have upcoming deadlines', () => {
      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + 3); // 3 days from now

      const obligations: Obligation[] = [
        {
          id: createUUID(),
          organisationId: orgId,
          source: createUUID(),
          type: 'FISCAL',
          description: 'VAT filing',
          deadline: futureDate.toISOString() as any,
          recurrence: null,
          status: 'PENDING',
          createdAt: now(),
          fulfilledAt: null,
        },
      ];

      const result = deriveBusinessState({ organisationId: orgId, needs: [], obligations });
      expect(result.state).toBe('ATENCIÓN');
    });
  });

  describe('DECISIÓN state', () => {
    it('returns DECISIÓN when needs require authorization', () => {
      const needs: Need[] = [
        {
          id: createUUID(),
          organisationId: orgId,
          type: 'OBLIGATORY',
          source: 'REGULATION',
          title: 'Authorize tax payment',
          description: 'Tax payment requires authorization',
          applicableRules: [],
          deadline: null,
          priority: 'HIGH',
          status: 'PENDING_AUTHORIZATION',
          confidence: ConfidenceLevel.FACT,
          relatedFacts: [],
          createdAt: now(),
          resolvedAt: null,
          resolvedBy: null,
        },
      ];

      const result = deriveBusinessState({ organisationId: orgId, needs, obligations: [] });
      expect(result.state).toBe('DECISIÓN');
      expect(result.metrics.pendingAuthorization).toBe(1);
    });

    it('returns DECISIÓN when needs are prepared', () => {
      const needs: Need[] = [
        {
          id: createUUID(),
          organisationId: orgId,
          type: 'OBLIGATORY',
          source: 'REGULATION',
          title: 'Prepared action',
          description: 'Action prepared, awaiting authorization',
          applicableRules: [],
          deadline: null,
          priority: 'MEDIUM',
          status: 'PREPARED',
          confidence: ConfidenceLevel.CALCULATED,
          relatedFacts: [],
          createdAt: now(),
          resolvedAt: null,
          resolvedBy: null,
        },
      ];

      const result = deriveBusinessState({ organisationId: orgId, needs, obligations: [] });
      expect(result.state).toBe('DECISIÓN');
    });
  });

  describe('State transitions', () => {
    it('SEGURO → ATENCIÓN is valid', () => {
      expect(isValidStateTransition('SEGURO', 'ATENCIÓN')).toBe(true);
    });

    it('SEGURO → DECISIÓN is valid', () => {
      expect(isValidStateTransition('SEGURO', 'DECISIÓN')).toBe(true);
    });

    it('DECISIÓN → SEGURO is valid (all resolved)', () => {
      expect(isValidStateTransition('DECISIÓN', 'SEGURO')).toBe(true);
    });

    it('DECISIÓN → ATENCIÓN is valid (partially resolved)', () => {
      expect(isValidStateTransition('DECISIÓN', 'ATENCIÓN')).toBe(true);
    });

    it('ATENCIÓN → SEGURO is valid (informed, nothing to do)', () => {
      expect(isValidStateTransition('ATENCIÓN', 'SEGURO')).toBe(true);
    });
  });

  describe('NEGATIVE: Invalid state transitions', () => {
    it('same state is valid (no change)', () => {
      expect(isValidStateTransition('SEGURO', 'SEGURO')).toBe(true);
      expect(isValidStateTransition('ATENCIÓN', 'ATENCIÓN')).toBe(true);
      expect(isValidStateTransition('DECISIÓN', 'DECISIÓN')).toBe(true);
    });
  });
});
