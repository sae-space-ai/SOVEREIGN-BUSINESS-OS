# ARCHITECTURE MASTER V1
## Servicio Empresarial Europeo de Seguridad y Gobierno
### Estado: DRAFT — Pendiente aceptación humana

---

## 0. PRINCIPIOS RECTORES

| # | Principio | Implicación |
|---|-----------|-------------|
| P1 | Soberanía europea | Datos, inferencia y almacenamiento en jurisdicción EU. Sin dependencia de jurisdicciones extraterritoriales para datos sensibles. |
| P2 | Seguridad como ciclo continuo | RECORDAR → COMPRENDER → VIGILAR → ANTICIPAR → PREPARAR → DECIDIR → ACTUAR → VERIFICAR → DEMOSTRAR → CONTINUAR |
| P3 | Autoridad humana irrenunciable | La IA observa, analiza, prepara y recomienda. La acción material requiere autorización humana. |
| P4 | Trazabilidad total | SOURCE → DATA → RULE → NEED → DECISION → AUTHORITY → ACTION → RESULT → EVIDENCE |
| P5 | Sin vendor lock-in | Todos los motores de IA son reemplazables mediante contratos de interfaz. |
| P6 | Sin capacidades falsas | Toda capacidad visible requiere DATA + LOGIC + RULES + ENGINE + PERMISSIONS + WORKFLOW + ERRORS + TESTS + AUDIT + EVIDENCE |
| P7 | Anticipación silenciosa | El sistema trabaja sin intervención. Interrumpe sólo cuando es necesario. |
| P8 | Evidencia antes que afirmación | No evidence, no claim. |

---

## 1. CAPAS ARQUITECTÓNICAS

```
┌─────────────────────────────────────────────────────────────┐
│                    PRESENTATION LAYER                        │
│  UX/UI System · Design Tokens · Responsive · Accesibilidad  │
├─────────────────────────────────────────────────────────────┤
│                  APPLICATION LAYER                           │
│  Casos de uso · Workflows · Orquestación · Autorizaciones   │
├─────────────────────────────────────────────────────────────┤
│                  DOMAIN LAYER                                │
│  Entidades · Value Objects · Reglas de negocio · Eventos    │
├─────────────────────────────────────────────────────────────┤
│                  ENGINE LAYER                                │
│  Intelligence · Inference · Retrieval · Document AI         │
│  Anticipation · Risk · Forecasting · Compliance             │
├─────────────────────────────────────────────────────────────┤
│                ADAPTER LAYER                                 │
│  Tax · Social Security · Registry · E-Invoicing · eIDAS    │
│  Procurement · Banking · Communications                     │
├─────────────────────────────────────────────────────────────┤
│                INFRASTRUCTURE LAYER                          │
│  Storage · Queue · Events · Auth · Audit · Backup · Monitor │
└─────────────────────────────────────────────────────────────┘
```

---

## 2. MÓDULOS PRINCIPALES

### 2.1 SOVEREIGN BUSINESS CORE (SBC)
**Responsabilidad:** Identidad digital de la empresa. Memoria, estado, necesidades, reglas, decisiones, autoridad, evidencia.

| Submódulo | Responsabilidad | Tier |
|-----------|----------------|------|
| Business Profile | Identidad legal, fiscal, societaria de la empresa | TIER0 |
| Memory | Hechos registrados, documentos, comunicaciones, decisiones pasadas | TIER0 |
| State | Estado actual consolidado de todos los dominios | TIER0 |
| Needs | Necesidades detectadas (obligatorias, condicionales, emergentes) | TIER0 |
| Applicability | Qué normas/obligaciones aplican a esta empresa | TIER0 |
| Rules | Motor de reglas empresariales y regulatorias | TIER1 |
| Decisions | Registro de decisiones con autoridad y evidencia | TIER0 |
| Workflows | Flujos de trabajo con estados, transiciones y gates | TIER1 |
| Authority | Modelo de autoridad humana y delegaciones | TIER0 |
| Permissions | RBAC/ABAC para accesos y acciones | TIER0 |
| Evidence | Almacén de evidencias con integridad verificable | TIER0 |
| Black Box | Registro inmutable de decisiones, datos y contexto de IA | TIER0 |
| Documents | Gestión documental con metadatos, versiones y clasificación | TIER1 |
| Cases | Expedientes que agrupan hechos, documentos, decisiones | TIER1 |

