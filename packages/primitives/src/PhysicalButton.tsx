import { useState } from 'react';
import type { ButtonHTMLAttributes } from 'react';
import type { InteractionState, PhysicalDepth } from '@neobrutalism-lab/interaction';
import type { SemanticColorRole } from '@neobrutalism-lab/tokens';

export interface PhysicalButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  depth?: PhysicalDepth;
  selected?: boolean;
  tone?: SemanticColorRole;
  /** Deterministic visual-state override for isolation, docs, and visual regression. */
  previewState?: InteractionState;
}

export function PhysicalButton({
  depth = 4,
  selected = false,
  tone = 'action',
  previewState,
  disabled = false,
  type,
  className = '',
  onMouseEnter,
  onMouseLeave,
  onMouseDown,
  onMouseUp,
  onFocus,
  onBlur,
  onKeyDown,
  onKeyUp,
  ...props
}: PhysicalButtonProps) {
  const [interactionState, setInteractionState] = useState<InteractionState>('rest');
  const restingState: InteractionState = selected ? 'selected' : 'rest';
  const liveInteractionState = interactionState === 'rest' || interactionState === 'selected'
    ? restingState
    : interactionState;
  const state: InteractionState = disabled ? 'disabled' : (previewState ?? liveInteractionState);

  return (
    <button
      {...props}
      type={type ?? 'button'}
      disabled={disabled}
      aria-pressed={selected}
      data-nb-depth={depth}
      data-nb-state={state}
      data-nb-tone={tone}
      className={`nb-physical-button ${className}`.trim()}
      onMouseEnter={(event) => {
        if (!disabled && previewState === undefined) setInteractionState('hover');
        onMouseEnter?.(event);
      }}
      onMouseLeave={(event) => {
        if (!disabled && previewState === undefined) setInteractionState('rest');
        onMouseLeave?.(event);
      }}
      onMouseDown={(event) => {
        if (!disabled && previewState === undefined) setInteractionState('pressed');
        onMouseDown?.(event);
      }}
      onMouseUp={(event) => {
        if (!disabled && previewState === undefined) setInteractionState('hover');
        onMouseUp?.(event);
      }}
      onFocus={(event) => {
        if (!disabled && previewState === undefined) setInteractionState('focus');
        onFocus?.(event);
      }}
      onBlur={(event) => {
        if (!disabled && previewState === undefined) setInteractionState('rest');
        onBlur?.(event);
      }}
      onKeyDown={(event) => {
        if (!disabled && previewState === undefined && (event.key === 'Enter' || event.key === ' ')) {
          setInteractionState('pressed');
        }
        onKeyDown?.(event);
      }}
      onKeyUp={(event) => {
        if (!disabled && previewState === undefined && (event.key === 'Enter' || event.key === ' ')) {
          setInteractionState('focus');
        }
        onKeyUp?.(event);
      }}
    />
  );
}
