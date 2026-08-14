# Foundation Verification Receipt

Date: 2026-08-11
Branch: `foundation/governed-system-bootstrap`
Draft PR: #3
Verified implementation head: `fd0fb9c52aa5939d5a5fe9ad02fab7e7a7f6845e`
GitHub Actions run: `31506768257`
Runner: Ubuntu 24.04, Node 22.23.1, npm 10.9.8

## Merge-equivalent command

```text
npm ci --no-audit --no-fund
npm run validate
```

## Result

- immutable install: PASS (`335` packages installed from committed lockfile);
- system registry: PASS (`registry:ok`);
- architecture boundaries: PASS (`boundaries:ok`);
- ESLint: PASS;
- strict TypeScript typecheck: PASS;
- Node contract/governance tests: 17/17 PASS;
- Vitest UI/Genesis tests: 21/21 PASS across 4 files;
- deterministic Genesis fixture: ACCEPTED with schema/context/path/dependency/evidence/coverage/graph checks all PASS;
- Genesis accepted receipt includes canonical candidate `subjectDigest` (`sha256:…`);
- stale-receipt/candidate-mutation regression: PASS;
- NUL/path containment regression: PASS;
- post-mount selected-state synchronization regression: PASS;
- TypeScript package build: PASS;
- Storybook 10.5.5 production build: PASS.

Total executable tests: **38/38 PASS**.

## Scope confirmation

No product-specific BOLD_CO application code was added on this branch. The foundation contains only contracts, tokens, interaction mechanics, reusable UI isolates, domain-neutral composition, governance/verification tooling, Storybook evidence, and Genesis proposal infrastructure.

## Integrity hardening

The final code-review cycle found and resolved two material issues before handoff:

1. `PhysicalButton` now derives persistent selected/rest state from current props when no transient interaction state is active, so `data-nb-state` remains synchronized across rerenders.
2. Genesis receipts now bind to the exact schema-valid candidate through a canonical SHA-256 digest. The proposal writer recomputes the digest immediately before materialization and rejects stale or altered candidates.

Path validation also has an explicit regression for NUL-containing paths.

## Non-blocking observation

Storybook's production build reports Vite chunk-size warnings for Storybook/tooling bundles (including axe/iframe). No product application bundle exists on this branch, so product bundle budgets are deferred to the first app track and should be enforced there rather than suppressing this warning globally.

## Closure rule

This receipt records the verified implementation head. The documentation commit containing this receipt must itself pass the same immutable install + `npm run validate` gate before PR #3 is described as ready for human review.
