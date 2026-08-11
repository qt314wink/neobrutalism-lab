import { createElement } from 'react';
import type { ButtonHTMLAttributes, HTMLAttributes, ReactNode } from 'react';
import type { SemanticColorRole } from '@neobrutalism-lab/tokens';
import type { PhysicalDepth } from '@neobrutalism-lab/interaction';

export interface PhysicalButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  depth?: PhysicalDepth;
  selected?: boolean;
}

export function PhysicalButton({ depth, selected, ...props }: PhysicalButtonProps) {
  void depth;
  void selected;
  return createElement('button', props);
}

export interface SurfaceProps extends HTMLAttributes<HTMLDivElement> {
  tone?: SemanticColorRole;
  children?: ReactNode;
}

export function Surface({ tone, ...props }: SurfaceProps) {
  void tone;
  return createElement('div', props);
}

export interface SignalBadgeProps extends HTMLAttributes<HTMLSpanElement> {
  tone?: SemanticColorRole;
  children?: ReactNode;
}

export function SignalBadge({ tone, ...props }: SignalBadgeProps) {
  void tone;
  return createElement('span', { role: 'status', ...props });
}