### 2.2 MONEY & TAX (M&T)
**Responsabilidad:** Ciclo completo del dinero y obligaciones fiscales.

| Submódulo | Responsabilidad | Tier |
|-----------|----------------|------|
| Invoicing | Emisión y recepción de facturas (formato EU) | TIER0 |
| Collections | Gestión de cobros, vencimientos, recordatorios | TIER1 |
| Payments | Gestión de pagos a proveedores, nóminas, impuestos | TIER1 |
| Treasury | Estado de tesorería, previsiones, alertas | TIER1 |
| Operational Accounting | Contabilidad operacional (no sustituye a contable oficial) | TIER1 |
| Fiscal Engine | Cálculo de obligaciones fiscales según jurisdicción | TIER0 |
| Tax Calendar | Calendario de obligaciones fiscales con plazos | TIER0 |
| Tax Forecasting | Previsión de carga fiscal | TIER2 |
| Tax Adapters | Adaptadores por país/autonomía para presentación | TIER0 |

### 2.3 LEGAL
**Responsabilidad:** Marco jurídico de la empresa.

| Submódulo | Responsabilidad | Tier |
|-----------|----------------|------|
| Contracts | Gestión de contratos: creación, revisión, obligaciones, plazos | TIER1 |
| Obligations Tracker | Seguimiento de obligaciones legales derivadas | TIER0 |
| Deadlines | Plazos legales con alertas anticipadas | TIER0 |
| Corporate | Societario: actas, registros, modificaciones | TIER1 |
| Laboral | Contratos laborales, nóminas (preparación), convenios | TIER1 |
| Privacy & DPO | RGPD, LOPDGDD, registros de tratamiento, DPIA | TIER0 |
| AI Compliance | EU AI Act: clasificación, documentación, obligaciones | TIER1 |
| Case Files | Expedientes legales estructurados | TIER1 |
| Admin Communications | Comunicaciones con administraciones públicas | TIER1 |
| Regulatory Change Monitor | Vigilancia de cambios normativos aplicables | TIER2 |

### 2.4 BUSINESS
**Responsabilidad:** Operativa empresarial.

| Submódulo | Responsabilidad | Tier |
|-----------|----------------|------|
| CRM | Relación con clientes: contactos, interacciones, historial | TIER1 |
| Clients | Gestión de clientes: datos, contratos, facturación | TIER1 |
| Suppliers | Gestión de proveedores: datos, contratos, pagos | TIER1 |
| Personnel | Información de personal, documentación, seguimiento | TIER1 |
| Sales | Pipeline comercial, oportunidades, seguimiento | TIER2 |
| Procurement | Compras, pedidos, recepción, control | TIER1 |
| Operations | Operaciones diarias, tareas, seguimiento | TIER1 |
| Projects | Gestión de proyectos: hitos, recursos, entregas | TIER2 |
| Assets | Inventario de activos físicos y digitales | TIER2 |
| Quality | Control de calidad, indicadores, no conformidades | TIER2 |
| Incidents | Registro y seguimiento de incidencias | TIER1 |
| Growth | Análisis de crecimiento, métricas, tendencias | TIER2 |

### 2.5 TENDERS FREE (Licitaciones Gratuitas)
**Responsabilidad:** Encontrar, entender, filtrar, vigilar y avisar sobre licitaciones públicas. SIN COSTE para el usuario.

| Submódulo | Responsabilidad | Tier |
|-----------|----------------|------|
| Sources | Fuentes públicas reales verificadas (PLACSP, DOUE, etc.) | TIER0 |
| Search | Búsqueda semántica y por criterios en licitaciones | TIER1 |
| Monitoring | Vigilancia continua de fuentes configuradas | TIER1 |
| Eligibility | Evaluación de elegibilidad basada en perfil empresarial | TIER1 |
| Compatibility | Compatibilidad con capacidad, certificación, solvencia | TIER1 |
| Discard Explainer | Explicación documentada de por qué se descarta una licitación | TIER1 |
| Deadlines | Plazos de presentación con alertas | TIER0 |
| Documentation | Preparación de documentación requerida | TIER2 |
| Alerts | Notificaciones de nuevas oportunidades relevantes | TIER1 |
| Case File | Expediente por licitación con toda la trazabilidad | TIER1 |

