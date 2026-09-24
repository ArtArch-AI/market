# Scrollytelling and interactive 360

Use this reference after the design discussion identifies an interaction-led
experience. Do not implement either pattern before the user approves the
experience brief.

## Contents

1. Choose the honest interaction model
2. Design scrollytelling
3. Design a marketing 360 spin
4. Generate source video with ArtArch
5. Prepare and load frames
6. Choose product imagery or real 3D
7. Implement interaction
8. Responsive and fallback behavior
9. Verify the real experience

## 1. Choose the honest interaction model

First classify the page as pointer-driven or scroll-driven. Use
**scrollytelling** within scroll-driven mode when ordered ideas,
transformations, locations, or product
states form a narrative. The page owns scroll; a sticky visual stage and HTML
copy progress through explicit beats. In this skill, its primary visual media is
ArtArch-generated video unless the user explicitly approves a static-only variant.

Use a **scroll-scrub sequence** when one continuous visual transformation is the
main event. Scroll maps directly to a finite frame range.

Use a **marketing 360 spin** when the user needs to inspect a subject from a
pre-rendered horizontal orbit. Drag, touch, or keys select frames from one full
turn. It cannot reveal unrendered elevation angles or arbitrary viewpoints.

Use **true interactive 3D** only with an actual 3D model, materials, and a 3D
renderer. Do not call a turntable video or frame sequence true 3D. If the user
needs free orbit, zoom, hotspots on model geometry, or lighting changes, request
a real 3D asset and treat video as a fallback or supporting layer.

Use **2.5D** when the available source is one or more product images. Images may
be isolated into planes or depth layers and used for parallax, restrained tilt,
or staged separation. Do not expose unrestricted orbit or imply that unseen
surfaces and internal parts are geometrically accurate.

A hybrid may place a marketing 360 stage inside a broader scrollytelling page.
Keep one primary interaction so input and narrative do not compete.

## 2. Design scrollytelling

Default to video-led scrollytelling. Generate one controlled video per narrative
beat, or one master video only when the whole story shares composition and
continuity. Use still images as approved start frames, composition references,
posters, loading states, and reduced-motion fallbacks. Do not silently replace
video with still-image cuts plus CSS parallax to save credits or implementation
time.

If the user explicitly chooses a static-only version after seeing the visible and
cost tradeoff, record `Static-only exception: approved by user` in the brief and
label the result as an editorial still sequence rather than video-led
scrollytelling.

Define three to seven beats. For each beat, lock:

- normalized start and end progress;
- the audience insight or story change;
- the visual opening and completed state;
- exact HTML heading, body, action, and alignment;
- the ArtArch asset and crop used on desktop and mobile;
- transition ownership: scroll, media, copy, camera, or light;
- entry, hold, and exit behavior.

Prefer one sticky stage with ordinary document sections driving progress. Keep the
story readable without JavaScript. Avoid stacking unrelated full-screen scenes or
making all content invisible until an intersection observer fires.

Use a master video only when every beat shares composition and continuity. Use
separate video clips when beats change location, subject, framing, or generation
mode. For each discontinuous boundary, plan a bridge clip from the approved
previous final frame to the approved next first frame. Do not force several story
changes or the bridge itself into one short source-video prompt.

Use the architecture in `scrollytelling-threejs.md`: one root timeline, explicit
pinned-stage geometry, absolute progress ranges, reversible waypoints, and one progress source
for DOM, video frames, and WebGL state. Map progress deterministically:

```text
sectionProgress = clamp((scrollY - sectionTop) / (sectionHeight - viewportHeight), 0, 1)
frameIndex = round(sectionProgress * (frameCount - 1))
```

Define beat ranges in data rather than scattered conditionals. Crossfade copy at
beat boundaries, but do not crossfade mismatched subject frames into a ghosted
image. Keep the visual stage dimensions stable for the entire pinned interval.

## 3. Design a marketing 360 spin

Approve the hero still and spin contract before video generation:

- subject centered on a stable axis with constant scale;
- fixed camera height, distance, focal length intent, and horizon;
- fixed background, floor contact, shadow direction, exposure, and color grade;
- exactly one complete horizontal rotation;
- compatible first and final pose;
- no camera orbit plus object rotation at the same time;
- no subject translation, deformation, part count change, or texture drift;
- no text, logo mutation, added props, or occluders.

