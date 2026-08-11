# Governed System Foundation Implementation Plan

Status: Implemented; final closure verification pending the documentation/graph head.

**Goal:** Establish a governed, independently testable Neo-Brutalist system foundation before product application code, including traceable UI isolates and a governed Genesis proposal path.

**Architecture:** One-way workspace layers `contracts -> tokens -> interaction -> primitives -> patterns -> assemblies -> compositions`, plus a sidecar `genesis` package and machine-readable relationship registry. Storybook is the executable isolation surface. BOLD_CO remains downstream.

**Tech Stack:** Node 22, npm workspaces, React 19.2.7, Vite 8.1.5, TypeScript 6.0.3, ESLint 10.8.0, typescript-eslint 8.65.0, Vitest 4.1.10, Storybook 10.5.5, Zod 4.4.3, OpenAI JS SDK 7.1.0.

## Global Constraints

- [x] No product-specific application code on this branch.
- [x] Every package exports a real tested capability; no empty placeholders.
- [x] Dependency direction is strictly one-way and machine-enforced.
- [x] Genesis depends internally only on contracts/tokens and outputs proposals, never accepted source.
- [x] Interactive primitives expose keyboard/focus behavior and reduced-motion-safe state semantics.
- [x] Physical translation and hard-shadow depth are coupled.
- [x] Reusable isolates have registry nodes and relevant relation edges.
- [x] CI does not require an OpenAI API key.
- [x] `package-lock.json` is committed and CI installs with `npm ci`.

### Task 1: Root workspace, documentation and registry harness

- [x] Add exact workspace scripts and dependency versions from `docs/contracts/package-choices.md`.
- [x] Write dependency-free registry validator that rejects duplicate node IDs, unknown edge endpoints and unknown relationship kinds.
- [x] Seed registry with package-layer nodes and allowed relation kinds.
- [x] Verify registry validation.
- [x] Commit governed workspace contracts.

### Task 2: Contracts and semantic tokens

- [x] Write token semantic-role tests before implementation.
- [x] Implement shared contracts with no React imports.
- [x] Implement semantic tokens and BOLD_CO dialect mapping.
- [x] Add registry nodes/edges for token derivations.
- [x] Verify targeted tests and typecheck.
- [x] Commit contracts and semantic token layer.

### Task 3: Deterministic interaction state model

- [x] Write tests for rest, hover, focus, pressed, selected, disabled and unsupported depth clamping.
- [x] Implement pure resolver returning transform/shadow/transition semantics.
- [x] Add reduced-motion resolver behavior.
- [x] Add registry `implements`, `uses_token`, and `validated_by` relations.
- [x] Verify targeted tests and typecheck.
- [x] Commit physical interaction state model.

### Task 4: Primitive isolates and Storybook states

- [x] Write failing React tests for semantic button behavior, disabled state, selection and accessible labels.
- [x] Verify clean RED state on a dependency-capable CI runner.
- [x] Implement `Surface`, `PhysicalButton`, and `SignalBadge`.
- [x] Create Storybook stories covering required states and stress cases.
- [x] Add registry nodes/edges.
- [x] Verify tests, typecheck, build and Storybook in CI.
- [x] Commit independently testable primitive isolates.

### Task 5: Patterns, assembly and first composition

- [x] Write composition tests proving pattern semantics, assembly identity, semantic headings and action propagation.
- [x] Implement `StickerLabel` and `MetricSlab` from lower layers.
- [x] Implement `MetricCluster` from `MetricSlab`.
- [x] Implement `EditorialHero` without app-data/routing assumptions.
- [x] Register `composes`, `uses_token`, observation and validation relations.
- [x] Verify tests, typecheck, build and Storybook in CI.
- [x] Promote proven pattern/assembly/composition nodes to accepted.

### Task 6: Governed Genesis schemas and deterministic validator

- [x] Write failing valid/invalid fixture tests for path escape, missing alternatives, coverage, dependencies, evidence, graph endpoints and direct-write mode.
- [x] Implement strict Zod schemas.
- [x] Implement deterministic validator returning typed gate receipts.
- [x] Add valid fixture and multiple invalid mutations.
- [x] Verify Genesis tests and deterministic fixture.
- [x] Commit deterministic Genesis governance gates.

### Task 7: OpenAI Responses provider adapter and CLI

- [x] Write provider/materialization tests before implementation.
- [x] Implement environment preflight for `OPENAI_API_KEY` and `OPENAI_MODEL`.
- [x] Implement strict structured-output Responses adapter behind an injected boundary.
- [x] Validate model output before materialization.
- [x] Ensure CLI writes only inside `.genesis/proposals`.
- [x] Verify provider tests without network or paid API call.
- [x] Commit governed Genesis provider adapter.

### Task 8: CI, self-review and downstream handoff

- [x] Open draft PR #3 for dependency-capable validation.
- [x] Inspect each CI failure and fix harness/implementation faults without weakening strictness.
- [x] Generate and commit `package-lock.json` from the clean runner.
- [x] Restore read-only CI and immutable `npm ci`.
- [x] Add `npm run genesis:fixture` to the merge-equivalent gate.
- [x] Update README with actual package/status table and downstream BOLD_CO consumption path.
- [x] Confirm no BOLD_CO application code was added.
- [x] Record clean validation evidence.

### Post-plan hardening: executable architecture boundaries

- [x] Add TDD tests for layer ordering, Genesis isolation, unknown packages, manifest dependencies and source imports.
- [x] Verify RED state with prior tests still green.
- [x] Implement `scripts/validate-boundaries.mjs`.
- [x] Add `boundaries:check` to `npm run validate`.
- [x] Fold registry and boundary validator tests into the normal Node test runner.
- [x] Verify clean runner result: 17/17 Node tests + 18/18 Vitest tests, registry and boundary gates, Genesis fixture, build and Storybook.

## Downstream handoff

BOLD_CO Specimen 001 is now a consumer plan. Its next implementation cycle should inventory the supplied prototype against accepted system capabilities, identify only genuinely missing isolates, promote those through the same governed process, then compose the application from accepted layers.
