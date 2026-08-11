# ADR-0001: Governed System-First Foundation

- Status: Accepted
- Date: 2026-08-11

## Context

The first BOLD_CO plan was specimen-first. The project direction now requires independently working, interoperable isolates before application composition, plus a governed generative path that produces explainable candidate artifacts with QA evidence rather than directly mutating source.

## Decision

Use one npm workspace repository with strictly layered packages:

`contracts -> tokens -> interaction -> primitives -> patterns -> assemblies -> compositions -> apps`

`genesis` is a sidecar governance package. It can read contracts and token context but outputs proposals only.

Every accepted reusable item receives a registry node. Every material dependency/derivation receives a typed edge.

## Consequences

Positive:
- mechanisms can be tested independently;
- app-specific style cannot silently become system truth;
- relationship/provenance queries become possible;
- generated assets are auditable and rejectable before integration;
- multiple product tracks can reuse the same lower layers.

Costs:
- more explicit contracts and small files up front;
- more promotion discipline;
- application reconstruction begins later.

## Rejected alternatives

1. Continue specimen-first and extract later: too easy to entangle product state with reusable grammar.
2. Build a generalized design system with no executable composition: insufficient evidence that abstractions combine correctly.
3. Let the model write directly into `src/`: violates governance, reproducibility and review boundaries.
