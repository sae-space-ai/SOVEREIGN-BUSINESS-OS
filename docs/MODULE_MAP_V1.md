# MODULE MAP V1
## Mapa completo de módulos, submódulos, dependencias y responsabilidades
### Estado: DRAFT — Pendiente aceptación humana

---

## LEYENDA DE DEPENDENCIAS

- → dependencia directa (requiere para funcionar)
- ⇄ dependencia bidireccional
- ╌╌ dependencia opcional (enhancement)

---

## MAPA DE MÓDULOS

```
                    ┌──────────────────────┐
                    │   SOVEREIGN CORE     │
                    │  (identidad empresa) │
                    └──────────┬───────────┘
                               │
            ┌──────────────────┼──────────────────┐
            │                  │                   │
    ┌───────▼───────┐  ┌──────▼──────┐  ┌────────▼────────┐
    │  MONEY & TAX  │  │   LEGAL     │  │    BUSINESS     │
    │               │  │             │  │                 │
    │ Facturación   │  │ Contratos   │  │ CRM             │
    │ Fiscalidad    │  │ Plazos      │  │ Clientes        │
    │ Tesorería     │  │ Societario  │  │ Operaciones     │
    │ Contabilidad  │  │ Laboral     │  │ Proyectos       │
    └───────┬───────┘  └──────┬──────┘  └────────┬────────┘
            │                  │                   │
            └──────────────────┼───────────────────┘
                               │
                    ┌──────────▼───────────┐
                    │  TENDERS FREE        │
                    │  (licitaciones)      │
                    └──────────┬───────────┘
                               │
            ┌──────────────────┼──────────────────┐
            │                  │                   │
    ┌───────▼───────┐  ┌──────▼──────┐  ┌────────▼────────┐
    │   SECURITY    │  │ INTELLIGENCE│  │   ADAPTERS      │
    │               │  │ TRANSVERSAL │  │   (EU Framework)│
    │ Identity      │  │             │  │                 │
    │ Evidence      │  │ Anticipation│  │ Tax Adapters    │
    │ Black Box     │  │ Attention   │  │ SS Adapters     │
    │ Backup        │  │ Risk        │  │ Registry        │
    └───────────────┘  │ Forecasting │  │ E-Invoicing     │
                       └─────────────┘  │ eIDAS           │
                                        └─────────────────┘
```

---

## DETALLE DE MÓDULOS Y DEPENDENCIAS

### M1: SOVEREIGN BUSINESS CORE

| ID | Submódulo | Depende de | Provee a |
|----|-----------|-----------|----------|
| M1.1 | Business Profile | — | Todos los módulos |
| M1.2 | Memory | M1.1 | M1.3, M1.4, M1.12 |
| M1.3 | State | M1.1, M1.2 | Todos los módulos (consulta) |
| M1.4 | Needs | M1.3, M1.5 | M1.6, M1.7, Intelligence |
| M1.5 | Applicability | M1.1, reglas externas | M1.4, M1.6 |
| M1.6 | Rules Engine | M1.5, M1.4 | M1.7, M1.8 |
| M1.7 | Decisions | M1.6, M1.9 | M1.8, M1.11 |
| M1.8 | Workflows | M1.7, M1.9 | M1.13, M1.14 |
| M1.9 | Authority | M1.1 | M1.7, M1.8, M1.10 |
| M1.10 | Permissions | M1.9 | Todos los módulos |
| M1.11 | Evidence | M1.7 | M1.12, Security |
| M1.12 | Black Box | M1.11, M1.2 | Security, Audit |
| M1.13 | Documents | M1.1, M1.8 | Todos los módulos |
| M1.14 | Cases | M1.13, M1.8, M1.11 | Legal, Business |

### M2: MONEY & TAX

