# UX/UI SYSTEM V1
## Arquitectura de experiencia, Design System y estados humanos
### Estado: DRAFT — Pendiente aceptación humana

---

## 1. CONCEPTO CENTRAL: ICONO DE SEGURIDAD

El elemento visual central es el **ICONO DE SEGURIDAD**.
No es un logo, no es un dashboard, no es un chatbot.
Es la representación visual de: "Mi empresa está atendida."

### Estados del Icono

| Estado | Significado humano | Visual | Acción requerida |
|--------|-------------------|--------|-----------------|
| SEGURO | No necesita hacer nada | Icono sereno, estático, color neutro positivo | Ninguna. El sistema trabaja. |
| ATENCIÓN | Debe conocer algo | Icono con sutil cambio (pulso suave, color ámbar) | Leer. Posiblemente nada más. |
| DECISIÓN | Necesitamos su información/autoridad | Icono con indicador claro (color definido, badge) | Revisar y decidir. |

### Principio
- El empresario NO debe sentir que tiene que "revisar un dashboard".
- El empresario debe sentir que su empresa está siendo atendida.
- Si todo está bien, el sistema lo comunica con silencio y claridad.

---

## 2. ESTÉTICA

### Principios visuales
- **Sobria**: Sin elementos decorativos innecesarios
- **Premium**: Tipografía cuidada, espaciado generoso, materiales de calidad
- **Europea**: Referencias al diseño institucional europeo (claridad, seriedad, accesibilidad)
- **Silenciosa**: No grita. No compite por atención. Informa con calma.
- **Clara**: Jerarquía visual inequívoca. Sin ambigüedad.

### Evitar
- ❌ Dashboard saturado de gráficos y números
- ❌ Estética startup genérica (gradientes neón, ilustraciones flat coloridas)
- ❌ Gamificación (badges, puntos, streaks)
- ❌ Chatbot central como interfaz principal
- ❌ Alertas constantes y notificaciones agresivas
- ❌ Animaciones innecesarias
- ❌ Colores saturados para elementos informativos

### Buscar
- ✅ Espacio en blanco generoso
- ✅ Tipografía con personalidad pero legible
- ✅ Color como información (no como decoración)
- ✅ Microinteracciones con propósito
- ✅ Progressive disclosure (mostrar solo lo necesario)
- ✅ Sensación de control y calma

---

## 3. DESIGN TOKENS

### 3.1 Color

| Token | Uso | Valor (conceptual) |
|-------|-----|-------------------|
| `--color-safe` | Estado seguro / completado | Verde apagado, no brillante |
| `--color-attention` | Requiere conocimiento | Ámbar suave |
| `--color-decision` | Requiere acción/autorización | Azul profundo (no rojo alarma) |
| `--color-critical` | Problema real, urgente | Rojo contenido, no estridente |
| `--color-neutral-900` | Texto principal | Gris muy oscuro |
| `--color-neutral-600` | Texto secundario | Gris medio |
| `--color-neutral-100` | Fondos sutiles | Gris muy claro |
| `--color-neutral-0` | Fondo principal | Blanco / off-white |
| `--color-surface` | Superficies elevadas | Blanco con sutil elevación |
| `--color-border` | Bordes, separadores | Gris muy sutil |

### 3.2 Tipografía

| Token | Uso | Características |
|-------|-----|----------------|
| `--font-display` | Títulos, icono de seguridad | Serif o sans-serif con carácter. Legible en grande. |
| `--font-body` | Texto general, datos | Sans-serif neutra, excelente legibilidad |
| `--font-mono` | Datos técnicos, IDs, hashes | Monoespaciada para datos exactos |
| `--text-xs` | Labels, metadata | 12px / 0.75rem |
| `--text-sm` | Texto secundario | 14px / 0.875rem |
| `--text-base` | Texto principal | 16px / 1rem |
| `--text-lg` | Subtítulos | 18-20px |
| `--text-xl` | Títulos de sección | 24-28px |
| `--text-2xl` | Título principal | 32-36px |

### 3.3 Espaciado

