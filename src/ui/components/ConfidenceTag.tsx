/**
 * UI FOUNDATION — Confidence Tag
 * 
 * Muestra el nivel de confianza de un dato.
 * CRÍTICO: Todo dato debe mostrar su confianza. Nunca incertidumbre como certeza.
 */

import type { ConfidenceLevel as ConfidenceLevelType } from '../../domain/types';

interface ConfidenceTagProps {
  level: ConfidenceLevelType;
  className?: string;
}

const styles: Record<ConfidenceLevelType, string> = {
  FACT: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  CALCULATED: 'bg-blue-50 text-blue-700 border-blue-200',
  ESTIMATED: 'bg-amber-50 text-amber-700 border-amber-200',
  PROJECTION: 'bg-orange-50 text-orange-700 border-orange-200',
  AI_RECOMMENDATION: 'bg-purple-50 text-purple-700 border-purple-200',
  PENDING_VERIFICATION: 'bg-gray-50 text-gray-700 border-gray-200',
  UNKNOWN: 'bg-gray-100 text-gray-500 border-gray-300',
};

const labels: Record<ConfidenceLevelType, string> = {
  FACT: 'Verificado',
  CALCULATED: 'Calculado',
  ESTIMATED: 'Estimado',
  PROJECTION: 'Proyección',
  AI_RECOMMENDATION: 'Recomendación IA',
  PENDING_VERIFICATION: 'Pendiente verificación',
  UNKNOWN: 'Desconocido',
};

export function ConfidenceTag({ level, className = '' }: ConfidenceTagProps) {
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border ${styles[level]} ${className}`}
      title={`Nivel de confianza: ${labels[level]}`}
    >
      {labels[level]}
    </span>
  );
}
