/**
 * TESTS — Confidence Classification (Epistemological)
 * 
 * Tests críticos:
 * - UNKNOWN nunca debe usarse para decisiones
 * - AI_RECOMMENDATION nunca debe ejecutarse sin autorización
 * - Solo FACT y CALCULATED son decision-grade
 */

import { describe, it, expect } from 'vitest';
import { ConfidenceLevel, isDecisionGrade, requiresVerification } from '../../src/domain/types';

describe('Confidence Classification', () => {
  describe('isDecisionGrade', () => {
    it('FACT es decision-grade', () => {
      expect(isDecisionGrade(ConfidenceLevel.FACT)).toBe(true);
    });

    it('CALCULATED es decision-grade', () => {
      expect(isDecisionGrade(ConfidenceLevel.CALCULATED)).toBe(true);
    });

    it('ESTIMATED NO es decision-grade', () => {
      expect(isDecisionGrade(ConfidenceLevel.ESTIMATED)).toBe(false);
    });

    it('PROJECTION NO es decision-grade', () => {
      expect(isDecisionGrade(ConfidenceLevel.PROJECTION)).toBe(false);
    });

    it('AI_RECOMMENDATION NO es decision-grade', () => {
      expect(isDecisionGrade(ConfidenceLevel.AI_RECOMMENDATION)).toBe(false);
    });

    it('PENDING_VERIFICATION NO es decision-grade', () => {
      expect(isDecisionGrade(ConfidenceLevel.PENDING_VERIFICATION)).toBe(false);
    });

    it('UNKNOWN NO es decision-grade', () => {
      expect(isDecisionGrade(ConfidenceLevel.UNKNOWN)).toBe(false);
    });
  });

  describe('requiresVerification', () => {
    it('UNKNOWN requiere verificación', () => {
      expect(requiresVerification(ConfidenceLevel.UNKNOWN)).toBe(true);
    });

    it('PENDING_VERIFICATION requiere verificación', () => {
      expect(requiresVerification(ConfidenceLevel.PENDING_VERIFICATION)).toBe(true);
    });

    it('AI_RECOMMENDATION requiere verificación', () => {
      expect(requiresVerification(ConfidenceLevel.AI_RECOMMENDATION)).toBe(true);
    });

    it('FACT NO requiere verificación', () => {
      expect(requiresVerification(ConfidenceLevel.FACT)).toBe(false);
    });

    it('CALCULATED NO requiere verificación', () => {
      expect(requiresVerification(ConfidenceLevel.CALCULATED)).toBe(false);
    });
  });

  describe('NEGATIVE: UNKNOWN treated as FACT', () => {
    it('UNKNOWN nunca debe pasar como decision-grade', () => {
      // Este test documenta la propiedad crítica:
      // Si UNKNOWN fuera decision-grade, el sistema podría tomar decisiones
      // basadas en datos no determinados.
      expect(isDecisionGrade(ConfidenceLevel.UNKNOWN)).toBe(false);
    });
  });
});
