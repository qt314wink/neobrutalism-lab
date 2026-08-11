# BOLD_CO Specimen 001 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a normalized, accessible, testable BOLD_CO React application as Specimen 001 while extracting only the minimum proven Neo-Brutalist token and physical-offset interaction layer.

**Architecture:** A Vite/React/TypeScript application lives at `apps/bold-co`. App-level state is orchestrated from `App.tsx`, while each user-visible responsibility is isolated into screen/feature components. Reusable visual grammar is exposed through local token and interaction modules first; package extraction is deferred until multiple consumers prove the abstraction.

**Tech Stack:** React 19, TypeScript 5, Vite 7, Tailwind CSS 4, Lucide React, Vitest, React Testing Library, ESLint, GitHub Actions, Vercel.

## Global Constraints

- `BOLD_CO` is **Specimen 001 — BOLD_CO / Cyber-Editorial Neo-Brutalism**.
- Preserve all four supplied screens and the article modal.
- Browser-local persistence only for the bootstrap; no server-backed CMS, auth, database, or user accounts.
- Malformed persisted data must fall back safely to canonical seed data.
- Physical-offset interactions must couple transform distance to visible shadow depth.
- Keyboard access, explicit focus visibility, accessible icon labels, Escape-to-close modal behavior, reduced-motion support, contrast, and touch target usability are required.
- TypeScript strict mode, ESLint zero warnings, tests, and production build must pass.
- Do not create empty packages or generalized abstractions without a proven consumer.
- Vercel preview is the deployment evidence target; production promotion is deferred until preview validation.

---

## File map

```text
neobrutalism-lab/
├── .github/workflows/validate.yml                 # CI validation gate
├── .gitignore                                     # generated/local artifacts
├── package.json                                   # npm workspace and root scripts
├── tsconfig.json                                  # workspace TS references/base policy
├── README.md                                      # lab purpose + traceability contract
├── apps/bold-co/
│   ├── index.html                                 # static font/document metadata
│   ├── package.json                               # specimen dependencies/scripts
│   ├── tsconfig.json                              # strict browser app compiler config
│   ├── vite.config.ts                             # Vite + Vitest config
│   └── src/
│       ├── main.tsx                               # React entrypoint
│       ├── App.tsx                                # navigation + shared specimen state
│       ├── styles.css                             # Tailwind import + global animation/focus rules
│       ├── model.ts                               # BlogPost/Review/Tab types
│       ├── data/seed.ts                           # canonical blogs/reviews/gallery/ticker
│       ├── lib/storage.ts                         # safe localStorage parsing/persistence
│       ├── design/tokens.ts                       # semantic color/border/shadow/motion tokens
│       ├── design/physicalOffset.ts               # coupled offset-shadow helper
│       ├── components/TickerBanner.tsx            # marquee status strip
│       ├── components/AppHeader.tsx                # primary tab navigation
│       ├── components/AppFooter.tsx                # status + secondary navigation
│       ├── components/ArticleModal.tsx             # accessible dialog behavior
│       ├── screens/HomeScreen.tsx                  # hero, metrics, services, CTA
│       ├── screens/AboutScreen.tsx                 # company, locator, gallery, reviews
│       ├── screens/JournalScreen.tsx               # post feed + modal triggers
│       ├── screens/DashboardScreen.tsx             # create/delete blog UI
│       └── test/
│           ├── setup.ts                            # jest-dom setup
│           ├── storage.test.ts                     # malformed/restored local state
│           ├── physicalOffset.test.ts              # shadow/translation coupling
│           └── app.test.tsx                        # navigation/modal/publish/review/gallery behavior
└── docs/
    ├── visual-language.md                          # observed semantic grammar
    ├── interaction-grammar.md                      # physical-state model
    └── specimen-analysis.md                        # observation -> implementation receipts
```

## Task 1: Establish runnable workspace and validation harness

