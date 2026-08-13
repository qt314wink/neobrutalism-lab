# Procedural Shader Type Field — Design Specification

## Status

APPROVED DESIGN — IMPLEMENTATION PLAN NOT YET AUTHORIZED

## Objective

Create one bounded, portfolio-grade interactive specimen demonstrating React/TypeScript UI engineering, deterministic state modeling, procedural motion, interactive GLSL/WebGL, responsive interaction, Vitest/Jest-style unit testing, and Cypress browser testing.

This is deliberately not a website redesign. It is one independently testable interaction system.

## Target

Repository: `qt314wink/neobrutalism-lab`

Branch: `feature/procedural-shader-type-field`

Target application: `apps/bold-co`

Existing stack includes React 19, TypeScript, Vite, Vitest, Testing Library, Tailwind, and ESLint. Preserve the existing validation pipeline. Add Cypress only after the deterministic motion/state layer passes unit tests.

## Product definition

Build a single responsive hero specimen called **Procedural Type Field**.

A large typographic statement behaves as a responsive physical material. A procedural shader inhabits the same interaction field. Neither animation system owns interaction state independently. Both consume the same normalized state.

Canonical transformation:

`pointer / touch / scroll -> input normalization -> interaction state -> motion field -> DOM typography transforms + GLSL uniforms -> visual response -> damped return to rest`

## Scope boundary

### In scope

- one hero viewport;
- one headline;
- one supporting line;
- one WebGL canvas;
- one procedural fragment shader;
- pointer-driven desktop interaction;
- scroll-driven mobile interaction;
- optional direct-touch perturbation;
- normalized state model;
- reduced-motion mode;
- quality/performance fallback;
- Vitest tests;
- Cypress component tests;
- Cypress E2E tests;
- responsive desktop/mobile behavior.

### Out of scope

- routing;
- CMS;
- backend;
- authentication;
- database;
- analytics;
- multiple shader scenes;
- generative AI;
- audio;
- gyroscope;
- WebGPU;
- 3D objects;
- full portfolio redesign;
- arbitrary visual-effects library;
- shader editor;
- user configuration panel.

YAGNI applies. One effect, exceptionally well engineered.

## Core interaction model

### Desktop

Primary input: pointer.

The resting typography has no constant agitation. As the pointer approaches a glyph or word region:

- local displacement increases;
- nearby text slightly translates away from or toward the interaction locus;
- scale changes by a constrained amount;
- tracking/spacing may expand locally;
- skew or rotation is extremely restrained;
- the shader field develops localized chromatic displacement;
- flow direction incorporates pointer velocity.

The response must feel elastic rather than binary.

Pointer velocity affects energy. Pointer position affects location. Pointer distance affects radius.

On pointer exit there is no instant reset. Accumulated energy decays and typography and shader settle through the same damping model.

### Mobile

There is no hover dependency.

Primary input: `scroll progress + scroll velocity`.

Secondary optional input: `touch position / drag`.

Scrolling through the hero advances the field through three visual phases. These phases are not additional state-machine modes; they are continuous visual regions derived from scroll progress and energy.

#### Phase 0 — REST

Text is coherent. Shader movement is minimal.

#### Phase 1 — EXCITE

Scrolling increases field energy. Typography expands/deforms. Color separation and shader flow increase.

#### Phase 2 — RESOLVE

As the hero exits the viewport, distortion collapses toward a clean readable configuration and the controller transitions through `SETTLING` back to `REST`.

Rapid scrolling affects velocity but must not permanently alter state. A touch/drag may temporarily introduce a local disturbance into the field. If implemented, touch release returns control to scroll-derived state.

## Shared interaction state

Define one canonical state shape conceptually equivalent to:

- normalized pointer X;
- normalized pointer Y;
- pointer velocity X/Y;
- scroll progress;
- scroll velocity;
- interaction energy;
- local influence radius;
- viewport aspect;
- device quality tier;
- reduced-motion preference;
- active input source;
- time.

Rendering code must consume this state. Rendering code must not independently read browser events.

This separation is mandatory because it makes the visual behavior deterministic and testable.

## State modes

Use explicit behavioral modes:

- `REST`
- `POINTER_ACTIVE`
- `SCROLL_ACTIVE`
- `TOUCH_ACTIVE`
- `SETTLING`
- `REDUCED_MOTION`

