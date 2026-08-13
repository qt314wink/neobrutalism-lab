# Procedural Shader Type Field Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build one bounded, state-driven interactive hero specimen where semantic DOM typography and a procedural WebGL2 shader consume the same deterministic interaction state, with desktop pointer behavior, mobile scroll behavior, Vitest coverage, Cypress component coverage, Cypress E2E coverage, reduced-motion support, and graceful fallback.

**Architecture:** Keep the feature isolated under `apps/bold-co/src/features/procedural-type-field/`. Native browser input is normalized into pure typed events, a reducer owns the canonical interaction state, pure mapping functions derive typography transforms and shader uniforms, and one orchestration component applies both render paths without React rerenders on every animation frame. Use raw WebGL2 rather than adding Three.js/R3F so the specimen remains narrow, inspectable, dependency-light, and directly demonstrative of shader engineering.

**Tech Stack:** React 19, TypeScript 5.9, Vite 7, Vitest 3, Testing Library, raw WebGL2/GLSL ES 3.00, CSS custom properties, Cypress Component Testing, Cypress E2E.

## Global Constraints

- Work only in `qt314wink/neobrutalism-lab` on `feature/procedural-shader-type-field`.
- Target only `apps/bold-co`; do not restructure unrelated application code.
- One hero specimen, one semantic headline, one supporting line, one WebGL canvas, one shader family.
- Desktop primary input is pointer position + pointer velocity.
- Mobile primary input is scroll progress + scroll velocity; mobile behavior must not depend on hover.
- Optional touch disturbance may be omitted without failing Definition of Done.
- The visible headline remains semantic DOM text and remains readable in every state.
- Shader failure must never remove or block content.
- Scroll remains native; do not hijack wheel/touch scrolling.
- The renderer must not own browser input or mutate canonical interaction state.
- DOM typography and GLSL consume one canonical interaction state.
- Do not trigger React state updates on every pointer/scroll animation frame.
- `requestAnimationFrame` runs only while there is active energy, a transition to settle, a resize redraw, or a visible interaction update.
- Reduced motion disables continuous procedural motion and velocity amplification.
- Clamp interaction energy to `[0, 1]` and guarantee a deterministic route back to `REST`.
- Preserve the existing `npm run validate` contract: lint, typecheck, Vitest, build.
- Do not install Cypress until Gate 1 deterministic motion/state unit tests pass.
- Do not add a runtime shader framework dependency.
- Do not snapshot arbitrary live shader frames.
- Do not open a PR or merge to `main` until implementation and verification are complete.

---

## Locked File Structure

Create these feature files:

```text
apps/bold-co/src/features/procedural-type-field/
├── types.ts
├── math.ts
├── math.test.ts
├── state.ts
├── state.test.ts
├── mappings.ts
├── mappings.test.ts
├── capabilities.ts
├── capabilities.test.ts
├── inputDriver.ts
├── typography/
│   ├── ResponsiveTypeField.tsx
│   ├── typographyRenderer.ts
│   └── typographyRenderer.test.tsx
├── shader/
│   ├── shaderSource.ts
│   ├── createShaderRenderer.ts
│   └── createShaderRenderer.test.ts
├── ProceduralTypeField.tsx
├── ProceduralTypeField.test.tsx
├── procedural-type-field.css
└── index.ts
```

Create browser-test files only after Gate 1 passes:

```text
apps/bold-co/
├── cypress.config.ts
└── cypress/
    ├── support/
    │   ├── component.ts
    │   └── component-index.html
    ├── component/
    │   └── procedural-type-field.cy.tsx
    └── e2e/
        └── procedural-type-field.cy.ts
```

Create verification/evidence docs:

```text
docs/verification/procedural-shader-type-field-baseline.md
docs/verification/procedural-shader-type-field-final.md
docs/portfolio/procedural-shader-type-field-evidence.md
```

Modify only as required:

```text
apps/bold-co/src/screens/HomeScreen.tsx
apps/bold-co/src/test/app.test.tsx
apps/bold-co/package.json
package-lock.json
```

Do not add feature CSS to the existing 18KB `src/styles.css`; import a feature-scoped stylesheet from the feature component instead.

---

### Task 1: Gate 0 — Freeze and record the current baseline

**Files:**
- Create: `docs/verification/procedural-shader-type-field-baseline.md`

**Interfaces:**
- Consumes: existing root `npm run validate` contract.
- Produces: evidence that the branch started from a passing lint/typecheck/test/build baseline before feature code or Cypress dependencies were added.

- [ ] **Step 1: Confirm branch and clean worktree**

Run from repository root:

```bash
git branch --show-current
git status --short
```

Expected branch:

```text
feature/procedural-shader-type-field
```

Expected worktree: no uncommitted implementation changes. Existing committed spec/plan files are allowed.

- [ ] **Step 2: Install exactly the locked dependencies and run existing validation**

```bash
npm ci
npm run validate
```

Expected: lint PASS, typecheck PASS, Vitest PASS, build PASS.

If this fails before feature code exists, stop and diagnose the baseline. Do not make shader changes to hide a pre-existing failure.

- [ ] **Step 3: Write baseline evidence from actual commands**

Run:

```bash
mkdir -p docs/verification
BASE_SHA=$(git rev-parse HEAD)
NODE_VERSION=$(node --version)
NPM_VERSION=$(npm --version)
printf '# Procedural Shader Type Field — Baseline Verification\n\n- Branch: `feature/procedural-shader-type-field`\n- Baseline SHA: `%s`\n- Node: `%s`\n- npm: `%s`\n- Command: `npm ci` — PASS\n- Command: `npm run validate` — PASS\n- Feature implementation present at baseline: no\n- Cypress installed at baseline: no\n' "$BASE_SHA" "$NODE_VERSION" "$NPM_VERSION" > docs/verification/procedural-shader-type-field-baseline.md
```

- [ ] **Step 4: Commit the baseline record**

```bash
git add docs/verification/procedural-shader-type-field-baseline.md
git commit -m "test: record procedural field baseline"
```

---

### Task 2: Gate 1A — Define interaction types and deterministic normalization math

**Files:**
- Create: `apps/bold-co/src/features/procedural-type-field/types.ts`
- Create: `apps/bold-co/src/features/procedural-type-field/math.ts`
- Create: `apps/bold-co/src/features/procedural-type-field/math.test.ts`

**Interfaces:**
- Produces: `Vec2`, `InteractionMode`, `InputSource`, `QualityTier`, `InteractionState`, `SegmentAnchor`, `normalizePointer()`, `calculateVelocity()`, `calculateInfluence()`, `normalizeScrollProgress()`, `normalizeScrollVelocity()`.
- Later tasks must use these names exactly.

- [ ] **Step 1: Write the failing math tests first**

Create `math.test.ts`:

