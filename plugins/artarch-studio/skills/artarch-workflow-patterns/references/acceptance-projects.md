# Maintained Acceptance Projects

Recreate these maintained examples when a reviewable copy is needed:

| Pattern | Project name | Expected business shape |
| ---- | ---- | ---- |
| Ecommerce | AIGC Pattern 01 - Ecommerce - 20260727 | Brief, canonical product, derivatives, delivery groups |
| Chinese short drama | AIGC Pattern 02 - Chinese Short Drama - 20260727 | Story contract, canonical assets, storyboard, clips, delivery |
| Creative/style short film | AIGC Pattern 03 - Creative Style Film - 20260727 | Directing thesis, visual anchors, shot board, beats, delivery |
| Poster | AIGC Pattern 04 - Poster and KV - 20260727 | Brand contract, visual authorities, key visual, channel variants |
| Photoreal person | AIGC Pattern 05 - Photoreal Person - 20260727 | Consent, canonical identity, reference coverage, scenes |
| Storyboard-to-video | AIGC Pattern 06 - Storyboard to Video - 20260727 | Scene contract, assets, storyboard, clean handoff, clips, delivery |

In each example's working directory, select it by visible name and read it back:

- Use `artarch_project_select` with `name` and `confirmed: true`.
- Use `artarch_canvas_select` with `name`; project scope is already selected.
- Use `artarch_canvas_describe` with no arguments; it reads the selected canvas.

Do not run these examples until the user replaces fictional inputs where
necessary and approves prompts, models, costs, and output scope.

## Production Workflow Reference

`ArtArch Japan Spotlight x Studio 60s` is historical production evidence for the
asset-first sketch-to-render-to-video pattern, including a final-frame
continuation. Use it to study reference roles, review gates, and continuity. Do
not copy its campaign assets, prompts, models, media URLs, or generated results.
The reusable contract is documented in
[Asset-First Progressive Storyboard Video](progressive-storyboard-video.md).
The readback proves the workflow shape, not a fully accepted final; the newer
rendered-board and continuation branch had not reached terminal status at the
time of review.
