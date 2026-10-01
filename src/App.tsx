/**
 * APP — Shell funcional de la Foundation
 * 
 * Demuestra los cimientos operativos:
 * - Layout responsive
 * - Navegación por dominios
 * - Security Icon derivado de BusinessState
 * - Estados SEGURO/ATENCIÓN/DECISIÓN basados en datos reales
 * - Progressive disclosure
 * - Error/Loading/Empty states
 * - Accesibilidad
 * 
 * NO hay datos empresariales inventados.
 * NO hay dashboard ficticio.
 * Si no hay datos reales → PENDING_VERIFICATION / UNKNOWN / EMPTY STATE.
 */

import { useState, useEffect, useMemo } from 'react';
import { Shield, FileText, Layers, Palette, Cpu, Database, Lock, BookOpen, Eye, Menu, X, ChevronRight, AlertTriangle, CheckCircle2, Clock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { SecurityIcon } from './ui/components/SecurityIcon';
import { ConfidenceTag } from './ui/components/ConfidenceTag';
import { EmptyState, ErrorBoundary, LoadingState, StatusBadge } from './ui/components/base';
import { deriveBusinessState } from './domain/state/business-state';
import { createInMemoryEvidenceStore } from './domain/evidence/store';
import { createInMemoryEventBus } from './domain/events/bus';
import { createInMemoryAuthorityStore, createInMemoryAuthorityEngine } from './domain/authority/engine';
import { createUUID, now } from './core/identifiers';
import type { BusinessState, Need, Obligation, ConfidenceLevel } from './domain/types';

type Section = 'overview' | 'architecture' | 'modules' | 'ux' | 'technology' | 'data' | 'traceability' | 'status';

const navItems: { id: Section; label: string; icon: React.ReactNode }[] = [
  { id: 'overview', label: 'Visión General', icon: <Eye className="w-4 h-4" /> },
  { id: 'architecture', label: 'Arquitectura', icon: <Layers className="w-4 h-4" /> },
  { id: 'modules', label: 'Módulos', icon: <BookOpen className="w-4 h-4" /> },
  { id: 'ux', label: 'UX/UI', icon: <Palette className="w-4 h-4" /> },
  { id: 'technology', label: 'Tecnología', icon: <Cpu className="w-4 h-4" /> },
  { id: 'data', label: 'Datos', icon: <Database className="w-4 h-4" /> },
  { id: 'traceability', label: 'Trazabilidad', icon: <Lock className="w-4 h-4" /> },
  { id: 'status', label: 'Estado', icon: <FileText className="w-4 h-4" /> },
];

export default function App() {
  const [activeSection, setActiveSection] = useState<Section>('overview');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  // Initialize foundation engines
  const foundation = useMemo(() => {
    const eventBus = createInMemoryEventBus();
    const evidenceStore = createInMemoryEvidenceStore();
    const authorityStore = createInMemoryAuthorityStore();
    const authorityEngine = createInMemoryAuthorityEngine(authorityStore);
    return { eventBus, evidenceStore, authorityStore, authorityEngine };
  }, []);

  // Simulate loading (in production, this would be real data fetching)
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  // Derive business state from REAL data (empty in foundation)
  const businessState = useMemo(() => {
    return deriveBusinessState({
      organisationId: createUUID(),
      needs: [] as Need[],
      obligations: [] as Obligation[],
    });
  }, []);

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-stone-50 text-stone-900">
        {/* Header */}
        <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-sm border-b border-stone-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-stone-900 flex items-center justify-center">
                  <Shield className="w-4 h-4 text-white" strokeWidth={2} />
                </div>
                <div>
                  <h1 className="text-sm font-semibold text-stone-900 leading-tight">Foundation v1</h1>
                  <p className="text-xs text-stone-500">Tier0 — Cimientos operativos</p>
                </div>
              </div>
              <div className="hidden md:flex items-center gap-3">
                <SecurityIcon state={businessState.state} size="sm" />
                <StatusBadge status="warning" label="FOUNDATION" />
              </div>
              <button
                className="md:hidden p-2 rounded-lg hover:bg-stone-100"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                aria-label="Toggle menu"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </header>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex gap-8">
            {/* Sidebar */}
            <nav className={`${mobileMenuOpen ? 'fixed inset-0 z-40 bg-white pt-20 px-6' : 'hidden'} md:block md:static md:bg-transparent md:pt-0 md:px-0 w-full md:w-56 shrink-0`}>
              <ul className="space-y-1">
                {navItems.map((item) => (
                  <li key={item.id}>
                    <button
                      onClick={() => { setActiveSection(item.id); setMobileMenuOpen(false); }}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${activeSection === item.id ? 'bg-stone-900 text-white' : 'text-stone-600 hover:bg-stone-100 hover:text-stone-900'}`}
                    >
                      {item.icon}
                      {item.label}
                    </button>
                  </li>
                ))}
              </ul>
            </nav>

            {/* Main */}
            <main className="flex-1 min-w-0">
              {loading ? (
                <LoadingState lines={5} />
              ) : (
                <AnimatePresence mode="wait">
                  <motion.div key={activeSection} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.2 }}>
                    {activeSection === 'overview' && <OverviewSection state={businessState.state} />}
                    {activeSection === 'architecture' && <ArchitectureSection />}
                    {activeSection === 'modules' && <ModulesSection />}
                    {activeSection === 'ux' && <UXSection />}
                    {activeSection === 'technology' && <TechnologySection />}
                    {activeSection === 'data' && <DataSection />}
                    {activeSection === 'traceability' && <TraceabilitySection />}
                    {activeSection === 'status' && <FoundationStatusSection />}
                  </motion.div>
                </AnimatePresence>
              )}
            </main>
          </div>
        </div>
      </div>
    </ErrorBoundary>
  );
}

// ============ SECTIONS ============

function OverviewSection({ state }: { state: BusinessState }) {
  return (
    <div className="space-y-12">
      <section className="text-center py-12">
        <div className="flex justify-center mb-8">
          <SecurityIcon state={state} size="lg" />
        </div>
        <h2 className="text-3xl sm:text-4xl font-serif text-stone-900 mb-4">
          Foundation Tier0
        </h2>
        <p className="text-lg text-stone-600 max-w-2xl mx-auto">
          Cimientos operativos del Sistema Operativo Empresarial Soberano.
        </p>
        <p className="text-sm text-stone-500 mt-4 max-w-xl mx-auto">
          Estado actual: <ConfidenceTag level="PENDING_VERIFICATION" /> — Sin datos empresariales reales configurados.
        </p>
      </section>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <FoundationCard title="Application Core" desc="Config, errors, health, identifiers" status="implemented" />
        <FoundationCard title="Domain Core" desc="18+ tipos de contrato estables" status="implemented" />
        <FoundationCard title="Authority Core" desc="IDENTITY ≠ ROLE ≠ AUTHORITY ≠ PERMISSION" status="implemented" />
        <FoundationCard title="Event + Traceability" desc="Event sourcing con causalidad" status="implemented" />
        <FoundationCard title="Evidence + Black Box" desc="Hash chain REAL (SHA-256)" status="implemented" />
        <FoundationCard title="Business State" desc="Derivado de hechos, no decorado" status="implemented" />
        <FoundationCard title="UI Foundation" desc="Shell, Security Icon, states" status="implemented" />
        <FoundationCard title="Storage Abstractions" desc="6 puertos definidos" status="implemented" />
        <FoundationCard title="Test Foundation" desc="Tests reales con Vitest" status="implemented" />
      </div>
    </div>
  );
}

function FoundationCard({ title, desc, status }: { title: string; desc: string; status: 'implemented' | 'pending' }) {
  return (
    <div className="bg-white rounded-xl border border-stone-200 p-5">
      <div className="flex items-center justify-between mb-2">
        <h3 className="font-semibold text-stone-900 text-sm">{title}</h3>
        {status === 'implemented' ? (
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
        ) : (
          <Clock className="w-4 h-4 text-amber-600" />
        )}
      </div>
      <p className="text-xs text-stone-500">{desc}</p>
    </div>
  );
}

function ArchitectureSection() {
  const layers = [
    { name: 'PRESENTATION', desc: 'UX/UI · Design Tokens · Responsive · Accesibilidad', color: 'bg-blue-50 border-blue-200' },
    { name: 'APPLICATION', desc: 'Casos de uso · Workflows · Orquestación · Autorizaciones', color: 'bg-indigo-50 border-indigo-200' },
    { name: 'DOMAIN', desc: 'Entidades · Value Objects · Reglas · Eventos', color: 'bg-violet-50 border-violet-200' },
    { name: 'ENGINE', desc: 'Intelligence · Inference · Retrieval · Document AI', color: 'bg-purple-50 border-purple-200' },
    { name: 'ADAPTER', desc: 'Tax · SS · Registry · E-Invoicing · eIDAS', color: 'bg-fuchsia-50 border-fuchsia-200' },
    { name: 'INFRASTRUCTURE', desc: 'Storage · Queue · Events · Auth · Audit', color: 'bg-stone-100 border-stone-300' },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-serif text-stone-900 mb-2">Capas Arquitectónicas</h2>
        <p className="text-stone-600">Foundation implementa las 3 capas inferiores como cimientos.</p>
      </div>
      <div className="space-y-3">
        {layers.map((layer) => (
          <div key={layer.name} className={`rounded-xl border p-5 ${layer.color}`}>
            <h4 className="font-mono text-sm font-bold text-stone-800 mb-1">{layer.name}</h4>
            <p className="text-sm text-stone-600">{layer.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function ModulesSection() {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-serif text-stone-900 mb-2">Módulos Tier0</h2>
      <p className="text-stone-600">Foundation no implementa módulos de dominio específicos. Solo los cimientos.</p>
      <EmptyState
        title="Módulos de dominio pendientes"
        description="Los módulos fiscales, legales, licitaciones y business se implementarán en órdenes posteriores sobre estos cimientos."
        confidence="PENDING_VERIFICATION"
      />
    </div>
  );
}

function UXSection() {
  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-serif text-stone-900 mb-2">UX Foundation</h2>
      <div className="bg-white rounded-xl border border-stone-200 p-8">
        <h3 className="text-lg font-semibold text-stone-900 mb-6">Icono de Seguridad — Estados</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {(['SEGURO', 'ATENCIÓN', 'DECISIÓN'] as BusinessState[]).map((s) => (
            <div key={s} className="text-center">
              <div className="flex justify-center mb-4"><SecurityIcon state={s} /></div>
              <h4 className={`font-semibold mb-1 ${s === 'SEGURO' ? 'text-emerald-700' : s === 'ATENCIÓN' ? 'text-amber-700' : 'text-blue-700'}`}>{s}</h4>
              <p className="text-xs text-stone-500">
                {s === 'SEGURO' && 'No necesita hacer nada'}
                {s === 'ATENCIÓN' && 'Debe conocer algo'}
                {s === 'DECISIÓN' && 'Necesitamos su autoridad'}
              </p>
            </div>
          ))}
        </div>
      </div>
      <div className="bg-white rounded-xl border border-stone-200 p-8">
        <h3 className="text-lg font-semibold text-stone-900 mb-4">Niveles de Confianza</h3>
        <div className="flex flex-wrap gap-2">
          {(['FACT', 'CALCULATED', 'ESTIMATED', 'PROJECTION', 'AI_RECOMMENDATION', 'PENDING_VERIFICATION', 'UNKNOWN'] as ConfidenceLevel[]).map((l) => (
            <ConfidenceTag key={l} level={l} />
          ))}
        </div>
      </div>
    </div>
  );
}

function TechnologySection() {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-serif text-stone-900 mb-2">Tecnología Foundation</h2>
      <div className="bg-white rounded-xl border border-stone-200 p-8">
        <h3 className="text-lg font-semibold text-stone-900 mb-4">Stack aprobado</h3>
        <div className="grid grid-cols-2 gap-3 text-sm">
          {[
            ['React 18', 'UI framework'],
            ['TypeScript strict', 'Type safety'],
            ['Vite', 'Build tool'],
            ['Tailwind CSS v4', 'Styling'],
            ['Vitest', 'Testing'],
            ['Framer Motion', 'Animation'],
            ['Lucide React', 'Icons'],
          ].map(([name, desc]) => (
            <div key={name} className="flex items-center gap-2 p-2 rounded bg-emerald-50 border border-emerald-100">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <div>
                <p className="font-medium text-stone-800">{name}</p>
                <p className="text-xs text-stone-500">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="bg-white rounded-xl border border-stone-200 p-8">
        <h3 className="text-lg font-semibold text-stone-900 mb-4">Puertos de almacenamiento</h3>
        <div className="space-y-2">
          {['DatabasePort', 'ObjectStoragePort', 'IdentityProviderPort', 'SecretProviderPort', 'EventStorePort', 'EvidenceStorePort'].map((p) => (
            <div key={p} className="flex items-center gap-2 p-2 rounded border border-stone-100">
              <code className="text-sm font-mono text-stone-700">{p}</code>
              <span className="text-xs text-stone-500 ml-auto">contrato definido</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function DataSection() {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-serif text-stone-900 mb-2">Domain Types</h2>
      <p className="text-stone-600">18+ contratos de dominio definidos con TypeScript strict.</p>
      <div className="bg-white rounded-xl border border-stone-200 p-8">
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {['Organisation', 'Person', 'Identity', 'Role', 'Authority', 'Permission', 'BusinessProfile', 'Jurisdiction', 'Need', 'Obligation', 'Decision', 'MaterialAction', 'Workflow', 'Document', 'Source', 'Evidence', 'DomainEvent', 'AuditRecord'].map((t) => (
            <code key={t} className="text-xs bg-stone-50 border border-stone-100 rounded px-2 py-1 text-stone-700">{t}</code>
          ))}
        </div>
      </div>
    </div>
  );
}

function TraceabilitySection() {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-serif text-stone-900 mb-2">Trazabilidad</h2>
      <div className="bg-white rounded-xl border border-stone-200 p-8">
        <h3 className="text-lg font-semibold text-stone-900 mb-4">Cadena de Trazabilidad</h3>
        <div className="flex flex-wrap items-center gap-1.5 text-sm">
          {['SOURCE', 'DATA', 'RULE', 'NEED', 'DECISION', 'AUTHORITY', 'ACTION', 'RESULT', 'EVIDENCE'].map((s, i) => (
            <div key={s} className="flex items-center gap-1.5">
              <span className="px-2.5 py-1.5 bg-stone-100 rounded-lg text-xs font-bold text-stone-800">{s}</span>
              {i < 8 && <ChevronRight className="w-3 h-3 text-stone-400" />}
            </div>
          ))}
        </div>
      </div>
      <div className="bg-blue-50 rounded-xl border border-blue-200 p-8">
        <h3 className="text-lg font-semibold text-blue-900 mb-4">Integridad verificable</h3>
        <p className="text-sm text-blue-700 mb-3">
          Cada evidencia tiene hash chain REAL (SHA-256 via Web Crypto API).
        </p>
        <p className="text-sm text-blue-700">
          <strong>Propiedad demostrada:</strong> Alterar cualquier evidencia invalida todos los hashes siguientes.
          La verificación recalcula y compara.
        </p>
      </div>
    </div>
  );
}

function FoundationStatusSection() {
  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-serif text-stone-900 mb-2">Estado de la Orden 2</h2>
      <div className="bg-white rounded-xl border border-stone-200 p-8">
        <h3 className="text-lg font-semibold text-stone-900 mb-4">Foundation implementada</h3>
        <div className="space-y-2">
          {[
            'Application Core (config, errors, health, identifiers)',
            'Domain Core (18+ tipos TypeScript strict)',
            'Authority Core (IDENTITY ≠ ROLE ≠ AUTHORITY ≠ PERMISSION)',
            'Event + Traceability Core (event bus con metadata completa)',
            'Evidence + Black Box (hash chain SHA-256 REAL)',
            'Business State (derivado de hechos, no decorado)',
            'UI Foundation (shell, Security Icon, states, a11y)',
            'Storage Abstractions (6 puertos)',
            'Test Foundation (Vitest configurado)',
            'Documentation (README, ADRs, strategies)',
          ].map((item) => (
            <div key={item} className="flex items-center gap-2 p-2 rounded bg-emerald-50 border border-emerald-100">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span className="text-sm text-stone-700">{item}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="bg-amber-50 rounded-xl border border-amber-200 p-8">
        <h3 className="text-lg font-semibold text-amber-900 mb-4">Limitaciones del entorno</h3>
        <div className="space-y-2 text-sm text-amber-800">
          <p>• Git/GitHub: NOT_VERIFIABLE (sandbox sin Git)</p>
          <p>• CI: NOT_EXECUTED (no hay GitHub Actions en sandbox)</p>
          <p>• DB real: NOT_AVAILABLE (solo in-memory NON_PRODUCTION)</p>
          <p>• Object storage real: NOT_AVAILABLE</p>
          <p>• Identity provider real: NOT_AVAILABLE</p>
        </div>
      </div>
    </div>
  );
}