| Token | Valor | Uso |
|-------|-------|-----|
| `--space-1` | 4px | Micro espaciado |
| `--space-2` | 8px | Entre elementos relacionados |
| `--space-3` | 12px | Padding interno compacto |
| `--space-4` | 16px | Padding estándar |
| `--space-6` | 24px | Entre secciones |
| `--space-8` | 32px | Entre bloques |
| `--space-12` | 48px | Entre áreas principales |
| `--space-16` | 64px | Separación de grandes secciones |

### 3.4 Elevación

| Token | Uso |
|-------|-----|
| `--elevation-0` | Plano base |
| `--elevation-1` | Cards, paneles (sutil) |
| `--elevation-2` | Dropdowns, popovers |
| `--elevation-3` | Modals, overlays |

### 3.5 Radio

| Token | Valor | Uso |
|-------|-------|-----|
| `--radius-sm` | 4px | Tags, badges pequeños |
| `--radius-md` | 8px | Cards, inputs |
| `--radius-lg` | 12px | Paneles grandes |
| `--radius-full` | 9999px | Avatares, pills |

---

## 4. ESTRUCTURA DE NAVEGACIÓN

### 4.1 Jerarquía

```
NIVEL 0: ICONO DE SEGURIDAD (home)
  → Estado global. ¿Necesito hacer algo?
  
NIVEL 1: DOMINIOS
  → Mi Empresa (SBC)
  → Dinero (M&T)
  → Legal
  → Negocio (Business)
  → Licitaciones (Tenders Free)
  → Seguridad
  
NIVEL 2: SUBMÓDULOS
  → Dentro de cada dominio, los submódulos relevantes
  
NIVEL 3: ENTIDADES / EXPEDIENTES
  → Casos concretos, documentos, decisiones
  
NIVEL 4: DETALLE / EVIDENCIA
  → Trazabilidad completa de un hecho
```

### 4.2 Navegación principal

- **Sidebar** (desktop): Dominios como navegación primaria. Colapsable.
- **Bottom nav** (mobile): Iconos de seguridad + dominios principales.
- **Breadcrumb**: Siempre visible para contexto.
- **Search global**: Acceso rápido desde cualquier punto.

### 4.3 Home / Icono de Seguridad

La home NO es un dashboard. Es el Icono de Seguridad con:

1. **Estado global** (SEGURO / ATENCIÓN / DECISIÓN)
2. **Si ATENCIÓN**: Lista breve de cosas que debe conocer (sin alarma)
3. **Si DECISIÓN**: Lista de decisiones pendientes con contexto suficiente
4. **Si SEGURO**: Mensaje de tranquilidad + actividad reciente del sistema (opcional)

---

## 5. COMPONENTES

### 5.1 Componentes base

| Componente | Descripción |
|-----------|-------------|
| `SecurityIcon` | Icono central con estados (seguro/atención/decisión) |
| `StatusBadge` | Badge de estado con semántica de color |
| `ConfidenceTag` | Tag que indica nivel de confianza del dato (FACT/CALCULATED/ESTIMATED/etc.) |
| `AuthorityGate` | Componente que bloquea acción hasta autorización humana |
| `EvidencePanel` | Panel que muestra trazabilidad completa |
| `TimelineItem` | Item de timeline con tipo, fuente y confianza |
| `DecisionCard` | Card para presentar una decisión pendiente |
| `CaseFile` | Vista de expediente agrupado |
| `DocumentPreview` | Preview de documento con metadatos |
| `AdaptadorStatus` | Indicador de estado de integración (DIRECT_API/STANDARD_PROTOCOL/etc.) |
| `EmptyState` | Estado vacío con mensaje claro y acción siguiente |
| `LoadingSkeleton` | Skeleton de carga que respeta layout |
| `ErrorBoundary` | Error manejado con opción de reintento y reporte |

### 5.2 Componentes de dominio

| Componente | Dominio | Descripción |
|-----------|---------|-------------|
| `FiscalCalendar` | M&T | Calendario de obligaciones fiscales |
| `InvoiceRow` | M&T | Línea de factura con validación |
| `TenderCard` | Tenders Free | Card de licitación con elegibilidad |
| `ContractSummary` | Legal | Resumen de contrato con obligaciones |
| `DeadlineAlert` | Legal | Alerta de plazo con contexto |
| `ClientProfile` | Business | Perfil de cliente con historial |
| `RiskMatrix` | Security | Matriz de riesgos simplificada |
| `BlackBoxEntry` | Security | Entrada de caja negra con hash |