**Principio:** Encontrar + Entender + Filtrar + Vigilar + Avisar = GRATIS. Siempre.

### 2.6 SECURITY
**Responsabilidad:** Seguridad integral del sistema y de la empresa.

| Submódulo | Responsabilidad | Tier |
|-----------|----------------|------|
| Identity | Gestión de identidades (propias y de usuarios del sistema) | TIER0 |
| Authority Model | Modelo de autoridad: quién puede hacer qué, con qué evidencia | TIER0 |
| Permissions | Control de acceso granular | TIER0 |
| Cybersecurity | Protección perimetral, cifrado, detección de intrusiones | TIER0 |
| Risk Register | Registro de riesgos empresariales y del sistema | TIER1 |
| Incident Response | Protocolo de respuesta a incidentes | TIER0 |
| Continuity | Plan de continuidad de negocio | TIER1 |
| Dependencies | Mapa de dependencias críticas | TIER1 |
| Backup & Restore | Copias de seguridad verificadas y plan de restauración | TIER0 |
| Evidence Store | Almacén de evidencias con integridad criptográfica | TIER0 |
| Black Box | Caja negra inmutable de decisiones y contexto | TIER0 |

### 2.7 INTELLIGENCE TRANSVERSAL
**Responsabilidad:** Motores de inteligencia que atraviesan todos los módulos.

| Motor | Responsabilidad | Tier |
|-------|----------------|------|
| Anticipation Engine | Detecta necesidades futuras antes de que sean urgentes | TIER2 |
| Attention Engine | Determina qué requiere atención humana y cuándo | TIER1 |
| Commitment Engine | Trackea compromisos adquiridos y su cumplimiento | TIER1 |
| Absence Engine | Detecta omisiones: lo que debería existir y no existe | TIER2 |
| Deterioration Engine | Detecta tendencias negativas antes de que sean críticas | TIER2 |
| Anomaly Engine | Detecta desviaciones respecto a patrones esperados | TIER2 |
| Risk Engine | Evalúa y prioriza riesgos de forma continua | TIER1 |
| Opportunity Engine | Identifica oportunidades basadas en contexto | TIER2 |
| Forecasting Engine | Proyecciones financieras, fiscales, operativas | TIER2 |
| Learning Engine | Aprende de correcciones, feedback y resultados | TIER2 |
| Uncertainty Engine | Cuantifica incertidumbre en estimaciones y proyecciones | TIER2 |

---

## 3. FLUJOS TRANSVERSALES

### 3.1 Flujo de Anticipación
```
OBSERVAR (eventos, datos, normas, plazos)
  → DETECTAR (cambios, patrones, desviaciones)
  → COMPRENDER (contexto, implicaciones, urgencia)
  → ANTICIPAR (escenarios, necesidades futuras)
  → PREPARAR (acciones, documentos, recomendaciones)
  → INTERRUMPIR SÓLO SI ES NECESARIO
  → o → "NO NECESITA HACER NADA" (registrado)
```

### 3.2 Flujo de Acción Material
```
PREPARED (sistema prepara acción con toda la información)
  → VERIFIED (sistema verifica consistencia y completitud)
  → HUMAN_AUTHORIZATION (humano revisa y autoriza)
  → EXECUTED (acción ejecutada)
  → EVIDENCED (resultado registrado como evidencia)
```

### 3.3 Flujo de Trazabilidad
```
SOURCE (origen del dato/hecho)
  → DATA (dato capturado/transformado)
  → RULE (regla aplicada)
  → NEED (necesidad identificada)
  → DECISION (decisión tomada con autoridad)
  → AUTHORITY (quién autorizó)
  → ACTION (acción ejecutada)
  → RESULT (resultado obtenido)
  → EVIDENCE (evidencia generada)
```

---

## 4. MODELO DE TIERS