Typical web sequences use 48-120 frames. Choose fewer for mobile or simple forms
and more for detailed products, but decide from the memory and download budget.
The sequence is a visual marketing spin, not evidence of geometrically accurate
backside detail. Reject it when identity or structure changes materially across
the turn.

Specify interaction in the brief:

- pointer drag distance per frame and direction;
- touch behavior and prevention of accidental page scroll only while dragging;
- ArrowLeft/ArrowRight step size, Home/End behavior, and focus label;
- wrap continuously or clamp at endpoints;
- optional inertia and its decay;
- drag cursor or familiar rotate affordance;
- whether scroll enters/leaves the stage or also drives rotation.

## 4. Generate source video with ArtArch

Inspect real capabilities before choosing node settings:

- Call `artarch_canvas_describe` with no arguments; project and canvas scope are
  already selected in the MCP session.
- Call `artarch_node_kinds` with an optional `query`.

Prefer image-to-video from an approved still when identity, product geometry, or
composition is fragile. Connect references only through business slots verified by the
selected node. Follow `artarch-video-prompt` for prompt construction and assign
each input one authority.

Before generation, confirm that every scrollytelling beat or continuous sequence
has a planned video node, duration, aspect ratio, opening state, endpoint, and
fallback. A list containing only image nodes fails the media-coherence gate.

For scrollytelling, generate one visible beat per short clip. State its opening,
trigger, progression, endpoint, single camera move, and continuity locks.

For every required bridge, wait until both adjacent shots are approved. Extract
and record the previous final frame and next first frame, then inspect
`artarch_node_kinds` and connect them only through verified start/end or reference
slots. Give each frame one authority. Prompt one continuous transition that
leaves the previous shot and lands on the next while preserving camera direction,
motion vector, subject position, horizon, lighting, exposure, and grade. Treat
each bridge as its own authorized run and retain its node/run lineage.

For a marketing 360 source, request a steady turntable motion with fixed camera,
lighting, framing, and scale. Treat geometry drift as a failed take rather than a
frontend problem. A masked loop cannot repair a mutated backside.

Recover the same run instead of resubmitting it. Before invoking `artarch_run`, follow
the parent skill's generation authorization gate: describe this specific run and
its credit use, then wait for a new explicit user reply such as `开始`, `允许`, or
`确认执行` unless an active standing authorization covers it. An instruction such
as `后续默认执行` or `无需再问` is standing authorization within its stated task,
canvas, and scope. Approval of the experience or source asset alone is not run
authorization.

- Call `artarch_run` with `target`, `authorized`, and optional `wait`/
  `timeoutSeconds`; project and canvas come from the selected MCP session.

Do not resubmit after a timeout. Before another paid attempt, diagnose the take
and change one variable.

## 5. Prepare and load frames

Create standard video variants for posters and passive fallbacks, then extract the
approved interaction sequence:

```bash
scripts/prepare_web_video.sh <input-video> <output-dir> <asset-name>
scripts/prepare_interactive_sequence.sh \
  <input-video> <output-dir> <asset-name> <frame-count> <max-width>
```

Inspect the compressed contact sheet before opening extracted AI frames. Verify
the first, middle, and final states, dimensions, file count, and manifest. Keep
source renders and rejected sequences outside public assets.

Load frame 1 eagerly and paint it immediately. Load a coarse subset next so the
whole range becomes usable, then fill neighboring frames around the current
position and finally the remaining sequence. Cap concurrent requests and decode
work. Do not preload several large sequences in the first viewport.

Use the generated manifest instead of constructing filenames from assumptions.
On a missing frame, keep the last valid frame and report the asset error in
development; do not flash a blank canvas.

## 6. Choose product imagery or real 3D

During design discussion, inspect what the user already has and recommend one
route:

| Available evidence | Honest implementation |
| --- | --- |
| Approved turntable video | Scroll-scrub or marketing 360 frame sequence |
| One product image | Poster, texture, or restrained 2.5D plane |
| Several isolated views/layers | 2.5D parallax, bounded tilt, or layer separation |
| GLB/GLTF with one mesh | Real 3D rotation; no semantic exploded view |
| GLB/GLTF with named parts and valid pivots | Real rotation, exploded view, assembly, and hotspots |
| Procedural object with known dimensions | Programmatic Three.js geometry and transforms |

