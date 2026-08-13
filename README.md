# Neobrutalism Lab

A research-and-implementation repository for identifying, specifying, testing, and rendering Neo-Brutalist interface grammar.

The repository boundary is the **system**, not a single brand demo. The first executable reference is **Specimen 001 — BOLD_CO / Cyber-Editorial Neo-Brutalism**.

## Traceability contract

`observation -> named mechanism -> semantic token -> primitive/helper -> component -> specimen -> test -> deployed evidence`

`apps/bold-co` preserves Home, Company Info/locator/gallery/reviews, Journal + article dialog, and a browser-local CMS. Bootstrap intentionally has no server CMS, authentication, database, or user accounts.

## Validation

```bash
npm ci
npm run validate
```

Validation runs lint, TypeScript checking, behavior tests, and production build.

## Foundation release gate

Foundation work ships before new specimen work starts. A foundation pull request is
ready to leave draft only when all of the following are true:

1. The branch is conflict-free with `main` and required checks are current.
2. `npm ci` and `npm run validate` pass from a clean checkout.
3. The deployed preview has been reviewed at desktop and mobile widths.
4. The traceability contract remains intact for every affected specimen.
5. After merge, the production deployment is healthy before the next workstream begins.

See [`docs/release-gates.md`](docs/release-gates.md) for the reconciliation and
production-verification procedure.
