# Specimen 002 — Procedural Type Field

## Evidence note

**Problem.** Static responsive typography often ignores the user's continuous input state.

**Experiment.** A shared, normalized interaction field drives semantic DOM typography and a progressively enhanced WebGL chromatic field. Desktop pointer velocity determines localized energy; narrow viewports use native scroll progress and velocity. Touch can temporarily take precedence without disabling native scrolling.

**Engineering claim.** Input normalization, state transitions, damping, and renderer mappings are deterministic and unit tested. Both renderers consume the same canonical state; neither renderer listens to input or mutates that state. Component tests cover semantic fallback and observable pointer transitions; Cypress browser coverage remains the next integration gate.

**Limitations.** This is a bounded reference specimen rather than a shader authoring framework or complete production design system. WebGL is decorative: unsupported clients retain the semantic headline and complete content.
