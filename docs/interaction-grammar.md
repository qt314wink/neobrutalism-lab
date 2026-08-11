# Physical-Offset Interaction Grammar

**Observation:** controls imply physical depth using a hard black offset shadow.

**Mechanism:** the shadow represents available travel distance. A press consumes that represented depth, coupling transform distance and shadow depth.

`REST -> HOVER/FOCUS LIFT -> PRESS/SHADOW COLLAPSE -> RELEASE -> REST`

Implementation: `src/design/tokens.ts` declares candidate offsets; `physicalOffset.ts` produces coupled shadow/press variables; `.physical-offset` implements the states.

Under `prefers-reduced-motion: reduce`, marquee, pulse, spin, and entrance animation are disabled while state remains legible through border, color, text, and static position.

Status: **candidate reusable grammar** derived from one executable specimen; cross-specimen validation is still required before package promotion.
