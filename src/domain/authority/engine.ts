/**
 * AUTHORITY ENGINE — Motor de autoridad y política
 * 
 * Separa explícitamente: IDENTITY ≠ ROLE ≠ AUTHORITY ≠ PERMISSION
 * 
 * CRÍTICO: Toda acción material DEBE pasar por este motor.
 * CRÍTICO: Una acción sin autorización requerida debe ser BLOCKED, nunca ejecutada silenciosamente.
 * CRÍTICO: La IA NUNCA puede autorizar acciones materiales.
 * 
 * Flujo: PREPARED → VERIFIED → HUMAN_AUTHORIZATION → EXECUTED → EVIDENCED
 */

import type { UUID } from '../../core/identifiers';
import { createUUID, now } from '../../core/identifiers';
import { AuthorityError } from '../../core/errors';
import type {
  Identity,
  Authority,
  Permission,
  AuthorityType,
  Action,
  AuthorizationGate,
} from '../types';

// ============================================================================
// AUTHORITY ENGINE CONTRACT
// ============================================================================

export interface AuthorityCheckRequest {
  identityId: UUID;
  action: Action;
  resource: string;
  resourceId?: UUID;
  context?: Record<string, unknown>;
}

export interface AuthorityCheckResult {
  authorized: boolean;
  authorityId: UUID | null;
  reason: string;
  blocked: boolean;
  requiresHumanAuthorization: boolean;
  gate: AuthorizationGate | null;
}

export interface AuthorityEngine {
  /**
   * Verifica si una identidad tiene permiso para una acción.
   * NO ejecuta la acción. Solo verifica.
   */
  checkPermission(request: AuthorityCheckRequest): Promise<AuthorityCheckResult>;

  /**
   * Crea un gate de autorización para una acción material.
   */
  createAuthorizationGate(
    actionId: UUID,
    requiredAuthorities: AuthorityType[],
    context: Record<string, unknown>
  ): Promise<AuthorizationGate>;

  /**
   * Registra la respuesta humana a un gate.
   * Solo una persona con autoridad válida puede responder.
   */
  respondToGate(
    gateId: UUID,
    responderIdentityId: UUID,
    response: 'AUTHORIZED' | 'REJECTED' | 'DEFERRED',
    reason: string | null
  ): Promise<AuthorizationGate>;

  /**
   * Verifica que un gate está correctamente autorizado antes de ejecutar.
   * Lanza AuthorityError si no está autorizado.
   */
  verifyGateForExecution(gateId: UUID): Promise<AuthorizationGate>;
}

// ============================================================================
// AUTHORIZATION POLICY
// ============================================================================

export interface AuthorizationPolicy {
  /**
   * Determina si una acción requiere autorización humana.
   */
  requiresHumanAuthorization(action: Action, resource: string): boolean;

  /**
   * Determina qué tipo de autoridad se necesita.
   */
  getRequiredAuthorityTypes(action: Action, resource: string): AuthorityType[];
}

/**
 * Política por defecto: toda acción material requiere autorización humana.
 */
export const defaultPolicy: AuthorizationPolicy = {
  requiresHumanAuthorization(action: Action, _resource: string): boolean {
    // Solo las acciones de lectura no requieren autorización
    return action !== 'VIEW' && action !== 'EXPORT';
  },

  getRequiredAuthorityTypes(action: Action, resource: string): AuthorityType[] {
    // Acciones fiscales/legales requieren representante legal
    if (resource.startsWith('fiscal/') || resource.startsWith('legal/')) {
      return ['LEGAL_REPRESENTATIVE', 'FISCAL_REPRESENTATIVE'];
    }
    // Acciones de delegación requieren representante legal
    if (action === 'DELEGATE') {
      return ['LEGAL_REPRESENTATIVE'];
    }
    // Resto: cualquier administrador
    return ['LEGAL_REPRESENTATIVE', 'DELEGATED_LEGAL', 'ADMIN_USER'];
  },
};

// ============================================================================
// IN-MEMORY IMPLEMENTATION (NON_PRODUCTION)
// ============================================================================

export interface InMemoryAuthorityStore {
  identities: Map<UUID, Identity>;
  authorities: Map<UUID, Authority>;
  permissions: Map<UUID, Permission>;
  gates: Map<UUID, AuthorizationGate>;
}

export function createInMemoryAuthorityStore(): InMemoryAuthorityStore {
  return {
    identities: new Map(),
    authorities: new Map(),
    permissions: new Map(),
    gates: new Map(),
  };
}

/**
 * Motor de autoridad en memoria.
 * ETIQUETADO: NON_PRODUCTION — Solo para tests y desarrollo.
 * En producción se debe usar implementación con persistencia real.
 */
