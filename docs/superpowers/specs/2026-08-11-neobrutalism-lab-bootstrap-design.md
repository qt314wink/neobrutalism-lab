# Neobrutalism Lab Bootstrap Design

Date: 2026-08-11
Status: Approved architecture direction; implementation not started
Repository: `qt314wink/neobrutalism-lab`

## 1. Purpose

`neobrutalism-lab` is a reusable research-and-implementation repository for identifying, specifying, testing, and rendering Neo-Brutalist interface grammar.

The repository boundary is the **system**, not a single brand demo. `BOLD_CO` is the first executable specimen used to extract and validate reusable rules.

The core traceability chain is:

`observation -> named mechanism -> semantic token -> primitive -> composed component -> specimen -> test -> deployed evidence`

## 2. Approaches considered

### A. System monorepo with executable specimens — selected

Keep reusable tokens, interaction primitives, documentation, and multiple specimen applications in one repository. `BOLD_CO` is `Specimen 001`.

Advantages:
- separates reusable grammar from specimen-specific expression;
- supports cross-specimen comparison without premature abstraction;
- gives each extracted rule an executable reference;
- scales to additional Neo-Brutalist dialects without creating fragmented repositories.

Costs:
- slightly more initial structure than a single Vite app;
- requires explicit package/specimen boundaries.

### B. Single BOLD_CO application, extract later

Fastest route to a deployable demo, but it would make the first specimen the repository ontology and encourage later reverse-engineering of reusable rules.

Rejected because it weakens traceability between observation and reusable mechanism.

### C. Design-system packages first, specimens later

Creates clean abstractions immediately, but risks defining Neo-Brutalist rules without enough executable evidence.

Rejected because the lab should derive reusable grammar from tested specimens rather than impose abstractions before comparison.

## 3. Repository architecture

```text
neobrutalism-lab/
├── apps/
│   └── bold-co/
│       ├── src/
│       │   ├── App.tsx
│       │   ├── main.tsx
│       │   ├── components/
│       │   ├── data/
│       │   ├── features/
│       │   │   ├── journal/
│       │   │   ├── gallery/
│       │   │   ├── reviews/
│       │   │   ├── cms/
│       │   │   └── locator/
│       │   └── styles/
│       └── index.html
├── packages/
│   ├── tokens/
│   ├── primitives/
│   └── interaction/
├── docs/
│   ├── visual-language.md
│   ├── interaction-grammar.md
│   ├── component-state-model.md
│   └── specimen-analysis.md
├── package.json
└── tsconfig.json
```

The first implementation may begin with a minimal workspace and only the files needed by Specimen 001. Empty placeholder packages should not be created merely to match the eventual tree.

## 4. Specimen 001: BOLD_CO

Internal identity:

**Specimen 001 — BOLD_CO / Cyber-Editorial Neo-Brutalism**

Its purpose is not to define Neo-Brutalism universally. It is an executable observation surface from which reusable mechanisms can be isolated.

### Preserved behavior

The supplied prototype contains these important functional areas:

- tabbed navigation across Home, Company Info, Journal, and CMS;
- marquee ticker;
- hero and metric slabs;
- tactile offset-shadow controls;
- service cards;
- simulated locator/radar interface;
- selectable gallery reel;
- user-created review feed persisted locally;
- journal feed persisted locally;
- CMS authoring/deletion interface;
- full-article modal;
- status-oriented footer.

### Source normalization required

The supplied source is treated as design input, not directly compilable source. Transport artifacts must be repaired before implementation, including:

- escaped identifiers such as `INITIAL\_BLOGS`;
- escaped JSX such as `\<div>`;
- escaped property access such as `window\.scrollTo`;
- Markdown-wrapped image/font URLs;
- unused imports under strict linting;
- runtime font-link injection that should move to static document/CSS configuration.

No semantic behavior should be silently removed while normalizing these artifacts.

## 5. Reusable grammar to extract

### 5.1 Physical-offset interaction

Canonical state progression:

`rest -> hover/lift -> press/translate-by-shadow-offset -> shadow-collapse -> release -> rest`

The visual shadow and transform distance are one coupled physical model. A control should not translate independently of the apparent shadow depth.

### 5.2 Semantic chromatic roles

Initial specimen roles:

- lime: action, affirmative, live state;
- cyan: information, technical state;
- pink: expressive emphasis and high-attention state;
- yellow: identity, annotation, selection;
- black: infrastructure, terminal, authority;
- ivory/white: document surface and neutral field.

These are specimen-derived semantic roles, not universal color requirements. Later specimens may preserve the role while changing the hue.

### 5.3 Component families

Initial families to document and selectively extract:

- physical buttons/switches;
- sticker labels;
- metric slabs;
- editorial cards;
- terminal/control panels;
- status badges;
- ribbons;
- image reels;
- form controls;
- destructive controls;
- modal documents;
- navigation switches.

