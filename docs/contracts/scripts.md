# Script Contract

- `npm run lint`: lint all project-owned JS/TS/TSX with zero warnings.
- `npm run typecheck`: run package TypeScript checks without emitting files.
- `npm run test`: run Vitest once.
- `npm run build`: compile package entry points with TypeScript build configs.
- `npm run storybook`: interactive isolation environment.
- `npm run storybook:build`: static Storybook evidence build.
- `npm run registry:check`: validate graph node uniqueness, edge endpoints and relation kinds using dependency-free Node code.
- `npm run genesis:fixture`: run deterministic Genesis fixture validation without network access.
- `npm run genesis`: execute a governed provider call from a request file; requires `OPENAI_API_KEY` and `OPENAI_MODEL`.
- `npm run validate`: merge-equivalent gate: registry, lint, typecheck, tests, builds, Storybook.