| Tier | Nombre | Significado | SLA |
|------|--------|-------------|-----|
| TIER0 | CRITICAL | Sin esto el sistema no funciona o la empresa incumple | 99.9% disponibilidad. Recovery < 1h |
| TIER1 | ESSENTIAL | El empresario lo necesita para operar con seguridad | 99.5% disponibilidad. Recovery < 4h |
| TIER2 | INTELLIGENCE | Aporta valor diferencial y anticipación | Best effort. Recovery < 24h |
| TIER3 | EXPERIENCE | Mejora la experiencia pero no es crítico | Best effort. Recovery < 72h |

---

## 5. MATRIZ CAPACIDADES (resumen)

| Necesidad | Objetivo | Capacidad | Módulo | Tier |
|-----------|----------|-----------|--------|------|
| La empresa existe legalmente | Tener identidad digital | Business Profile | SBC | TIER0 |
| Cumplir obligaciones fiscales | Calcular y calendarizar | Fiscal Engine + Tax Calendar | M&T | TIER0 |
| No perder plazos legales | Vigilar plazos | Deadlines + Obligations Tracker | Legal | TIER0 |
| Facturar correctamente | Emitir facturas conformes | Invoicing + E-Invoicing Adapter | M&T | TIER0 |
| Encontrar licitaciones relevantes | Búsqueda y filtrado | Sources + Search + Eligibility | Tenders Free | TIER0 |
| Saber qué hacer hoy | Estado consolidado | State + Attention Engine | SBC + Intelligence | TIER0 |
| Demostrar cumplimiento | Evidencia trazable | Evidence + Black Box | SBC + Security | TIER0 |
| Anticipar problemas | Detección temprana | Anticipation + Deterioration | Intelligence | TIER2 |
| Preparar acciones | Automatización asistida | Workflows + Preparation | SBC | TIER1 |
| Autorizar con evidencia | Control humano | Authority + Evidence | SBC | TIER0 |

---

## 6. ORDEN DE CONSTRUCCIÓN RECOMENDADO

### Fase 1 — Cimientos (TIER0)
1. Sovereign Business Core: Profile, Memory, State, Authority, Permissions
2. Evidence & Black Box
3. Fiscal Engine + Tax Calendar (con adaptadores vacíos)
4. Deadlines + Obligations Tracker
5. Invoicing (emisión básica)
6. Sources (Tenders Free — fuentes públicas)
7. Identity & Security básico

### Fase 2 — Operativa (TIER1)
8. Workflows + Cases
9. Documents
10. CRM + Clients + Suppliers
11. Contracts + Corporate
12. Collections + Payments + Treasury
13. Attention Engine + Commitment Engine + Risk Engine
14. Tenders Free: Search + Monitoring + Eligibility + Alerts

### Fase 3 — Inteligencia (TIER2)
15. Anticipation Engine
16. Absence + Deterioration + Anomaly Engines
17. Opportunity + Forecasting Engines
18. Regulatory Change Monitor
19. Learning Engine
20. Tax Forecasting

### Fase 4 — Experiencia (TIER3)
21. UX refinamiento
22. Progressive disclosure avanzado
23. Mobile optimization
24. Accessibility audit completo

---

## 7. DECISIONES PENDIENTES DE VERIFICACIÓN

| Decisión | Estado | Bloqueador |
|----------|--------|------------|
| Jurisdicción exacta de hosting | REQUIRES_CONFIGURATION | Necesita decisión de negocio |
| Proveedor de infraestructura EU | REQUIRES_CONFIGURATION | OVH/Hetzner/Scaleway evaluación |
| Motor de inferencia primario | REQUIRES_EVALUATION | NVIDIA Triton vs alternativas |
| Adaptadores fiscales por país | REQUIRES_IMPLEMENTATION | Cada país requiere desarrollo |
| Integración e-Invoicing EU | REQUIRES_EXTERNAL_SERVICE | Depende de estándares por país |
| Certificado eIDAS | REQUIRES_EXTERNAL_SERVICE | Prestador de servicios de confianza |

---

*Documento generado como parte de la Orden 0. No constituye implementación.*
*Pendiente de aceptación humana antes de proceder a implementación.*
