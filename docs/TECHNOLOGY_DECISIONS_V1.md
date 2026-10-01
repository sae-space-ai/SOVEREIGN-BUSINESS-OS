# TECHNOLOGY DECISIONS V1
## Evaluación, selección y justificación de tecnología
### Estado: DRAFT — Pendiente aceptación humana

---

## 1. METODOLOGÍA DE DECISIÓN

Para cada necesidad tecnológica:
```
NECESIDAD → REQUISITO → CAPACIDAD → ALTERNATIVAS → EVALUACIÓN → SELECCIÓN → JUSTIFICACIÓN
```

Criterios de evaluación (ponderados):
- Madurez y estabilidad
- Seguridad y auditabilidad
- Soberanía / jurisdicción EU
- Rendimiento
- Coste operativo
- Portabilidad (sin lock-in)
- Comunidad y soporte
- Recuperación ante fallos
- Reemplazabilidad

---

## 2. CONTRATOS DE MOTOR (REEMPLAZABLES)

Todos los motores de IA se acceden mediante interfaces/contratos. Ningún motor es permanente.

### 2.1 MODEL_PROVIDER
**Contrato:** Interfaz para enviar prompts y recibir respuestas estructuradas.
**Requisitos:** Soporte de structured output, function calling, context window amplio, temperatura controlable.

| Alternativa | Madurez | EU/Soberanía | Reemplazable | Evaluación |
|-------------|---------|-------------|--------------|------------|
| NVIDIA NIM (hosting propio) | Alta | ✅ Deploy on-prem EU | ✅ Via contrato | Excelente para privacidad total |
| Ollama (self-hosted) | Alta | ✅ Self-hosted | ✅ Via contrato | Buen balance, open source |
| Mistral AI (API) | Media-Alta | ✅ Empresa EU | ✅ Via contrato | Buena opción cloud EU |
| OpenAI (API) | Muy alta | ❌ US jurisdiction | ✅ Via contrato | Excelente capacidad, problema soberanía |
| Anthropic (API) | Alta | ❌ US jurisdiction | ✅ Via contrato | Excelente razonamiento |
| vLLM (self-hosted) | Alta | ✅ Self-hosted | ✅ Via contrato | Alto rendimiento, requiere GPU |

**SELECCIÓN:** Contrato MODEL_PROVIDER con implementación primaria evaluando NVIDIA NIM para deployment soberano. Alternativa: Ollama/Mistral según infraestructura disponible.
**JUSTIFICACIÓN:** NVIDIA NIM permite deployment on-premise en EU con modelos optimizados. Contrato garantiza reemplazabilidad. La decisión final de proveedor requiere verificar infraestructura disponible.

### 2.2 INFERENCE_ENGINE
**Contrato:** Motor de ejecución de inferencia con batching, caching y colas.

| Alternativa | Evaluación |
|-------------|------------|
| NVIDIA Triton Inference Server | Excelente para multi-modelo, batching dinámico, producción |
| vLLM | Excelente throughput, PagedAttention |
| TGI (HuggingFace) | Buena integración con modelos HF |
| Ray Serve | Escalabilidad horizontal |

**SELECCIÓN:** NVIDIA Triton como evaluación primaria para producción. Contrato permite sustitución.
**JUSTIFICACIÓN:** Triton ofrece serving multi-modelo, dynamic batching, model management y monitoring integrados. Madurez de producción superior.

### 2.3 EMBEDDING_ENGINE
**Contrato:** Generación de embeddings para búsqueda semántica y RAG.

| Alternativa | Dimensiones | EU/Soberanía | Evaluación |
|-------------|-------------|-------------|------------|
| NVIDIA NV-Embed-v2 | 4096 | ✅ On-prem | Alta calidad, optimizado |
| sentence-transformers (multilingual-e5) | 768-1024 | ✅ Self-hosted | Excelente multilingüe |
| Mistral Embed | 1024 | ✅ EU API | Buena calidad, API simple |
| OpenAI text-embedding-3 | 1536 | ❌ US | Excelente calidad |

**SELECCIÓN:** Contrato EMBEDDING_ENGINE. Evaluación primaria: sentence-transformers multilingual para self-hosted (soberanía). NVIDIA NV-Embed si hay GPU disponible.
**JUSTIFICACIÓN:** Los datos empresariales europeos requieren embeddings que funcionen bien en múltiples idiomas EU. Self-hosted garantiza soberanía.

### 2.4 RERANKER
**Contrato:** Reordenamiento de resultados de búsqueda para mayor precisión.

| Alternativa | Evaluación |
|-------------|------------|
| NVIDIA Reranking (NV-RerankQA) | Excelente precisión, on-prem |
| Cohere Rerank | Excelente, pero US |
| BGE-Reranker (BAAI) | Buena calidad, self-hosted, open source |
| Cross-encoder (sentence-transformers) | Buena calidad, self-hosted |

