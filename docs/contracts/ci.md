# CI Contract

## Pull-request gate

Environment:
- Ubuntu runner;
- Node 22;
- current Node-24-runtime GitHub checkout/setup-node action majors;
- no required model-provider credentials.

Final order:
1. checkout;
2. install exactly from committed `package-lock.json` with `npm ci`;
3. run `npm run validate`.

`npm run validate` includes registry validation, lint, strict typecheck, Node tests, UI/governance tests, deterministic Genesis fixture validation, package build, and Storybook build.

## Reproducibility gate

A committed `package-lock.json` is mandatory before merge. Dependency-manifest changes without a matching lockfile change are invalid. CI uses `npm ci`, never an unconstrained install, after bootstrap closure.

## Genesis safety

CI never invokes a paid generative API. Genesis tests use fixtures and an injected fake Responses boundary. Provider integration is executed manually or from a separately permissioned workflow only after explicit authorization.
