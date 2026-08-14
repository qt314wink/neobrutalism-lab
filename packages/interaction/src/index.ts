export type InteractionState =
  | 'rest'
  | 'hover'
  | 'focus'
  | 'pressed'
  | 'selected'
  | 'disabled';

export type PhysicalDepth = 2 | 4 | 8;

export interface PhysicalOffsetOptions {
  reducedMotion?: boolean;
}

export interface PhysicalOffsetResolved {
  state: InteractionState;
  depth: PhysicalDepth;
  translateX: number;
  translateY: number;
  shadowX: number;
  shadowY: number;
  transitionMs: number;
  opacity: number;
}

const supportedDepths = [2, 4, 8] as const;

export function normalizePhysicalDepth(depth: number): PhysicalDepth {
  return (supportedDepths as readonly number[]).includes(depth)
    ? (depth as PhysicalDepth)
    : 4;
}

export function resolvePhysicalOffset(
  state: InteractionState,
  requestedDepth: number = 4,
  options: PhysicalOffsetOptions = {},
): PhysicalOffsetResolved {
  const depth = normalizePhysicalDepth(requestedDepth);
  const transitionMs = options.reducedMotion || state === 'disabled' ? 0 : 120;

  if (state === 'pressed') {
    return {
      state,
      depth,
      translateX: depth,
      translateY: depth,
      shadowX: 0,
      shadowY: 0,
      transitionMs,
      opacity: 1,
    };
  }

  if (state === 'hover' || state === 'focus') {
    return {
      state,
      depth,
      translateX: -2,
      translateY: -2,
      shadowX: depth + 2,
      shadowY: depth + 2,
      transitionMs,
      opacity: 1,
    };
  }

  return {
    state,
    depth,
    translateX: 0,
    translateY: 0,
    shadowX: depth,
    shadowY: depth,
    transitionMs,
    opacity: state === 'disabled' ? 0.55 : 1,
  };
}