Extraction happens only when a mechanism is reusable or when multiple components need the same behavior.

## 6. Component boundaries

`App.tsx` should become an orchestration shell, not remain the full application.

Initial decomposition should follow user-visible responsibility rather than arbitrary file size:

- `AppShell`: top-level navigation and current specimen screen;
- `TickerBanner`: marquee/status strip;
- `HomeScreen`: hero, metrics, services, CTA;
- `AboutScreen`: company information, locator, gallery, reviews;
- `JournalScreen`: feed and article view trigger;
- `DashboardScreen`: authoring and deployment controller;
- `ArticleModal`: full article reading state.

Feature-local components remain inside their feature folders until a reusable mechanism is proven.

## 7. Data and state flow

Specimen 001 remains browser-local for the first bounded implementation.

- seed data initializes blogs and reviews;
- `localStorage` persists user-authored blogs and reviews;
- local component state controls navigation, gallery selection, locator simulation, forms, alerts, and modal state;
- no network-backed CMS, authentication, database, or API is introduced in the first pass.

Persistence helpers must tolerate missing or malformed local storage values and browser-only APIs must not execute at module evaluation time.

This keeps the first implementation focused on interface grammar rather than backend product architecture.

## 8. Accessibility and interaction constraints

Neo-Brutalist visual force must not reduce operability.

Required constraints:

- every interactive element remains keyboard reachable;
- visible focus state is at least as explicit as hover state;
- icon-only destructive controls have accessible names;
- modal reading view supports Escape to close and sensible focus management;
- motion respects `prefers-reduced-motion`;
- color is not the sole carrier of semantic state;
- text/background combinations maintain usable contrast;
- touch targets remain usable on mobile even when the visual control is compact.

## 9. Motion model

Motion should express physical causality rather than decoration.

Allowed first-pass categories:

- offset collapse on press;
- small lift on hover/focus-visible;
- short selection translation;
- marquee translation;
- pulse/ping for live status;
- constrained modal entrance;
- locator simulation transforms.

Reduced-motion mode should disable nonessential marquee/ping/spin animation and preserve state changes without continuous movement.

## 10. Error handling

First-pass errors are local and recoverable:

- malformed persisted data falls back to canonical seed data;
- incomplete CMS form submission produces an explicit inline error;
- missing gallery image displays a neutral fallback surface with retained title/metadata;
- local persistence failures do not destroy the in-memory user action;
- invalid numeric controls are clamped to their declared limits.

No user-facing state should fail silently.

## 11. Testing strategy

The first implementation should establish three layers of evidence.

### Static checks

- TypeScript strict mode;
- ESLint with zero warnings for project-owned source;
- production build succeeds.

### Behavioral tests

At minimum verify:

- navigation between all four screens;
- article modal open/close;
- gallery selection;
- blog publish and delete;
- review submission;
- persistence restoration;
- locator zoom clamping;
- keyboard focus and modal dismissal.

### Visual/interaction checks

Capture representative desktop and mobile states for:

- default control;
- hovered/focused control;
- pressed control;
- selected navigation tab;
- selected gallery reel;
- validation error;
- article modal;
- reduced-motion mode.

The goal is to test the grammar, not just render pixels.

## 12. Deployment model

GitHub repository: `qt314wink/neobrutalism-lab`

Vercel project target: `neobrutalism-lab`

Initial production surface: Specimen 001 (`apps/bold-co`).

Deployment should occur only after the production build passes locally/CI. Preview deployments should be used as visual evidence before promoting the first production deployment.

## 13. Explicit non-goals for bootstrap

The first implementation does not include:

- a server-backed CMS;
- authentication;
- external database persistence;
- user accounts;
- a generalized component publishing pipeline;
- Storybook unless the extracted primitive surface becomes large enough to justify it;
- multiple specimens before Specimen 001 is stable enough to serve as comparison evidence.

## 14. Bootstrap success criteria

Bootstrap is complete when:

1. the normalized BOLD_CO specimen compiles from clean checkout;
2. the four screens and modal preserve the supplied prototype behavior;
3. persistent blog/review state works without crashing on malformed storage;
4. key physical-offset interactions are represented through reusable tokens/helpers instead of duplicated magic values;
5. accessibility constraints above are met for the implemented interactions;
6. strict lint/type/build checks pass;
7. the specimen has a Vercel preview deployment;
8. the repository contains enough documentation to trace at least one visible behavior from observation through token/primitive to rendered specimen.

## 15. Next implementation boundary

After this specification is accepted, the implementation plan should cover only:

**Bootstrap workspace + normalize and decompose Specimen 001 + extract the minimum proven token/interaction layer + establish validation + produce first Vercel preview.**

Additional Neo-Brutalist specimens are deliberately deferred until this boundary is complete.
