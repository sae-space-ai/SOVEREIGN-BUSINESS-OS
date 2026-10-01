/**
 * TESTS — Event Bus
 * 
 * Tests críticos:
 * - Evento incompleto debe fallar
 * - Secuencia por aggregate
 * - Metadata completa requerida
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { createUUID, now } from '../../src/core/identifiers';
import { createInMemoryEventBus, validateEventRequest, type EventBus } from '../../src/domain/events/bus';
import { ConfidenceLevel } from '../../src/domain/types';

describe('Event Bus', () => {
  let bus: EventBus;

  beforeEach(() => {
    bus = createInMemoryEventBus();
  });

  describe('Publishing', () => {
    it('publishes valid event', async () => {
      const event = await bus.publish({
        type: 'ORGANISATION_CREATED',
        aggregateId: createUUID(),
        aggregateType: 'ORGANISATION',
        payload: { name: 'Test Org' },
        metadata: {
          userId: null,
          systemComponent: 'test',
          modelProvider: null,
          modelVersion: null,
          confidence: ConfidenceLevel.FACT,
          sourceId: createUUID(),
          retryCount: 0,
        },
      });

      expect(event.id).toBeTruthy();
      expect(event.type).toBe('ORGANISATION_CREATED');
      expect(event.sequenceNumber).toBe(1);
    });

    it('increments sequence per aggregate', async () => {
      const aggregateId = createUUID();

      const event1 = await bus.publish({
        type: 'NEED_DETECTED',
        aggregateId,
        aggregateType: 'NEED',
        payload: { n: 1 },
        metadata: {
          userId: null,
          systemComponent: 'test',
          modelProvider: null,
          modelVersion: null,
          confidence: ConfidenceLevel.FACT,
          sourceId: createUUID(),
          retryCount: 0,
        },
      });

      const event2 = await bus.publish({
        type: 'NEED_ANALYZED',
        aggregateId,
        aggregateType: 'NEED',
        payload: { n: 2 },
        metadata: {
          userId: null,
          systemComponent: 'test',
          modelProvider: null,
          modelVersion: null,
          confidence: ConfidenceLevel.FACT,
          sourceId: createUUID(),
          retryCount: 0,
        },
      });

      expect(event1.sequenceNumber).toBe(1);
      expect(event2.sequenceNumber).toBe(2);
    });

    it('maintains separate sequences per aggregate', async () => {
      const agg1 = createUUID();
      const agg2 = createUUID();

      await bus.publish({
        type: 'NEED_DETECTED',
        aggregateId: agg1,
        aggregateType: 'NEED',
        payload: {},
        metadata: {
          userId: null,
          systemComponent: 'test',
          modelProvider: null,
          modelVersion: null,
          confidence: ConfidenceLevel.FACT,
          sourceId: createUUID(),
          retryCount: 0,
        },
      });

      const event2 = await bus.publish({
        type: 'NEED_DETECTED',
        aggregateId: agg2,
        aggregateType: 'NEED',
        payload: {},
        metadata: {
          userId: null,
          systemComponent: 'test',
          modelProvider: null,
          modelVersion: null,
          confidence: ConfidenceLevel.FACT,
          sourceId: createUUID(),
          retryCount: 0,
        },
      });

      expect(event2.sequenceNumber).toBe(1); // Different aggregate, starts at 1
    });
  });

  describe('NEGATIVE: Incomplete events', () => {
    it('rejects event without type', async () => {
      await expect(
        bus.publish({
          type: '' as any,
          aggregateId: createUUID(),
          aggregateType: 'NEED',
          payload: {},
          metadata: {
            userId: null,
            systemComponent: 'test',
            modelProvider: null,
            modelVersion: null,
            confidence: ConfidenceLevel.FACT,
            sourceId: createUUID(),
            retryCount: 0,
          },
        })
      ).rejects.toThrow('Event type is required');
    });

    it('rejects event without aggregateId', async () => {
      await expect(
        bus.publish({
          type: 'NEED_DETECTED',
          aggregateId: '' as any,
          aggregateType: 'NEED',
          payload: {},
          metadata: {
            userId: null,
            systemComponent: 'test',
            modelProvider: null,
            modelVersion: null,
            confidence: ConfidenceLevel.FACT,
            sourceId: createUUID(),
            retryCount: 0,
          },
        })
      ).rejects.toThrow('Aggregate ID is required');
    });

    it('rejects event without systemComponent in metadata', async () => {
      await expect(
        bus.publish({
          type: 'NEED_DETECTED',
          aggregateId: createUUID(),
          aggregateType: 'NEED',
          payload: {},
          metadata: {
            userId: null,
            systemComponent: '',
            modelProvider: null,
            modelVersion: null,
            confidence: ConfidenceLevel.FACT,
            sourceId: createUUID(),
            retryCount: 0,
          },
        })
      ).rejects.toThrow('System component is required');
    });

    it('rejects event without sourceId in metadata', async () => {
      await expect(
        bus.publish({
          type: 'NEED_DETECTED',
          aggregateId: createUUID(),
          aggregateType: 'NEED',
          payload: {},
          metadata: {
            userId: null,
            systemComponent: 'test',
            modelProvider: null,
            modelVersion: null,
            confidence: ConfidenceLevel.FACT,
            sourceId: '' as any,
            retryCount: 0,
          },
        })
      ).rejects.toThrow('Source ID is required');
    });
  });

  describe('Querying', () => {
    it('retrieves events by aggregate', async () => {
      const aggregateId = createUUID();

      await bus.publish({
        type: 'NEED_DETECTED',
        aggregateId,
        aggregateType: 'NEED',
        payload: { n: 1 },
        metadata: {
          userId: null,
          systemComponent: 'test',
          modelProvider: null,
          modelVersion: null,
          confidence: ConfidenceLevel.FACT,
          sourceId: createUUID(),
          retryCount: 0,
        },
      });

      await bus.publish({
        type: 'NEED_ANALYZED',
        aggregateId,
        aggregateType: 'NEED',
        payload: { n: 2 },
        metadata: {
          userId: null,
          systemComponent: 'test',
          modelProvider: null,
          modelVersion: null,
          confidence: ConfidenceLevel.FACT,
          sourceId: createUUID(),
          retryCount: 0,
        },
      });

      const events = await bus.getByAggregate(aggregateId);
      expect(events).toHaveLength(2);
    });

    it('retrieves events by type', async () => {
      await bus.publish({
        type: 'NEED_DETECTED',
        aggregateId: createUUID(),
        aggregateType: 'NEED',
        payload: {},
        metadata: {
          userId: null,
          systemComponent: 'test',
          modelProvider: null,
          modelVersion: null,
          confidence: ConfidenceLevel.FACT,
          sourceId: createUUID(),
          retryCount: 0,
        },
      });

      const events = await bus.getByType('NEED_DETECTED');
      expect(events).toHaveLength(1);
    });
  });

  describe('Subscriptions', () => {
    it('notifies subscribers', async () => {
      const received: string[] = [];
      bus.subscribe((event) => {
        received.push(event.type);
      });

      await bus.publish({
        type: 'NEED_DETECTED',
        aggregateId: createUUID(),
        aggregateType: 'NEED',
        payload: {},
        metadata: {
          userId: null,
          systemComponent: 'test',
          modelProvider: null,
          modelVersion: null,
          confidence: ConfidenceLevel.FACT,
          sourceId: createUUID(),
          retryCount: 0,
        },
      });

      expect(received).toContain('NEED_DETECTED');
    });

    it('unsubscribe stops notifications', async () => {
      const received: string[] = [];
      const unsub = bus.subscribe((event) => {
        received.push(event.type);
      });

      unsub();

      await bus.publish({
        type: 'NEED_DETECTED',
        aggregateId: createUUID(),
        aggregateType: 'NEED',
        payload: {},
        metadata: {
          userId: null,
          systemComponent: 'test',
          modelProvider: null,
          modelVersion: null,
          confidence: ConfidenceLevel.FACT,
          sourceId: createUUID(),
          retryCount: 0,
        },
      });

      expect(received).toHaveLength(0);
    });
  });
});