**Files:**
- Create: `package.json`
- Create: `tsconfig.json`
- Create: `.gitignore`
- Create: `apps/bold-co/package.json`
- Create: `apps/bold-co/tsconfig.json`
- Create: `apps/bold-co/vite.config.ts`
- Create: `apps/bold-co/index.html`
- Create: `apps/bold-co/src/main.tsx`
- Create: `apps/bold-co/src/styles.css`
- Create: `apps/bold-co/src/test/setup.ts`
- Create: `.github/workflows/validate.yml`

**Interfaces:**
- Produces root commands: `npm run lint`, `npm run typecheck`, `npm run test`, `npm run build`, `npm run validate`.
- Produces `@neobrutalism-lab/bold-co` workspace.

- [ ] **Step 1: Write workspace manifests with exact scripts**

Root `package.json`:

```json
{
  "name": "neobrutalism-lab",
  "private": true,
  "workspaces": ["apps/*"],
  "scripts": {
    "lint": "npm run lint --workspace @neobrutalism-lab/bold-co",
    "typecheck": "npm run typecheck --workspace @neobrutalism-lab/bold-co",
    "test": "npm run test --workspace @neobrutalism-lab/bold-co",
    "build": "npm run build --workspace @neobrutalism-lab/bold-co",
    "validate": "npm run lint && npm run typecheck && npm run test && npm run build"
  }
}
```

Specimen scripts must run ESLint with `--max-warnings=0`, `tsc --noEmit`, Vitest once, and Vite build.

- [ ] **Step 2: Configure strict TypeScript and Vite/Vitest**

Use DOM/ES2022 libraries, `strict: true`, `noUnusedLocals: true`, `noUnusedParameters: true`, JSX `react-jsx`, and Vitest `jsdom` environment with `src/test/setup.ts`.

- [ ] **Step 3: Add minimal `main.tsx` and Tailwind stylesheet**

`main.tsx` imports `./styles.css`, mounts `<App />` into `#root`, and uses `StrictMode`.

- [ ] **Step 4: Add CI validation gate**

Workflow trigger: push to `main` and pull requests. Use Node 22, `npm ci`, then `npm run validate`.

- [ ] **Step 5: Commit**

```bash
git add package.json tsconfig.json .gitignore .github apps/bold-co
git commit -m "build: bootstrap bold-co specimen workspace"
```

## Task 2: Define domain model and safe browser persistence

**Files:**
- Create: `apps/bold-co/src/model.ts`
- Create: `apps/bold-co/src/data/seed.ts`
- Create: `apps/bold-co/src/lib/storage.ts`
- Test: `apps/bold-co/src/test/storage.test.ts`

**Interfaces:**
- Produces `BlogPost`, `Review`, `GalleryImage`, `TabId`.
- Produces `loadStoredArray<T>(key, fallback, guard)` and `saveStoredArray<T>(key, value)`.
- Produces `INITIAL_BLOGS`, `INITIAL_REVIEWS`, `GALLERY_IMAGES`, `TICKER_ITEMS`.

- [ ] **Step 1: Write failing malformed-storage tests**

```ts
expect(loadStoredArray('blogs', INITIAL_BLOGS, isBlogPost)).toEqual(INITIAL_BLOGS)
```

Cover invalid JSON, valid non-array JSON, and arrays containing invalid records.

- [ ] **Step 2: Run the storage test and verify failure because helpers do not exist**

Run: `npm run test --workspace @neobrutalism-lab/bold-co -- storage.test.ts`
Expected: FAIL on unresolved `loadStoredArray`.

- [ ] **Step 3: Implement guards and safe storage helpers**

`loadStoredArray` must return `fallback` when `window`/storage is unavailable, parsing fails, parsed data is not an array, or any item fails the guard. `saveStoredArray` catches storage exceptions and returns `boolean` rather than throwing.

- [ ] **Step 4: Normalize supplied seed content**

Use raw Unsplash URL strings and unescaped identifiers. Preserve titles, summaries, review copy, and gallery metadata from the supplied prototype.