---

## 6. PATRONES DE INTERACCIÓN

### 6.1 Progressive Disclosure

```
NIVEL 1: Resumen (una línea)
  → "Tienes 2 decisiones pendientes"
  
NIVEL 2: Contexto (expansión)
  → Lista de decisiones con descripción breve
  
NIVEL 3: Detalle (navegación)
  → Expediente completo con evidencia
  
NIVEL 4: Trazabilidad (profundización)
  → SOURCE → DATA → RULE → ... → EVIDENCE
```

### 6.2 Estados de datos

Todo dato muestra su nivel de confianza:
- 🟢 `FACT` — Verificado
- 🔵 `CALCULATED` — Calculado deterministamente
- 🟡 `ESTIMATED` — Estimado (con método)
- 🟠 `PROJECTION` — Proyección (con incertidumbre)
- 🟣 `AI_RECOMMENDATION` — Recomendación de IA
- ⚪ `PENDING_VERIFICATION` — Pendiente de verificar
- ⚫ `UNKNOWN` — No determinado

### 6.3 Autorización humana

Para toda acción material:
```
1. Sistema PREPARA la acción
2. Sistema VERIFICA consistencia
3. Se muestra al humano con:
   - Qué se va a hacer
   - Con qué datos
   - Qué regla aplica
   - Qué evidencia genera
   - Qué pasa si no se hace
4. Humano AUTORIZA o RECHAZA
5. Sistema EJECUTA
6. Sistema REGISTRA evidencia
```

### 6.4 Anticipación silenciosa

```
Sistema detecta → analiza → determina:
  → "No necesita hacer nada" → registra en log, no interrumpe
  → "Debe conocer esto" → estado ATENCIÓN
  → "Necesitamos su decisión" → estado DECISIÓN
  → "Problema urgente" → estado CRÍTICO (excepcional)
```

---

## 7. RESPONSIVE

### Desktop (>1024px)
- Sidebar fija con dominios
- Contenido principal amplio
- Paneles laterales para contexto
- Tablas completas

### Tablet (768-1024px)
- Sidebar colapsable
- Contenido adaptable
- Paneles como overlays

### Mobile (<768px)
- Bottom navigation
- Contenido a pantalla completa
- Swipe para navegación entre dominios
- Cards en lugar de tablas
- Icono de seguridad siempre accesible

---

## 8. ACCESIBILIDAD

- WCAG 2.1 AA como mínimo
- Contraste mínimo 4.5:1 para texto
- Navegación completa por teclado
- Screen reader: labels semánticos, roles ARIA
- No depender solo del color para transmitir información
- Focus visible claro
- Motion: respetar `prefers-reduced-motion`
- Tamaño de touch targets: mínimo 44x44px

---

## 9. ESTADOS EMPTY / LOADING / ERROR

### Empty State
- Mensaje claro de qué significa "vacío"
- Acción siguiente sugerida
- Sin culpa ni urgencia
- Ejemplo: "Aún no has registrado facturas. Cuando lo hagas, aparecerán aquí."

### Loading
- Skeleton que respeta el layout final
- No spinner genérico en centro de página
- Contenido parcial si está disponible
- Tiempo estimado si es largo

### Error
- Mensaje comprensible (no técnico)
- Qué puede hacer el usuario
- Opción de reintentar
- Opción de reportar
- No bloquear toda la interfaz si es parcial

---

## 10. ANIMACIONES

| Tipo | Duración | Easing | Uso |
|------|----------|--------|-----|
| Micro-feedback | 150ms | ease-out | Hover, focus, toggle |
| Transición de estado | 300ms | ease-in-out | Cambio de estado del icono |
| Entrada de contenido | 400ms | ease-out | Aparición de paneles |
| Transición de página | 300ms | ease-in-out | Navegación entre vistas |

Principio: Las animaciones informan, no decoran.

---

*Documento generado como parte de la Orden 0. Pendiente de aceptación humana.*