export function createInMemoryAuthorityEngine(
  store: InMemoryAuthorityStore,
  policy: AuthorizationPolicy = defaultPolicy
): AuthorityEngine {
  return {
    async checkPermission(request: AuthorityCheckRequest): Promise<AuthorityCheckResult> {
      const identity = store.identities.get(request.identityId);
      
      if (!identity) {
        return {
          authorized: false,
          authorityId: null,
          reason: 'Identity not found',
          blocked: true,
          requiresHumanAuthorization: false,
          gate: null,
        };
      }

      if (identity.status !== 'ACTIVE') {
        return {
          authorized: false,
          authorityId: null,
          reason: `Identity is ${identity.status}`,
          blocked: true,
          requiresHumanAuthorization: false,
          gate: null,
        };
      }

      // Buscar autoridades activas para esta identidad
      const activeAuthorities = Array.from(store.authorities.values()).filter(
        (auth) =>
          auth.identityId === request.identityId &&
          auth.status === 'ACTIVE' &&
          isAuthorityCurrentlyValid(auth)
      );

      if (activeAuthorities.length === 0) {
        return {
          authorized: false,
          authorityId: null,
          reason: 'No active authority for this identity',
          blocked: true,
          requiresHumanAuthorization: policy.requiresHumanAuthorization(request.action, request.resource),
          gate: null,
        };
      }

      // Verificar permisos
      const hasPermission = checkPermissions(
        store,
        request.identityId,
        request.action,
        request.resource
      );

      if (!hasPermission) {
        return {
          authorized: false,
          authorityId: null,
          reason: 'Insufficient permissions',
          blocked: true,
          requiresHumanAuthorization: false,
          gate: null,
        };
      }

      // Si requiere autorización humana, crear gate
      if (policy.requiresHumanAuthorization(request.action, request.resource)) {
        return {
          authorized: false,
          authorityId: activeAuthorities[0].id,
          reason: 'Requires human authorization',
          blocked: false,
          requiresHumanAuthorization: true,
          gate: null,
        };
      }

      return {
        authorized: true,
        authorityId: activeAuthorities[0].id,
        reason: 'Authorized',
        blocked: false,
        requiresHumanAuthorization: false,
        gate: null,
      };
    },

    async createAuthorizationGate(
      actionId: UUID,
      requiredAuthorities: AuthorityType[],
      _context: Record<string, unknown>
    ): Promise<AuthorizationGate> {
      const gate: AuthorizationGate = {
        id: createUUID(),
        actionId,
        requiredAuthority: requiredAuthorities,
        presentedAt: now(),
        respondedAt: null,
        respondedBy: null,
        response: null,
        responseReason: null,
      };

      store.gates.set(gate.id, gate);
      return gate;
    },

    async respondToGate(
      gateId: UUID,
      responderIdentityId: UUID,
      response: 'AUTHORIZED' | 'REJECTED' | 'DEFERRED',
      reason: string | null
    ): Promise<AuthorizationGate> {
      const gate = store.gates.get(gateId);
      if (!gate) {
        throw new AuthorityError('NOT_FOUND', 'Authorization gate not found', { gateId });
      }

      if (gate.response !== null) {
        throw new AuthorityError('AUTHORITY_INSUFFICIENT', 'Gate already responded', { gateId });
      }

      // Verificar que el respondedor tiene autoridad válida
      const responderAuth = Array.from(store.authorities.values()).find(
        (auth) =>
          auth.identityId === responderIdentityId &&
          auth.status === 'ACTIVE' &&
          isAuthorityCurrentlyValid(auth) &&
          gate.requiredAuthority.includes(auth.type)
      );

      if (!responderAuth) {
        throw new AuthorityError(
          'AUTHORITY_INSUFFICIENT',
          'Responder does not have required authority type',
          { gateId, responderIdentityId, requiredTypes: gate.requiredAuthority }
        );
      }

      gate.respondedAt = now();
      gate.respondedBy = responderIdentityId;
      gate.response = response;
      gate.responseReason = reason;

      return gate;
    },

    async verifyGateForExecution(gateId: UUID): Promise<AuthorizationGate> {
      const gate = store.gates.get(gateId);
      if (!gate) {
        throw new AuthorityError('NOT_FOUND', 'Authorization gate not found', { gateId });
      }

      if (gate.response !== 'AUTHORIZED') {
        throw new AuthorityError(
          'AUTHORITY_REQUIRED',
          `Gate not authorized. Status: ${gate.response || 'PENDING'}`,
          { gateId, response: gate.response }
        );
      }

      return gate;
    },
  };
}

// Helpers
function isAuthorityCurrentlyValid(auth: Authority): boolean {
  const nowTs = new Date(now()).getTime();
  const validFrom = new Date(auth.validFrom).getTime();
  const validTo = auth.validTo ? new Date(auth.validTo).getTime() : Infinity;
  return nowTs >= validFrom && nowTs <= validTo;
}

function checkPermissions(
  store: InMemoryAuthorityStore,
  identityId: UUID,
  action: Action,
  resource: string
): boolean {
  // Verificar permisos directos
  const directPermissions = Array.from(store.permissions.values()).filter(
    (p) => p.identityId === identityId && p.source === 'DIRECT'
  );

  if (matchesPermission(directPermissions, action, resource)) {
    return true;
  }

  // Verificar permisos a través de roles
  const rolePermissions = Array.from(store.permissions.values()).filter(
    (p) => p.identityId === identityId && p.source === 'ROLE'
  );

  return matchesPermission(rolePermissions, action, resource);
}

function matchesPermission(
  permissions: Permission[],
  action: Action,
  resource: string
): boolean {
  return permissions.some((p) => {
    if (p.action !== action) return false;
    // Simple pattern matching (production should use proper pattern matching)
    if (p.resource === '*') return true;
    if (p.resource === resource) return true;
    if (p.resource.endsWith('/*') && resource.startsWith(p.resource.slice(0, -2))) {
      return true;
    }
    return false;
  });
}
