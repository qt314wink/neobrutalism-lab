# Specimen 001 Analysis Receipts

## Receipt 001 — Physical depth
Observation: controls imply depth with a hard offset shadow. Secondary observation: strong interactions change the object/shadow relationship, not only color. Mechanism: press consumes represented depth. Implementation: `shadowOffsets` + `physicalOffsetStyle()` + `.physical-offset`. Verification: `physicalOffset.test.ts` plus real control behavior. Status: specimen-derived candidate reusable grammar.

## Receipt 002 — Chromatic semantics
Observation: saturated colors repeat with role expectations—lime action/live, cyan technical information, yellow annotation/selection, pink expressive emphasis. Mechanism: color is one channel in a redundant state signal. Components pair it with text, border, `aria-current`, `aria-pressed`, or status copy. Status: semantic roles are candidates; exact hues remain specimen-specific.

## Receipt 003 — Brutality without interaction loss
Observation: compact object-like controls must not become inaccessible clickable containers. Mechanism: preserve visual objecthood while upgrading element semantics. Gallery reels are buttons with `aria-pressed`; destructive icon buttons have contextual labels; article view is a labelled dialog with Escape and focus restoration; focus-visible uses a high-contrast outline. Verification: `app.test.tsx` covers navigation, gallery, review, article dialog, CMS, validation, and persistence recovery.
