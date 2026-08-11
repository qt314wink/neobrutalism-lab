import type { HTMLAttributes } from 'react';
import type { PhysicalDepth } from '@neobrutalism-lab/interaction';
import type { SemanticColorRole } from '@neobrutalism-lab/tokens';

export interface SurfaceProps extends HTMLAttributes<HTMLDivElement> {
  tone?: SemanticColorRole;
  depth?: PhysicalDepth;
  outlined?: boolean;
}

export function Surface({
  tone = 'paper',
  depth = 4,
  outlined = true,
  className = '',
  ...props
}: SurfaceProps) {
  return (
    <div
      {...props}
      data-nb-tone={tone}
      data-nb-depth={depth}
      data-nb-outlined={outlined ? 'true' : 'false'}
      className={`nb-surface ${className}`.trim()}
    />
  );
}
