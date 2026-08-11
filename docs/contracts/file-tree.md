# File-Tree Contract

This tree is architectural. A directory may be added only when its layer owns a distinct responsibility.

```text
neobrutalism-lab/
├── .github/workflows/
│   └── validate.yml
├── .storybook/
│   ├── main.ts
│   └── preview.ts
├── docs/
│   ├── architecture/
│   ├── contracts/
│   ├── governance/
│   └── superpowers/
├── packages/
│   ├── contracts/
│   │   └── src/
│   ├── tokens/
│   │   └── src/
│   ├── interaction/
│   │   └── src/
│   ├── primitives/
│   │   └── src/
│   ├── patterns/
│   │   └── src/
│   ├── assemblies/
│   │   └── src/
│   ├── compositions/
│   │   └── src/
│   └── genesis/
│       ├── src/
│       └── fixtures/
├── registry/
│   └── system-graph.json
├── scripts/
│   └── validate-registry.mjs
├── eslint.config.mjs
├── package.json
└── tsconfig.base.json
```

## Ownership rules

- `contracts`: schemas/types only; no React and no visual values.
- `tokens`: semantic values; no React.
- `interaction`: pure state/behavior functions; no React.
- `primitives`: smallest accessible UI building blocks.
- `patterns`: recognizable reusable motifs made from primitives.
- `assemblies`: coordinated groups of patterns/primitives with slots or internal state.
- `compositions`: page/section arrangements; still domain-neutral.
- `apps`: specimen/product-specific state, content, routes and features.
- `genesis`: generation request/candidate governance and provider adapters; never accepted UI source.
- `registry`: machine-readable system graph; no implementation logic.
- `docs`: human-readable rationale/contracts/evidence.

## Dependency rule

A layer may import only from itself or layers to its left in:

`contracts -> tokens -> interaction -> primitives -> patterns -> assemblies -> compositions -> apps`

Genesis may import from `contracts` and `tokens` only.
