/**
 * BUSINESS STATE — Estado empresarial derivado de hechos
 * 
 * CRÍTICO: El estado NO es decoración UI. Se calcula a partir de:
 * - Necesidades pendientes de autorización
 * - Obligaciones vencidas
 * - Plazos próximos
 * - Alertas activas
 * 
 * Estados:
 * - SEGURO: No necesita hacer nada
 * - ATENCIÓN: Debe conocer algo
 * - DECISIÓN: Necesitamos su información/autoridad
 * 
 * Basado en: UX_UI_SYSTEM_V1, ARCHITECTURE_MASTER_V1
 */

import type { UUID, Timestamp } from '../../core/identifiers';
import { now } from '../../core/identifiers';
import type { BusinessState, BusinessStateDerivation, StateReason, StateMetrics, Need, Obligation } from '../types';

// ============================================================================
// BUSINESS STATE DERIVATION ENGINE
// ============================================================================

export interface BusinessStateInput {
  organisationId: UUID;
  needs: Need[];
  obligations: Obligation[];
  currentTime?: Timestamp;
}

/**
 * Deriva el estado empresarial a partir de hechos reales.
 * NO es hardcoded. Se calcula en cada invocation.
 */
export function deriveBusinessState(input: BusinessStateInput): BusinessStateDerivation {
  const currentTime = input.currentTime || now();
  const currentMs = new Date(currentTime).getTime();
  
  const reasons: StateReason[] = [];
  let state: BusinessState = 'SEGURO';

  // Analyze needs
  const needsPendingAuth = input.needs.filter(
    (n) => n.status === 'PENDING_AUTHORIZATION' || n.status === 'PREPARED'
  );
  
  const needsDetected = input.needs.filter(
    (n) => n.status === 'DETECTED' || n.status === 'ANALYZED'
  );

  // Analyze obligations
  const overdueObligations = input.obligations.filter((o) => {
    if (!o.deadline) return false;
    return new Date(o.deadline).getTime() < currentMs && o.status !== 'FULFILLED';
  });

  const upcomingDeadlines = input.obligations.filter((o) => {
    if (!o.deadline || o.status === 'FULFILLED') return false;
    const deadlineMs = new Date(o.deadline).getTime();
    const daysUntil = (deadlineMs - currentMs) / (1000 * 60 * 60 * 24);
    return daysUntil >= 0 && daysUntil <= 7; // Within 7 days
  });

  // Build reasons and determine state
  // DECISIÓN: Hay necesidades pendientes de autorización
  if (needsPendingAuth.length > 0) {
    state = 'DECISIÓN';
    for (const need of needsPendingAuth) {
      reasons.push({
        code: 'NEED_PENDING_AUTHORIZATION',
        severity: need.priority === 'CRITICAL' ? 'CRITICAL' : 'WARNING',
        message: `Necesidad pendiente de autorización: ${need.title}`,
        relatedNeedId: need.id,
        relatedObligationId: null,
      });
    }
  }

  // ATENCIÓN: Hay obligaciones vencidas o información que debe conocer
  if (overdueObligations.length > 0 && state !== 'DECISIÓN') {
    state = 'ATENCIÓN';
    for (const obligation of overdueObligations) {
      reasons.push({
        code: 'OBLIGATION_OVERDUE',
        severity: 'CRITICAL',
        message: `Obligación vencida: ${obligation.description}`,
        relatedNeedId: null,
        relatedObligationId: obligation.id,
      });
    }
  }

  if (upcomingDeadlines.length > 0 && state === 'SEGURO') {
    state = 'ATENCIÓN';
    for (const obligation of upcomingDeadlines) {
      reasons.push({
        code: 'DEADLINE_APPROACHING',
        severity: 'WARNING',
        message: `Plazo próximo: ${obligation.description}`,
        relatedNeedId: null,
        relatedObligationId: obligation.id,
      });
    }
  }

  // ATENCIÓN: Hay necesidades detectadas que debe conocer
  if (needsDetected.length > 0 && state === 'SEGURO') {
    state = 'ATENCIÓN';
    for (const need of needsDetected) {
      reasons.push({
        code: 'NEED_DETECTED',
        severity: 'INFO',
        message: `Necesidad detectada: ${need.title}`,
        relatedNeedId: need.id,
        relatedObligationId: null,
      });
    }
  }

  // Build metrics
  const metrics: StateMetrics = {
    totalNeeds: input.needs.length,
    pendingAuthorization: needsPendingAuth.length,
    overdueObligations: overdueObligations.length,
    upcomingDeadlines: upcomingDeadlines.length,
    activeAlerts: reasons.length,
  };

  return {
    state,
    computedAt: currentTime,
    reasons,
    metrics,
  };
}

// ============================================================================
// STATE TRANSITIONS
// ============================================================================

/**
 * Valida si una transición de estado es válida.
 */
export function isValidStateTransition(from: BusinessState, to: BusinessState): boolean {
  // SEGURO puede ir a ATENCIÓN o DECISIÓN
  if (from === 'SEGURO') return to === 'ATENCIÓN' || to === 'DECISIÓN' || to === 'SEGURO';
  // ATENCIÓN puede ir a SEGURO (resuelto) o DECISIÓN (empeora)
  if (from === 'ATENCIÓN') return to === 'SEGURO' || to === 'DECISIÓN' || to === 'ATENCIÓN';
  // DECISIÓN puede ir a ATENCIÓN (parcialmente resuelto) o SEGURO (todo resuelto)
  if (from === 'DECISIÓN') return to === 'ATENCIÓN' || to === 'SEGURO' || to === 'DECISIÓN';
  return false;
}
