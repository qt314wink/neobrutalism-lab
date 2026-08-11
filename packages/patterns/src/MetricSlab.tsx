import type { ReactNode } from 'react';
import type { SemanticColorRole } from '@neobrutalism-lab/tokens';
import { SignalBadge, Surface } from '@neobrutalism-lab/primitives';

export interface MetricSlabProps {
  label: string;
  value: ReactNode;
  detail?: ReactNode;
  tone?: SemanticColorRole;
  className?: string;
}

export function MetricSlab({
  label,
  value,
  detail,
  tone = 'paper',
  className = '',
}: MetricSlabProps) {
  return (
    <Surface
      role="group"
      aria-label={label}
      tone={tone}
      data-nb-pattern="metric-slab"
      className={`nb-metric-slab ${className}`.trim()}
    >
      <SignalBadge role="term" tone="paper">{label}</SignalBadge>
      <strong className="nb-metric-slab__value">{value}</strong>
      {detail === undefined ? null : <span className="nb-metric-slab__detail">{detail}</span>}
    </Surface>
  );
}
