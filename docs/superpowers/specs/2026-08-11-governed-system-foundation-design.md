# Neobrutalism Lab Governed System Foundation Design

Date: 2026-08-11
Status: Approved by continuation instruction; supersedes the bootstrap ordering in `2026-08-11-neobrutalism-lab-bootstrap-design.md` where the two conflict.
Repository: `qt314wink/neobrutalism-lab`

## 1. Goal

Build the repository as a governed design-system and experimental web lab before product-specific application code. Each reusable mechanism must exist as an independently understandable, independently testable isolate before it can participate in a larger composition.

The canonical progression is:

`problem -> observation -> mechanism -> contract -> token/state model -> primitive -> pattern -> assembly -> composition -> product track -> evidence -> acceptance`

Generated work follows a parallel governed path:

`problem -> constraints -> observations -> alternatives -> candidate -> deterministic validation -> QA/test plan -> isolated verification -> human approval -> promotion`

## 2. Architectural decision

Adopt a system-first npm workspace with explicit one-way dependency layers. BOLD_CO remains Specimen 001, but product reconstruction starts only after the reusable foundation can stand on its own.

### Layering

1. `contracts`: shared schemas, IDs, relationship types, evidence and receipt models.
2. `tokens`: semantic design values and dialect mappings.
3. `interaction`: deterministic state transformations and physical-causality helpers.
4. `primitives`: smallest accessible React controls/surfaces.
5. `patterns`: reusable visual/behavioral motifs composed from primitives.
6. `assemblies`: multi-part, domain-neutral modules with internal coordination.
7. `compositions`: section/page-layout recipes built from assemblies and patterns.
8. `apps/*`: product tracks and specimens. Apps may consume every lower layer; lower layers never import from apps.
9. `genesis`: governed candidate generation and validation. Genesis may reference contracts/tokens but cannot mutate accepted source directly.

No upward imports are allowed. Cross-layer relations are recorded in `registry/system-graph.json` and checked in CI.

## 3. File-tree contract

The authoritative detailed tree is `docs/contracts/file-tree.md`. The minimum foundation is:

```text
.github/workflows/validate.yml
.storybook/
docs/
packages/
  contracts/
  tokens/
  interaction/
  primitives/
  patterns/
  assemblies/
  compositions/
  genesis/
registry/system-graph.json
scripts/validate-registry.mjs
package.json
tsconfig.base.json
eslint.config.mjs
```

No empty placeholder package is accepted. Every package must export at least one tested capability and declare its upstream dependencies.

## 4. Design-language contract

Neo-Brutalist styling is modeled as mechanisms and semantic roles, not copied magic values.

Initial mechanisms:
- structural outline;
- hard offset shadow;
- hover lift;
- press translation coupled to shadow collapse;
- explicit selected/active inversion;
- sticker/label interruption;
- slab grouping;
- editorial density contrast;
- terminal/utility framing;
- marquee/live signal behavior.

Initial semantic roles:
- `ink`: structural authority;
- `paper`: neutral reading surface;
- `action`: affirmative/action signal;
- `info`: technical/informational signal;
- `attention`: high-attention/expressive signal;
- `identity`: selection/annotation signal;
- `critical`: destructive/error signal.

Hue assignments are dialect-level. Semantic roles are system-level.

## 5. State transformation contract

Interactive isolates use the same named states:

`rest | hover | focus | pressed | selected | disabled`

For physical-offset interactions, visible depth and translation are coupled:
- rest: full shadow depth, zero translation;
- hover/focus: optional small negative lift, expanded apparent depth;
- pressed: translate by the declared base depth and collapse visible shadow;
- selected: retain explicit semantic selection independent of hover;
- disabled: remove motion and reduce emphasis without relying only on color.

Reduced-motion mode removes nonessential continuous motion and preserves semantic state changes.

## 6. Isolation and promotion

Every isolate must ship with:
- public interface;
- source observation/mechanism reference;
- story or executable specimen;
- tests for deterministic behavior;
- accessibility considerations where interactive;
- relationship graph entries;
- explicit failure/edge states.

Promotion rule:

`experiment -> evidence -> reusable contract -> accepted layer`

An experiment is never promoted solely because it looks good in one screen.

## 7. Genesis governance

Generated assets/code are proposals, not accepted source.

A Genesis request must include:
- design problem and pain point;
- target artifact type;
- observations/evidence references;
- constraints;
- benchmarks;
- allowed dependencies and write roots.