| ID | Submódulo | Depende de | Provee a |
|----|-----------|-----------|----------|
| M2.1 | Invoicing | M1.1, Adapters E-Invoicing | M2.2, M2.5 |
| M2.2 | Collections | M2.1, M1.13 | M2.4 |
| M2.3 | Payments | M1.1, Banking Adapter | M2.4 |
| M2.4 | Treasury | M2.2, M2.3 | M2.6, M2.8 |
| M2.5 | Operational Accounting | M2.1, M2.3 | M2.6 |
| M2.6 | Fiscal Engine | M2.5, M2.4, Tax Adapters | M2.7, M2.8 |
| M2.7 | Tax Calendar | M2.6 | Legal Deadlines, Attention |
| M2.8 | Tax Forecasting | M2.6, M2.4, Forecasting Engine | — |
| M2.9 | Tax Adapters | M1.1 (jurisdicción) | M2.6, M2.1 |

### M3: LEGAL

| ID | Submódulo | Depende de | Provee a |
|----|-----------|-----------|----------|
| M3.1 | Contracts | M1.1, M1.13 | M3.2, M3.3 |
| M3.2 | Obligations Tracker | M3.1, M1.5 | M3.3, Attention |
| M3.3 | Deadlines | M3.2, M2.7 | Attention, Workflows |
| M3.4 | Corporate | M1.1, M1.13 | M1.2 |
| M3.5 | Laboral | M1.1, M3.1 | M2.3 (nóminas) |
| M3.6 | Privacy & DPO | M1.1, M1.5 | M1.10, Security |
| M3.7 | AI Compliance | M1.5, EU AI Act rules | Intelligence (supervisión) |
| M3.8 | Case Files | M1.14, M3.1 | — |
| M3.9 | Admin Communications | M1.1, M1.13 | M1.2 |
| M3.10 | Regulatory Change Monitor | Fuentes normativas | M1.5, M3.2 |

### M4: BUSINESS

| ID | Submódulo | Depende de | Provee a |
|----|-----------|-----------|----------|
| M4.1 | CRM | M1.1 | M4.2, M4.6 |
| M4.2 | Clients | M4.1, M1.1 | M2.1, M3.1 |
| M4.3 | Suppliers | M1.1 | M2.3, M3.1 |
| M4.4 | Personnel | M1.1, M3.5 | M2.3 |
| M4.5 | Sales | M4.1, M4.2 | M2.1 |
| M4.6 | Procurement | M4.3 | M2.3 |
| M4.7 | Operations | M1.1, M1.8 | M4.8 |
| M4.8 | Projects | M4.7 | M1.14 |
| M4.9 | Assets | M1.1 | M2.5 |
| M4.10 | Quality | M4.7 | M4.11 |
| M4.11 | Incidents | M4.10, M4.7 | M1.14 |
| M4.12 | Growth | M2.4, M4.5, Forecasting | — |

### M5: TENDERS FREE

| ID | Submódulo | Depende de | Provee a |
|----|-----------|-----------|----------|
| M5.1 | Sources | — (fuentes públicas) | M5.2 |
| M5.2 | Search | M5.1, M1.1 | M5.3 |
| M5.3 | Monitoring | M5.1 | M5.8 |
| M5.4 | Eligibility | M5.2, M1.1, M1.5 | M5.5 |
| M5.5 | Compatibility | M5.4, M1.1 | M5.6 |
| M5.6 | Discard Explainer | M5.5 | M1.14 |
| M5.7 | Deadlines | M5.2 | M3.3 |
| M5.8 | Alerts | M5.3, M5.4 | Attention |
| M5.9 | Documentation | M5.5, M1.13 | M1.14 |
| M5.10 | Case File | M5.6, M5.7, M1.14 | — |

### M6: SECURITY

