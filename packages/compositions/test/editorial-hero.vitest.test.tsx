import { fireEvent, render, screen, within } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { StickerLabel, MetricSlab } from '@neobrutalism-lab/patterns';
import { MetricCluster } from '@neobrutalism-lab/assemblies';
import { EditorialHero } from '../src/index.ts';

const metrics = [
  { id: 'one', label: 'Systems', value: '08', detail: 'active modules', tone: 'info' as const },
  { id: 'two', label: 'States', value: '06', detail: 'governed modes', tone: 'identity' as const },
];

describe('patterns', () => {
  it('keeps sticker identity and metric semantics machine-readable', () => {
    render(<><StickerLabel tone="attention">New rule</StickerLabel><MetricSlab label="Systems" value="08" detail="active modules" /></>);
    expect(screen.getByText('New rule')).toHaveAttribute('data-nb-pattern', 'sticker-label');
    const slab = screen.getByRole('group', { name: 'Systems' });
    expect(slab).toHaveAttribute('data-nb-pattern', 'metric-slab');
    expect(within(slab).getByText('08')).toBeInTheDocument();
    expect(within(slab).getByText('active modules')).toBeInTheDocument();
  });
});

describe('MetricCluster', () => {
  it('stacks independently identified metric slabs under one assembly boundary', () => {
    render(<MetricCluster title="System evidence" metrics={metrics} />);
    const cluster = screen.getByRole('region', { name: 'System evidence' });
    expect(cluster).toHaveAttribute('data-nb-assembly', 'metric-cluster');
    expect(within(cluster).getByRole('group', { name: 'Systems' })).toBeInTheDocument();
    expect(within(cluster).getByRole('group', { name: 'States' })).toBeInTheDocument();
  });
});

describe('EditorialHero', () => {
  it('preserves semantic title hierarchy and propagates its primary action', () => {
    const onAction = vi.fn();
    render(<EditorialHero eyebrow="Neobrutalism Lab" title="Mechanisms before pages" summary="Compose only after isolates prove themselves." primaryAction={{ label: 'Inspect system', onClick: onAction }} metrics={metrics} />);
    const hero = screen.getByRole('region', { name: 'Mechanisms before pages' });
    expect(hero).toHaveAttribute('data-nb-composition', 'editorial-hero');
    expect(within(hero).getByRole('heading', { level: 1, name: 'Mechanisms before pages' })).toBeInTheDocument();
    fireEvent.click(within(hero).getByRole('button', { name: 'Inspect system' }));
    expect(onAction).toHaveBeenCalledOnce();
    expect(within(hero).getByRole('region', { name: 'System evidence' })).toBeInTheDocument();
  });
});
