# Poster and Campaign-Key-Visual Canvas

## Purpose

Separate visual synthesis from deterministic communication design. Use it for
posters, launch key visuals, event graphics, campaign systems, social crops, and
banner families.

## Topology

`brand/copy hierarchy -> subject and background authorities -> textless key visual -> channel crops -> layout handoff`

Recommended groups:

1. `01 Brand and copy contract`
2. `02 Visual authorities`
3. `03 Textless key visual`
4. `04 Channel variants`
5. `05 Deterministic layout handoff`

## Split of responsibility

Use image generation for subject, environment, texture, lighting, and composition.
Use a visible text node to preserve exact headline, subhead, date, venue, price,
CTA, legal copy, logo rules, reading order, and safe margins. Add final typography
in a deterministic design surface when exact copy or print quality matters.

Do not ask the model to invent missing marketing copy. Do not treat readable text
in one generated take as a stable layout system.

## Maintained example

The example campaign is `AFTERIMAGE / 光后`. It creates a textless 3:4 key visual
from a reflective sculptural subject and a controlled red-light environment, then
derives 3:4, 1:1, and 16:9 canvas variants. A separate handoff node records exact
copy, layout constraints, and the final deterministic 2:3 or 4:5 crop when the
live image-node catalog does not expose those ratios.

## Acceptance

Verify hierarchy at thumbnail size, subject/copy collision, crop-safe regions,
contrast, exact copy, date and price accuracy, logo clear space, series consistency,
and export ratio. Reject a crop that merely stretches or recenters the master
without rebalancing the composition.
