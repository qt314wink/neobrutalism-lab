import type { SemanticColorRole } from '@neobrutalism-lab/tokens';
import { MetricSlab } from '@neobrutalism-lab/patterns';

export interface MetricItem {
  id: string;
  label: string;
  value: string;
  detail?: string;
  tone?: SemanticColorRole;
}

export interface MetricClusterProps {
  title: string;
  metrics: readonly MetricItem[];
  className?: string;
}

export function MetricCluster({ title, metrics, className = '' }: MetricClusterProps) {
  return (
    <section
      aria-label={title}
      data-nb-assembly="metric-cluster"
      className={`nb-metric-cluster ${className}`.trim()}
    >
      {metrics.map((metric) => (
        <MetricSlab
          key={metric.id}
          label={metric.label}
          value={metric.value}
          detail={metric.detail}
          tone={metric.tone}
        />
      ))}
    </section>
  );
}