- [ ] **Step 5: Run storage tests and commit**

```bash
npm run test --workspace @neobrutalism-lab/bold-co -- storage.test.ts
git add apps/bold-co/src/model.ts apps/bold-co/src/data apps/bold-co/src/lib apps/bold-co/src/test/storage.test.ts
git commit -m "feat: add specimen data model and safe persistence"
```

## Task 3: Encode the minimum proven Neo-Brutalist grammar

**Files:**
- Create: `apps/bold-co/src/design/tokens.ts`
- Create: `apps/bold-co/src/design/physicalOffset.ts`
- Test: `apps/bold-co/src/test/physicalOffset.test.ts`
- Modify: `apps/bold-co/src/styles.css`

**Interfaces:**
- Produces `specimenColors`, `borderWidths`, `shadowOffsets`, `motionDurations`.
- Produces `physicalOffsetStyle(offset: number)` returning `{ boxShadow, '--press-offset': string }`.

- [ ] **Step 1: Write coupling tests**

```ts
expect(physicalOffsetStyle(4)).toEqual({
  boxShadow: '4px 4px 0 0 #000000',
  '--press-offset': '4px'
})
```

Verify only declared offsets are accepted and invalid offsets fall back to the canonical 4px value.

- [ ] **Step 2: Implement semantic tokens**

Represent lime `#A2FF00`, cyan `#00E5FF`, pink `#FF007A`, yellow `#FFE600`, ink `#000000`, paper `#F4F0EA`, and white `#FFFFFF` by semantic names, while documenting that hue is specimen-specific and semantic role is the reusable observation.

- [ ] **Step 3: Implement physical-offset CSS behavior**

Add reusable `.physical-offset` behavior using `--press-offset`; hover/focus-visible lifts slightly, active translates by the full shadow offset and removes the shadow. Add `@media (prefers-reduced-motion: reduce)` rules to stop marquee/ping/spin and remove nonessential transitions.

- [ ] **Step 4: Run tests and commit**

```bash
npm run test --workspace @neobrutalism-lab/bold-co -- physicalOffset.test.ts
git add apps/bold-co/src/design apps/bold-co/src/styles.css apps/bold-co/src/test/physicalOffset.test.ts
git commit -m "feat: encode physical offset interaction grammar"
```

## Task 4: Build the application shell and navigation

**Files:**
- Create: `apps/bold-co/src/App.tsx`
- Create: `apps/bold-co/src/components/TickerBanner.tsx`
- Create: `apps/bold-co/src/components/AppHeader.tsx`
- Create: `apps/bold-co/src/components/AppFooter.tsx`
- Begin: `apps/bold-co/src/test/app.test.tsx`

**Interfaces:**
- `AppHeader` consumes `currentTab: TabId` and `onNavigate(tab: TabId): void`.
- `AppFooter` consumes `onNavigate(tab: TabId): void`.
- `App` owns shared blog/review state and current tab.

- [ ] **Step 1: Write failing navigation test**

Render `<App />`, click `02. COMPANY_INFO`, assert the company screen heading becomes visible; repeat for Journal and Dashboard.

- [ ] **Step 2: Implement shell with semantic buttons**

Header tabs must expose `aria-current="page"` for the selected tab, use explicit focus-visible outlines, and call a shared navigation helper that scrolls to top.

- [ ] **Step 3: Implement ticker/footer without render-time clock drift**

Ticker repeats canonical items. Footer clock state updates on an interval from an effect and clears the interval on unmount; do not call `new Date()` directly as dynamic text during every unrelated render.

- [ ] **Step 4: Run navigation test and commit**

```bash
npm run test --workspace @neobrutalism-lab/bold-co -- app.test.tsx
git add apps/bold-co/src/App.tsx apps/bold-co/src/components apps/bold-co/src/test/app.test.tsx
git commit -m "feat: add specimen application shell"
```

## Task 5: Reconstruct Home and About screens