**SELECCIÓN:** Contrato RERANKER. Evaluación primaria: BGE-Reranker o cross-encoder para soberanía.
**JUSTIFICACIÓN:** El reranking es crítico para precisión en búsqueda legal/fiscal. Self-hosted preferred.

### 2.5 RETRIEVAL_ENGINE
**Contrato:** Búsqueda vectorial + keyword + híbrida.

| Alternativa | Evaluación |
|-------------|------------|
| Milvus | Excelente escalabilidad, open source |
| Qdrant | Excelente API, Rust, EU-based |
| Weaviate | Buena integración, GraphQL |
| pgvector (PostgreSQL) | Simple si ya hay PostgreSQL |
| Meilisearch | Excelente para búsqueda textual |

**SELECCIÓN:** Contrato RETRIEVAL_ENGINE. Evaluación primaria: Qdrant (EU-based, excelente rendimiento) o pgvector (simplicidad).
**JUSTIFICACIÓN:** Qdrant tiene sede en EU, es open source, rendimiento excelente. pgvector si se busca simplicidad operativa.

### 2.6 AGENT_RUNTIME
**Contrato:** Ejecución de agentes con herramientas, memoria y supervisión.

| Alternativa | Evaluación |
|-------------|------------|
| NVIDIA NeMo Agent (LANCOR) | Framework NVIDIA para agentes |
| LangGraph | Flexible, grafo de estados |
| CrewAI | Multi-agente, simple |
| Custom (state machine) | Control total, más trabajo |

**SELECCIÓN:** Contrato AGENT_RUNTIME. Evaluación primaria: state machine custom con supervisión humana integrada.
**JUSTIFICACIÓN:** Para un sistema de autoridad humana, necesitamos control total sobre el flujo del agente. Custom state machine con gates de autorización.

### 2.7 DOCUMENT_AI_ENGINE
**Contrato:** Extracción de información de documentos (OCR, comprensión, clasificación).

| Alternativa | Evaluación |
|-------------|------------|
| NVIDIA Document AI (DocTR + LM) | Pipeline completo, on-prem |
| Unstructured.io | Open source, buena extracción |
| Marker (PDF→Markdown) | Especializado en PDFs |
| Tesseract + custom | Base, requiere mucho trabajo |

**SELECCIÓN:** Contrato DOCUMENT_AI_ENGINE. Evaluación primaria: pipeline NVIDIA Document AI o Unstructured.io.
**JUSTIFICACIÓN:** Se procesan facturas, contratos, comunicaciones administrativas. Necesidad de alta precisión en extracción.

---

## 3. INFRAESTRUCTURA

### 3.1 Hosting
**Requisito:** Jurisdicción EU, soberanía de datos, certificaciones.

| Alternativa | Jurisdicción | Evaluación |
|-------------|-------------|------------|
| OVHcloud | 🇫🇷 Francia | Líder EU, certificaciones amplias |
| Hetzner | 🇩🇪 Alemania | Excelente relación calidad/precio |
| Scaleway | 🇫🇷 Francia | Buen ecosistema cloud EU |
| IONOS | 🇩🇪 Alemania | Enterprise, 1&1 |
| Switch (CH) | 🇨🇭 Suiza | Fuera EU pero soberanía fuerte |

**SELECCIÓN:** REQUIRES_CONFIGURATION — Depende de decisión de negocio y requisitos específicos de certificación.
**JUSTIFICACIÓN:** No se puede seleccionar sin conocer volumen, certificaciones requeridas y presupuesto.

### 3.2 Base de datos
**Requisito:** Fiabilidad, auditoría, replicación, backup.

| Alternativa | Evaluación |
|-------------|------------|
| PostgreSQL | Estándar, extensiones (pgvector, pgcrypto), maduro |
| PostgreSQL + TimescaleDB | Si se necesitan series temporales |

**SELECCIÓN:** PostgreSQL como motor principal.
**JUSTIFICACIÓN:** Madurez, extensiones, ACID, replicación, comunidad. Suficiente para la mayoría de necesidades.

### 3.3 Event Bus / Queue
**Requisito:** Eventos asíncronos, colas de trabajo, pub/sub.

| Alternativa | Evaluación |
|-------------|------------|
| Redis Streams | Simple, rápido, si ya hay Redis |
| RabbitMQ | Robusto, routing complejo |
| NATS | Ligero, alto rendimiento |
| PostgreSQL LISTEN/NOTIFY | Simple si volumen bajo |

**SELECCIÓN:** REQUIRES_EVALUATION — Depende de volumen de eventos y complejidad de routing.
**JUSTIFICACIÓN:** Para fase inicial, PostgreSQL LISTEN/NOTIFY + Redis Streams puede ser suficiente. Migrar a RabbitMQ/NATS si escala.

