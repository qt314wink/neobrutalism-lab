export const color = {
  ink: 'ink',
  paper: 'paper',
  action: 'action',
  info: 'info',
  attention: 'attention',
  identity: 'identity',
  critical: 'critical',
} as const;

export type SemanticColorRole = keyof typeof color;

export const space = {
  0: 0,
  1: 4,
  2: 8,
  3: 12,
  4: 16,
  6: 24,
  8: 32,
  12: 48,
  16: 64,
} as const;

export const border = {
  control: 2,
  structural: 3,
  emphasis: 4,
} as const;

export const shadow = {
  depth: [2, 4, 8] as const,
  base: 4,
  strong: 8,
} as const;

export const motion = {
  instant: 0,
  snap: 80,
  shove: 120,
  reveal: 180,
} as const;

export const typeScale = {
  label: '0.75rem',
  body: '1rem',
  title: '1.5rem',
  display: 'clamp(2.5rem, 8vw, 7rem)',
} as const;

export interface Dialect {
  id: string;
  color: Record<SemanticColorRole, string>;
  shadowInk: string;
}

export const dialects = {
  boldCo: {
    id: 'bold-co',
    color: {
      ink: '#000000',
      paper: '#F4F0EA',
      action: '#A2FF00',
      info: '#00E5FF',
      attention: '#FF007A',
      identity: '#FFE600',
      critical: '#FF3B30',
    },
    shadowInk: '#000000',
  },
} as const satisfies Record<string, Dialect>;

export function tokenCssVariables(dialect: Dialect): Record<string, string> {
  return {
    '--nb-color-ink': dialect.color.ink,
    '--nb-color-paper': dialect.color.paper,
    '--nb-color-action': dialect.color.action,
    '--nb-color-info': dialect.color.info,
    '--nb-color-attention': dialect.color.attention,
    '--nb-color-identity': dialect.color.identity,
    '--nb-color-critical': dialect.color.critical,
    '--nb-border-control': `${border.control}px`,
    '--nb-border-structural': `${border.structural}px`,
    '--nb-border-emphasis': `${border.emphasis}px`,
    '--nb-shadow-base': `${shadow.base}px`,
    '--nb-shadow-strong': `${shadow.strong}px`,
    '--nb-shadow-ink': dialect.shadowInk,
    '--nb-motion-snap': `${motion.snap}ms`,
    '--nb-motion-shove': `${motion.shove}ms`,
    '--nb-motion-reveal': `${motion.reveal}ms`,
  };
}
