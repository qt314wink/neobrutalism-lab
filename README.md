# Neobrutalism Lab

A governed design-system and experimental web lab for turning Neo-Brutalist observations into independently testable mechanisms, reusable interface isolates, stackable compositions, and eventually product-specific applications.

The repository is intentionally **system-first**. Product pages do not define the primitives. Proven primitives, patterns, assemblies, and compositions become the vocabulary product tracks are allowed to consume.

The first executable downstream reference is **Specimen 001 — BOLD_CO / Cyber-Editorial Neo-Brutalism** in `apps/bold-co`.

## Foundation status

The governed foundation and the BOLD_CO application are integrated in one workspace. Foundation capabilities remain independently validated before application deployment.

Accepted capabilities:

- strict npm workspace, lockfile, TypeScript and ESLint contracts;
- machine-readable system relationship graph + validator;
- machine-enforced one-way package/import boundaries;
- semantic design tokens with a BOLD_CO dialect mapping;
- deterministic physical-offset interaction model;
- independently testable React primitives;
- reusable patterns and assembly;
- first domain-neutral editorial composition;
- Storybook isolation/stress states;
- governed Genesis request/candidate schemas;
- deterministic Genesis policy gates;
- OpenAI Responses provider adapter behind an injected, mock-tested boundary;
- SHA-256 binding between accepted Genesis receipts and the exact candidate they validated;
- proposal-only materialization under `.genesis/proposals`.

`apps/bold-co` preserves Home, Company Info/locator/gallery/reviews, Journal + article dialog, and a browser-local CMS. Bootstrap intentionally has no server CMS, authentication, database, or user accounts.

## Architecture

```text
contracts
   ↓
tokens
   ↓
interaction
   ↓
primitives
   ↓
patterns
   ↓
assemblies
   ↓
compositions
   ↓
apps / product tracks
```

`genesis` is a governance sidecar. It may use contracts and token context, but generated code is never accepted source by default.

The promotion path is:

```text
problem
  → observation
  → mechanism
  → contract
  → isolated implementation
  → deterministic tests
  → Storybook evidence
  → relationship graph
  → acceptance
  → composition
  → product use
```

Generated work follows:

```text
problem + pain point
  → observations + constraints + benchmarks
  → explicit alternatives
  → candidate files + rationale summaries
  → schema validation
  → deterministic policy gates
  → test + QA coverage receipt
  → candidate digest binding
  → proposal-only materialization
  → isolated repository validation
  → human review
  → optional promotion
```

## Package responsibilities

| Package | Responsibility | Accepted capabilities |
| --- | --- | --- |
| `@neobrutalism-lab/contracts` | Evidence, graph, receipt and relation contracts | relationship vocabulary; system/evidence types; optional receipt subject digest |
| `@neobrutalism-lab/tokens` | Semantic values independent from product hues | semantic roles, spacing, borders, hard-shadow depth, motion, type scale, BOLD_CO dialect |
| `@neobrutalism-lab/interaction` | Pure deterministic behavior | rest/hover/focus/pressed/selected/disabled physical-offset resolver |
| `@neobrutalism-lab/primitives` | Smallest accessible React surfaces/controls | `Surface`, `PhysicalButton`, `SignalBadge` |
| `@neobrutalism-lab/patterns` | Reusable visual/behavioral motifs | `StickerLabel`, `MetricSlab` |
| `@neobrutalism-lab/assemblies` | Coordinated groups of patterns | `MetricCluster` |
| `@neobrutalism-lab/compositions` | Domain-neutral page/section recipes | `EditorialHero` |
| `@neobrutalism-lab/genesis` | Governed candidate generation + policy | strict schemas, validator, candidate digest, provider adapter, proposal writer, CLI |

## Architecture boundaries

The dependency rule is executable, not just documentation:

```bash
npm run boundaries:check
```

The validator scans workspace manifests and real source imports. Standard UI layers may consume only themselves or lower layers. `genesis` may consume only `contracts` and `tokens`; UI/runtime packages may not consume `genesis`. Unknown internal packages and upward imports fail validation with file/package evidence.

## Interaction contract

All interactive isolates use the same named states:

```text
rest | hover | focus | pressed | selected | disabled
```

For physical-offset interactions, translation and visible depth remain coupled:

- **rest**: zero translation, full hard shadow;
- **hover/focus**: small negative lift, larger apparent depth;
- **pressed**: translate by the declared physical depth, collapse the hard shadow;
- **selected**: persistent semantic selection independent from hover and synchronized when selection props change after mount;
- **disabled**: no motion, reduced emphasis, non-color disabled cues;
- **reduced motion**: semantic states remain, nonessential transition duration becomes zero.

