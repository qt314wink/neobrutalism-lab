# Governed Genesis Protocol

Genesis is a proposal compiler, not an autonomous committer.

## Input

Every request states:
- `problem`: concrete design/engineering problem;
- `painPoint`: why the current state is insufficient;
- `target`: requested artifact family;
- `observations`: evidence-backed observations with IDs;
- `constraints`: hard requirements with IDs;
- `benchmarks`: success checks with IDs;
- `allowedDependencies`;
- `allowedWriteRoots`.

## Model output

Structured candidate output must contain:
- summary;
- assumptions;
- at least two alternatives;
- decision records referencing observation IDs;
- proposed files;
- tests;
- QA checks covering every constraint and benchmark;
- relationship edges;
- risks and open questions.

Decision records are concise, inspectable rationale summaries. They are not hidden chain-of-thought and are never treated as proof by themselves; evidence references and deterministic checks carry that role.

## Deterministic acceptance gates

A candidate is invalid if:
- the problem/pain point is not referenced;
- any write path escapes an allowed proposal root or contains an unsafe path form;
- tests are missing;
- alternatives are missing;
- a constraint or benchmark lacks both test and QA mappings;
- a decision lacks an observation reference;
- a dependency is not allowed;
- a relationship uses an unknown relation kind or unresolved endpoint;
- direct source mutation is requested.

For a schema-valid candidate, validation also computes a canonical SHA-256 candidate digest and stores it as the receipt `subjectDigest`. A proposal may materialize only when the current candidate digest still matches that accepted receipt. This prevents an accepted receipt from being reused after candidate mutation.

## Promotion

1. Generate candidate to `.genesis/proposals/<candidate-id>/`.
2. Validate schema and policy.
3. Bind the accepted receipt to the exact candidate digest.
4. Materialize only inside the isolated proposal root and verify the digest again at the write boundary.
5. Run candidate tests plus repository `npm run validate` in an isolated branch/worktree.
6. Produce a receipt recording command results and changed graph edges.
7. Human reviews candidate, alternatives, evidence and diff.
8. Only then may selected files be promoted into accepted package/app paths.
