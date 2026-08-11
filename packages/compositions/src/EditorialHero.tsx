import type { MouseEventHandler, ReactNode } from 'react';
import type { MetricItem } from '@neobrutalism-lab/assemblies';
import { MetricCluster } from '@neobrutalism-lab/assemblies';
import { StickerLabel } from '@neobrutalism-lab/patterns';
import { PhysicalButton } from '@neobrutalism-lab/primitives';

export interface HeroAction {
  label: string;
  onClick: MouseEventHandler<HTMLButtonElement>;
}

export interface EditorialHeroProps {
  eyebrow: string;
  title: string;
  summary: string;
  primaryAction?: HeroAction;
  metrics?: readonly MetricItem[];
  metricsTitle?: string;
  mediaSlot?: ReactNode;
  afterSlot?: ReactNode;
}

export function EditorialHero({
  eyebrow,
  title,
  summary,
  primaryAction,
  metrics = [],
  metricsTitle = 'System evidence',
  mediaSlot,
  afterSlot,
}: EditorialHeroProps) {
  return (
    <section
      aria-label={title}
      data-nb-composition="editorial-hero"
      className="nb-editorial-hero"
    >
      <div className="nb-editorial-hero__copy">
        <StickerLabel tone="attention">{eyebrow}</StickerLabel>
        <h1>{title}</h1>
        <p>{summary}</p>
        {primaryAction === undefined ? null : (
          <PhysicalButton depth={8} tone="action" onClick={primaryAction.onClick}>
            {primaryAction.label}
          </PhysicalButton>
        )}
      </div>
      {mediaSlot === undefined ? null : <div className="nb-editorial-hero__media">{mediaSlot}</div>}
      {metrics.length === 0 ? null : <MetricCluster title={metricsTitle} metrics={metrics} />}
      {afterSlot === undefined ? null : <div className="nb-editorial-hero__after">{afterSlot}</div>}
    </section>
  );
}
