---
name: artarch-workflow-patterns
description: "Build and document reusable ArtArch Studio canvas patterns for ecommerce content, Chinese short drama, long takes, creative or style films, posters, photoreal people, and storyboard-to-video production. Use when the user asks for a repeatable canvas structure, business workflow template, AIGC production convention, acceptance project, or reusable execution and recovery workflow."
---

# ArtArch Workflow Patterns

Before any node execution, read and follow the [Studio generation approval
rules](../artarch-studio/SKILL.md#generation): explain the node's purpose and
expected credits, then wait for explicit approval for that node. Only an
explicit request to run the agreed workflow in one go waives per-node questions;
a creative brief or request for a finished result does not. Unknown cost and
retries require the handling specified there. These rules also apply to all
execution stages and examples below.

Build patterns from the live ArtArch Studio node catalog. Use the ArtArch MCP tools for
every canvas change; do not invent node kinds, settings, connections, or run
behavior.

## Select a pattern

| Request | Read |
| ---- | ---- |
| Product photography, listing images, A+ content, ad variants | [references/ecommerce.md](references/ecommerce.md) |
| Chinese vertical short drama or serialized dialogue scenes | [references/short-drama.md](references/short-drama.md) |
| Creative film, style film, fashion film, music visual, art short | [references/creative-short-film.md](references/creative-short-film.md) |
| Poster, key visual, campaign graphic, social crop set | [references/poster.md](references/poster.md) |
| Photoreal person, recurring face, virtual model, identity set | [references/photoreal-person.md](references/photoreal-person.md) |
| Storyboard, previs, shot-to-clip handoff, continuity board | [references/storyboard.md](references/storyboard.md) |
| Asset-first sketch board, rendered board, then video for long takes or short drama | [references/progressive-storyboard-video.md](references/progressive-storyboard-video.md) |
| Human-action reenactment with replaceable characters/backgrounds and canvas depth | [references/action-reenactment.md](references/action-reenactment.md) |

Always read [references/shared-contract.md](references/shared-contract.md) before
creating or changing one of these canvases. Read
[references/acceptance-projects.md](references/acceptance-projects.md) when the
user wants the maintained example canvases. Read

## Pattern contract

Before applying a pattern:

1. In the production directory, select the project and canvas by visible name
   with `artarch_project_select` (`name`, `confirmed: true`) and
   `artarch_canvas_select` (`name`). Inspect the selected canvas with
   `artarch_canvas_describe`, or create
   a separate named project and canvas when the pattern must remain independently
   reviewable.
2. Run `artarch_node_kinds` and verify every selected kind, model, input, output,
   aspect ratio, quality, resolution, duration, and audio option.
3. Assign every reference one primary role and connect it explicitly. Spatial
   proximity is not a dependency.
4. Keep the canvas left-to-right. Put inputs and contracts left, canonical assets
   next, derived assets or boards next, clips or channel variants next, and
   delivery nodes right.
5. Group nodes by production responsibility. Never put one node in two semantic
   groups.
6. Do not run generation while only constructing a pattern. Follow the
   [Studio generation approval rules](../artarch-studio/SKILL.md#generation)
   before every node submission: explain its purpose, disclose expected credits,
   and wait for approval. Batch runs require explicit informed batch authorization.
7. Node mutations auto-layout their selected or explicitly scoped canvas;
   `artarch_canvas_batch` includes layout in the same persisted batch. Check
   the mutation's layout outcome or batch version, then read back the canvas;
   do not repeat `artarch_canvas_layout` after every node. If an additional
   presentation pass is needed, request confirmation before invoking that
   explicit layout mutation. Plan for output-first cards at least 360 px wide,
   unit cards at least 362 px wide, and input cards at least 196 px high;
   larger measured dimensions take precedence. The layout keeps inputs on the
   left and independent pipelines together while preserving existing section
   containers and their contents.
   Completion requires named nodes, groups, business connections, and the final
   layout to survive reopening.

## Continuity handoff

For a long take, or for adjacent shots that remain logically and visually in the
same scene, use the accepted previous clip's final frame as a continuity
reference when it improves the handoff. Add the visible final-frame extraction
node kind, configure `Frame` as `-1`, and connect the previous clip to its Video
slot. Connect the extracted image to either:

- the next video node as its first-frame or explicitly named continuity reference;
- the next storyboard/image node as one reference image for the accepted opening
  state.

Inspect the accepted ending state before making this handoff. Do not use a planned
ending or rejected take as continuity evidence, and do not force final-frame
chaining across a real scene boundary; re-anchor from canonical assets there.

Running a downstream node also includes its connected upstream dependencies. To
avoid regenerating an accepted paid clip, first materialize that result as a
stable Video Input node, then connect `accepted clip -> final-frame extraction ->
downstream`.
Keep the original generation node for prompt and lineage review. Verify the live
node catalog and target business slot before connecting. Use a First Frame or
Opening Image slot for strict initialization, or a numbered Reference Images
position when the frame is one reference alongside identity, product,
environment, or style assets.

## Recreate the examples

When the user requests a new example, use `artarch_project_create` and
`artarch_canvas_create`, then build its structure using the node tools and the
live node catalog. Do not run generation as part of creating the structure.
Report the created project and canvas names.

## Finish and recover

- Run reviewed nodes with `artarch_run` in the selected canvas. For a fully
  authorized canvas-wide batch and permission to parallelize or a stated speed
  preference, omit `target` and use `wait: false`: canvas scope uses `multi`
  mode, which can schedule dependency-ready nodes together when supported.
  Do not parallelize targeted calls or include unapproved canvas nodes.
- Track the returned `runReference`; sleep or schedule a host wait of about
  15 seconds for video or 5 seconds for images between `artarch_run_status`
  calls when feasible. Use
  `artarch_canvas_run_progress` to list running nodes only if the MCP server
  exposes it. Do not busy-wait when background polling is unavailable; on a
  timeout, check the existing run rather than resubmitting a paid generation.
- Read back the terminal node result and artifact URL. An accepted HTTP response
  or submitted run alone does not prove delivery.
- Keep failed or unreviewed outputs out of canonical identity and continuity
  chains.
