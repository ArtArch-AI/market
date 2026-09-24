# Asset-First Progressive Storyboard Video

## Purpose

Use this pattern for long takes, cinematic continuous scenes, and short drama
when visual consistency matters enough to approve the production in four visible
stages:

`canonical assets -> sketch storyboard -> rendered storyboard -> video`

The sketch board settles time, blocking, camera, performance, and edit logic
before expensive rendering. The rendered board settles the final visual states
before video motion is generated. Do not collapse these into one generic
"storyboard" stage.

## Production reference

This pattern was extracted from the persisted production canvas
`ArtArch Japan Spotlight x Studio 60s` on 2026-08-07. Its readback contained a
large six-group production workflow. The reusable mechanism was:

`direction contracts -> canonical assets -> global sketch -> segment sketch revisions -> fully rendered segment boards -> label-free handoff -> reference-to-video`

One continuation branch also used:

`accepted previous clip -> final-frame extraction -> next continuation clip`

Treat the canvas as evidence for topology and review gates. Do not copy its
Japanese campaign content, characters, prompts, models, media URLs, or completed
results into another production. The V03B-1 rendered-board, video, and final-frame
branch had persisted terminal results; the newer V03B-2 rendered board and
continuation did not show terminal status in this readback, so this canvas is not
evidence of a fully accepted end-to-end final.

## Recommended groups

1. `01 Story and direction contract`
2. `02 Canonical assets`
3. `03 Sketch storyboard`
4. `04 Rendered storyboard`
5. `05 Video segments`
6. `06 Continuity and delivery`

Lay these groups left to right. Stack parallel scene or segment branches
vertically. Every runtime dependency needs an explicit business connection; group membership and visual
proximity are not inputs.

## Stage 1: Canonical assets

Create and approve the sources that control dimensions which must not drift:

- lead and supporting character identity, age, face, hair, body, and costume;
- environment geometry, time of day, lighting logic, and spatial landmarks;
- hero props, products, vehicles, creatures, screens, or brand marks;
- style and medium authority;
- exact UI or layout truth when a real interface appears on screen.

Give every asset one primary reference role. Separate identity, wardrobe,
environment, style, composition, UI truth, and brand authority instead of asking
one image to control all of them. Promote accepted generated assets to stable
Image Input nodes before broad reuse.

## Stage 2: Sketch storyboard

The sketch board is the structural contract. It may begin as one global board for
the whole scene or episode, but each video-generation unit must also have an
exact segment board when the global board is too broad.

Every panel records:

- panel number, represented time range, and target aspect ratio;
- opening state, visible action, and observable ending state;
- framing, screen direction, camera path, and whether a cut exists;
- performance, exact dialogue, sound intent, and transition;
- which canonical assets govern the panel.

Keep it monochrome or otherwise visually economical when possible. Use
Text to Image for a contract-only first draft or a multi-reference image kind when
canonical assets must already constrain identity and space. If a global sketch is
re-cut into segment sketches, the segment board becomes authoritative for that
time range; do not send the global board directly to the video node.

Approve timing, continuity, action density, and camera grammar here. Do not spend
the rendered-board stage repairing unresolved story structure.

## Stage 3: Rendered storyboard

Create a fully rendered board from the approved segment sketch plus only the
canonical assets needed by that segment. The rendered board owns final
composition, character appearance, environment, lighting, color, material, and
the visible start and end states. It must not silently change shot order, timing,
dialogue, blocking, or camera logic approved in the sketch.

Keep two artifacts when annotations are useful:

- an annotated rendered review board with panel numbers and time ranges;
- a clean or label-free handoff containing only scene imagery for video input.

Do not feed panel numbers, arrows, borders, timecodes, production notes, UI
chrome, or blank placeholders into the video model. When any generated image is
used downstream, apply the parent skill's generated-image clean-pass rules first;
connect the approved original PNG/CDN result, never a compressed review preview.

## Stage 4: Video

Use the clean rendered segment board as timing, blocking, composition, and visual
state authority. Add canonical assets only for dimensions that still need direct
identity, environment, prop, product, UI, or brand control. In the video prompt,
state each reference role and explicitly prohibit storyboard paper, grids,
labels, arrows, and production text from appearing as scene content.

Verify the live node catalog before selecting the video node and model. The reference
canvas used a reference-video kind, but available duration, image count,
resolution, aspect ratio, and audio support can change. One video node should own
one continuous generation unit with one coherent camera grammar and one completed
local endpoint.

## Long-take mode

For a true long take, storyboard panels describe phases within one uninterrupted
camera path; they do not imply cuts. The sketch and rendered boards must repeat:

- `single continuous take`;
- the one primary camera path and allowed speed changes;
- stable screen direction and environment geometry;
- exact subject trajectories and interaction timing;
- `no cut`, `no teleport`, `no reset`, and `no replay` constraints;
- the final state that a continuation must inherit.

Keep one video node when the whole take fits the selected model's verified
duration and reference limits. If it does not fit, split only at a planned,
observable continuity state. Materialize the accepted previous clip as
Video Input, connect it to final-frame extraction with Frame set to `-1`, and use
that output as the next segment's opening-state reference. Re-anchor canonical
assets at a genuine scene boundary instead of forcing final-frame chaining.

## Short-drama mode

For short drama, divide the episode by dramatic beat or continuous scene segment,
not by an arbitrary fixed shot count. Each segment receives its own sketch board,
rendered board, clean handoff, and video node. Adjacent continuous beats may share
one segment when their combined duration fits the verified model limit and their
camera, space, cast, and endpoint remain coherent.

Repeat exact dialogue and sound intent in the sketch, rendered-board contract,
and video prompt. End every segment with a visible state the next segment can
inherit. Assemble accepted clips in chronological order with the live-verified
sequence node; the visible Video sequence output kind accepts ordered Videos
positions plus explicit width and height settings.

## Live node mapping

The 2026-08-07 node-catalog review verified these building blocks:

| Responsibility | Typical node |
| ---- | ---- |
| Visible story or direction contract | Text Input |
| Stable uploaded or promoted image asset | Image Input |
| Contract-only sketch draft | Text to Image |
| Asset-constrained sketch or rendered board | Multi-reference Image to Image |
| Rendered-board and asset referenced video | Image reference |
| Accepted previous-clip final frame | Final Frame Extraction |
| Stable accepted clip for downstream reuse | Video Input |
| Ordered clip assembly | Video sequence output |

This table is evidence, not a permanent allowlist. Re-read `artarch_node_kinds`
before constructing a canvas and verify exact business slots before connecting.

## Approval and acceptance

Require a separate review gate after assets, sketch boards, rendered boards, and
video takes. Approval of one stage authorizes neither the next generation stage
nor a paid run.

Reject the workflow when:

- a video branch bypasses its exact segment board;
- a rendered board repairs or changes unapproved story structure;
- canonical identity, wardrobe, prop ownership, environment, or screen direction
  drifts between stages;
- annotations or storyboard layout appear in generated footage;
- a long take hides cuts, resets action, or changes camera grammar mid-segment;
- a short-drama segment omits exact dialogue, sound, or an observable endpoint;
- a rejected or merely planned frame enters a continuity chain;
- a timeout causes a duplicate paid submission.
