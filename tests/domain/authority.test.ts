/**
 * TESTS — Authority Engine
 * 
 * Tests críticos:
 * - Acción sin autoridad → BLOCKED (nunca ejecutada silenciosamente)
 * - IDENTITY ≠ AUTHORITY
 * - Solo personas físicas pueden tener AUTHORITY para acciones materiales
 * - Gate de autorización debe responderse con autoridad válida
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { createUUID, now } from '../../src/core/identifiers';
import {
  createInMemoryAuthorityStore,
  createInMemoryAuthorityEngine,
  type InMemoryAuthorityStore,
  type AuthorityEngine,
} from '../../src/domain/authority/engine';
import type { Identity, Authority, Permission, AuthorityType } from '../../src/domain/types';

describe('Authority Engine', () => {
  let store: InMemoryAuthorityStore;
  let engine: AuthorityEngine;

  beforeEach(() => {
    store = createInMemoryAuthorityStore();
    engine = createInMemoryAuthorityEngine(store);
  });

  describe('NEGATIVE: Action without authority', () => {
    it('BLOCKS action when identity has no authority', async () => {
      const identityId = createUUID();
      const identity: Identity = {
        id: identityId,
        type: 'PERSON',
        credentials: [],
        status: 'ACTIVE',
        createdAt: now(),
      };
      store.identities.set(identityId, identity);

      // NO authority registered for this identity
      const result = await engine.checkPermission({
        identityId,
        action: 'CREATE',
        resource: 'fiscal/invoice',
      });

      expect(result.authorized).toBe(false);
      expect(result.blocked).toBe(true);
      expect(result.reason).toContain('No active authority');
    });

    it('BLOCKS action when identity is suspended', async () => {
      const identityId = createUUID();
      const identity: Identity = {
        id: identityId,
        type: 'PERSON',
        credentials: [],
        status: 'SUSPENDED',
        createdAt: now(),
      };
      store.identities.set(identityId, identity);

      const result = await engine.checkPermission({
        identityId,
        action: 'CREATE',
        resource: 'fiscal/invoice',
      });

      expect(result.authorized).toBe(false);
      expect(result.blocked).toBe(true);
      expect(result.reason).toContain('SUSPENDED');
    });

    it('BLOCKS action when identity does not exist', async () => {
      const result = await engine.checkPermission({
        identityId: createUUID(),
        action: 'CREATE',
        resource: 'fiscal/invoice',
      });

      expect(result.authorized).toBe(false);
      expect(result.blocked).toBe(true);
      expect(result.reason).toContain('not found');
    });
  });

  describe('Authority types separation', () => {
    it('IDENTITY without AUTHORITY cannot perform material actions', async () => {
      const identityId = createUUID();
      store.identities.set(identityId, {
        id: identityId,
        type: 'PERSON',
        credentials: [],
        status: 'ACTIVE',
        createdAt: now(),
      });

      // Has identity but no authority
      const result = await engine.checkPermission({
        identityId,
        action: 'AUTHORIZE_ACTION',
        resource: 'legal/contract',
      });

      expect(result.authorized).toBe(false);
      expect(result.blocked).toBe(true);
    });

    it('AUTHORITY with correct type allows material action (after gate)', async () => {
      const identityId = createUUID();
      const authorityId = createUUID();

      store.identities.set(identityId, {
        id: identityId,
        type: 'PERSON',
        credentials: [],
        status: 'ACTIVE',
        createdAt: now(),
      });

      store.authorities.set(authorityId, {
        id: authorityId,
        identityId,
        type: 'LEGAL_REPRESENTATIVE',
        scope: 'FULL',
        grantedBy: identityId,
        grantedAt: now(),
        validFrom: now(),
        validTo: null,
        status: 'ACTIVE',
        evidenceId: createUUID(),
      });

      store.permissions.set(createUUID(), {
        id: createUUID(),
        identityId,
        source: 'DIRECT',
        sourceId: authorityId,
        action: 'CREATE',
        resource: 'fiscal/*',
        conditions: [],
        validFrom: now(),
        validTo: null,
        grantedAt: now(),
      });

      const result = await engine.checkPermission({
        identityId,
        action: 'CREATE',
        resource: 'fiscal/invoice',
      });

      // Requires human authorization (material action)
      expect(result.requiresHumanAuthorization).toBe(true);
      expect(result.authorityId).toBe(authorityId);
    });
  });

  describe('Authorization Gate', () => {
    it('creates gate for material action', async () => {
      const actionId = createUUID();
      const gate = await engine.createAuthorizationGate(
        actionId,
        ['LEGAL_REPRESENTATIVE'],
        {}
      );

      expect(gate.actionId).toBe(actionId);
      expect(gate.response).toBeNull();
      expect(gate.requiredAuthority).toContain('LEGAL_REPRESENTATIVE');
    });

    it('rejects gate response from identity without required authority', async () => {
      const actionId = createUUID();
      const gate = await engine.createAuthorizationGate(
        actionId,
        ['LEGAL_REPRESENTATIVE'],
        {}
      );

      const responderId = createUUID();
      store.identities.set(responderId, {
        id: responderId,
        type: 'PERSON',
        credentials: [],
        status: 'ACTIVE',
        createdAt: now(),
      });
      // No authority of type LEGAL_REPRESENTATIVE

      await expect(
        engine.respondToGate(gate.id, responderId, 'AUTHORIZED', null)
      ).rejects.toThrow('does not have required authority');
    });

    it('accepts gate response from identity with required authority', async () => {
      const actionId = createUUID();
      const gate = await engine.createAuthorizationGate(
        actionId,
        ['LEGAL_REPRESENTATIVE'],
        {}
      );

      const responderId = createUUID();
      const authorityId = createUUID();

      store.identities.set(responderId, {
        id: responderId,
        type: 'PERSON',
        credentials: [],
        status: 'ACTIVE',
        createdAt: now(),
      });

      store.authorities.set(authorityId, {
        id: authorityId,
        identityId: responderId,
        type: 'LEGAL_REPRESENTATIVE',
        scope: 'FULL',
        grantedBy: responderId,
        grantedAt: now(),
        validFrom: now(),
        validTo: null,
        status: 'ACTIVE',
        evidenceId: createUUID(),
      });

      const updatedGate = await engine.respondToGate(
        gate.id,
        responderId,
        'AUTHORIZED',
        'Approved'
      );

      expect(updatedGate.response).toBe('AUTHORIZED');
      expect(updatedGate.respondedBy).toBe(responderId);
    });

    it('verifyGateForExecution throws if not authorized', async () => {
      const actionId = createUUID();
      const gate = await engine.createAuthorizationGate(actionId, ['LEGAL_REPRESENTATIVE'], {});

      await expect(engine.verifyGateForExecution(gate.id)).rejects.toThrow('Gate not authorized');
    });

    it('verifyGateForExecution succeeds if authorized', async () => {
      const actionId = createUUID();
      const gate = await engine.createAuthorizationGate(actionId, ['LEGAL_REPRESENTATIVE'], {});

      const responderId = createUUID();
      const authorityId = createUUID();
      store.identities.set(responderId, {
        id: responderId,
        type: 'PERSON',
        credentials: [],
        status: 'ACTIVE',
        createdAt: now(),
      });
      store.authorities.set(authorityId, {
        id: authorityId,
        identityId: responderId,
        type: 'LEGAL_REPRESENTATIVE',
        scope: 'FULL',
        grantedBy: responderId,
        grantedAt: now(),
        validFrom: now(),
        validTo: null,
        status: 'ACTIVE',
        evidenceId: createUUID(),
      });

      await engine.respondToGate(gate.id, responderId, 'AUTHORIZED', null);
      const verified = await engine.verifyGateForExecution(gate.id);
      expect(verified.response).toBe('AUTHORIZED');
    });
  });
});