**Files:**
- Create: `apps/bold-co/src/screens/HomeScreen.tsx`
- Create: `apps/bold-co/src/screens/AboutScreen.tsx`
- Modify: `apps/bold-co/src/App.tsx`
- Modify: `apps/bold-co/src/test/app.test.tsx`

**Interfaces:**
- `HomeScreen` consumes `onNavigate(tab: TabId): void`.
- `AboutScreen` consumes `reviews`, `onAddReview`, gallery seed data, and internal locator/gallery state.

- [ ] **Step 1: Add failing gallery and review tests**

Select `THE SOUND SYNTH` thumbnail and assert the large preview title changes. Submit a named review and assert its comment appears in the live review feed.

- [ ] **Step 2: Implement Home preserving hero/metrics/services/CTA**

Convert repeated physical buttons/cards to `.physical-offset` and semantic token use where it directly replaces repeated magic values; do not generalize every card into a package primitive.

- [ ] **Step 3: Implement About locator/gallery/review behavior**

Clamp zoom to 10–18. Use deterministic recenter increments rather than `Math.random()` in tests by extracting the next center calculation from the click handler or using a fixed bounded cycle. Gallery thumbnails must be `<button>` elements, not clickable `<div>` elements.

- [ ] **Step 4: Add image fallback behavior**

On image error, replace the image display with a labelled neutral surface preserving title and badge metadata.

- [ ] **Step 5: Run tests and commit**

```bash
npm run test --workspace @neobrutalism-lab/bold-co -- app.test.tsx
git add apps/bold-co/src/screens apps/bold-co/src/App.tsx apps/bold-co/src/test/app.test.tsx
git commit -m "feat: reconstruct home and about specimen screens"
```

## Task 6: Reconstruct Journal, accessible article modal, and CMS

**Files:**
- Create: `apps/bold-co/src/screens/JournalScreen.tsx`
- Create: `apps/bold-co/src/screens/DashboardScreen.tsx`
- Create: `apps/bold-co/src/components/ArticleModal.tsx`
- Modify: `apps/bold-co/src/App.tsx`
- Modify: `apps/bold-co/src/test/app.test.tsx`

**Interfaces:**
- `JournalScreen` consumes `blogs` and `onOpenArticle(post)`.
- `DashboardScreen` consumes `blogs`, `onPublish(postDraft)`, `onDelete(id)`.
- `ArticleModal` consumes `post`, `onClose()`.

- [ ] **Step 1: Add failing article-modal tests**

Open the first article, assert `role="dialog"` and title, press Escape, assert dialog removed, and assert focus returns to the triggering Read button.

- [ ] **Step 2: Implement modal focus lifecycle**

Store the previously focused element, focus the close button on mount, listen for Escape, restore prior focus on close, and use `aria-modal="true"` with `aria-labelledby`.

- [ ] **Step 3: Add failing publish/delete tests**

Submit a valid post in Dashboard, navigate to Journal, assert uppercase title appears; return to Dashboard, delete it, navigate back, assert absent. Submit incomplete form and assert explicit inline error.

- [ ] **Step 4: Implement Journal and Dashboard behavior**

Preserve category color, author, date, read time, summary, article body, empty feed state, and delete controller. Avoid delayed navigation via `setTimeout`; successful publish may navigate immediately after setting success state or keep the user in Dashboard with explicit action, but must be deterministic in tests.

- [ ] **Step 5: Run tests and commit**

```bash
npm run test --workspace @neobrutalism-lab/bold-co -- app.test.tsx
git add apps/bold-co/src/screens apps/bold-co/src/components/ArticleModal.tsx apps/bold-co/src/App.tsx apps/bold-co/src/test/app.test.tsx
git commit -m "feat: add journal cms and accessible article modal"
```

## Task 7: Close persistence, accessibility, and reduced-motion gaps

**Files:**
- Modify: `apps/bold-co/src/App.tsx`
- Modify: `apps/bold-co/src/styles.css`
- Modify: `apps/bold-co/src/test/app.test.tsx`