Ask the user for the original GLB/GLTF, CAD-derived web model, part hierarchy,
product views, brand materials, and assembled reference when those determine the
result. With approval and a separate ArtArch run authorization, generate missing
images for direction, texture, environment, poster, or 2.5D layers. Do not claim
that image generation creates a production 3D model unless the inspected ArtArch
canvas exposes and returns a real compatible 3D artifact.

Before promising assembly or an exploded view, verify every animated part has a
stable object identity, pivot, material ownership, assembled position/quaternion/
scale, and an approved exploded transform. Define parent-child ownership so
fasteners and nested subassemblies move with the correct group.

## 7. Implement interaction

Use the repository's existing framework and motion libraries. Keep state and
rendering deterministic:

- normalize scroll or drag into one `0..1` progress value;
- derive frame and beat state from progress;
- schedule visual draws through `requestAnimationFrame`;
- keep progress in a ref or external store when per-frame React renders would
  cause churn;
- size canvas/image stages explicitly and account for device pixel ratio;
- render navigation, headings, body copy, actions, and status as semantic HTML;
- avoid scroll hijacking, long main-thread tasks, and layout reads after writes;
- clean up observers, listeners, animation frames, and decoded resources.

For React 18+ and GSAP 3+, prefer a maintained scrollytelling library when its
current compatibility and license fit the repository. Otherwise implement the pattern
with the existing stack: a single normalized timeline with declarative absolute
ranges. Do not distribute beat state across unrelated observers.

For Three.js or React Three Fiber, let timeline progress update numeric proxy
state or model groups inside the render loop. Interpolate positions and scales,
use quaternion slerp for rotation, and clamp each operation to its named range.
Keep normal page scroll available; only pointer-capture an orbit or spin gesture
while the user is actively manipulating the stage.

For canvas rendering, draw a poster or first frame before interaction starts.
Preserve the cover/contain rule from the brief rather than stretching frames.
For image rendering, keep intrinsic dimensions and the container aspect ratio
stable so frame changes cannot shift layout.

## 8. Responsive and fallback behavior

Define mobile as a real composition, not a scaled desktop stage. Choose one:

- alternate crop or separately approved mobile sequence;
- reduced frame count with the same endpoints;
- swipe-controlled spin instead of scroll-controlled rotation;
- poster plus ordered HTML beats when the interaction is too costly.

For `prefers-reduced-motion`, show the approved poster or a small set of discrete
states with no scrub interpolation. Keep the narrative order, copy, primary
action, and product inspection outcome available.

If loading or decoding fails, retain a meaningful poster and ordinary document
flow. Never leave the hero blank, freeze the page scroll, or hide the primary
action behind a failed canvas.

For WebGL failure or an unsupported device, replace the canvas with the approved
poster, video, or frame sequence while preserving the narrative and primary
action. For reduced motion, use discrete approved states and disable continuous
orbit, auto-rotation, floating motion, and scroll-scrub interpolation.

## 9. Verify the real experience

For scrollytelling, inspect 0%, 25%, 50%, 75%, and 100% progress on desktop and
mobile. Record the active beat, frame index, visible copy, and screenshot. Confirm
no blank frame, sticky jump, accidental overlap, skipped ending, or unreachable
next section.

For a marketing 360 spin, test pointer drag in both directions, touch-equivalent
input, ArrowLeft/ArrowRight, Home/End, focus visibility, wrap/clamp behavior, and
loading failure. Sample canvas pixels or inspect the rendered image at separated
frames to prove that interaction changes visible output.

Measure first poster paint, initial interactive readiness, frame-request errors,
memory on representative mobile hardware, and layout shift. Verify reduced motion
and no-JavaScript/static fallback. An HTTP 200 or changing frame index alone does
not prove the experience works.

For Three.js, capture desktop and mobile screenshots and sample canvas pixels at
the assembled state, one intermediate state, and the exploded state. Confirm the
canvas is nonblank, progress changes rendered pixels, the subject remains framed,
parts do not disappear or detach from the wrong parent, orbit limits hold, and
the final state is reachable in both scroll directions. Test the poster/video
fallback by forcing model-load or WebGL failure.
