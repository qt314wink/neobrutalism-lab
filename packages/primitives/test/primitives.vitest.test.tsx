import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { PhysicalButton, SignalBadge, Surface } from '../src/index.ts';

describe('PhysicalButton', () => {
  it('is a native accessible button with governed physical state attributes', () => {
    render(<PhysicalButton depth={8}>Make signal</PhysicalButton>);
    const button = screen.getByRole('button', { name: 'Make signal' });
    expect(button.tagName).toBe('BUTTON');
    expect(button).toHaveAttribute('data-nb-depth', '8');
    expect(button).toHaveAttribute('data-nb-state', 'rest');
  });

  it('exposes selection and disabled state without relying on color', () => {
    render(<PhysicalButton selected disabled>Selected action</PhysicalButton>);
    const button = screen.getByRole('button', { name: 'Selected action' });
    expect(button).toBeDisabled();
    expect(button).toHaveAttribute('aria-pressed', 'true');
    expect(button).toHaveAttribute('data-nb-state', 'disabled');
  });
});

describe('Surface and SignalBadge', () => {
  it('preserve semantic tone as machine-readable state', () => {
    render(<Surface tone="paper" data-testid="surface"><SignalBadge tone="info">Live system</SignalBadge></Surface>);
    expect(screen.getByTestId('surface')).toHaveAttribute('data-nb-tone', 'paper');
    expect(screen.getByRole('status', { name: 'Live system' })).toHaveAttribute('data-nb-tone', 'info');
  });
});
