# Package Choices

Reference date: 2026-08-11.

## Installed foundation dependencies

- React / React DOM: `19.2.7`
- Vite: `8.1.5`
- `@vitejs/plugin-react`: `6.0.4`
- TypeScript: `6.0.3`
- ESLint: `10.8.0`
- `typescript-eslint`: `8.65.0`
- Vitest: `4.1.10`
- jsdom: `30.0.1`
- React Testing Library: `16.3.2`
- jest-dom: `7.0.0`
- Storybook / React Vite: `10.5.5`
- Zod: `4.4.3`
- `tsx`: `4.22.5`
- OpenAI JavaScript SDK: `7.1.0`

## Deliberate constraints

TypeScript is pinned to `6.0.3`, not the newer 7.x line, because the selected `typescript-eslint` release currently documents support for TypeScript `<6.1.0`. This is a compatibility decision, not version neglect.

No Tailwind dependency is installed in the system foundation. System mechanics are expressed as semantic tokens and small CSS files. Product tracks may add Tailwind when its utility model is useful without changing system contracts.

Motion is deferred until a real assembly/composition needs spring/layout behavior beyond CSS. This keeps the physical interaction model independently testable and prevents animation tooling from defining the base architecture.
