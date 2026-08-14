# Governed System Foundation Implementation Plan

Status: **Implemented and verified.** Final human review/merge remains outside this plan.

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

- [x] Add exact workspace scripts and dependency versions.
- [x] Write and test the dependency-free registry validator.
- [x] Seed registry package-layer nodes and allowed relation kinds.
- [x] Verify registry validation in CI.

### Task 2: Contracts and semantic tokens

- [x] Test semantic-role contracts before implementation.
- [x] Implement shared contracts with no React imports.
- [x] Implement semantic tokens and BOLD_CO dialect mapping.
- [x] Add registry derivation/validation relations.

### Task 3: Deterministic interaction state model

- [x] Test rest, hover, focus, pressed, selected, disabled and invalid-depth behavior.
- [x] Implement pure physical-offset resolver and reduced-motion semantics.
- [x] Register mechanism/token/test relations.

### Task 4: Primitive isolates and Storybook states

- [x] Write React behavior/accessibility tests first and verify RED in CI.
- [x] Implement `Surface`, `PhysicalButton`, and `SignalBadge`.
- [x] Add deterministic Storybook states and stress cases.
- [x] Verify test/typecheck/build/Storybook gates.

### Task 5: Patterns, assembly and first composition

- [x] Write composition tests first.
- [x] Implement `StickerLabel`, `MetricSlab`, `MetricCluster`, and `EditorialHero` from accepted lower layers.
- [x] Register observation/composition/token/test relations.
- [x] Verify and promote proven nodes to accepted.

### Task 6: Governed Genesis schemas and deterministic validator

- [x] Write valid/invalid policy fixtures first.
- [x] Implement strict Zod schemas and deterministic policy gates.
- [x] Cover path escape, alternatives, coverage, dependencies, evidence, graph endpoints and direct-write rejection.
- [x] Verify deterministic fixture without a network call.

### Task 7: OpenAI Responses provider adapter and CLI

- [x] Write provider/materialization tests first.
- [x] Implement credentials/model preflight.
- [x] Implement strict structured-output Responses adapter behind an injected boundary.
- [x] Validate provider output before materialization.
- [x] Limit CLI writes to `.genesis/proposals`.

### Task 8: CI, closure and downstream handoff

- [x] Open draft PR #3 as the dependency-capable test environment.
- [x] Generate and commit `package-lock.json` from a clean runner.
- [x] Restore read-only CI and immutable `npm ci`.
- [x] Add Genesis fixture, package build and Storybook to merge-equivalent validation.
- [x] Update README/contracts with actual system state.
- [x] Confirm no BOLD_CO application code was added.

### Post-plan hardening: executable architecture boundaries

- [x] Add TDD contracts for layer ordering, Genesis isolation, unknown packages, manifests and source imports.
- [x] Implement `scripts/validate-boundaries.mjs`.
- [x] Add `boundaries:check` to `npm run validate`.
- [x] Fold registry/boundary tests into the normal Node test runner.

### Final code-review hardening

- [x] Add regression for selected prop changes after mount.
- [x] Synchronize `PhysicalButton` persistent selected/rest state without disrupting transient hover/focus/pressed states.
- [x] Add unsafe NUL-path regression.
- [x] Add regression proving a stale accepted Genesis receipt cannot materialize a mutated candidate.
- [x] Canonicalize schema-valid candidates and bind receipts to SHA-256 `subjectDigest`.
- [x] Verify digest again at proposal materialization boundary.
- [x] Verify clean runner result: 17/17 Node tests + 21/21 Vitest tests = **38/38**, plus registry, boundaries, fixture, build and Storybook.

## Downstream handoff

BOLD_CO Specimen 001 is now a consumer plan. Its next implementation cycle should inventory the supplied prototype against accepted system capabilities, identify only genuinely missing isolates, promote those through the same governed process, then compose the application from accepted layers.