A Genesis candidate must include:
- proposed files;
- alternatives considered;
- decision rationale summaries tied to observation IDs;
- assumptions;
- test plan;
- QA claims mapped to benchmarks/constraints;
- relationship edges;
- risks;
- unresolved questions.

Deterministic gates reject candidates that:
- escape allowed write roots;
- omit alternatives;
- omit tests/QA;
- introduce undeclared dependencies;
- fail to reference the problem/pain point;
- leave a constraint or benchmark uncovered;
- contain relationship edges to unknown nodes;
- request direct mutation of accepted source.

The first provider adapter uses the OpenAI Responses API with structured JSON output. API keys remain server-side/environment-only. CI tests the adapter with mocks and fixtures; CI does not make paid model calls.

## 8. Package choices

Reference compatibility baseline for the foundation:
- Node 22;
- npm workspaces;
- React 19.2.x;
- Vite 8.1.x;
- TypeScript 6.0.3 (deliberately below 6.1 because current `typescript-eslint` support is `<6.1.0`);
- ESLint 10.8.x + `typescript-eslint` 8.65.x;
- Vitest 4.1.x + jsdom 30.x;
- Storybook React/Vite 10.5.x with accessibility addon;
- Zod 4.4.x for runtime governance schemas;
- OpenAI JS SDK current stable major through a narrow adapter boundary.

Motion is a permitted downstream dependency but is not installed until an assembly/composition requires behavior CSS cannot express cleanly.

## 9. Scripts contract

Root scripts must expose:
- `lint`;
- `typecheck`;
- `test`;
- `build`;
- `storybook`;
- `storybook:build`;
- `registry:check`;
- `genesis:fixture`;
- `validate`.

`validate` is the merge gate and must run static analysis, tests, registry validation, package builds, and Storybook build.

## 10. CI contract

Pull requests must run on Node 22 and execute the same `npm run validate` command used locally. CI must never require an OpenAI API key.

A dependency lockfile is required before merge. Because the current execution sandbox cannot reach the npm registry, the first branch may temporarily use exact top-level versions with `npm install` in CI; the PR remains non-merge-ready until `package-lock.json` is generated in a networked environment and CI is changed to `npm ci`.

## 11. Initial isolates

The first executable system slice contains:
- semantic color, border, spacing, shadow, motion and type tokens;
- physical-offset state resolver;
- `Surface`, `PhysicalButton`, and `SignalBadge` primitives;
- `StickerLabel` and `MetricSlab` patterns;
- `MetricCluster` assembly;
- `EditorialHero` composition;
- registry nodes/edges tracing them;
- Storybook stories exercising rest/hover/focus/pressed/selected/disabled and density variants;
- Genesis request/candidate schemas, deterministic validator, provider adapter and fixtures.

This is intentionally enough to prove vertical interoperability without reconstructing BOLD_CO yet.

## 12. Error handling

- Invalid token keys fail at TypeScript compile time where possible.
- Invalid physical-depth inputs clamp to a declared supported depth.
- Registry errors fail validation with exact edge/node IDs.
- Genesis schema failures fail closed.
- Genesis provider failures return a typed error and never produce a promotable candidate.
- Missing API credentials fail before network invocation.
- Generated file paths are normalized and checked against allowed roots before materialization.

## 13. Testing

Three evidence layers are required:

1. Pure behavior tests for state resolvers, schemas, registry validation and governance gates.
2. React behavior tests for primitives/patterns/assemblies.
3. Storybook build plus accessibility stories for visual/state evidence.

Product-level Playwright tests begin when the first app/package track is assembled.

## 14. Success criteria for this foundation boundary

Foundation is complete when:
1. every declared package contains a real exported capability;
2. no forbidden upward dependency exists by contract;
3. state transformation helpers pass deterministic tests;
4. primitive/pattern/assembly/composition stories build;
5. registry graph validation passes;
6. Genesis fixture validation passes and malformed fixtures are rejected;
7. OpenAI adapter is isolated behind an interface and mock-tested;
8. `npm run validate` passes in CI;
9. a lockfile is committed before merge;
10. BOLD_CO application reconstruction has not been started on this branch.

## 15. Supersession note

The earlier Specimen 001 plan remains useful as a downstream product-track plan. Its workspace bootstrap and local design extraction tasks are superseded by this system-first foundation. Once this foundation merges, BOLD_CO should consume these packages rather than recreate local equivalents.
