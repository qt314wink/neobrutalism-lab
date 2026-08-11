# CI Contract

## Pull-request gate

Environment:
- Ubuntu runner;
- Node 22;
- no required model-provider credentials.

Order:
1. checkout;
2. install dependencies;
3. run `npm run validate`;
4. upload Storybook static output on failure or review workflows when desired.

## Reproducibility gate

A committed `package-lock.json` is mandatory before merge. The initial foundation branch may use `npm install` only because the current authoring sandbox cannot reach the npm registry. Once the lockfile is generated, CI must switch to `npm ci` and any dependency-manifest change without corresponding lock change must fail review.

## Genesis safety

CI never invokes a paid generative API. Genesis tests use fixtures and an injected fake provider. Provider integration is executed manually or from a separately permissioned workflow only after explicit authorization.