`PhysicalButton.previewState` exists only for deterministic isolation/visual evidence. Real interactive state remains event-driven.

## Semantic tokens, not magic colors

System code asks for roles such as `action`, `info`, `attention`, `identity`, and `critical`. Product dialects decide which hues implement those meanings.

The initial BOLD_CO dialect maps those roles to the prototype palette without making that palette universal system truth.

## System graph

`registry/system-graph.json` records reusable nodes and typed relationships such as:

```text
derived_from
implements
uses_token
composes
validated_by
constrained_by
optimizes
alternative_to
```

Run:

```bash
npm run registry:check
```

The validator fails on duplicate node IDs, duplicate edge IDs, unknown relationship kinds, or unresolved edge endpoints.

## Storybook as the isolation surface

```bash
npm run storybook
```

Stories are executable isolation evidence, not decorative screenshots. Current stories cover:

- `PhysicalButton`: rest, hover, focus, pressed, selected, disabled, deep offset;
- `Surface`: semantic tones, depth, flat mode;
- `SignalBadge`: informational/action/attention/critical signals;
- `StickerLabel`: tone and rotation variants;
- `MetricSlab`: density/value stress;
- `MetricCluster`: multi/single metric assembly;
- `EditorialHero`: default, media slot, copy-only composition.

## Governed Genesis

Genesis is a **proposal compiler**, not an autonomous committer.

A request must state a concrete design/engineering problem, pain point, target artifact, evidence-backed observations, hard constraints, measurable benchmarks, allowed dependencies, and allowed write roots.

A candidate must return at least two alternatives plus concise decision rationale summaries tied to observation IDs. Those summaries are inspectable decision records—not hidden chain-of-thought and not substitutes for evidence.

The deterministic validator checks:

- strict request/candidate schemas;
- exact problem and pain-point context retention;
- proposal-only write mode;
- target path containment, including traversal/NUL rejection;
- declared dependency boundaries;
- observation and alternative references;
- test coverage for every constraint and benchmark;
- QA coverage for every constraint and benchmark;
- graph relationship endpoint validity.

When a candidate passes, its receipt records a canonical SHA-256 `subjectDigest`. Proposal materialization recomputes the candidate digest and rejects stale or altered candidates even if an earlier receipt was accepted.

### Fixture validation — no API call

```bash
npm run genesis:fixture
```

### Provider call

Create a request JSON matching `packages/genesis/fixtures/request.valid.json`, then provide server-side credentials:

```bash
export OPENAI_API_KEY=...
export OPENAI_MODEL=...
npm run genesis -- path/to/request.json
```

The CLI writes accepted proposals only under:

```text
.genesis/proposals/<candidate-id>/
├── candidate.json
├── receipt.json
└── files/
    └── <proposed destination tree>
```

Nothing in this path directly writes into `packages/` or `apps/`.

## Commands

```bash
npm ci
npm run registry:check
npm run boundaries:check
npm run lint
npm run typecheck
npm run test
npm run genesis:fixture
npm run build
npm run storybook
npm run storybook:build
npm run validate
```

`npm run validate` is the merge-equivalent gate.

## Verified foundation evidence

The clean PR validation run recorded in `docs/governance/foundation-verification.md` proves:

- immutable `npm ci` install;
- `registry:ok` and `boundaries:ok`;
- 17/17 Node behavior/governance tests;
- 21/21 Vitest component/Genesis tests;
- **38/38 executable tests total**;
- accepted deterministic Genesis fixture receipt with a candidate SHA-256 digest;
- TypeScript package build;
- production Storybook build.

## Repository contracts

Read these before adding a new layer or bypassing an existing one:

- `docs/architecture/adr-0001-governed-system-first.md`
- `docs/contracts/file-tree.md`
- `docs/contracts/package-choices.md`
- `docs/contracts/scripts.md`
- `docs/contracts/ci.md`
- `docs/governance/genesis.md`
- `docs/governance/foundation-verification.md`
- `docs/superpowers/specs/2026-08-11-governed-system-foundation-design.md`
- `docs/superpowers/plans/2026-08-11-governed-system-foundation.md`

## Promotion rule

A reusable mechanism is eligible for `accepted` only after its contract, tests, integration evidence, graph relationships, and merge-equivalent validation all pass.

```text
experiment → evidence → candidate → validation → accepted system capability
```

A successful one-screen aesthetic is not sufficient evidence for promotion.

## Downstream track: BOLD_CO

BOLD_CO is a **consumer** of the governed system instead of a source of local abstractions. Further application work should map local states to accepted packages, add genuinely missing isolates through the same promotion process, and compose pages, routes, and features from accepted layers.

The integrated traceability contract is:

`observation → named mechanism → semantic token → primitive/helper → component → specimen → test → deployed evidence`
