import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Shield,
  FileText,
  Layers,
  Palette,
  Cpu,
  Database,
  Lock,
  ChevronRight,
  CheckCircle2,
  AlertTriangle,
  Clock,
  ArrowRight,
  BookOpen,
  Eye,
  Zap,
  Globe,
  Scale,
  Banknote,
  Briefcase,
  Search,
  ShieldCheck,
  Brain,
  Menu,
  X,
} from 'lucide-react';

// Types
type DocSection =
  | 'overview'
  | 'architecture'
  | 'modules'
  | 'ux'
  | 'technology'
  | 'data'
  | 'traceability'
  | 'status';

// Security Icon Component - the central concept
function SecurityIcon({ state }: { state: 'safe' | 'attention' | 'decision' }) {
  const colors = {
    safe: { bg: 'bg-emerald-50', border: 'border-emerald-200', icon: 'text-emerald-700', pulse: false },
    attention: { bg: 'bg-amber-50', border: 'border-amber-200', icon: 'text-amber-700', pulse: true },
    decision: { bg: 'bg-blue-50', border: 'border-blue-200', icon: 'text-blue-700', pulse: true },
  };
  const config = colors[state];

  return (
    <motion.div
      className={`relative inline-flex items-center justify-center w-20 h-20 rounded-2xl ${config.bg} border-2 ${config.border}`}
      animate={config.pulse ? { scale: [1, 1.02, 1] } : {}}
      transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
    >
      <Shield className={`w-10 h-10 ${config.icon}`} strokeWidth={1.5} />
      {state === 'decision' && (
        <span className="absolute -top-1 -right-1 w-4 h-4 bg-blue-500 rounded-full border-2 border-white" />
      )}
      {state === 'attention' && (
        <span className="absolute -top-1 -right-1 w-4 h-4 bg-amber-500 rounded-full border-2 border-white" />
      )}
    </motion.div>
  );
}

// Confidence Tag
function ConfidenceTag({ level }: { level: string }) {
  const styles: Record<string, string> = {
    FACT: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    CALCULATED: 'bg-blue-50 text-blue-700 border-blue-200',
    ESTIMATED: 'bg-amber-50 text-amber-700 border-amber-200',
    PROJECTION: 'bg-orange-50 text-orange-700 border-orange-200',
    AI_RECOMMENDATION: 'bg-purple-50 text-purple-700 border-purple-200',
    PENDING_VERIFICATION: 'bg-gray-50 text-gray-700 border-gray-200',
    UNKNOWN: 'bg-gray-100 text-gray-500 border-gray-300',
  };

  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border ${styles[level] || styles.UNKNOWN}`}>
      {level.replace(/_/g, ' ')}
    </span>
  );
}

// Tier Badge
function TierBadge({ tier }: { tier: string }) {
  const styles: Record<string, string> = {
    TIER0: 'bg-red-50 text-red-700 border-red-200',
    TIER1: 'bg-orange-50 text-orange-700 border-orange-200',
    TIER2: 'bg-blue-50 text-blue-700 border-blue-200',
    TIER3: 'bg-gray-50 text-gray-600 border-gray-200',
  };

  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border ${styles[tier]}`}>
      {tier}
    </span>
  );
}

// Status indicator
function StatusIndicator({ status }: { status: string }) {
  const config: Record<string, { color: string; label: string }> = {
    CREATED: { color: 'text-emerald-600', label: 'Creado' },
    PENDING: { color: 'text-amber-600', label: 'Pendiente' },
    BLOCKED: { color: 'text-red-600', label: 'Bloqueado' },
  };
  const c = config[status] || config.PENDING;

  return (
    <span className={`inline-flex items-center gap-1.5 text-sm ${c.color}`}>
      <span className={`w-2 h-2 rounded-full bg-current`} />
      {c.label}
    </span>
  );
}

// Navigation
const navItems: { id: DocSection; label: string; icon: React.ReactNode }[] = [
  { id: 'overview', label: 'Visión General', icon: <Eye className="w-4 h-4" /> },
  { id: 'architecture', label: 'Arquitectura', icon: <Layers className="w-4 h-4" /> },
  { id: 'modules', label: 'Módulos', icon: <BookOpen className="w-4 h-4" /> },
  { id: 'ux', label: 'UX/UI System', icon: <Palette className="w-4 h-4" /> },
  { id: 'technology', label: 'Tecnología', icon: <Cpu className="w-4 h-4" /> },
  { id: 'data', label: 'Datos & Eventos', icon: <Database className="w-4 h-4" /> },
  { id: 'traceability', label: 'Trazabilidad', icon: <Lock className="w-4 h-4" /> },
  { id: 'status', label: 'Estado Orden 0', icon: <FileText className="w-4 h-4" /> },
];

export default function App() {
  const [activeSection, setActiveSection] = useState<DocSection>('overview');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
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
                <h1 className="text-sm font-semibold text-stone-900 leading-tight">Arquitectura v1</h1>
                <p className="text-xs text-stone-500">Servicio Empresarial Europeo</p>
              </div>
            </div>
            <div className="hidden md:flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-50 border border-amber-200 text-xs font-medium text-amber-700">
                <Clock className="w-3 h-3" />
                DRAFT — Pendiente aceptación
              </span>
            </div>
            <button
              className="md:hidden p-2 rounded-lg hover:bg-stone-100"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-8">
          {/* Sidebar Navigation */}
          <nav className={`
            ${mobileMenuOpen ? 'fixed inset-0 z-40 bg-white pt-20 px-6' : 'hidden'}
            md:block md:static md:bg-transparent md:pt-0 md:px-0
            w-full md:w-56 shrink-0
          `}>
            <ul className="space-y-1">
              {navItems.map((item) => (
                <li key={item.id}>
                  <button
                    onClick={() => {
                      setActiveSection(item.id);
                      setMobileMenuOpen(false);
                    }}
                    className={`
                      w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors
                      ${activeSection === item.id
                        ? 'bg-stone-900 text-white'
                        : 'text-stone-600 hover:bg-stone-100 hover:text-stone-900'
                      }
                    `}
                  >
                    {item.icon}
                    {item.label}
                  </button>
                </li>
              ))}
            </ul>
          </nav>

          {/* Main Content */}
          <main className="flex-1 min-w-0">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeSection}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2 }}
              >
                {activeSection === 'overview' && <OverviewSection />}
                {activeSection === 'architecture' && <ArchitectureSection />}
                {activeSection === 'modules' && <ModulesSection />}
                {activeSection === 'ux' && <UXSection />}
                {activeSection === 'technology' && <TechnologySection />}
                {activeSection === 'data' && <DataSection />}
                {activeSection === 'traceability' && <TraceabilitySection />}
                {activeSection === 'status' && <StatusSection />}
              </motion.div>
            </AnimatePresence>
          </main>
        </div>
      </div>
    </div>
  );
}