**Interfaces:**
- App initializes blog/review state through safe storage helpers and persists on change.

- [ ] **Step 1: Add persistence restoration test**

Seed `localStorage` with one valid blog before render and assert it appears in Journal. Seed malformed JSON in a second test and assert canonical seed posts render rather than throwing.

- [ ] **Step 2: Wire safe persistence**

Persist after changes; a persistence write failure must not roll back current in-memory state.

- [ ] **Step 3: Audit accessible names and focus behavior**

Ensure trash icon buttons have `aria-label` including the post title, all fields have associated labels, gallery controls expose selected state via `aria-pressed`, and interactive controls meet a 44px practical touch target where applicable.

- [ ] **Step 4: Add reduced-motion CSS evidence**

Continuous marquee/ping/spin animation must resolve to `animation: none` under reduced motion; state changes remain visible through static color/border/position differences.

- [ ] **Step 5: Run full tests and commit**

```bash
npm run test --workspace @neobrutalism-lab/bold-co
git add apps/bold-co/src
git commit -m "fix: harden specimen persistence and accessibility"
```

## Task 8: Document traceability and validate the clean build

**Files:**
- Create: `README.md`
- Create: `docs/visual-language.md`
- Create: `docs/interaction-grammar.md`
- Create: `docs/specimen-analysis.md`

**Interfaces:**
- Documentation traces at least one observed behavior through semantic token/helper to rendered component and test.

- [ ] **Step 1: Document visual-language roles**

Record semantic role, specimen value, observable cue, and non-color redundant cue for lime/cyan/pink/yellow/black/paper.

- [ ] **Step 2: Document physical interaction grammar**

Record `rest -> hover/focus -> press -> release`, shadow/translation coupling, reduced-motion behavior, and which components currently consume it.

- [ ] **Step 3: Record Specimen 001 evidence receipt**

At minimum include:

```text
Observation: controls imply physical depth with offset black shadow.
Mechanism: press consumes the represented depth.
Token/helper: shadowOffsets + physicalOffsetStyle + .physical-offset.
Consumers: primary CTA, navigation controls, specimen cards.
Verification: physicalOffset.test.ts + representative app behavior test.
Status: specimen-derived; candidate reusable grammar.
```

- [ ] **Step 4: Run complete validation**

Run:

```bash
npm ci
npm run validate
```

Expected: lint 0 warnings, typecheck success, Vitest success, Vite production build success.

- [ ] **Step 5: Commit**

```bash
git add README.md docs
npm run validate
git commit -m "docs: record specimen 001 traceability evidence"
```

## Task 9: Open PR, verify CI, and produce Vercel preview evidence

**Files:**
- No source file requirement unless CI/deployment exposes a defect.
- Update: GitHub Issue #1 and PR body with evidence.

**Interfaces:**
- Input: feature branch containing Tasks 1–8.
- Output: reviewable PR + green validation + Vercel preview URL/deployment evidence.

- [ ] **Step 1: Open PR against `main`**

PR title: `feat: bootstrap BOLD_CO specimen 001`

PR body must enumerate preserved behavior, extracted grammar, accessibility measures, validation commands, and explicit non-goals.

- [ ] **Step 2: Verify GitHub Actions**

Require the `validate` workflow to complete successfully for the PR head SHA. If it fails, inspect the failed job logs and fix only the actual failure before re-running validation.

- [ ] **Step 3: Configure/import the matching Vercel project when available**

Target project: `neobrutalism-lab` in the `melodicbloom` Vercel team. Set Root Directory to `apps/bold-co` if Git integration is used. Build command: `npm run build`; output: `dist`.

- [ ] **Step 4: Inspect preview deployment**

Verify deployment status is READY and fetch the preview page. Record the URL/deployment ID in the PR and Issue #1.

- [ ] **Step 5: Update Issue #1 bootstrap checklist**

Mark implementation/validation/preview items complete only with observed evidence. Keep production promotion and later specimens outside this issue.
