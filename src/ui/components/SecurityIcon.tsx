/**
 * UI FOUNDATION — Security Icon Component
 * 
 * El elemento visual central del sistema.
 * Representa: "Mi empresa está atendida."
 * 
 * Estados:
 * - SEGURO: No necesita hacer nada
 * - ATENCIÓN: Debe conocer algo
 * - DECISIÓN: Necesitamos su información/autoridad
 * 
 * NO es decoración. El estado se deriva de BusinessStateDerivation.
 */

import { motion } from 'framer-motion';
import { Shield } from 'lucide-react';
import type { BusinessState } from '../../domain/types';

interface SecurityIconProps {
  state: BusinessState;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const sizeConfig = {
  sm: { container: 'w-12 h-12', icon: 'w-6 h-6' },
  md: { container: 'w-16 h-16', icon: 'w-8 h-8' },
  lg: { container: 'w-24 h-24', icon: 'w-12 h-12' },
};

const stateConfig = {
  SEGURO: {
    bg: 'bg-emerald-50',
    border: 'border-emerald-200',
    icon: 'text-emerald-700',
    pulse: false,
    label: 'Seguro',
  },
  ATENCIÓN: {
    bg: 'bg-amber-50',
    border: 'border-amber-200',
    icon: 'text-amber-700',
    pulse: true,
    label: 'Atención',
  },
  DECISIÓN: {
    bg: 'bg-blue-50',
    border: 'border-blue-200',
    icon: 'text-blue-700',
    pulse: true,
    label: 'Decisión',
  },
};

export function SecurityIcon({ state, size = 'md', className = '' }: SecurityIconProps) {
  const sizeClass = sizeConfig[size];
  const config = stateConfig[state];

  return (
    <motion.div
      className={`relative inline-flex items-center justify-center ${sizeClass.container} rounded-2xl ${config.bg} border-2 ${config.border} ${className}`}
      animate={config.pulse ? { scale: [1, 1.02, 1] } : {}}
      transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
      role="status"
      aria-label={`Estado empresarial: ${config.label}`}
    >
      <Shield className={`${sizeClass.icon} ${config.icon}`} strokeWidth={1.5} />
      {state === 'DECISIÓN' && (
        <span className="absolute -top-1 -right-1 w-3 h-3 bg-blue-500 rounded-full border-2 border-white" />
      )}
      {state === 'ATENCIÓN' && (
        <span className="absolute -top-1 -right-1 w-3 h-3 bg-amber-500 rounded-full border-2 border-white" />
      )}
    </motion.div>
  );
}
