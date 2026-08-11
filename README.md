# Neobrutalism Lab

A research-and-implementation repository for identifying, specifying, testing, and rendering Neo-Brutalist interface grammar.

The repository boundary is the **system**, not a single brand demo. The first executable reference is **Specimen 001 — BOLD_CO / Cyber-Editorial Neo-Brutalism**.

## Traceability contract

`observation -> named mechanism -> semantic token -> primitive/helper -> component -> specimen -> test -> deployed evidence`

`apps/bold-co` preserves Home, Company Info/locator/gallery/reviews, Journal + article dialog, and a browser-local CMS. Bootstrap intentionally has no server CMS, authentication, database, or user accounts.

## Validation

```bash
npm install
npm run validate
```

Validation runs lint, TypeScript checking, behavior tests, and production build.