```ts
import { describe, expect, it } from 'vitest';
import {
  calculateInfluence,
  calculateVelocity,
  normalizePointer,
  normalizeScrollProgress,
  normalizeScrollVelocity,
} from './math';

describe('procedural type field math', () => {
  it('normalizes a pointer to 0..1 coordinates inside the hero rect', () => {
    const rect = { left: 100, top: 50, width: 400, height: 200 };
    expect(normalizePointer(300, 150, rect)).toEqual({ x: 0.5, y: 0.5 });
    expect(normalizePointer(-100, 500, rect)).toEqual({ x: 0, y: 1 });
  });

  it('calculates clamped normalized velocity', () => {
    const velocity = calculateVelocity({ x: 0.5, y: 0.5 }, { x: 0.7, y: 0.3 }, 100);
    expect(velocity.x).toBeCloseTo(2);
    expect(velocity.y).toBeCloseTo(-2);
    expect(calculateVelocity({ x: 0, y: 0 }, { x: 1, y: 1 }, 1)).toEqual({ x: 2.5, y: 2.5 });
  });

  it('returns smooth bounded influence', () => {
    expect(calculateInfluence({ x: 0.5, y: 0.5 }, { x: 0.5, y: 0.5, index: 0 }, 0.2)).toBe(1);
    expect(calculateInfluence({ x: 0.8, y: 0.5 }, { x: 0.5, y: 0.5, index: 0 }, 0.2)).toBe(0);
  });

  it('maps hero position to 0..1 scroll progress', () => {
    expect(normalizeScrollProgress(800, 600, 800)).toBe(0);
    expect(normalizeScrollProgress(-600, 600, 800)).toBe(1);
  });

  it('maps scroll delta to -1..1 velocity', () => {
    expect(normalizeScrollVelocity(0, 16)).toBe(0);
    expect(normalizeScrollVelocity(144, 16)).toBe(1);
    expect(normalizeScrollVelocity(-144, 16)).toBe(-1);
  });
});
```

- [ ] **Step 2: Run the focused test and verify failure**

```bash
npm run test --workspace @neobrutalism-lab/bold-co -- src/features/procedural-type-field/math.test.ts
```

Expected: FAIL because `./math` and exported types/functions do not exist.

- [ ] **Step 3: Add the locked types**

Create `types.ts`:

```ts
export type InteractionMode =
  | 'REST'
  | 'POINTER_ACTIVE'
  | 'SCROLL_ACTIVE'
  | 'TOUCH_ACTIVE'
  | 'SETTLING'
  | 'REDUCED_MOTION';

export type InputSource = 'none' | 'pointer' | 'scroll' | 'touch';
export type QualityTier = 'high' | 'medium' | 'low' | 'fallback';

export interface Vec2 {
  x: number;
  y: number;
}

export interface SegmentAnchor extends Vec2 {
  index: number;
}

export interface InteractionState {
  mode: InteractionMode;
  pointer: Vec2;
  velocity: Vec2;
  scrollProgress: number;
  scrollVelocity: number;
  energy: number;
  influenceRadius: number;
  viewportAspect: number;
  qualityTier: QualityTier;
  reducedMotion: boolean;
  activeInput: InputSource;
  timeMs: number;
  lastInputTimeMs: number;
}

export interface CapabilitySnapshot {
  webgl2: boolean;
  reducedMotion: boolean;
  qualityTier: QualityTier;
  dpr: number;
}
```

- [ ] **Step 4: Implement the deterministic math**

Create `math.ts`:

```ts
import type { SegmentAnchor, Vec2 } from './types';

export function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

export function clamp01(value: number): number {
  return clamp(value, 0, 1);
}

export function normalizePointer(
  clientX: number,
  clientY: number,
  rect: Pick<DOMRect, 'left' | 'top' | 'width' | 'height'>,
): Vec2 {
  const width = Math.max(rect.width, 1);
  const height = Math.max(rect.height, 1);
  return {
    x: clamp01((clientX - rect.left) / width),
    y: clamp01((clientY - rect.top) / height),
  };
}

export function calculateVelocity(previous: Vec2, next: Vec2, dtMs: number): Vec2 {
  const seconds = Math.max(dtMs, 16) / 1000;
  return {
    x: clamp((next.x - previous.x) / seconds, -2.5, 2.5),
    y: clamp((next.y - previous.y) / seconds, -2.5, 2.5),
  };
}

export function calculateInfluence(
  point: Vec2,
  anchor: SegmentAnchor,
  radius: number,
): number {
  const safeRadius = Math.max(radius, 0.001);
  const distance = Math.hypot(point.x - anchor.x, point.y - anchor.y);
  const t = clamp01(1 - distance / safeRadius);
  return t * t * (3 - 2 * t);
}

export function normalizeScrollProgress(
  rectTop: number,
  rectHeight: number,
  viewportHeight: number,
): number {
  return clamp01((viewportHeight - rectTop) / (viewportHeight + Math.max(rectHeight, 1)));
}

export function normalizeScrollVelocity(deltaY: number, dtMs: number): number {
  const normalized = deltaY / Math.max(dtMs, 16) / 9;
  return clamp(normalized, -1, 1);
}
```

- [ ] **Step 5: Run focused tests**

```bash
npm run test --workspace @neobrutalism-lab/bold-co -- src/features/procedural-type-field/math.test.ts
```

Expected: PASS.

- [ ] **Step 6: Commit the deterministic math contract**

```bash
git add apps/bold-co/src/features/procedural-type-field/types.ts apps/bold-co/src/features/procedural-type-field/math.ts apps/bold-co/src/features/procedural-type-field/math.test.ts
git commit -m "feat: define procedural interaction math"
```

---

### Task 3: Gate 1B — Implement the pure interaction reducer and settling model

**Files:**
- Create: `apps/bold-co/src/features/procedural-type-field/state.ts`
- Create: `apps/bold-co/src/features/procedural-type-field/state.test.ts`

**Interfaces:**
- Consumes: `InteractionState`, `Vec2`, `QualityTier` from `types.ts`; `clamp01` from `math.ts`.
- Produces: `InteractionEvent`, `createInitialInteractionState()`, `reduceInteractionState()`.

- [ ] **Step 1: Write reducer tests first**

Create `state.test.ts` with these cases:

```ts
import { describe, expect, it } from 'vitest';
import { createInitialInteractionState, reduceInteractionState } from './state';

describe('interaction state reducer', () => {
  it('starts in REST with bounded neutral values', () => {
    const state = createInitialInteractionState({ nowMs: 0, viewportAspect: 1.5, qualityTier: 'high' });
    expect(state.mode).toBe('REST');
    expect(state.pointer).toEqual({ x: 0.5, y: 0.5 });
    expect(state.energy).toBe(0);
  });

  it('enters POINTER_ACTIVE and raises bounded energy', () => {
    const start = createInitialInteractionState({ nowMs: 0, viewportAspect: 1, qualityTier: 'high' });
    const next = reduceInteractionState(start, {
      type: 'POINTER_MOVE',
      point: { x: 0.8, y: 0.2 },
      velocity: { x: 2, y: -1 },
      nowMs: 100,
    });
    expect(next.mode).toBe('POINTER_ACTIVE');
    expect(next.activeInput).toBe('pointer');
    expect(next.energy).toBeGreaterThan(0);
    expect(next.energy).toBeLessThanOrEqual(1);
  });

  it('uses scroll progress and velocity for SCROLL_ACTIVE', () => {
    const start = createInitialInteractionState({ nowMs: 0, viewportAspect: 0.6, qualityTier: 'low' });
    const next = reduceInteractionState(start, {
      type: 'SCROLL',
      progress: 0.5,
      velocity: 0.8,
      nowMs: 100,
    });
    expect(next.mode).toBe('SCROLL_ACTIVE');
    expect(next.activeInput).toBe('scroll');
    expect(next.energy).toBeGreaterThan(0.5);
  });

  it('moves from active to SETTLING and then deterministically to REST', () => {
    const start = reduceInteractionState(
      createInitialInteractionState({ nowMs: 0, viewportAspect: 1, qualityTier: 'high' }),
      { type: 'POINTER_MOVE', point: { x: 0.9, y: 0.4 }, velocity: { x: 2, y: 0 }, nowMs: 20 },
    );
    const settling = reduceInteractionState(start, { type: 'POINTER_LEAVE', nowMs: 30 });
    expect(settling.mode).toBe('SETTLING');
    let current = settling;
    for (let nowMs = 46; nowMs <= 2500; nowMs += 16) {
      current = reduceInteractionState(current, { type: 'TICK', nowMs, dtMs: 16 });
    }
    expect(current.mode).toBe('REST');
    expect(current.energy).toBe(0);
  });

  it('forces REDUCED_MOTION energy to zero', () => {
    const start = createInitialInteractionState({ nowMs: 0, viewportAspect: 1, qualityTier: 'high' });
    const reduced = reduceInteractionState(start, { type: 'SET_REDUCED_MOTION', value: true, nowMs: 5 });
    const moved = reduceInteractionState(reduced, {
      type: 'POINTER_MOVE',
      point: { x: 1, y: 1 },
      velocity: { x: 2.5, y: 2.5 },
      nowMs: 10,
    });
    expect(moved.mode).toBe('REDUCED_MOTION');
    expect(moved.energy).toBe(0);
  });
});
```

