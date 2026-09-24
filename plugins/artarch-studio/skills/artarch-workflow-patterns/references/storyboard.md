# Storyboard-to-Video Canvas

## Purpose

Make the storyboard an executable production contract rather than a mood board.
Use it for previs, shot planning, image-reference video, multi-clip continuity, and
reviewable handoff.

## Topology

`scene/shot contract -> character and environment masters -> annotated board -> clean panel crops -> panel-bound clips -> ordered stack`

When the production explicitly separates asset approval, rough planning, final
visual development, and motion, use
[Asset-First Progressive Storyboard Video](progressive-storyboard-video.md):

`canonical assets -> sketch storyboard -> rendered storyboard -> clean handoff -> video`

Do not use one ambiguous board as both the structural draft and final visual
authority.

Recommended groups:

1. `01 Scene and shot contract`
2. `02 Canonical assets`
3. `03 Annotated storyboard`
4. `04 Clean panel handoff`
5. `05 Panel-bound clips`
6. `06 Delivery`

## Panel contract

For every panel record:

- panel number and represented time range;
- target-video aspect ratio;
- framing, viewpoint, and screen direction;
- visible action and performance;
- exact dialogue and sound intent;
- camera movement written in words;
- lens or depth-of-field intent;
- observable ending state.

Use one board for one scene or continuous event of at most 60 represented seconds.
Every panel composition must match the target video ratio.

## Clean handoff

Keep an annotated review board and separate clean panel crops. Video nodes should
reference the clean crop or exact named panel region plus canonical assets. Do not
feed borders, arrows, timecodes, UI controls, or production notes into the video
model when they could appear as scene content.

## Maintained example

The example is a 10-second, two-panel 9:16 cafe scene. Panel 01 ends when an adult
woman notices a handwritten message beneath a cup; Panel 02 begins from that exact
state and ends after she quietly folds the note into her palm. Each clean crop
feeds only its matching 5-second clip.

## Acceptance

Reject boards with mismatched panel ratios, omitted dialogue, ambiguous action
order, arrows standing in for camera language, overlapping clip time ranges,
missing endpoints, or video nodes that say only `follow the storyboard` without an
exact panel binding.