### 3.4 Almacenamiento de documentos
**Requisito:** Objetos, versionado, cifrado, integridad.

| Alternativa | Evaluación |
|-------------|------------|
| MinIO | S3-compatible, self-hosted, EU |
| Seagate Exos (OVH) | Object storage managed |
| PostgreSQL Large Objects | Solo si documentos pequeños |

**SELECCIÓN:** MinIO como evaluación primaria (self-hosted, S3-compatible).
**JUSTIFICACIÓN:** Control total, compatible con ecosistema S3, deployment en EU.

---

## 4. FRONTEND

### 4.1 Framework
**SELECCIÓN:** React + TypeScript + Tailwind CSS + Vite
**JUSTIFICACIÓN:** Ya disponible en el entorno. Ecosistema maduro. Tailwind permite design system consistente.

### 4.2 Estado
**SELECCIÓN:** React Context + useReducer para estado local. Estado global según necesidad (Zustand si crece).
**JUSTIFICACIÓN:** No sobre-engineer. Empezar simple, evolucionar.

### 4.3 Animaciones
**SELECCIÓN:** Framer Motion
**JUSTIFICACIÓN:** Ya disponible. Excelente para transiciones con propósito.

---

## 5. OBSERVABILIDAD

| Necesidad | Alternativa | Selección |
|-----------|-------------|-----------|
| Logs | Winston/Pino + agregador | Pino + Loki o similar |
| Métricas | Prometheus + Grafana | Estándar, open source |
| Trazas | OpenTelemetry | Estándar abierto |
| AI Observability | NVIDIA Nemotron / Arize / LangSmith | REQUIRES_EVALUATION |
| Guardrails | NVIDIA NeMo Guardrails / Guardrails AI | REQUIRES_EVALUATION |

---

## 6. SEGURIDAD

| Necesidad | Selección | Justificación |
|-----------|-----------|--------------|
| Auth | Keycloak (self-hosted) o Authelia | Open source, EU, SSO, OIDC |
| Secret management | HashiCorp Vault | Estándar, maduro |
| Cifrado en tránsito | TLS 1.3 | Estándar |
| Cifrado en reposo | AES-256 (pgcrypto + MinIO) | Estándar |
| Firma de evidencias | Hash criptográfico (SHA-256) + timestamp | Integridad verificable |
| Auditoría | Event sourcing + append-only log | Trazabilidad completa |

---

## 7. RESUMEN DE DECISIONES

| Componente | Decisión | Estado |
|-----------|----------|--------|
| MODEL_PROVIDER | Contrato reemplazable. Eval. NVIDIA NIM | REQUIRES_CONFIGURATION |
| INFERENCE_ENGINE | Contrato reemplazable. Eval. NVIDIA Triton | REQUIRES_CONFIGURATION |
| EMBEDDING_ENGINE | Contrato reemplazable. Eval. sentence-transformers | REQUIRES_CONFIGURATION |
| RERANKER | Contrato reemplazable. Eval. BGE-Reranker | REQUIRES_CONFIGURATION |
| RETRIEVAL_ENGINE | Contrato reemplazable. Eval. Qdrant | REQUIRES_CONFIGURATION |
| AGENT_RUNTIME | Contrato reemplazable. Custom state machine | REQUIRES_IMPLEMENTATION |
| DOCUMENT_AI | Contrato reemplazable. Eval. pipeline NVIDIA/Unstructured | REQUIRES_CONFIGURATION |
| Database | PostgreSQL | APROBADO |
| Frontend | React + TypeScript + Tailwind | APROBADO |
| Hosting EU | REQUIRES_CONFIGURATION | BLOQUEADO |
| Auth | Keycloak/Authelia | PENDIENTE |
| Object Storage | MinIO | PENDIENTE |

---

## 8. PRINCIPIO DE REEMPLAZABILIDAD

```typescript
// Ejemplo de contrato (interfaz conceptual)
interface ModelProvider {
  complete(prompt: string, options: CompletionOptions): Promise<CompletionResult>;
  completeStructured<T>(prompt: string, schema: Schema): Promise<T>;
  embed(texts: string[]): Promise<number[][]>;
  rerank(query: string, documents: string[]): Promise<RerankResult[]>;
}

// Implementaciones intercambiables:
// - NvidiaNimProvider implements ModelProvider
// - OllamaProvider implements ModelProvider
// - MistralProvider implements ModelProvider
// - MockProvider implements ModelProvider (testing)
```

Ningún módulo del dominio depende de un proveedor concreto. Todos dependen del contrato.

---

*Documento generado como parte de la Orden 0. Pendiente de aceptación humana.*
