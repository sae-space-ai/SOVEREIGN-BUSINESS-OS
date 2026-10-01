/**
 * EVENT BUS — Sistema de eventos del dominio
 * 
 * Todos los cambios en el sistema se registran como eventos inmutables.
 * Cada evento tiene: causation (qué lo provocó), correlation (eventos relacionados),
 * secuencia, metadata completa.
 * 
 * Basado en: DATA_EVENT_MODEL_V1
 */

import type { UUID } from '../../core/identifiers';
import { createUUID, now } from '../../core/identifiers';
import { DomainError } from '../../core/errors';
import type { DomainEvent, DomainEventType, AggregateType, EventMetadata, ConfidenceLevel } from '../types';

// ============================================================================
// EVENT BUS CONTRACT
// ============================================================================

export interface EventPublishRequest {
  type: DomainEventType;
  aggregateId: UUID;
  aggregateType: AggregateType;
  payload: Record<string, unknown>;
  metadata: Omit<EventMetadata, 'processingTimeMs'>;
  causationId?: UUID;
  correlationId?: UUID;
}

export interface EventBus {
  /**
   * Publica un evento. Lo valida, asigna secuencia y lo almacena.
   */
  publish(request: EventPublishRequest): Promise<DomainEvent>;

  /**
   * Obtiene eventos por aggregate.
   */
  getByAggregate(aggregateId: UUID): Promise<DomainEvent[]>;

  /**
   * Obtiene eventos por tipo.
   */
  getByType(type: DomainEventType): Promise<DomainEvent[]>;

  /**
   * Obtiene un evento por ID.
   */
  getById(id: UUID): Promise<DomainEvent | null>;

  /**
   * Suscribe un handler a eventos.
   */
  subscribe(handler: EventHandler): () => void;
}

export type EventHandler = (event: DomainEvent) => void | Promise<void>;

// ============================================================================
// EVENT VALIDATION
// ============================================================================

export function validateEventRequest(request: EventPublishRequest): void {
  if (!request.type) {
    throw new DomainError('EVENT_INCOMPLETE', 'Event type is required');
  }
  if (!request.aggregateId) {
    throw new DomainError('EVENT_INCOMPLETE', 'Aggregate ID is required');
  }
  if (!request.aggregateType) {
    throw new DomainError('EVENT_INCOMPLETE', 'Aggregate type is required');
  }
  if (!request.metadata) {
    throw new DomainError('EVENT_INCOMPLETE', 'Event metadata is required');
  }
  if (!request.metadata.systemComponent) {
    throw new DomainError('EVENT_INCOMPLETE', 'System component is required in metadata');
  }
  if (!request.metadata.sourceId) {
    throw new DomainError('EVENT_INCOMPLETE', 'Source ID is required in metadata');
  }
}

// ============================================================================
// IN-MEMORY IMPLEMENTATION (NON_PRODUCTION)
// ============================================================================

/**
 * Event bus en memoria.
 * ETIQUETADO: NON_PRODUCTION — Solo para tests y desarrollo.
 * En producción se debe usar event store persistente.
 */
export function createInMemoryEventBus(): EventBus {
  const events: DomainEvent[] = [];
  const handlers: Set<EventHandler> = new Set();
  const sequenceByAggregate = new Map<string, number>();

  return {
    async publish(request: EventPublishRequest): Promise<DomainEvent> {
      validateEventRequest(request);

      const aggregateKey = `${request.aggregateType}:${request.aggregateId}`;
      const currentSeq = sequenceByAggregate.get(aggregateKey) || 0;
      const nextSeq = currentSeq + 1;
      sequenceByAggregate.set(aggregateKey, nextSeq);

      const event: DomainEvent = {
        id: createUUID(),
        type: request.type,
        aggregateId: request.aggregateId,
        aggregateType: request.aggregateType,
        payload: request.payload,
        metadata: {
          ...request.metadata,
          processingTimeMs: 0,
        },
        timestamp: now(),
        causationId: request.causationId || null,
        correlationId: request.correlationId || createUUID(),
        sequenceNumber: nextSeq,
      };

      events.push(event);

      // Notificar handlers
      for (const handler of handlers) {
        try {
          await handler(event);
        } catch (error) {
          // Log but don't fail the publish
          console.error('Event handler error:', error);
        }
      }

      return event;
    },

    async getByAggregate(aggregateId: UUID): Promise<DomainEvent[]> {
      return events.filter((e) => e.aggregateId === aggregateId);
    },

    async getByType(type: DomainEventType): Promise<DomainEvent[]> {
      return events.filter((e) => e.type === type);
    },

    async getById(id: UUID): Promise<DomainEvent | null> {
      return events.find((e) => e.id === id) || null;
    },

    subscribe(handler: EventHandler): () => void {
      handlers.add(handler);
      return () => {
        handlers.delete(handler);
      };
    },
  };
}
