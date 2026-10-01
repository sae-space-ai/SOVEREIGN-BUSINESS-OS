/**
 * UI FOUNDATION — Base Components
 * 
 * EmptyState, ErrorBoundary, LoadingSkeleton, StatusBadge
 * 
 * Principios:
 * - Empty: Mensaje claro + acción siguiente. Sin culpa.
 * - Error: Comprensible + reintentable. No bloquea toda la UI si es parcial.
 * - Loading: Skeleton que respeta layout. No spinner genérico.
 */

import { Component, type ReactNode } from 'react';
import { AlertTriangle, Inbox, RefreshCw } from 'lucide-react';

// ============================================================================
// EMPTY STATE
// ============================================================================

interface EmptyStateProps {
  title: string;
  description: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  confidence?: 'PENDING_VERIFICATION' | 'UNKNOWN';
}

export function EmptyState({ title, description, action, confidence }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-6 text-center" role="status">
      <div className="w-16 h-16 rounded-full bg-stone-100 flex items-center justify-center mb-4">
        <Inbox className="w-8 h-8 text-stone-400" />
      </div>
      <h3 className="text-lg font-semibold text-stone-900 mb-2">{title}</h3>
      <p className="text-sm text-stone-500 max-w-sm mb-4">{description}</p>
      {confidence && (
        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border bg-gray-100 text-gray-500 border-gray-300 mb-4">
          {confidence === 'UNKNOWN' ? 'Sin datos' : 'Pendiente de verificar'}
        </span>
      )}
      {action && (
        <button
          onClick={action.onClick}
          className="px-4 py-2 bg-stone-900 text-white text-sm font-medium rounded-lg hover:bg-stone-800 transition-colors"
        >
          {action.label}
        </button>
      )}
    </div>
  );
}

// ============================================================================
// ERROR BOUNDARY
// ============================================================================

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // In production: send to error tracking service
    console.error('ErrorBoundary caught:', error, errorInfo);
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback;

      return (
        <div className="flex flex-col items-center justify-center py-12 px-6 text-center" role="alert">
          <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center mb-4">
            <AlertTriangle className="w-8 h-8 text-red-500" />
          </div>
          <h3 className="text-lg font-semibold text-stone-900 mb-2">Algo ha ido mal</h3>
          <p className="text-sm text-stone-500 max-w-sm mb-4">
            {this.state.error?.message || 'Error inesperado. Puedes intentar de nuevo.'}
          </p>
          <button
            onClick={this.handleRetry}
            className="inline-flex items-center gap-2 px-4 py-2 bg-stone-900 text-white text-sm font-medium rounded-lg hover:bg-stone-800 transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            Reintentar
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

// ============================================================================
// LOADING SKELETON
// ============================================================================

interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className = '' }: SkeletonProps) {
  return (
    <div
      className={`animate-pulse bg-stone-200 rounded ${className}`}
      aria-hidden="true"
    />
  );
}

export function LoadingState({ lines = 3 }: { lines?: number }) {
  return (
    <div className="space-y-3 p-6" role="status" aria-label="Cargando">
      {Array.from({ length: lines }).map((_, i) => (
        <div key={i} className="flex items-center gap-3">
          <Skeleton className="w-10 h-10 rounded-lg" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-3 w-1/2" />
          </div>
        </div>
      ))}
    </div>
  );
}

// ============================================================================
// STATUS BADGE
// ============================================================================

interface StatusBadgeProps {
  status: 'success' | 'warning' | 'error' | 'info' | 'neutral';
  label: string;
}

const statusStyles = {
  success: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  warning: 'bg-amber-50 text-amber-700 border-amber-200',
  error: 'bg-red-50 text-red-700 border-red-200',
  info: 'bg-blue-50 text-blue-700 border-blue-200',
  neutral: 'bg-stone-50 text-stone-700 border-stone-200',
};

export function StatusBadge({ status, label }: StatusBadgeProps) {
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border ${statusStyles[status]}`}>
      {label}
    </span>
  );
}
