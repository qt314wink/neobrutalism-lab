# Governed System Foundation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Establish a governed, independently testable Neo-Brutalist system foundation before product application code, including traceable UI isolates and a governed Genesis proposal path.

**Architecture:** Implement one-way workspace layers `contracts -> tokens -> interaction -> primitives -> patterns -> assemblies -> compositions`, plus a sidecar `genesis` package and machine-readable relationship registry. Storybook is the executable isolation surface. BOLD_CO is deferred until the foundation validates.

**Tech Stack:** Node 22, npm workspaces, React 19.2.7, Vite 8.1.5, TypeScript 6.0.3, ESLint 10.8.0, typescript-eslint 8.65.0, Vitest 4.1.10, Storybook 10.5.5, Zod 4.4.3, OpenAI JS SDK 7.1.0.

## Global Constraints

- No product-specific application code on this branch.
- Every package must export a real tested capability; no empty placeholders.
- Dependency direction is strictly left-to-right: `contracts -> tokens -> interaction -> primitives -> patterns -> assemblies -> compositions -> apps`.
- Genesis may depend only on contracts/tokens and must output proposals, never mutate accepted source.
- Interactive components must expose keyboard/focus behavior and reduced-motion-safe state semantics.
- Physical translation and shadow depth are coupled.
- Every reusable isolate must have a registry node and relevant relation edges.
- CI must not require an OpenAI API key.
- `package-lock.json` is required before merge; until generated, PR is intentionally non-merge-ready.

---

### Task 1: Root workspace, documentation and registry harness

**Files:** create root `package.json`, `tsconfig.base.json`, `eslint.config.mjs`, `.gitignore`, `.env.example`, `.github/workflows/validate.yml`, `.storybook/*`, `registry/system-graph.json`, `scripts/validate-registry.mjs` and the contract/ADR docs in this branch.

**Interfaces:** root commands `lint`, `typecheck`, `test`, `build`, `storybook`, `storybook:build`, `registry:check`, `genesis:fixture`, `validate`.

- [ ] Add exact workspace scripts and dependency versions from `docs/contracts/package-choices.md`.
- [ ] Write dependency-free registry validator that rejects duplicate node IDs, unknown edge endpoints and unknown relationship kinds.
- [ ] Seed registry with package-layer nodes and allowed relation kinds.
- [ ] Run `node scripts/validate-registry.mjs`; expect PASS.
- [ ] Commit as `build: establish governed workspace contracts`.

### Task 2: Contracts and semantic tokens

**Files:** `packages/contracts/*`, `packages/tokens/*` and tests.

**Interfaces:** `SystemNode`, `SystemEdge`, `ObservationRef`, `ConstraintRef`, `BenchmarkRef`, `Receipt`; token exports `color`, `space`, `border`, `shadow`, `motion`, `typeScale`, `dialects.boldCo`.

- [ ] Write failing token semantic-role tests.
- [ ] Implement shared contracts with no React imports.
- [ ] Implement semantic tokens and BOLD_CO dialect mapping.
- [ ] Add registry nodes/edges for token derivations.
- [ ] Run targeted tests and typecheck; expect PASS.
- [ ] Commit as `feat: add contracts and semantic token layer`.

### Task 3: Deterministic interaction state model

**Files:** `packages/interaction/*` and tests.

**Interfaces:** `InteractionState`, `PhysicalOffsetSpec`, `resolvePhysicalOffset(state, depth)`.

- [ ] Write failing tests for rest, hover, focus, pressed, selected, disabled and unsupported depth clamping.
- [ ] Implement pure resolver returning transform/shadow/transition semantics.
- [ ] Add reduced-motion resolver behavior.
- [ ] Add registry node/edges `implements`, `uses_token`, `validated_by`.
- [ ] Run targeted tests and typecheck; expect PASS.
- [ ] Commit as `feat: encode physical interaction state model`.

### Task 4: Primitive isolates and Storybook states

**Files:** `packages/primitives/*` with `Surface`, `PhysicalButton`, `SignalBadge`, CSS, tests and stories.

**Interfaces:** primitives consume tokens/interaction only and expose typed React props.

- [ ] Write failing React tests for semantic button behavior, disabled state, selection and accessible labels.
- [ ] Implement primitives using CSS custom properties generated from the state model.
- [ ] Create Storybook stories covering required states and density stress cases.
- [ ] Add registry nodes/edges.
- [ ] Run tests, typecheck and Storybook build; expect PASS in a dependency-capable environment.
- [ ] Commit as `feat: add independently testable primitive isolates`.

### Task 5: Patterns, assembly and first composition

**Files:** `packages/patterns/*`, `packages/assemblies/*`, `packages/compositions/*` with tests/stories.

**Interfaces:** `StickerLabel`, `MetricSlab`, `MetricCluster`, `EditorialHero`.

- [ ] Write composition tests proving slots, semantic headings and action propagation.
- [ ] Implement patterns only from primitives/tokens.
- [ ] Implement `MetricCluster` from `MetricSlab`.
- [ ] Implement `EditorialHero` from primitives/patterns/assembly without app data assumptions.
- [ ] Register `composes`/`uses_token` relations.
- [ ] Run tests, typecheck and Storybook build; expect PASS in CI.
- [ ] Commit as `feat: prove stackable pattern assembly composition path`.

### Task 6: Governed Genesis schemas and deterministic validator

**Files:** `packages/genesis/src/schema.ts`, `validate.ts`, `provider.ts`, fixtures and tests.

**Interfaces:** `GenesisRequest`, `GenesisCandidate`, `validateGenesisCandidate(request, candidate)`, `GenesisProvider.generate(request)`.

- [ ] Write failing valid/invalid fixture tests for path escape, missing alternatives, uncovered constraints/benchmarks, undeclared dependencies and unreferenced observations.
- [ ] Implement strict Zod schemas.
- [ ] Implement deterministic validator returning typed gate receipts.
- [ ] Add valid fixture and at least four invalid mutations in tests.
- [ ] Run Genesis tests; expect PASS.
- [ ] Commit as `feat: add deterministic genesis governance gates`.

### Task 7: OpenAI Responses provider adapter and CLI

**Files:** `packages/genesis/src/openai-provider.ts`, `cli.ts`, provider tests, `.env.example`.

**Interfaces:** provider calls `client.responses.create` with strict structured output and parses `response.output_text`; CLI reads a request file and writes candidate/receipt only under `.genesis/proposals`.

- [ ] Write mock-provider test before implementation.
- [ ] Implement environment preflight for `OPENAI_API_KEY` and `OPENAI_MODEL`.
- [ ] Implement Responses API call using the candidate JSON schema with strict structured output.
- [ ] Validate model output before any file is materialized.
- [ ] Ensure CLI never writes directly to `packages/` or `apps/`.
- [ ] Run provider tests without network; expect PASS.
- [ ] Commit as `feat: add governed genesis provider adapter`.

### Task 8: CI, self-review and downstream handoff

**Files:** `.github/workflows/validate.yml`, README, registry, docs.

- [ ] Run dependency-free local checks available in the sandbox.
- [ ] Open PR so GitHub Actions can install dependencies and run full `npm run validate`.
- [ ] Inspect CI failures; fix until green except the explicitly documented lockfile gate if networked lock generation remains outstanding.
- [ ] Update README with actual package/status table and downstream BOLD_CO consumption path.
- [ ] Confirm no BOLD_CO application code was added.
- [ ] Commit as `docs: close governed foundation bootstrap`.