- [ ] **Step 2: Verify the tests fail**

```bash
npm run test --workspace @neobrutalism-lab/bold-co -- src/features/procedural-type-field/state.test.ts
```

Expected: FAIL because `state.ts` does not exist.

- [ ] **Step 3: Implement the reducer with explicit events**

Create `state.ts`:

```ts
import { clamp01 } from './math';
import type { InteractionState, QualityTier, Vec2 } from './types';

export type InteractionEvent =
  | { type: 'POINTER_MOVE'; point: Vec2; velocity: Vec2; nowMs: number }
  | { type: 'POINTER_LEAVE'; nowMs: number }
  | { type: 'SCROLL'; progress: number; velocity: number; nowMs: number }
  | { type: 'TOUCH_MOVE'; point: Vec2; velocity: Vec2; nowMs: number }
  | { type: 'TOUCH_END'; nowMs: number }
  | { type: 'SET_VIEWPORT'; aspect: number; nowMs: number }
  | { type: 'SET_REDUCED_MOTION'; value: boolean; nowMs: number }
  | { type: 'TICK'; nowMs: number; dtMs: number };

interface InitialStateOptions {
  nowMs: number;
  viewportAspect: number;
  qualityTier: QualityTier;
  reducedMotion?: boolean;
}

export function createInitialInteractionState(options: InitialStateOptions): InteractionState {
  const reducedMotion = options.reducedMotion ?? false;
  return {
    mode: reducedMotion ? 'REDUCED_MOTION' : 'REST',
    pointer: { x: 0.5, y: 0.5 },
    velocity: { x: 0, y: 0 },
    scrollProgress: 0,
    scrollVelocity: 0,
    energy: 0,
    influenceRadius: 0.2,
    viewportAspect: Math.max(options.viewportAspect, 0.1),
    qualityTier: options.qualityTier,
    reducedMotion,
    activeInput: 'none',
    timeMs: options.nowMs,
    lastInputTimeMs: options.nowMs,
  };
}

function settle(state: InteractionState, nowMs: number, dtMs: number): InteractionState {
  const decay = Math.exp(-Math.max(dtMs, 0) / 220);
  const energy = state.energy * decay;
  if (energy < 0.015) {
    return {
      ...state,
      mode: 'REST',
      energy: 0,
      velocity: { x: 0, y: 0 },
      scrollVelocity: 0,
      activeInput: 'none',
      timeMs: nowMs,
    };
  }
  return {
    ...state,
    mode: 'SETTLING',
    energy,
    velocity: { x: state.velocity.x * decay, y: state.velocity.y * decay },
    scrollVelocity: state.scrollVelocity * decay,
    timeMs: nowMs,
  };
}

export function reduceInteractionState(
  state: InteractionState,
  event: InteractionEvent,
): InteractionState {
  if (event.type === 'SET_REDUCED_MOTION') {
    return {
      ...state,
      reducedMotion: event.value,
      mode: event.value ? 'REDUCED_MOTION' : 'REST',
      energy: 0,
      velocity: { x: 0, y: 0 },
      scrollVelocity: 0,
      activeInput: 'none',
      timeMs: event.nowMs,
      lastInputTimeMs: event.nowMs,
    };
  }

  if (state.reducedMotion) {
    return { ...state, mode: 'REDUCED_MOTION', energy: 0, timeMs: event.nowMs };
  }

  switch (event.type) {
    case 'POINTER_MOVE': {
      const speed = Math.hypot(event.velocity.x, event.velocity.y);
      const energy = clamp01(0.18 + speed * 0.22);
      return {
        ...state,
        mode: 'POINTER_ACTIVE',
        pointer: event.point,
        velocity: event.velocity,
        energy,
        influenceRadius: 0.16 + energy * 0.16,
        activeInput: 'pointer',
        timeMs: event.nowMs,
        lastInputTimeMs: event.nowMs,
      };
    }
    case 'POINTER_LEAVE':
      return { ...state, mode: 'SETTLING', activeInput: 'none', timeMs: event.nowMs };
    case 'SCROLL': {
      const phase = Math.sin(clamp01(event.progress) * Math.PI);
      const energy = clamp01(Math.abs(event.velocity) * 0.55 + phase * 0.45);
      return {
        ...state,
        mode: 'SCROLL_ACTIVE',
        scrollProgress: clamp01(event.progress),
        scrollVelocity: event.velocity,
        energy,
        influenceRadius: 0.24 + energy * 0.08,
        activeInput: 'scroll',
        timeMs: event.nowMs,
        lastInputTimeMs: event.nowMs,
      };
    }
    case 'TOUCH_MOVE': {
      const speed = Math.hypot(event.velocity.x, event.velocity.y);
      const energy = clamp01(0.25 + speed * 0.18);
      return {
        ...state,
        mode: 'TOUCH_ACTIVE',
        pointer: event.point,
        velocity: event.velocity,
        energy,
        influenceRadius: 0.24,
        activeInput: 'touch',
        timeMs: event.nowMs,
        lastInputTimeMs: event.nowMs,
      };
    }
    case 'TOUCH_END':
      return { ...state, mode: 'SETTLING', activeInput: 'none', timeMs: event.nowMs };
    case 'SET_VIEWPORT':
      return { ...state, viewportAspect: Math.max(event.aspect, 0.1), timeMs: event.nowMs };
    case 'TICK': {
      const inactiveFor = event.nowMs - state.lastInputTimeMs;
      if (state.mode === 'REST') return { ...state, timeMs: event.nowMs };
      if (state.mode === 'SETTLING' || inactiveFor > 120) {
        return settle(state, event.nowMs, event.dtMs);
      }
      return { ...state, timeMs: event.nowMs };
    }
  }
}
```

- [ ] **Step 4: Run reducer tests, then the feature math+state suite**

```bash
npm run test --workspace @neobrutalism-lab/bold-co -- src/features/procedural-type-field/state.test.ts
npm run test --workspace @neobrutalism-lab/bold-co -- src/features/procedural-type-field
```

Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add apps/bold-co/src/features/procedural-type-field/state.ts apps/bold-co/src/features/procedural-type-field/state.test.ts
git commit -m "feat: add deterministic interaction reducer"
```

---

### Task 4: Gate 1C — Derive typography transforms and shader uniforms as pure functions

**Files:**
- Create: `apps/bold-co/src/features/procedural-type-field/mappings.ts`
- Create: `apps/bold-co/src/features/procedural-type-field/mappings.test.ts`

**Interfaces:**
- Consumes: `InteractionState`, `SegmentAnchor`, `calculateInfluence()`, `clamp()`.
- Produces: `TypographyTransform`, `ShaderUniformSnapshot`, `mapStateToTypography()`, `mapStateToUniforms()`.

- [ ] **Step 1: Write mapping tests first**

Cover these exact invariants:

```ts
import { describe, expect, it } from 'vitest';
import { createInitialInteractionState, reduceInteractionState } from './state';
import { mapStateToTypography, mapStateToUniforms } from './mappings';

const anchor = { x: 0.5, y: 0.5, index: 1 };