Modes describe interaction behavior. Continuous values describe intensity. Do not create dozens of discrete animation states.

## Procedural shader

Implement one shader family only: **Chromatic Flow Displacement**.

### Inputs

- time;
- resolution;
- interaction position;
- interaction velocity;
- interaction energy;
- scroll phase;
- influence radius.

### Visual mechanisms

May include:

- smooth radial field;
- low-frequency procedural noise;
- directional flow;
- localized refraction/displacement;
- restrained RGB/chromatic separation;
- phase-controlled intensity.

Do not turn this into generic animated noise. Every shader operation should correspond to an observable interaction variable. The shader should be almost still at REST. Movement is caused primarily by user interaction.

## Typography motion

Keep typography as semantic DOM.

Recommended hierarchy:

`ResponsiveTypeField -> TypeLine -> TypeSegment`

Do not create one React state update per character per animation frame. Animation-frame data should remain outside ordinary React render churn. Transforms may consume CSS custom properties or an imperative motion layer.

Typography response should use the same normalized field as GLSL.

Candidate variables:

- translate X/Y;
- scale X/Y;
- letter spacing;
- local skew;
- opacity only if necessary.

Hard constraint: legibility survives every state.

## Accessibility

The headline remains actual semantic text. WebGL is enhancement.

If WebGL fails:

- headline remains;
- layout remains;
- page remains understandable.

For `prefers-reduced-motion`:

- disable continuous procedural motion;
- preserve a static or extremely restrained visual state;
- remove scroll-velocity amplification;
- no essential information may depend on animation.

Keyboard navigation must remain unaffected.

## Performance

Target:

- no React rerender on every pointer frame;
- `requestAnimationFrame` only while needed;
- suspend or reduce animation when offscreen;
- clamp device pixel ratio;
- resize canvas correctly;
- avoid unnecessary allocations inside render loop;
- shader uniform objects remain stable;
- quality tier can reduce noise complexity/DPR before disabling the effect.

Do not optimize blindly. Instrument first.

## Feature boundaries

### F1 — Input Normalizer

Consumes native pointer, touch and scroll events. Produces normalized device-independent input values. No rendering responsibilities.

### F2 — Interaction State Controller

Consumes normalized input. Produces canonical field state. Responsible for modes, damping, velocity, energy, transitions, and reduced-motion behavior. No WebGL responsibilities.

### F3 — Procedural Shader Surface

Consumes canonical state. Maps values to GLSL uniforms. No direct event listeners.

### F4 — Responsive Typography Field

Consumes the same canonical state. Maps field influence to typographic transforms. No direct pointer/scroll listeners.

### F5 — Capability/Fallback Layer

Determines WebGL availability, device quality, and reduced-motion mode. Must permit semantic UI without shader support.

### F6 — Diagnostic Mode

Development-only. Expose current mode, pointer, scroll progress, velocity, energy, and quality tier. This makes interaction debugging inspectable. Do not ship the diagnostic overlay visibly in production.

## Test architecture

### Vitest / Jest-style unit layer

Test deterministic functions including:

- `normalizePointer()`
- `normalizeScroll()`
- `calculateVelocity()`
- `calculateInfluence()`
- `reduceInteractionState()`
- `mapStateToTypography()`
- `mapStateToUniforms()`

Test bounds, clamping, zero-input REST state, pointer transition, scroll transition, touch precedence if touch is implemented, settling, reduced-motion behavior, extreme velocity, and resize normalization.

Freeze time/seed anywhere procedural output is tested. Do not snapshot arbitrary live shader frames.

### Cypress Component layer

Mount the hero specimen independently.

Verify:

- renders without WebGL-specific UI failure;
- semantic heading exists;
- desktop pointer interaction changes observable state;
- pointer exit enters `SETTLING`;
- reduced-motion mode suppresses high-energy effects;
- resize updates normalized dimensions;
- fallback retains readable typography;
- diagnostic state reflects interaction mode.

Use stable `data-cy` selectors for test-specific targeting rather than brittle CSS selectors.

### Cypress E2E layer

Load the actual application.

Desktop scenario:

`REST -> pointer enter -> pointer move -> POINTER_ACTIVE -> pointer exit -> SETTLING -> REST`