| ID | Submódulo | Depende de | Provee a |
|----|-----------|-----------|----------|
| M6.1 | Identity | — | M1.9, M1.10 |
| M6.2 | Authority Model | M6.1, M1.9 | M1.7, M1.8 |
| M6.3 | Permissions | M6.2, M1.10 | Todos |
| M6.4 | Cybersecurity | Infraestructura | Todos |
| M6.5 | Risk Register | M1.1, todos los módulos | Risk Engine |
| M6.6 | Incident Response | M6.4 | M1.12 |
| M6.7 | Continuity | M6.5 | — |
| M6.8 | Dependencies | Todos los módulos (mapa) | M6.7 |
| M6.9 | Backup & Restore | Infraestructura | M6.7 |
| M6.10 | Evidence Store | M1.11 | M1.12 |
| M6.11 | Black Box | M1.12, M6.10 | Audit |

### M7: INTELLIGENCE TRANSVERSAL

| ID | Motor | Depende de | Provee a |
|----|-------|-----------|----------|
| M7.1 | Anticipation | M1.3, M1.4, todos | Attention |
| M7.2 | Attention | M7.1, M1.4, M1.3 | UX (estados humanos) |
| M7.3 | Commitment | M1.8, M3.2, M3.3 | M7.2 |
| M7.4 | Absence | M1.5, M1.4 | M7.1, M7.2 |
| M7.5 | Deterioration | M1.3, series temporales | M7.1, M7.2 |
| M7.6 | Anomaly | M1.3, patrones históricos | M7.1, M7.2 |
| M7.7 | Risk | M6.5, M7.5, M7.6 | M7.2, M1.4 |
| M7.8 | Opportunity | M1.3, contexto externo | M7.2 |
| M7.9 | Forecasting | M2.4, M2.8, series | M7.1, M4.12 |
| M7.10 | Learning | Correcciones humanas, resultados | Todos |
| M7.11 | Uncertainty | M7.9, M7.7 | M7.2 (calificación datos) |

---

## ADAPTER FRAMEWORK (EU)

| ID | Adaptador | Estado actual | Requiere |
|----|-----------|--------------|----------|
| A1 | Tax Adapter (ES) | NOT_AVAILABLE | Implementación + verificación |
| A2 | Tax Adapter (PT) | NOT_AVAILABLE | Implementación + verificación |
| A3 | Tax Adapter (FR) | NOT_AVAILABLE | Implementación + verificación |
| A4 | Tax Adapter (DE) | NOT_AVAILABLE | Implementación + verificación |
| A5 | Tax Adapter (IT) | NOT_AVAILABLE | Implementación + verificación |
| A6 | Social Security Adapter | NOT_AVAILABLE | Implementación por país |
| A7 | Business Registry Adapter | NOT_AVAILABLE | Implementación por país |
| A8 | E-Invoicing Adapter (EN 16931) | NOT_AVAILABLE | Implementación estándar EU |
| A9 | Procurement / Tenders Sources | NOT_AVAILABLE | Verificación fuentes públicas |
| A10 | eIDAS / EUDI Adapter | NOT_AVAILABLE | Prestador confianza externo |
| A11 | Trust Services (firma, sello) | NOT_AVAILABLE | Prestador cualificado |
| A12 | Banking Adapter | NOT_AVAILABLE | PSD2/Open Banking |

**Nota:** NINGÚN adaptador está verificado. Todos requieren IMPLEMENTACIÓN y VERIFICACIÓN con fuentes oficiales. No se asume ninguna API disponible sin comprobación directa.

---

## MATRIZ DE CLASIFICACIÓN DE DATOS

| Clasificación | Significado | Tratamiento |
|--------------|-------------|-------------|
| FACT | Dato verificado con fuente | Almacenamiento permanente, trazable |
| CALCULATED | Resultado de cálculo determinista | Reproducible, auditables |
| ESTIMATED | Estimación con método documentado | Marcado como tal, con intervalo |
| PROJECTION | Proyección futura | Incertidumbre cuantificada |
| AI_RECOMMENDATION | Recomendación de IA | Nunca ejecutada sin autorización |
| PENDING_VERIFICATION | Requiere verificación humana | Bloqueante hasta verificación |
| UNKNOWN | No determinado | No se usa para decisiones |

---

*Documento generado como parte de la Orden 0. Pendiente de aceptación humana.*