describe('visual mappings', () => {
  it('returns identity typography at REST', () => {
    const state = createInitialInteractionState({ nowMs: 0, viewportAspect: 1, qualityTier: 'high' });
    expect(mapStateToTypography(state, anchor)).toEqual({
      translateX: 0,
      translateY: 0,
      scaleX: 1,
      scaleY: 1,
      trackingEm: 0,
      skewDeg: 0,
    });
  });

  it('produces bounded pointer transforms', () => {
    const active = reduceInteractionState(
      createInitialInteractionState({ nowMs: 0, viewportAspect: 1, qualityTier: 'high' }),
      { type: 'POINTER_MOVE', point: { x: 0.55, y: 0.5 }, velocity: { x: 2, y: 0 }, nowMs: 16 },
    );
    const mapped = mapStateToTypography(active, anchor);
    expect(Math.abs(mapped.translateX)).toBeLessThanOrEqual(28);
    expect(Math.abs(mapped.translateY)).toBeLessThanOrEqual(18);
    expect(Math.abs(mapped.skewDeg)).toBeLessThanOrEqual(2);
    expect(mapped.scaleX).toBeLessThanOrEqual(1.06);
  });

  it('maps DOM top-left coordinates to shader bottom-left pointer coordinates', () => {
    const state = reduceInteractionState(
      createInitialInteractionState({ nowMs: 0, viewportAspect: 1, qualityTier: 'high' }),
      { type: 'POINTER_MOVE', point: { x: 0.25, y: 0.2 }, velocity: { x: 1, y: -1 }, nowMs: 1000 },
    );
    const uniforms = mapStateToUniforms(state, { width: 800, height: 600, dpr: 2 });
    expect(uniforms.pointer).toEqual([0.25, 0.8]);
    expect(uniforms.energy).toBeGreaterThan(0);
    expect(uniforms.resolution).toEqual([1600, 1200]);
  });

  it('forces visual energy to zero for reduced motion', () => {
    const state = createInitialInteractionState({ nowMs: 0, viewportAspect: 1, qualityTier: 'low', reducedMotion: true });
    expect(mapStateToTypography(state, anchor).translateX).toBe(0);
    expect(mapStateToUniforms(state, { width: 400, height: 300, dpr: 1 }).energy).toBe(0);
  });
});
```

- [ ] **Step 2: Run and verify failure**

```bash
npm run test --workspace @neobrutalism-lab/bold-co -- src/features/procedural-type-field/mappings.test.ts
```

- [ ] **Step 3: Implement the pure mappings**

Use these exact public shapes:

```ts
export interface TypographyTransform {
  translateX: number;
  translateY: number;
  scaleX: number;
  scaleY: number;
  trackingEm: number;
  skewDeg: number;
}

export interface ShaderUniformSnapshot {
  timeSeconds: number;
  resolution: [number, number];
  pointer: [number, number];
  velocity: [number, number];
  energy: number;
  scrollPhase: number;
  radius: number;
}
```

Implement `mapStateToTypography()` with the following rules:

```ts
const pointerMode = state.mode === 'POINTER_ACTIVE' || state.mode === 'TOUCH_ACTIVE';
const influence = pointerMode
  ? calculateInfluence(state.pointer, anchor, state.influenceRadius)
  : 0.72 + 0.28 * Math.sin((state.scrollProgress + anchor.index * 0.17) * Math.PI * 2);
const energy = state.reducedMotion ? 0 : state.energy;
const awayX = (anchor.x - state.pointer.x) * influence * energy * 28;
const awayY = (anchor.y - state.pointer.y) * influence * energy * 18;
const scrollWave = pointerMode ? 0 : Math.sin((state.scrollProgress * 1.6 + anchor.index * 0.21) * Math.PI * 2);
return {
  translateX: clamp(awayX + scrollWave * energy * 8 + state.velocity.x * energy * 2.5, -28, 28),
  translateY: clamp(awayY + scrollWave * energy * 5, -18, 18),
  scaleX: 1 + energy * influence * 0.05,
  scaleY: 1 - energy * influence * 0.02,
  trackingEm: energy * influence * 0.025,
  skewDeg: clamp(state.velocity.x * energy * 0.6, -2, 2),
};
```

At `REST` and `REDUCED_MOTION`, return exact identity typography.

Implement `mapStateToUniforms()` so:

```ts
resolution = [Math.max(1, Math.round(width * dpr)), Math.max(1, Math.round(height * dpr))];
pointer = [state.pointer.x, 1 - state.pointer.y];
velocity = [state.velocity.x, -state.velocity.y];
timeSeconds = state.timeMs / 1000;
energy = state.reducedMotion ? 0 : state.energy;
scrollPhase = state.scrollProgress;
radius = state.influenceRadius;
```

- [ ] **Step 4: Run the full deterministic Gate 1 suite**

```bash
npm run test --workspace @neobrutalism-lab/bold-co -- src/features/procedural-type-field/math.test.ts src/features/procedural-type-field/state.test.ts src/features/procedural-type-field/mappings.test.ts
npm run typecheck --workspace @neobrutalism-lab/bold-co
```

Expected: PASS.

**Gate 1 is now satisfied. Cypress may be installed only after this point.**

- [ ] **Step 5: Commit**

```bash
git add apps/bold-co/src/features/procedural-type-field/mappings.ts apps/bold-co/src/features/procedural-type-field/mappings.test.ts
git commit -m "feat: map interaction state to visual parameters"
```

---

### Task 5: Gate 2 — Build semantic typography as an isolated renderer

**Files:**
- Create: `apps/bold-co/src/features/procedural-type-field/typography/ResponsiveTypeField.tsx`
- Create: `apps/bold-co/src/features/procedural-type-field/typography/typographyRenderer.ts`
- Create: `apps/bold-co/src/features/procedural-type-field/typography/typographyRenderer.test.tsx`
- Create: `apps/bold-co/src/features/procedural-type-field/procedural-type-field.css`

**Interfaces:**
- Produces: `ResponsiveTypeField`, `measureSegmentAnchors()`, `applyTypographyState()`.
- `ResponsiveTypeField` renders semantic text only. It does not read pointer, scroll, or shader state.

- [ ] **Step 1: Write the semantic renderer test first**

Test that:

```tsx
render(
  <ResponsiveTypeField
    id="home-title"
    segments={['WE BUILD', 'UNAPOLOGETIC', 'DIGITAL', 'EXPERIENCES.']}
    accentIndex={2}
    subheading="We reject generic template sameness."
  />,
);
expect(screen.getByRole('heading', { name: /WE BUILD UNAPOLOGETIC DIGITAL EXPERIENCES/i })).toBeInTheDocument();
expect(screen.getAllByTestId('ptf-segment')).toHaveLength(4);
expect(screen.getByText(/We reject generic template sameness/i)).toBeInTheDocument();
```

Also test `applyTypographyState()` by mocking segment/root `getBoundingClientRect()` values, calling `measureSegmentAnchors()`, applying a synthetic pointer-active state, and asserting CSS variables are written to segment style.

- [ ] **Step 2: Run and verify failure**

```bash
npm run test --workspace @neobrutalism-lab/bold-co -- src/features/procedural-type-field/typography/typographyRenderer.test.tsx
```

- [ ] **Step 3: Implement the semantic component**

Use this DOM contract:

```tsx
interface ResponsiveTypeFieldProps {
  id: string;
  segments: readonly string[];
  accentIndex?: number;
  subheading: string;
}