Mobile scenario:

`REST -> scroll hero -> SCROLL_ACTIVE -> rising energy -> decreasing energy as hero exits -> SETTLING -> REST`

Also verify:

- no horizontal overflow;
- content remains readable at narrow viewport;
- canvas tracks viewport size;
- page scroll is not hijacked;
- navigation remains operable;
- reduced-motion browser preference produces safe experience;
- no uncaught browser error during normal interaction.

## Interaction invariants

1. Input never causes navigation or scrolling to become inaccessible.
2. Shader failure never removes content.
3. Scroll remains native.
4. Mobile interaction never depends on hover.
5. Text remains readable.
6. Interaction energy is bounded.
7. Every excited state has a deterministic route back to REST.
8. Reduced-motion mode is meaningful, not cosmetic.
9. DOM and shader consume one source of truth.
10. Renderer-specific code cannot mutate canonical interaction state.

## Implementation gates

### Gate 0 — Existing-system verification

Before changes:

- run current lint;
- run current typecheck;
- run current Vitest suite;
- run current build;
- record baseline.

FAIL = stop.

### Gate 1 — Motion contract

Implement/test only state types, normalization, reducer/controller, damping, and state-to-visual parameter mappings. No shader yet.

PASS requires deterministic unit tests.

### Gate 2 — Typography isolate

Implement responsive typography with synthetic state values. No browser input coupling yet.

PASS requires legible REST, excited, settling, reduced-motion, and responsive states.

### Gate 3 — Shader isolate

Implement shader driven only by synthetic canonical state. No pointer listeners inside shader component.

PASS requires REST stability, visible response to energy, bounded uniforms, and working fallback.

### Gate 4 — Input integration

Connect pointer/scroll/touch normalizer to controller. Connect controller to both typography and shader.

PASS requires one shared state pathway. Reject duplicated renderer-specific interaction logic.

### Gate 5 — Cypress component verification

Add Cypress. Write focused component tests. PASS before page composition.

### Gate 6 — Mobile interaction

Implement scroll-primary mobile mapping. Verify native page scrolling remains intact. Test at representative narrow viewports. PASS before visual embellishment.

### Gate 7 — E2E

Add full interaction sequence tests. Test desktop and mobile pathways. No arbitrary sleeps. Use observable application state and Cypress retry behavior.

### Gate 8 — Performance/accessibility

Verify reduced motion, offscreen suspension, resize, DPR clamp, fallback, keyboard usability, and no interaction-driven layout breakage.

### Gate 9 — Portfolio readiness

Produce one concise evidence note with:

**Problem:** Static responsive typography often ignores the continuous input state of the user.

**Experiment:** Create a shared procedural interaction field that drives semantic DOM typography and a GPU shader simultaneously.

**Engineering claim:** Input normalization, state transitions and render mappings are deterministic and unit tested; user-observable behavior is verified in a real browser.

**Limitations:** This is a reference interaction specimen, not evidence of a complete production design system.

## Proposed file boundaries

Prefer focused modules conceptually similar to:

`apps/bold-co/src/features/procedural-type-field/`

containing:

- interaction types;
- input normalizer;
- interaction controller;
- visual mappings;
- shader surface;
- responsive typography;
- capability detection;
- diagnostic view;
- focused tests.

Cypress E2E tests remain in conventional Cypress locations.

Do not put the entire system in one component. Do not restructure unrelated application code.

## Definition of done

The specimen is complete when:

- deterministic interaction logic passes unit tests;
- real-browser Cypress tests pass;
- pointer interaction works on desktop;
- scroll-primary interaction works on mobile;
- if implemented, touch disturbance works without hijacking scroll;
- shader and typography demonstrably share one state model;
- reduced-motion path works;
- fallback works;
- no horizontal overflow;
- existing repository validation still passes;
- implementation is documented;
- one short portfolio evidence description exists.

Not included in Definition of Done:

- full visual-effects library;
- multiple scenes;
- reusable shader authoring framework;
- portfolio deployment redesign;
- audio/gyro;
- broad animation system.

## Human approval boundary

The design has been approved. The next step is to write the implementation plan only after Jennipher reviews this committed specification and confirms it is ready to plan.
