import type { HTMLAttributes, ReactNode } from 'react';
import type { SemanticColorRole } from '@neobrutalism-lab/tokens';

export interface SignalBadgeProps extends HTMLAttributes<HTMLSpanElement> {
  tone?: SemanticColorRole;
  children?: ReactNode;
}

export function SignalBadge({
  tone = 'info',
  children,
  className = '',
  role = 'status',
  'aria-label': ariaLabel,
  ...props
}: SignalBadgeProps) {
  const derivedLabel = ariaLabel ?? (typeof children === 'string' ? children : undefined);

  return (
    <span
      {...props}
      role={role}
      aria-label={derivedLabel}
      data-nb-tone={tone}
      className={`nb-signal-badge ${className}`.trim()}
    >
      {children}
    </span>
  );
}