export function ResponsiveTypeField({ id, segments, accentIndex, subheading }: ResponsiveTypeFieldProps) {
  return (
    <div className="ptf-copy" data-cy="ptf-copy">
      <h1 id={id} className="ptf-heading" data-cy="ptf-heading">
        {segments.map((segment, index) => (
          <span
            key={`${segment}-${index}`}
            className={index === accentIndex ? 'ptf-segment ptf-segment--accent' : 'ptf-segment'}
            data-ptf-segment
            data-ptf-index={index}
            data-testid="ptf-segment"
          >
            {segment}
          </span>
        ))}
      </h1>
      <p className="ptf-subheading">{subheading}</p>
    </div>
  );
}
```

- [ ] **Step 4: Implement measurement and imperative transforms**

`measureSegmentAnchors(root)` must normalize each segment center relative to the root rect and return one `SegmentAnchor` per `[data-ptf-segment]`.

`applyTypographyState(root, state, anchors)` must call `mapStateToTypography()` for every segment and set only these CSS variables:

```text
--ptf-x
--ptf-y
--ptf-scale-x
--ptf-scale-y
--ptf-track
--ptf-skew
```

Use values with explicit units, for example `12.4px`, `0.011em`, `1.2deg`.

- [ ] **Step 5: Add feature-scoped CSS**

Use this baseline, then tune only within the approved bounds:

```css
.ptf-root{position:relative;isolation:isolate;min-height:320px;display:grid;align-items:center;overflow:hidden}
.ptf-canvas{position:absolute;inset:0;width:100%;height:100%;z-index:-1;pointer-events:none}
.ptf-copy{position:relative;z-index:1}
.ptf-heading{margin:18px 0;display:flex;flex-wrap:wrap;gap:.08em .18em;max-width:850px;font-size:clamp(40px,6vw,74px);line-height:.95;letter-spacing:-.05em;font-weight:900}
.ptf-segment{display:inline-block;transform:translate3d(var(--ptf-x,0px),var(--ptf-y,0px),0) scaleX(var(--ptf-scale-x,1)) scaleY(var(--ptf-scale-y,1)) skewX(var(--ptf-skew,0deg));letter-spacing:var(--ptf-track,0em);transform-origin:center;will-change:transform;backface-visibility:hidden}
.ptf-segment--accent{background:var(--lime);border:2px solid #000;padding:0 .15em}
.ptf-subheading{max-width:730px;font-size:18px;line-height:1.55;font-weight:600;color:#333}
.ptf-diagnostic{position:absolute;right:10px;bottom:10px;z-index:3;margin:0;padding:8px;background:#000;color:var(--lime);font:700 10px/1.45 'JetBrains Mono',monospace;pointer-events:none}
@media (max-width:700px){.ptf-root{min-height:360px}.ptf-heading{font-size:clamp(38px,13vw,64px);gap:.04em .12em}.ptf-subheading{font-size:16px}}
@media (prefers-reduced-motion:reduce){.ptf-segment{will-change:auto;transform:none!important;letter-spacing:0!important}}
```

- [ ] **Step 6: Verify Gate 2**

```bash
npm run test --workspace @neobrutalism-lab/bold-co -- src/features/procedural-type-field/typography/typographyRenderer.test.tsx
npm run typecheck --workspace @neobrutalism-lab/bold-co
```

Expected: semantic heading PASS, synthetic excited transform PASS, identity reduced/rest state PASS.

- [ ] **Step 7: Commit**

```bash
git add apps/bold-co/src/features/procedural-type-field/typography apps/bold-co/src/features/procedural-type-field/procedural-type-field.css
git commit -m "feat: add responsive procedural typography isolate"
```

---

### Task 6: Gate 3 — Build the raw WebGL2 shader isolate and fallback contract

**Files:**
- Create: `apps/bold-co/src/features/procedural-type-field/capabilities.ts`
- Create: `apps/bold-co/src/features/procedural-type-field/capabilities.test.ts`
- Create: `apps/bold-co/src/features/procedural-type-field/shader/shaderSource.ts`
- Create: `apps/bold-co/src/features/procedural-type-field/shader/createShaderRenderer.ts`
- Create: `apps/bold-co/src/features/procedural-type-field/shader/createShaderRenderer.test.ts`

**Interfaces:**
- Produces: `detectCapabilities()`, `ShaderRenderer`, `createShaderRenderer()`.
- `ShaderRenderer` signature:

```ts
export interface ShaderRenderer {
  resize(widthCssPx: number, heightCssPx: number, dpr: number): void;
  draw(uniforms: ShaderUniformSnapshot): void;
  dispose(): void;
}
```

- [ ] **Step 1: Write capability/fallback tests first**

Test:

```ts
expect(detectQualityTier({ width: 390, dpr: 3, reducedMotion: false })).toBe('low');
expect(detectQualityTier({ width: 1280, dpr: 1, reducedMotion: false })).toBe('high');
expect(detectQualityTier({ width: 1280, dpr: 1, reducedMotion: true })).toBe('low');
```

Also test `createShaderRenderer(canvas, capability)` returns `null` when `canvas.getContext('webgl2')` returns `null` and does not throw.

- [ ] **Step 2: Implement deterministic capability selection**

Rules:

```ts
export function clampDpr(dpr: number, tier: QualityTier): number {
  if (tier === 'high') return Math.min(Math.max(dpr, 1), 2);
  if (tier === 'medium') return Math.min(Math.max(dpr, 1), 1.5);
  return 1;
}

export function detectQualityTier(input: { width: number; dpr: number; reducedMotion: boolean }): QualityTier {
  if (input.reducedMotion) return 'low';
  if (input.width >= 1024 && input.dpr <= 2.5) return 'high';
  if (input.width >= 640) return 'medium';
  return 'low';
}
```

`detectCapabilities(canvas, win)` must read `matchMedia('(prefers-reduced-motion: reduce)')`, `devicePixelRatio`, viewport width, and `Boolean(canvas.getContext('webgl2'))`. If no WebGL2 context exists, force `qualityTier: 'fallback'` and `dpr: 1`.

- [ ] **Step 3: Add a full-screen-triangle WebGL2 vertex shader**

`shaderSource.ts` vertex source:

```glsl
#version 300 es
precision highp float;
out vec2 vUv;
const vec2 positions[3] = vec2[](
  vec2(-1.0, -1.0),
  vec2(3.0, -1.0),
  vec2(-1.0, 3.0)
);
void main(){
  vec2 position = positions[gl_VertexID];
  vUv = position * 0.5 + 0.5;
  gl_Position = vec4(position, 0.0, 1.0);
}
```

- [ ] **Step 4: Add the single approved Chromatic Flow Displacement fragment shader**

Use one low-frequency value-noise field, one local radial field, directional velocity flow, and restrained chromatic separation. Keep the REST shader nearly still.

```glsl
#version 300 es
precision highp float;
in vec2 vUv;
out vec4 outColor;
uniform vec2 u_resolution;
uniform vec2 u_pointer;
uniform vec2 u_velocity;
uniform float u_time;
uniform float u_energy;
uniform float u_scrollPhase;
uniform float u_radius;

float hash(vec2 p){
  return fract(sin(dot(p,vec2(127.1,311.7))) * 43758.5453123);
}
float noise(vec2 p){
  vec2 i=floor(p);vec2 f=fract(p);f=f*f*(3.0-2.0*f);
  return mix(mix(hash(i),hash(i+vec2(1.0,0.0)),f.x),mix(hash(i+vec2(0.0,1.0)),hash(i+vec2(1.0,1.0)),f.x),f.y);
}
void main(){
  vec2 uv=vUv;
  vec2 delta=uv-u_pointer;
  float distanceToPointer=length(delta);
  float field=1.0-smoothstep(u_radius,u_radius*1.8,distanceToPointer);
  vec2 direction=normalize(delta+vec2(0.0001));
  vec2 flow=direction*field*u_energy*0.035+u_velocity*0.006*u_energy;
  vec2 warped=uv+flow;
  float n=noise(warped*2.2+vec2(u_time*0.035,u_scrollPhase*0.35));
  float phase=sin((warped.x+warped.y+u_scrollPhase)*6.2831853+n*1.2);
  vec3 paper=vec3(0.956,0.941,0.918);
  vec3 cyan=vec3(0.0,0.898,1.0);
  vec3 pink=vec3(1.0,0.0,0.478);
  vec3 lime=vec3(0.635,1.0,0.0);
  float split=u_energy*field*0.09;
  vec3 color=paper;
  color+=cyan*max(phase,0.0)*split;
  color+=pink*max(-phase,0.0)*split;
  color=mix(color,lime,field*u_energy*0.12);
  float grain=(n-0.5)*0.025*u_energy;
  outColor=vec4(clamp(color+grain,0.0,1.0),1.0);
}
```

- [ ] **Step 5: Implement the renderer with compile/link failure fallback**

`createShaderRenderer()` must:

1. call `canvas.getContext('webgl2', { alpha: true, antialias: false, powerPreference: 'high-performance' })`;
2. return `null` if the context is unavailable;
3. compile vertex/fragment shaders;
4. if compile or link fails, delete created GL resources and return `null` rather than throwing into React;
5. cache uniform locations once;
6. call `gl.drawArrays(gl.TRIANGLES, 0, 3)` in `draw()`;
7. resize the backing buffer only when dimensions change;
8. `dispose()` program/shader resources.

Do not allocate arrays or create programs inside `draw()`.

- [ ] **Step 6: Verify Gate 3**

```bash
npm run test --workspace @neobrutalism-lab/bold-co -- src/features/procedural-type-field/capabilities.test.ts src/features/procedural-type-field/shader/createShaderRenderer.test.ts
npm run typecheck --workspace @neobrutalism-lab/bold-co
```

Expected: fallback PASS, capability tier PASS, no shader exception in jsdom fallback path.

- [ ] **Step 7: Commit**

```bash
git add apps/bold-co/src/features/procedural-type-field/capabilities.ts apps/bold-co/src/features/procedural-type-field/capabilities.test.ts apps/bold-co/src/features/procedural-type-field/shader
git commit -m "feat: add bounded WebGL2 shader renderer"
```

---

### Task 7: Gate 4 — Bind native input to one canonical state and integrate the specimen into HomeScreen

**Files:**
- Create: `apps/bold-co/src/features/procedural-type-field/inputDriver.ts`
- Create: `apps/bold-co/src/features/procedural-type-field/ProceduralTypeField.tsx`
- Create: `apps/bold-co/src/features/procedural-type-field/ProceduralTypeField.test.tsx`
- Create: `apps/bold-co/src/features/procedural-type-field/index.ts`
- Modify: `apps/bold-co/src/screens/HomeScreen.tsx`
- Modify: `apps/bold-co/src/test/app.test.tsx` only if the existing heading query requires normalization; do not weaken existing application behavior tests.

**Interfaces:**
- `bindInteractionInputs(root, dispatch, now?) => cleanup` owns browser event normalization only.
- `ProceduralTypeField` owns the state ref, one frame scheduler, resize/visibility lifecycle, typography application, shader draw, and diagnostic dataset.
- Neither renderer may install its own input listeners.

- [ ] **Step 1: Write the orchestrator tests first**

Required Vitest/Testing Library cases:

```tsx
render(<ProceduralTypeField id="home-title" segments={['WE BUILD','UNAPOLOGETIC','DIGITAL','EXPERIENCES.']} accentIndex={2} subheading="Test copy" diagnostic capabilitiesOverride={{ webgl2:false,reducedMotion:false,qualityTier:'fallback',dpr:1 }} />);
expect(screen.getByRole('heading',{name:/WE BUILD UNAPOLOGETIC DIGITAL EXPERIENCES/i})).toBeInTheDocument();
expect(screen.getByTestId('ptf-root')).toHaveAttribute('data-shader-status','fallback');
```

Also dispatch a pointer move through `fireEvent.pointerMove(root,{clientX:100,clientY:100,pointerType:'mouse'})` after mocking `getBoundingClientRect()` and assert `data-motion-mode="POINTER_ACTIVE"` without asserting a React rerender count.

Reduced motion case must assert `data-motion-mode="REDUCED_MOTION"` and `data-motion-energy="0.000"` after pointer input.

- [ ] **Step 2: Implement `bindInteractionInputs()`**

The driver must keep `previousPoint`, `previousPointerTime`, `previousScrollY`, and `previousScrollTime` inside its closure. It must:

- listen for `pointermove` and `pointerleave` on the root;
- ignore pointer moves whose `pointerType === 'touch'` in v1;
- listen for passive `scroll` on `window`;
- calculate scroll progress from the root rect and `window.innerHeight`;
- dispatch only typed reducer events;
- return one cleanup function that removes all listeners.

No renderer imports are allowed in `inputDriver.ts`.

- [ ] **Step 3: Implement the orchestration component with a mutable state ref, not per-frame React state**

Public props:

```ts
interface ProceduralTypeFieldProps {
  id: string;
  segments: readonly string[];
  accentIndex?: number;
  subheading: string;
  diagnostic?: boolean;
  capabilitiesOverride?: CapabilitySnapshot;
}
```

Required orchestration sequence inside one mount effect:

```text
canvas/root refs available
→ detect/override capabilities
→ create initial state
→ create shader renderer or mark fallback
→ measure segment anchors
→ bind inputs to dispatch(event)
→ ResizeObserver updates viewport/aspect, anchors, canvas backing size
→ IntersectionObserver controls visibleRef
→ dispatch(event) mutates stateRef through reducer and schedules frame
→ frame dispatches TICK, applies typography, maps/draws uniforms, writes diagnostics
→ keep scheduling only while state is not REST and not REDUCED_MOTION
→ cleanup RAF, observers, input listeners, shader resources
```

Diagnostic attributes written imperatively to the root on each visual update:

```text
data-motion-mode
data-motion-energy
data-active-input
data-scroll-progress
data-viewport-aspect
data-quality-tier
data-shader-status
```

Format numeric attributes with three decimals so Cypress can assert them deterministically.

- [ ] **Step 4: Add the decorative canvas and semantic copy**

Root DOM contract:

```tsx
<section ref={rootRef} className="ptf-root" data-testid="ptf-root" data-cy="ptf-root" aria-labelledby={id}>
  <canvas ref={canvasRef} className="ptf-canvas" data-cy="ptf-canvas" aria-hidden="true" />
  <ResponsiveTypeField id={id} segments={segments} accentIndex={accentIndex} subheading={subheading} />
  {diagnostic ? <pre className="ptf-diagnostic" data-cy="ptf-diagnostic" aria-hidden="true" /> : null}
</section>
```

No essential content belongs in the canvas or diagnostic overlay.

- [ ] **Step 5: Integrate into the existing HomeScreen without changing the page information architecture**

Keep the existing `.hero-grid`, `.hero-panel`, status chip, actions, metric stack, services, and CTA. Replace only the existing `<h1>` + hero paragraph block with:

```tsx
<ProceduralTypeField
  id="home-title"
  segments={['WE BUILD', 'UNAPOLOGETIC', 'DIGITAL', 'EXPERIENCES.']}
  accentIndex={2}
  subheading="We reject generic template sameness. BOLD_CO constructs high-impact, physical-feeling interfaces that behave like objects instead of decorative glass."
/>
```

Preserve the accessible headline text expected by `app.test.tsx`.

- [ ] **Step 6: Run Gate 4 verification**

```bash
npm run test --workspace @neobrutalism-lab/bold-co -- src/features/procedural-type-field/ProceduralTypeField.test.tsx src/test/app.test.tsx
npm run typecheck --workspace @neobrutalism-lab/bold-co
npm run lint --workspace @neobrutalism-lab/bold-co
npm run build --workspace @neobrutalism-lab/bold-co
```

Expected: PASS. Verify manually that pointer movement does not trigger page scroll, and page scroll remains native.

- [ ] **Step 7: Commit**

```bash
git add apps/bold-co/src/features/procedural-type-field/inputDriver.ts apps/bold-co/src/features/procedural-type-field/ProceduralTypeField.tsx apps/bold-co/src/features/procedural-type-field/ProceduralTypeField.test.tsx apps/bold-co/src/features/procedural-type-field/index.ts apps/bold-co/src/screens/HomeScreen.tsx apps/bold-co/src/test/app.test.tsx
git commit -m "feat: integrate shared procedural interaction field"
```

---

### Task 8: Gate 5 — Add Cypress after the deterministic layer is proven

**Files:**
- Modify: `apps/bold-co/package.json`
- Modify: `package-lock.json`
- Create: `apps/bold-co/cypress.config.ts`
- Create: `apps/bold-co/cypress/support/component.ts`
- Create: `apps/bold-co/cypress/support/component-index.html`
- Create: `apps/bold-co/cypress/component/procedural-type-field.cy.tsx`

**Interfaces:**
- Consumes: production `ProceduralTypeField` public props and diagnostic data attributes.
- Produces: real-browser component verification using React 19 + Vite 7, which current Cypress Component Testing supports.

- [ ] **Step 1: Install browser-test dependencies only now**

From repository root:

```bash
npm install --workspace @neobrutalism-lab/bold-co --save-dev cypress start-server-and-test
```

Do not install `@cypress/vite-dev-server`; current Cypress bundles the Vite component dev-server integration.

- [ ] **Step 2: Add package scripts**

Add to `apps/bold-co/package.json`:

```json
"preview:test": "npm run build && vite preview --host 127.0.0.1 --port 4173",
"cy:open": "cypress open",
"cy:component": "cypress run --component --browser chrome",
"cy:e2e:run": "cypress run --e2e --browser chrome",
"cy:e2e": "start-server-and-test preview:test http://127.0.0.1:4173 cy:e2e:run",
"test:browser": "npm run cy:component && npm run cy:e2e"
```

Do not replace the existing `test: "vitest run"` script.

- [ ] **Step 3: Configure Cypress for both Component and E2E**

Create `cypress.config.ts`:

```ts
import { defineConfig } from 'cypress';

export default defineConfig({
  component: {
    devServer: { framework: 'react', bundler: 'vite' },
    specPattern: 'cypress/component/**/*.cy.tsx',
    supportFile: 'cypress/support/component.ts',
  },
  e2e: {
    baseUrl: 'http://127.0.0.1:4173',
    specPattern: 'cypress/e2e/**/*.cy.ts',
    supportFile: false,
    viewportWidth: 1280,
    viewportHeight: 800,
  },
});
```

Create `component.ts`:

```ts
import { mount } from 'cypress/react';
import '../../src/styles.css';
import '../../src/features/procedural-type-field/procedural-type-field.css';

Cypress.Commands.add('mount', mount);

declare global {
  namespace Cypress {
    interface Chainable {
      mount: typeof mount;
    }
  }
}

export {};
```

Create `component-index.html` with a standard HTML document containing `<div data-cy-root></div>` as Cypress's mount root.

- [ ] **Step 4: Write component tests around observable behavior, not internal reducer calls**

Required cases:

```tsx
cy.mount(<ProceduralTypeField id="test-title" segments={['STATE','DRIVES','FORM']} accentIndex={1} subheading="One source of truth." diagnostic capabilitiesOverride={{webgl2:false,reducedMotion:false,qualityTier:'fallback',dpr:1}} />);
cy.get('[data-cy=ptf-heading]').should('contain.text','STATE').and('contain.text','FORM');
cy.get('[data-cy=ptf-root]').should('have.attr','data-shader-status','fallback');
```

Pointer case:

```ts
cy.get('[data-cy=ptf-root]').then(($root) => {
  const rect = $root[0].getBoundingClientRect();
  cy.wrap($root).trigger('pointermove', {
    pointerType: 'mouse',
    clientX: rect.left + rect.width * 0.75,
    clientY: rect.top + rect.height * 0.35,
  });
});
cy.get('[data-cy=ptf-root]').should('have.attr','data-motion-mode','POINTER_ACTIVE');
cy.get('[data-cy=ptf-root]').invoke('attr','data-motion-energy').then((value) => {
  expect(Number(value)).to.be.greaterThan(0);
});
```

Pointer leave must eventually reach `REST` using Cypress retry assertions, not `cy.wait()`.

Reduced-motion override must remain `REDUCED_MOTION` with energy `0.000` after pointer input.

Resize must change `data-viewport-aspect` after `cy.viewport(390, 844)`.

- [ ] **Step 5: Run Cypress Component Testing headlessly**

```bash
npm run cy:component --workspace @neobrutalism-lab/bold-co
```

Expected: all component specs PASS in a real browser.

- [ ] **Step 6: Commit**

```bash
git add apps/bold-co/package.json package-lock.json apps/bold-co/cypress.config.ts apps/bold-co/cypress/support apps/bold-co/cypress/component
git commit -m "test: add Cypress component verification"
```

---

### Task 9: Gates 6–7 — Verify mobile scroll behavior and full-page E2E interaction

**Files:**
- Create: `apps/bold-co/cypress/e2e/procedural-type-field.cy.ts`
- Modify: `apps/bold-co/src/features/procedural-type-field/ProceduralTypeField.tsx` only if E2E exposes a real behavior defect.
- Modify: `apps/bold-co/src/features/procedural-type-field/inputDriver.ts` only if E2E exposes a real normalization defect.

**Interfaces:**
- Consumes: deployed app shell, native document scrolling, diagnostic attributes.
- Produces: proof of desktop pointer lifecycle, mobile scroll lifecycle, no horizontal overflow, reduced-motion safety, and preserved navigation.

- [ ] **Step 1: Write the desktop E2E flow**

Test:

```text
visit /
→ root starts REST or REDUCED_MOTION according to environment
→ pointer move over hero
→ POINTER_ACTIVE + energy > 0
→ pointerleave
→ SETTLING
→ eventually REST through retry assertion
```

Use `.trigger('pointermove', { pointerType: 'mouse', clientX, clientY })` and `.trigger('pointerleave')`. Do not use arbitrary sleeps.

- [ ] **Step 2: Write the mobile scroll flow at 390×844**

Test:

```ts
cy.viewport(390, 844);
cy.visit('/');
cy.get('[data-cy=ptf-root]').should('exist');
cy.scrollTo(0, 420);
cy.get('[data-cy=ptf-root]').should(($root) => {
  expect(['SCROLL_ACTIVE','SETTLING']).to.include($root.attr('data-motion-mode'));
  expect(Number($root.attr('data-motion-energy'))).to.be.greaterThan(0);
});
```

Then scroll beyond the hero and use retry assertions until energy returns near zero / mode returns `REST`. Do not prevent native scroll events in application code.

- [ ] **Step 3: Verify layout and navigation invariants**

In the same mobile test:

```ts
cy.document().then((doc) => {
  expect(doc.documentElement.scrollWidth).to.be.at.most(doc.documentElement.clientWidth);
});
```

Then click one existing navigation button and assert the destination heading renders, proving the effect has not trapped input or broken navigation.

- [ ] **Step 4: Verify reduced-motion behavior in a full browser page**

Visit with `matchMedia` overridden in `onBeforeLoad` so queries containing `prefers-reduced-motion` return `matches: true`. Assert:

```text
data-motion-mode = REDUCED_MOTION
data-motion-energy = 0.000
headline remains visible
navigation remains operable
```

- [ ] **Step 5: Run E2E**

```bash
npm run cy:e2e --workspace @neobrutalism-lab/bold-co
```

Expected: PASS without arbitrary waits and without uncaught browser exceptions.

- [ ] **Step 6: Commit**

```bash
git add apps/bold-co/cypress/e2e/procedural-type-field.cy.ts apps/bold-co/src/features/procedural-type-field/ProceduralTypeField.tsx apps/bold-co/src/features/procedural-type-field/inputDriver.ts
git commit -m "test: verify responsive procedural interaction e2e"
```

---

### Task 10: Gate 8 — Performance, lifecycle, fallback, and accessibility verification

**Files:**
- Modify: feature files only where a failing verification proves a defect.
- Create: `docs/verification/procedural-shader-type-field-final.md`

**Interfaces:**
- Produces: final evidence that runtime behavior honors the approved invariants.

- [ ] **Step 1: Verify frame-loop lifecycle manually and with diagnostics**

In development diagnostic mode, confirm:

```text
REST → no continuously scheduled RAF after the final resting redraw
POINTER_ACTIVE / SCROLL_ACTIVE / SETTLING → RAF active
hero offscreen → RAF cancelled/suspended
hero re-enters viewport → one redraw scheduled
REDUCED_MOTION → no continuous RAF
```

Implementation must use `IntersectionObserver` for visibility and `ResizeObserver` for measurements/resolution rather than polling layout every frame.

- [ ] **Step 2: Verify DPR limits**

Assert capability rules in unit tests:

```text
high tier max DPR = 2
medium tier max DPR = 1.5
low/fallback DPR = 1
```

Canvas backing width/height must equal rounded CSS dimensions × clamped DPR.

- [ ] **Step 3: Verify no essential accessibility is shader-dependent**

Run the app with `capabilitiesOverride.webgl2 = false` in component tests and assert:

- semantic `h1` remains;
- subheading remains;
- actions/navigation remain outside and usable;
- canvas is `aria-hidden="true"`;
- diagnostic overlay is `aria-hidden="true"`;
- keyboard focus styles from the existing app are unchanged.

- [ ] **Step 4: Run complete automated verification**

```bash
npm run validate
npm run test:browser --workspace @neobrutalism-lab/bold-co
```

Expected: both PASS.

- [ ] **Step 5: Record actual final verification evidence**

Generate `docs/verification/procedural-shader-type-field-final.md` from the verified branch state. It must contain the actual `git rev-parse HEAD`, Node/npm versions, and PASS status for both commands above. Do not mark PASS before commands complete successfully.

- [ ] **Step 6: Commit**

```bash
git add apps/bold-co/src/features/procedural-type-field apps/bold-co/src/screens/HomeScreen.tsx apps/bold-co/src/test/app.test.tsx docs/verification/procedural-shader-type-field-final.md
git commit -m "test: verify procedural field performance and accessibility"
```

---

### Task 11: Gate 9 — Add the bounded portfolio evidence note and perform final branch verification

**Files:**
- Create: `docs/portfolio/procedural-shader-type-field-evidence.md`

**Interfaces:**
- Produces: a truthful project proof artifact for the career portfolio without overstating production maturity.

- [ ] **Step 1: Write the evidence note with this exact claim boundary**

```markdown
# Procedural Shader Type Field

**State:** REFERENCE IMPLEMENTATION

## Problem
Static responsive typography often ignores the continuous input state of the user, while motion-heavy WebGL treatments frequently become disconnected from semantic content, accessibility, and testability.

## Experiment
A single normalized interaction field drives both semantic DOM typography and a procedural WebGL2 shader. Desktop pointer position/velocity and mobile scroll progress/velocity become explicit typed state, then pure mappings translate that state into bounded typographic transforms and GLSL uniforms.

## Engineering claim
Input normalization, state transitions, settling behavior, typography mappings, and shader-uniform mappings are deterministic and unit tested with Vitest. User-observable component and full-page behavior are verified in a real browser with Cypress Component Testing and Cypress E2E.

## Interaction contract
`pointer / scroll → normalized event → canonical state → typography mapping + shader uniform mapping → rendered response → deterministic settling → REST`

## Accessibility and fallback
The headline remains semantic DOM text. The canvas is decorative. WebGL failure preserves content and navigation. Reduced-motion preference suppresses continuous procedural motion and velocity amplification.

## Limitations
This is a bounded reference interaction specimen, not evidence of a complete production design system, a reusable shader-authoring framework, or production behavior across every browser/GPU combination.
```

- [ ] **Step 2: Run the repository-wide final gate again from a clean state**

```bash
git status --short
npm ci
npm run validate
npm run test:browser --workspace @neobrutalism-lab/bold-co
git diff --check
```

Expected before final commit: only the evidence note is uncommitted; all commands PASS.

- [ ] **Step 3: Commit the evidence note**

```bash
git add docs/portfolio/procedural-shader-type-field-evidence.md
git commit -m "docs: document procedural field evidence boundary"
```

- [ ] **Step 4: Final verification after commit**

```bash
git status --short
npm run validate
npm run test:browser --workspace @neobrutalism-lab/bold-co
git diff --check
```

Expected:

```text
clean worktree
lint PASS
typecheck PASS
Vitest PASS
build PASS
Cypress component PASS
Cypress E2E PASS
diff check PASS
```

Do not call the branch complete unless all evidence above is observed after the final commit.

---

## Implementation Gate Summary

| Gate | Required evidence | Blocks |
|---|---|---|
| 0 | Existing lint/typecheck/Vitest/build all pass | all feature work |
| 1 | math + reducer + visual mappings deterministic tests pass | Cypress install, rendering |
| 2 | semantic typography isolate passes | integration |
| 3 | raw WebGL2 shader isolate + fallback pass | integration |
| 4 | one canonical state drives DOM + shader | Cypress browser layer |
| 5 | Cypress component suite passes | page-level motion claims |
| 6 | mobile scroll-primary behavior verified | embellishment |
| 7 | desktop/mobile E2E flows pass | completion |
| 8 | reduced motion, fallback, DPR, offscreen lifecycle, accessibility pass | portfolio claim |
| 9 | clean full validation + bounded evidence note | branch completion |

## Self-Review Results

- **Spec coverage:** Gates 0–9, desktop pointer, mobile scroll, one shader family, semantic DOM typography, shared canonical state, reduced motion, fallback, Cypress component/E2E, performance lifecycle, and bounded portfolio evidence are all mapped to explicit tasks.
- **Scope:** No routing, CMS, backend, auth, database, AI generation, audio, gyro, WebGPU, 3D scene, shader editor, or portfolio redesign has been introduced.
- **Type consistency:** Later tasks consume the exact `InteractionState`, `InteractionEvent`, `CapabilitySnapshot`, `TypographyTransform`, and `ShaderUniformSnapshot` names defined earlier.
- **Dependency discipline:** Raw WebGL2 uses no runtime graphics framework. Cypress and `start-server-and-test` are dev-only and are added only after deterministic Gate 1 passes.
- **Test discipline:** Every implementation task begins with a failing focused test or baseline gate, then minimal implementation, rerun, and commit.
- **No speculative success:** Final PASS claims are written only after commands are actually executed.

## Execution Handoff

Recommended execution mode: **Subagent-Driven Development** with a fresh subagent for each task and review between gates.

Alternative: **Inline Execution** with `superpowers:executing-plans`, executing one gate/task at a time and stopping at any failed gate.

Before implementation, create/use an isolated worktree for `feature/procedural-shader-type-field`. Do not execute feature code from a dirty or unrelated working directory.