// ============ SECTIONS ============

function OverviewSection() {
  return (
    <div className="space-y-12">
      {/* Hero */}
      <section className="text-center py-12">
        <div className="flex justify-center mb-8">
          <SecurityIcon state="safe" />
        </div>
        <h2 className="text-3xl sm:text-4xl font-serif text-stone-900 mb-4">
          Servicio Empresarial Europeo<br />de Seguridad y Gobierno
        </h2>
        <p className="text-lg text-stone-600 max-w-2xl mx-auto leading-relaxed">
          "Mi empresa está atendida."
        </p>
        <p className="text-sm text-stone-500 mt-4 max-w-xl mx-auto">
          Arquitectura integral diseñada para que el empresario sienta seguridad, 
          no la carga de gestionar. El sistema trabaja en silencio y solo interrumpe cuando es necesario.
        </p>
      </section>

      {/* Three temporal dimensions */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl border border-stone-200 p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-lg bg-stone-100 flex items-center justify-center">
              <Clock className="w-5 h-5 text-stone-600" />
            </div>
            <h3 className="font-semibold text-stone-900">AYER</h3>
          </div>
          <p className="text-sm text-stone-600">MEMORIA. Todo hecho registrado, trazable, verificable. La empresa recuerda.</p>
        </div>
        <div className="bg-white rounded-xl border border-stone-200 p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-lg bg-stone-100 flex items-center justify-center">
              <Eye className="w-5 h-5 text-stone-600" />
            </div>
            <h3 className="font-semibold text-stone-900">HOY</h3>
          </div>
          <p className="text-sm text-stone-600">ESTADO. Consolidación de todos los dominios. Qué es verdad ahora.</p>
        </div>
        <div className="bg-white rounded-xl border border-stone-200 p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-lg bg-stone-100 flex items-center justify-center">
              <Zap className="w-5 h-5 text-stone-600" />
            </div>
            <h3 className="font-semibold text-stone-900">MAÑANA</h3>
          </div>
          <p className="text-sm text-stone-600">ANTICIPACIÓN. Detectar antes de que sea urgente. Preparar antes de que sea necesario.</p>
        </div>
      </section>

      {/* Security cycle */}
      <section className="bg-white rounded-xl border border-stone-200 p-8">
        <h3 className="text-lg font-semibold text-stone-900 mb-6">Ciclo de Seguridad</h3>
        <div className="flex flex-wrap gap-2">
          {[
            'RECORDAR', 'COMPRENDER', 'VIGILAR', 'ANTICIPAR', 'PREPARAR',
            'DECIDIR', 'ACTUAR', 'VERIFICAR', 'DEMOSTRAR', 'CONTINUAR'
          ].map((step, i) => (
            <div key={step} className="flex items-center gap-2">
              <span className="px-3 py-1.5 bg-stone-100 rounded-lg text-sm font-medium text-stone-700">
                {step}
              </span>
              {i < 9 && <ChevronRight className="w-4 h-4 text-stone-400" />}
            </div>
          ))}
        </div>
      </section>

      {/* Principles */}
      <section className="bg-white rounded-xl border border-stone-200 p-8">
        <h3 className="text-lg font-semibold text-stone-900 mb-6">Principios Rectores</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[
            { title: 'Soberanía europea', desc: 'Datos e inferencia en jurisdicción EU' },
            { title: 'Autoridad humana', desc: 'La IA prepara. El humano decide.' },
            { title: 'Trazabilidad total', desc: 'SOURCE → EVIDENCE en cada hecho' },
            { title: 'Sin vendor lock-in', desc: 'Motores reemplazables por contrato' },
            { title: 'Anticipación silenciosa', desc: 'Trabaja sin interrumpir' },
            { title: 'Evidencia antes que afirmación', desc: 'No evidence, no claim' },
            { title: 'Sin capacidades falsas', desc: 'Toda UI requiere backend real' },
            { title: 'Seguridad como ciclo', desc: 'No es un estado, es un proceso continuo' },
          ].map((p) => (
            <div key={p.title} className="flex items-start gap-3 p-3 rounded-lg hover:bg-stone-50">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-stone-900">{p.title}</p>
                <p className="text-xs text-stone-500">{p.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

function ArchitectureSection() {
  const layers = [
    { name: 'PRESENTATION', desc: 'UX/UI System · Design Tokens · Responsive · Accesibilidad', color: 'bg-blue-50 border-blue-200' },
    { name: 'APPLICATION', desc: 'Casos de uso · Workflows · Orquestación · Autorizaciones', color: 'bg-indigo-50 border-indigo-200' },
    { name: 'DOMAIN', desc: 'Entidades · Value Objects · Reglas de negocio · Eventos', color: 'bg-violet-50 border-violet-200' },
    { name: 'ENGINE', desc: 'Intelligence · Inference · Retrieval · Document AI · Anticipation', color: 'bg-purple-50 border-purple-200' },
    { name: 'ADAPTER', desc: 'Tax · Social Security · Registry · E-Invoicing · eIDAS · Procurement', color: 'bg-fuchsia-50 border-fuchsia-200' },
    { name: 'INFRASTRUCTURE', desc: 'Storage · Queue · Events · Auth · Audit · Backup · Monitor', color: 'bg-stone-100 border-stone-300' },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-serif text-stone-900 mb-2">Capas Arquitectónicas</h2>
        <p className="text-stone-600">Separación de responsabilidades en 6 capas con contratos definidos entre ellas.</p>
      </div>

      <div className="space-y-3">
        {layers.map((layer) => (
          <div key={layer.name} className={`rounded-xl border p-5 ${layer.color}`}>
            <h4 className="font-mono text-sm font-bold text-stone-800 mb-1">{layer.name} LAYER</h4>
            <p className="text-sm text-stone-600">{layer.desc}</p>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl border border-stone-200 p-8">
        <h3 className="text-lg font-semibold text-stone-900 mb-4">Flujo de Anticipación</h3>
        <div className="flex flex-wrap items-center gap-2 text-sm">
          {['OBSERVAR', 'DETECTAR', 'COMPRENDER', 'ANTICIPAR', 'PREPARAR'].map((step, i) => (
            <div key={step} className="flex items-center gap-2">
              <span className="px-3 py-1.5 bg-stone-100 rounded-lg font-medium text-stone-700">{step}</span>
              {i < 4 && <ArrowRight className="w-4 h-4 text-stone-400" />}
            </div>
          ))}
        </div>
        <div className="mt-4 flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1.5 bg-amber-50 border border-amber-200 rounded-lg font-medium text-amber-700 text-sm">INTERRUMPIR</span>
            <span className="text-xs text-stone-500">sólo si es necesario</span>
          </div>
          <span className="text-stone-400">ó</span>
          <div className="flex items-center gap-2">
            <span className="px-3 py-1.5 bg-emerald-50 border border-emerald-200 rounded-lg font-medium text-emerald-700 text-sm">NO NECESITA HACER NADA</span>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-stone-200 p-8">
        <h3 className="text-lg font-semibold text-stone-900 mb-4">Flujo de Acción Material</h3>
        <div className="flex flex-wrap items-center gap-2 text-sm">
          {['PREPARED', 'VERIFIED', 'HUMAN_AUTHORIZATION', 'EXECUTED', 'EVIDENCED'].map((step, i) => (
            <div key={step} className="flex items-center gap-2">
              <span className={`px-3 py-1.5 rounded-lg font-medium text-sm ${
                step === 'HUMAN_AUTHORIZATION' 
                  ? 'bg-blue-50 border border-blue-200 text-blue-700' 
                  : 'bg-stone-100 text-stone-700'
              }`}>{step.replace(/_/g, ' ')}</span>
              {i < 4 && <ArrowRight className="w-4 h-4 text-stone-400" />}
            </div>
          ))}
        </div>
        <p className="mt-4 text-sm text-stone-500">
          La IA puede observar, extraer, clasificar, relacionar, detectar, anticipar, simular, preparar y recomendar.
          <strong className="text-stone-700"> No puede apropiarse de autoridad jurídica, fiscal, económica o humana.</strong>
        </p>
      </div>
    </div>
  );
}

function ModulesSection() {
  const modules = [
    {
      id: 'sbc',
      name: 'Sovereign Business Core',
      icon: <Shield className="w-5 h-5" />,
      desc: 'Identidad digital de la empresa. Memoria, estado, necesidades, reglas, decisiones, autoridad, evidencia.',
      submodules: ['Business Profile', 'Memory', 'State', 'Needs', 'Applicability', 'Rules', 'Decisions', 'Workflows', 'Authority', 'Permissions', 'Evidence', 'Black Box', 'Documents', 'Cases'],
      tier: 'TIER0',
    },
    {
      id: 'mt',
      name: 'Money & Tax',
      icon: <Banknote className="w-5 h-5" />,
      desc: 'Ciclo completo del dinero y obligaciones fiscales.',
      submodules: ['Invoicing', 'Collections', 'Payments', 'Treasury', 'Operational Accounting', 'Fiscal Engine', 'Tax Calendar', 'Tax Forecasting', 'Tax Adapters'],
      tier: 'TIER0',
    },
    {
      id: 'legal',
      name: 'Legal',
      icon: <Scale className="w-5 h-5" />,
      desc: 'Marco jurídico de la empresa.',
      submodules: ['Contracts', 'Obligations Tracker', 'Deadlines', 'Corporate', 'Laboral', 'Privacy & DPO', 'AI Compliance', 'Case Files', 'Admin Communications', 'Regulatory Change Monitor'],
      tier: 'TIER0',
    },
    {
      id: 'business',
      name: 'Business',
      icon: <Briefcase className="w-5 h-5" />,
      desc: 'Operativa empresarial.',
      submodules: ['CRM', 'Clients', 'Suppliers', 'Personnel', 'Sales', 'Procurement', 'Operations', 'Projects', 'Assets', 'Quality', 'Incidents', 'Growth'],
      tier: 'TIER1',
    },
    {
      id: 'tenders',
      name: 'Tenders Free',
      icon: <Search className="w-5 h-5" />,
      desc: 'Encontrar + Entender + Filtrar + Vigilar + Avisar = GRATIS. Siempre.',
      submodules: ['Sources', 'Search', 'Monitoring', 'Eligibility', 'Compatibility', 'Discard Explainer', 'Deadlines', 'Documentation', 'Alerts', 'Case File'],
      tier: 'TIER0',
    },
    {
      id: 'security',
      name: 'Security',
      icon: <ShieldCheck className="w-5 h-5" />,
      desc: 'Seguridad integral del sistema y de la empresa.',
      submodules: ['Identity', 'Authority Model', 'Permissions', 'Cybersecurity', 'Risk Register', 'Incident Response', 'Continuity', 'Dependencies', 'Backup & Restore', 'Evidence Store', 'Black Box'],
      tier: 'TIER0',
    },
    {
      id: 'intelligence',
      name: 'Intelligence Transversal',
      icon: <Brain className="w-5 h-5" />,
      desc: 'Motores de inteligencia que atraviesan todos los módulos.',
      submodules: ['Anticipation', 'Attention', 'Commitment', 'Absence', 'Deterioration', 'Anomaly', 'Risk', 'Opportunity', 'Forecasting', 'Learning', 'Uncertainty'],
      tier: 'TIER2',
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-serif text-stone-900 mb-2">Módulos del Sistema</h2>
        <p className="text-stone-600">7 módulos principales con sus submódulos, dependencias y clasificación por tier.</p>
      </div>

      <div className="space-y-4">
        {modules.map((mod) => (
          <div key={mod.id} className="bg-white rounded-xl border border-stone-200 p-6">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-stone-100 flex items-center justify-center text-stone-600">
                  {mod.icon}
                </div>
                <div>
                  <h3 className="font-semibold text-stone-900">{mod.name}</h3>
                  <p className="text-sm text-stone-500">{mod.desc}</p>
                </div>
              </div>
              <TierBadge tier={mod.tier} />
            </div>
            <div className="flex flex-wrap gap-1.5 mt-4">
              {mod.submodules.map((sub) => (
                <span key={sub} className="px-2 py-1 bg-stone-50 border border-stone-100 rounded text-xs text-stone-600">
                  {sub}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function UXSection() {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-serif text-stone-900 mb-2">UX/UI System</h2>
        <p className="text-stone-600">Arquitectura de experiencia centrada en el Icono de Seguridad. Sofisticación por dentro, elegancia por fuera.</p>
      </div>

      {/* Security Icon States */}
      <div className="bg-white rounded-xl border border-stone-200 p-8">
        <h3 className="text-lg font-semibold text-stone-900 mb-6">Estados del Icono de Seguridad</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="flex justify-center mb-4">
              <SecurityIcon state="safe" />
            </div>
            <h4 className="font-semibold text-emerald-700 mb-1">SEGURO</h4>
            <p className="text-sm text-stone-500">No necesita hacer nada. El sistema trabaja.</p>
          </div>
          <div className="text-center">
            <div className="flex justify-center mb-4">
              <SecurityIcon state="attention" />
            </div>
            <h4 className="font-semibold text-amber-700 mb-1">ATENCIÓN</h4>
            <p className="text-sm text-stone-500">Debe conocer algo. Posiblemente nada más.</p>
          </div>
          <div className="text-center">
            <div className="flex justify-center mb-4">
              <SecurityIcon state="decision" />
            </div>
            <h4 className="font-semibold text-blue-700 mb-1">DECISIÓN</h4>
            <p className="text-sm text-stone-500">Necesitamos su información o autoridad.</p>
          </div>
        </div>
      </div>

      {/* Design Principles */}
      <div className="bg-white rounded-xl border border-stone-200 p-8">
        <h3 className="text-lg font-semibold text-stone-900 mb-4">Principios Estéticos</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-emerald-700">✅ Buscar</h4>
            {['Espacio en blanco generoso', 'Tipografía con personalidad', 'Color como información', 'Progressive disclosure', 'Sensación de control y calma'].map((item) => (
              <p key={item} className="text-sm text-stone-600 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                {item}
              </p>
            ))}
          </div>
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-red-700">❌ Evitar</h4>
            {['Dashboard saturado', 'Estética startup genérica', 'Gamificación', 'Chatbot central', 'Alertas constantes'].map((item) => (
              <p key={item} className="text-sm text-stone-600 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-red-400" />
                {item}
              </p>
            ))}
          </div>
        </div>
      </div>

      {/* Confidence Levels */}
      <div className="bg-white rounded-xl border border-stone-200 p-8">
        <h3 className="text-lg font-semibold text-stone-900 mb-4">Niveles de Confianza de Datos</h3>
        <p className="text-sm text-stone-500 mb-4">Todo dato muestra su nivel de confianza. Nunca se presenta incertidumbre como certeza.</p>
        <div className="flex flex-wrap gap-2">
          {['FACT', 'CALCULATED', 'ESTIMATED', 'PROJECTION', 'AI_RECOMMENDATION', 'PENDING_VERIFICATION', 'UNKNOWN'].map((level) => (
            <ConfidenceTag key={level} level={level} />
          ))}
        </div>
      </div>

      {/* Navigation hierarchy */}
      <div className="bg-white rounded-xl border border-stone-200 p-8">
        <h3 className="text-lg font-semibold text-stone-900 mb-4">Jerarquía de Navegación</h3>
        <div className="space-y-3">
          {[
            { level: 0, name: 'ICONO DE SEGURIDAD', desc: 'Estado global. ¿Necesito hacer algo?' },
            { level: 1, name: 'DOMINIOS', desc: 'Mi Empresa · Dinero · Legal · Negocio · Licitaciones · Seguridad' },
            { level: 2, name: 'SUBMÓDULOS', desc: 'Dentro de cada dominio, los submódulos relevantes' },
            { level: 3, name: 'EXPEDIENTES', desc: 'Casos concretos, documentos, decisiones' },
            { level: 4, name: 'TRAZABILIDAD', desc: 'SOURCE → DATA → RULE → ... → EVIDENCE' },
          ].map((item) => (
            <div key={item.level} className="flex items-start gap-4" style={{ paddingLeft: `${item.level * 24}px` }}>
              <span className="w-6 h-6 rounded-full bg-stone-900 text-white text-xs flex items-center justify-center shrink-0 font-mono">
                {item.level}
              </span>
              <div>
                <p className="text-sm font-semibold text-stone-900">{item.name}</p>
                <p className="text-xs text-stone-500">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function TechnologySection() {
  const contracts = [
    { name: 'MODEL_PROVIDER', eval: 'NVIDIA NIM', alt: 'Ollama, Mistral', status: 'REQUIRES_CONFIGURATION' },
    { name: 'INFERENCE_ENGINE', eval: 'NVIDIA Triton', alt: 'vLLM, TGI', status: 'REQUIRES_CONFIGURATION' },
    { name: 'EMBEDDING_ENGINE', eval: 'sentence-transformers', alt: 'NV-Embed, Mistral Embed', status: 'REQUIRES_CONFIGURATION' },
    { name: 'RERANKER', eval: 'BGE-Reranker', alt: 'NV-RerankQA, Cohere', status: 'REQUIRES_CONFIGURATION' },
    { name: 'RETRIEVAL_ENGINE', eval: 'Qdrant', alt: 'pgvector, Milvus', status: 'REQUIRES_CONFIGURATION' },
    { name: 'AGENT_RUNTIME', eval: 'Custom state machine', alt: 'LangGraph, NeMo Agent', status: 'REQUIRES_IMPLEMENTATION' },
    { name: 'DOCUMENT_AI', eval: 'NVIDIA Doc AI / Unstructured', alt: 'Marker, Tesseract', status: 'REQUIRES_CONFIGURATION' },
  ];

  const approved = [
    { name: 'Database', selection: 'PostgreSQL', reason: 'Madurez, extensiones, ACID, replicación' },
    { name: 'Frontend', selection: 'React + TypeScript + Tailwind', reason: 'Ecosistema maduro, design system consistente' },
    { name: 'Object Storage', selection: 'MinIO', reason: 'S3-compatible, self-hosted, EU' },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-serif text-stone-900 mb-2">Decisiones Tecnológicas</h2>
        <p className="text-stone-600">Todos los motores de IA son reemplazables mediante contratos. Sin vendor lock-in.</p>
      </div>

      {/* Contract interfaces */}
      <div className="bg-white rounded-xl border border-stone-200 p-8">
        <h3 className="text-lg font-semibold text-stone-900 mb-2">Contratos de Motor (Reemplazables)</h3>
        <p className="text-sm text-stone-500 mb-6">Ningún módulo del dominio depende de un proveedor concreto. Todos dependen del contrato.</p>
        
        <div className="space-y-3">
          {contracts.map((c) => (
            <div key={c.name} className="border border-stone-100 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <code className="text-sm font-mono font-bold text-stone-800">{c.name}</code>
                <StatusIndicator status={c.status === 'REQUIRES_CONFIGURATION' ? 'PENDING' : 'BLOCKED'} />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                <div>
                  <span className="text-stone-500">Evaluación primaria: </span>
                  <span className="font-medium text-stone-700">{c.eval}</span>
                </div>
                <div>
                  <span className="text-stone-500">Alternativas: </span>
                  <span className="font-medium text-stone-700">{c.alt}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Approved */}
      <div className="bg-white rounded-xl border border-stone-200 p-8">
        <h3 className="text-lg font-semibold text-stone-900 mb-4">Tecnología Aprobada</h3>
        <div className="space-y-3">
          {approved.map((t) => (
            <div key={t.name} className="flex items-start gap-3 p-3 rounded-lg bg-emerald-50 border border-emerald-100">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-stone-900">{t.name}: <span className="font-normal text-stone-700">{t.selection}</span></p>
                <p className="text-xs text-stone-500">{t.reason}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* EU Adapters */}
      <div className="bg-white rounded-xl border border-stone-200 p-8">
        <h3 className="text-lg font-semibold text-stone-900 mb-2">European Adapter Framework</h3>
        <p className="text-sm text-stone-500 mb-4">Adaptadores sustituibles por país. NINGUNO está verificado actualmente.</p>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {[
            { name: 'Tax Adapters (ES/PT/FR/DE/IT)', status: 'NOT_AVAILABLE' },
            { name: 'Social Security Adapter', status: 'NOT_AVAILABLE' },
            { name: 'Business Registry Adapter', status: 'NOT_AVAILABLE' },
            { name: 'E-Invoicing (EN 16931)', status: 'NOT_AVAILABLE' },
            { name: 'Procurement / Tenders Sources', status: 'NOT_AVAILABLE' },
            { name: 'eIDAS / EUDI', status: 'NOT_AVAILABLE' },
            { name: 'Trust Services (firma, sello)', status: 'NOT_AVAILABLE' },
            { name: 'Banking (PSD2/Open Banking)', status: 'NOT_AVAILABLE' },
          ].map((a) => (
            <div key={a.name} className="flex items-center justify-between p-3 rounded-lg border border-stone-100">
              <span className="text-sm text-stone-700">{a.name}</span>
              <span className="px-2 py-0.5 bg-red-50 border border-red-200 rounded text-xs font-medium text-red-700">
                {a.status.replace(/_/g, ' ')}
              </span>
            </div>
          ))}
        </div>
        <p className="mt-4 text-xs text-stone-500 italic">
          Nota: No se asume ninguna API disponible sin comprobación directa con fuentes oficiales.
        </p>
      </div>

      {/* Reemplazabilidad */}
      <div className="bg-stone-900 rounded-xl p-8 text-white">
        <h3 className="text-lg font-semibold mb-4">Principio de Reemplazabilidad</h3>
        <pre className="text-sm font-mono text-stone-300 overflow-x-auto">
{`interface ModelProvider {
  complete(prompt: string, options: CompletionOptions): Promise<CompletionResult>;
  completeStructured<T>(prompt: string, schema: Schema): Promise<T>;
  embed(texts: string[]): Promise<number[][]>;
  rerank(query: string, documents: string[]): Promise<RerankResult[]>;
}

// Implementaciones intercambiables:
// → NvidiaNimProvider implements ModelProvider
// → OllamaProvider implements ModelProvider
// → MistralProvider implements ModelProvider
// → MockProvider implements ModelProvider (testing)`}
        </pre>
      </div>
    </div>
  );
}

function DataSection() {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-serif text-stone-900 mb-2">Modelo de Datos & Eventos</h2>
        <p className="text-stone-600">Event Sourcing. Trazabilidad total. Clasificación de confianza. Separación hecho/interpretación.</p>
      </div>

      {/* Entities */}
      <div className="bg-white rounded-xl border border-stone-200 p-8">
        <h3 className="text-lg font-semibold text-stone-900 mb-4">Entidades Principales</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[
            { name: 'BusinessEntity', desc: 'Identidad legal, fiscal, societaria', fields: 8 },
            { name: 'Fact', desc: 'Hecho registrado con fuente y confianza', fields: 10 },
            { name: 'Need', desc: 'Necesidad detectada (obligatoria, condicional, emergente)', fields: 11 },
            { name: 'Decision', desc: 'Decisión con autoridad y evidencia', fields: 10 },
            { name: 'Evidence', desc: 'Evidencia con integridad criptográfica', fields: 9 },
            { name: 'BlackBoxEntry', desc: 'Registro inmutable de interacción IA', fields: 12 },
            { name: 'Workflow', desc: 'Flujo con estados, transiciones y gates', fields: 8 },
            { name: 'Case', desc: 'Expediente que agrupa hechos y decisiones', fields: 11 },
          ].map((e) => (
            <div key={e.name} className="p-4 rounded-lg border border-stone-100 hover:border-stone-200 transition-colors">
              <code className="text-sm font-mono font-bold text-stone-800">{e.name}</code>
              <p className="text-xs text-stone-500 mt-1">{e.desc}</p>
              <p className="text-xs text-stone-400 mt-2">{e.fields} campos</p>
            </div>
          ))}
        </div>
      </div>

      {/* Events */}
      <div className="bg-white rounded-xl border border-stone-200 p-8">
        <h3 className="text-lg font-semibold text-stone-900 mb-4">Eventos del Sistema</h3>
        <p className="text-sm text-stone-500 mb-4">Todos los cambios se registran como eventos inmutables con causación y correlación.</p>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {[
            'BUSINESS_PROFILE_CREATED', 'FACT_RECORDED', 'NEED_DETECTED',
            'DECISION_PREPARED', 'DECISION_AUTHORIZED', 'INVOICE_CREATED',
            'TAX_OBLIGATION_DUE', 'CONTRACT_SIGNED', 'DEADLINE_APPROACHING',
            'TENDER_DETECTED', 'TENDER_ELIGIBLE', 'ANTICIPATION_GENERATED',
            'ANOMALY_DETECTED', 'EVIDENCE_RECORDED', 'BLACKBOX_ENTRY_CREATED',
            'AUTHORIZATION_GRANTED', 'INCIDENT_REPORTED', 'REGULATION_CHANGED',
          ].map((ev) => (
            <span key={ev} className="px-2 py-1 bg-stone-50 border border-stone-100 rounded text-xs font-mono text-stone-600">
              {ev}
            </span>
          ))}
        </div>
      </div>

      {/* Integrity chain */}
      <div className="bg-white rounded-xl border border-stone-200 p-8">
        <h3 className="text-lg font-semibold text-stone-900 mb-4">Cadena de Integridad</h3>
        <div className="bg-stone-900 rounded-lg p-4 overflow-x-auto">
          <pre className="text-sm font-mono text-stone-300">
{`Evidence[n].chainHash = SHA256(
  Evidence[n].integrityHash +
  Evidence[n].timestamp +
  Evidence[n-1].chainHash  // cadena inmutable
)

// Verificación en cualquier momento:
// 1. Recalcular hash del contenido
// 2. Verificar cadena completa hasta génesis
// 3. Si todo coincide → evidencia íntegra
// 4. Si algo falla → evidencia comprometida`}
          </pre>
        </div>
      </div>

      {/* Storage */}
      <div className="bg-white rounded-xl border border-stone-200 p-8">
        <h3 className="text-lg font-semibold text-stone-900 mb-4">Separación de Almacenamiento</h3>
        <div className="space-y-3">
          {[
            { layer: 'Transaccional', tech: 'PostgreSQL', purpose: 'Estado actual, queries' },
            { layer: 'Event Store', tech: 'PostgreSQL (domain_events)', purpose: 'Event sourcing, audit trail' },
            { layer: 'Documentos', tech: 'MinIO', purpose: 'Archivos, PDFs, imágenes' },
            { layer: 'Búsqueda vectorial', tech: 'pgvector / Qdrant', purpose: 'Embeddings para RAG' },
            { layer: 'Cache', tech: 'Redis', purpose: 'Sesiones, estado temporal' },
            { layer: 'Black Box', tech: 'Append-only + hash chain', purpose: 'Inmutabilidad verificable' },
          ].map((s) => (
            <div key={s.layer} className="flex items-center gap-4 p-3 rounded-lg border border-stone-100">
              <div className="w-28 shrink-0">
                <span className="text-xs font-semibold text-stone-500 uppercase">{s.layer}</span>
              </div>
              <code className="text-sm font-mono text-stone-800 w-48 shrink-0">{s.tech}</code>
              <span className="text-sm text-stone-500">{s.purpose}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function TraceabilitySection() {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-serif text-stone-900 mb-2">Trazabilidad & Autoridad</h2>
        <p className="text-stone-600">Toda acción material tiene trazabilidad completa. La autoridad humana es irrenunciable.</p>
      </div>

      {/* Traceability chain */}
      <div className="bg-white rounded-xl border border-stone-200 p-8">
        <h3 className="text-lg font-semibold text-stone-900 mb-4">Cadena de Trazabilidad</h3>
        <div className="flex flex-wrap items-center gap-1.5 text-sm">
          {[
            { step: 'SOURCE', desc: 'Origen' },
            { step: 'DATA', desc: 'Dato' },
            { step: 'RULE', desc: 'Regla' },
            { step: 'NEED', desc: 'Necesidad' },
            { step: 'DECISION', desc: 'Decisión' },
            { step: 'AUTHORITY', desc: 'Autoridad' },
            { step: 'ACTION', desc: 'Acción' },
            { step: 'RESULT', desc: 'Resultado' },
            { step: 'EVIDENCE', desc: 'Evidencia' },
          ].map((item, i) => (
            <div key={item.step} className="flex items-center gap-1.5">
              <div className="px-2.5 py-1.5 bg-stone-100 rounded-lg text-center">
                <span className="text-xs font-bold text-stone-800 block">{item.step}</span>
                <span className="text-[10px] text-stone-500">{item.desc}</span>
              </div>
              {i < 8 && <ChevronRight className="w-3 h-3 text-stone-400" />}
            </div>
          ))}
        </div>
      </div>

      {/* Authority model */}
      <div className="bg-white rounded-xl border border-stone-200 p-8">
        <h3 className="text-lg font-semibold text-stone-900 mb-4">Principios de Autoridad</h3>
        <div className="space-y-3">
          {[
            'La autoridad es humana — Solo personas físicas ejercen autoridad jurídica/fiscal/económica',
            'La autoridad es identificada — Cada acto identifica a la persona',
            'La autoridad es informada — No se autoriza sin información suficiente',
            'La autoridad es registrada — Todo acto genera evidencia',
            'La autoridad es delegable (con límites) — La delegación es trazable',
            'La autoridad es revocable — Se puede revocar en cualquier momento',
            'La IA NO tiene autoridad — Prepara, recomienda, analiza. No decide materialmente.',
          ].map((p) => (
            <div key={p} className="flex items-start gap-3 p-3 rounded-lg bg-stone-50">
              <Lock className="w-4 h-4 text-stone-500 shrink-0 mt-0.5" />
              <p className="text-sm text-stone-700">{p}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Authorization Gate */}
      <div className="bg-blue-50 rounded-xl border border-blue-200 p-8">
        <h3 className="text-lg font-semibold text-blue-900 mb-4">Gate de Autorización Humana</h3>
        <p className="text-sm text-blue-700 mb-4">Para toda acción material, el sistema presenta al humano:</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {[
            'Qué se va a hacer',
            'Con qué datos',
            'Qué regla aplica',
            'Qué evidencia genera',
            'Qué pasa si no se hace',
            'Plazo para decidir',
          ].map((item) => (
            <div key={item} className="flex items-center gap-2 p-2 bg-white rounded-lg border border-blue-100">
              <CheckCircle2 className="w-4 h-4 text-blue-600" />
              <span className="text-sm text-blue-800">{item}</span>
            </div>
          ))}
        </div>
        <div className="mt-4 flex items-center gap-3">
          <span className="px-3 py-1.5 bg-blue-100 rounded-lg text-sm font-medium text-blue-800">Humano AUTORIZA</span>
          <ArrowRight className="w-4 h-4 text-blue-400" />
          <span className="px-3 py-1.5 bg-blue-100 rounded-lg text-sm font-medium text-blue-800">Sistema EJECUTA</span>
          <ArrowRight className="w-4 h-4 text-blue-400" />
          <span className="px-3 py-1.5 bg-blue-100 rounded-lg text-sm font-medium text-blue-800">Sistema REGISTRA evidencia</span>
        </div>
      </div>

      {/* Matrix */}
      <div className="bg-white rounded-xl border border-stone-200 p-8">
        <h3 className="text-lg font-semibold text-stone-900 mb-4">Matriz NEED → UI (resumen)</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-stone-200">
                <th className="text-left py-2 px-3 font-semibold text-stone-700">Necesidad</th>
                <th className="text-left py-2 px-3 font-semibold text-stone-700">Módulo</th>
                <th className="text-left py-2 px-3 font-semibold text-stone-700">Autoridad</th>
                <th className="text-left py-2 px-3 font-semibold text-stone-700">UI</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {[
                { need: 'Cumplir obligación fiscal', mod: 'M&T', auth: 'Representante legal', ui: 'StatusBadge + EvidencePanel' },
                { need: 'No perder plazo legal', mod: 'Legal', auth: 'Humano lee', ui: 'DeadlineAlert' },
                { need: 'Facturar correctamente', mod: 'M&T', auth: 'Representante legal', ui: 'InvoiceRow + AuthorityGate' },
                { need: 'Encontrar licitación', mod: 'Tenders Free', auth: 'Humano decide', ui: 'TenderCard + CaseFile' },
                { need: 'Anticipar problema', mod: 'Intelligence', auth: 'Humano informado', ui: 'SecurityIcon state' },
                { need: 'Demostrar cumplimiento', mod: 'Security', auth: 'Representante legal', ui: 'EvidencePanel + Timeline' },
              ].map((row) => (
                <tr key={row.need}>
                  <td className="py-2 px-3 text-stone-700">{row.need}</td>
                  <td className="py-2 px-3"><code className="text-xs bg-stone-100 px-1.5 py-0.5 rounded">{row.mod}</code></td>
                  <td className="py-2 px-3 text-stone-600">{row.auth}</td>
                  <td className="py-2 px-3"><code className="text-xs bg-stone-100 px-1.5 py-0.5 rounded">{row.ui}</code></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function StatusSection() {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-serif text-stone-900 mb-2">Estado de la Orden 0</h2>
        <p className="text-stone-600">Informe de cumplimiento de la orden maestra.</p>
      </div>

      {/* Order status */}
      <div className="bg-white rounded-xl border border-stone-200 p-8">
        <h3 className="text-lg font-semibold text-stone-900 mb-4">ORDER_STATUS</h3>
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-amber-50 border border-amber-200 rounded-lg">
          <AlertTriangle className="w-5 h-5 text-amber-600" />
          <span className="font-semibold text-amber-800">DRAFT — Pendiente aceptación humana</span>
        </div>
      </div>

      {/* Files created */}
      <div className="bg-white rounded-xl border border-stone-200 p-8">
        <h3 className="text-lg font-semibold text-stone-900 mb-4">FILES_CREATED</h3>
        <div className="space-y-2">
          {[
            'docs/ARCHITECTURE_MASTER_V1.md',
            'docs/MODULE_MAP_V1.md',
            'docs/UX_UI_SYSTEM_V1.md',
            'docs/TECHNOLOGY_DECISIONS_V1.md',
            'docs/DATA_EVENT_MODEL_V1.md',
            'docs/TRACEABILITY_AUTHORITY_MODEL_V1.md',
          ].map((f) => (
            <div key={f} className="flex items-center gap-2 p-2 rounded-lg bg-emerald-50 border border-emerald-100">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <code className="text-sm text-stone-700">{f}</code>
            </div>
          ))}
        </div>
      </div>

      {/* Requirements */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-stone-200 p-8">
          <h3 className="text-lg font-semibold text-stone-900 mb-4">REQUIREMENTS_COVERED</h3>
          <ul className="space-y-2 text-sm text-stone-600">
            {[
              'Arquitectura funcional completa (7 módulos)',
              'European Adapter Framework',
              'Modelo de trazabilidad total',
              'Modelo de autoridad humana',
              'UX/UI System con Icono de Seguridad',
              'Technology decisions con contratos reemplazables',
              'Data & Event model con event sourcing',
              'Clasificación por tiers (TIER0-TIER3)',
              'Clasificación de confianza de datos',
              'Matriz NEED→UI',
              'Orden de construcción recomendado',
              'Flujo de anticipación silenciosa',
              'Flujo de acción material con gate humano',
              'Black Box inmutable',
              'Cadena de evidencia criptográfica',
            ].map((r) => (
              <li key={r} className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                {r}
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-white rounded-xl border border-stone-200 p-8">
          <h3 className="text-lg font-semibold text-stone-900 mb-4">REQUIREMENTS_MISSING / BLOCKERS</h3>
          <ul className="space-y-2 text-sm text-stone-600">
            {[
              'Hosting EU: REQUIRES_CONFIGURATION (decisión de negocio)',
              'Adaptadores fiscales: REQUIRES_IMPLEMENTATION (por país)',
              'Integraciones API: NOT_AVAILABLE (ninguna verificada)',
              'Certificado eIDAS: REQUIRES_EXTERNAL_SERVICE',
              'Motor IA definitivo: REQUIRES_CONFIGURATION',
              'Infraestructura GPU: REQUIRES_CONFIGURATION',
              'Volumen/certificaciones: desconocidos',
            ].map((r) => (
              <li key={r} className="flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                {r}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Key decisions */}
      <div className="bg-white rounded-xl border border-stone-200 p-8">
        <h3 className="text-lg font-semibold text-stone-900 mb-4">CONTRADICTIONS & ASSUMPTIONS</h3>
        <div className="space-y-4">
          <div>
            <h4 className="text-sm font-semibold text-stone-700 mb-2">Contradicciones encontradas:</h4>
            <p className="text-sm text-stone-600">Ninguna detectada tras revisión cruzada de los 6 documentos.</p>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-stone-700 mb-2">Suposiciones:</h4>
            <ul className="text-sm text-stone-600 space-y-1">
              <li>• La empresa opera en jurisdicción EU (al menos un estado miembro)</li>
              <li>• Existe infraestructura disponible o presupuesto para adquirirla</li>
              <li>• El empresario acepta el modelo de autoridad humana como principio</li>
              <li>• Las fuentes públicas de licitaciones son accesibles (verificar)</li>
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-stone-700 mb-2">Unknowns:</h4>
            <ul className="text-sm text-stone-600 space-y-1">
              <li>• Volumen de datos y eventos esperados</li>
              <li>• Número de usuarios concurrentes</li>
              <li>• Certificaciones requeridas (ISO, ENS, etc.)</li>
              <li>• Presupuesto de infraestructura</li>
              <li>• Plazos de implementación</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Next steps */}
      <div className="bg-stone-900 rounded-xl p-8 text-white">
        <h3 className="text-lg font-semibold mb-4">NEXT_RECOMMENDED_STEP</h3>
        <div className="space-y-3">
          <div className="flex items-start gap-3">
            <span className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center text-xs font-bold shrink-0">1</span>
            <p className="text-sm text-stone-300">Revisión humana de los 6 documentos arquitectónicos</p>
          </div>
          <div className="flex items-start gap-3">
            <span className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center text-xs font-bold shrink-0">2</span>
            <p className="text-sm text-stone-300">Decisión sobre infraestructura (hosting EU, GPU, presupuesto)</p>
          </div>
          <div className="flex items-start gap-3">
            <span className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center text-xs font-bold shrink-0">3</span>
            <p className="text-sm text-stone-300">Verificación de fuentes públicas (licitaciones, normativas)</p>
          </div>
          <div className="flex items-start gap-3">
            <span className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center text-xs font-bold shrink-0">4</span>
            <p className="text-sm text-stone-300">Orden 1: Implementación de Fase 1 (Cimientos TIER0)</p>
          </div>
        </div>
        <div className="mt-6 p-4 bg-white/10 rounded-lg">
          <p className="text-sm font-medium text-white">
            READY_FOR_HUMAN_ACCEPTANCE = <span className="text-amber-300">YES</span>
          </p>
          <p className="text-xs text-stone-400 mt-1">
            Se ha releído íntegramente la orden. No se conocen requisitos omitidos. 
            Los bloqueadores son de configuración/decisión, no de omisión arquitectónica.
          </p>
        </div>
      </div>

      {/* STOP notice */}
      <div className="border-2 border-dashed border-stone-300 rounded-xl p-8 text-center">
        <p className="text-lg font-semibold text-stone-700 mb-2">STOP</p>
        <p className="text-sm text-stone-500">
          No se implementa el servicio empresarial hasta nueva orden.<br />
          Esta presentación web es únicamente un visor de la arquitectura documentada.
        </p>
      </div>
    </div>
  );
}
