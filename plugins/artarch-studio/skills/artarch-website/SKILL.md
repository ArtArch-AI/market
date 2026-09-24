---
name: artarch-website
description: "Clarify, design, produce, and ship a high-concept, media-led website with the ArtArch MCP server and approved ArtArch Studio assets. Use for two primary interaction modes: (1) pointer-driven subjects that follow, gaze, or turn with mouse/touch input; and (2) scroll-driven experiences such as product rotation-to-exploded reveals, timelapse, landscape progression, and cinematic scrollytelling. Clarify the user's need, create approved images and videos with ArtArch MCP server, derive the website from those videos, and plan bridge video nodes between long-form shots from the previous final frame to the next first frame. Particle transformation is an optional effect."
---

# ArtArch Website

Before any node execution, read and follow the [Studio generation approval
rules](../artarch-studio/SKILL.md#generation): explain the node's purpose and
expected credits, then wait for explicit approval for that node. Only an
explicit request to run the agreed workflow in one go waives per-node questions;
a creative brief or request for a finished result does not. Unknown cost and
retries require the handling specified there. These rules also apply to all
execution stages and examples below.

Use this skill when a website is a high-concept experience rather than a
standard marketing page. Robotics, AI, futuristic interfaces, machines, and
high-tech products are especially strong matches; other immersive concepts are
also in scope when the interaction and visual system are central to the brief.

The governing workflow is media-first:

```text
clarify user need and response
  -> lock experience and media brief
  -> create/approve stills with ArtArch MCP tools
  -> create/approve videos with ArtArch MCP tools
  -> derive frames, posters, and web variants from approved video
  -> implement the website around the verified media
  -> test scroll, time, pointer, reduced-motion, and media fallbacks
```

Do not start by inventing a generic page or by replacing a required video with
CSS decoration. The website is the presentation and interaction layer for an
approved media plan.

Deliver the real website, not a mockup. Use `artarch` for every ArtArch Studio
operation and treat the frontend repository as the source of code. Preserve
unrelated work and never invent a canvas node kind, model setting, artifact,
approval state, website command, or deployment result.

Do not jump from a rough request to a static page. First discuss the page's
concept, story, visual system, interaction, responsive behavior, and asset plan.
Show one coherent recommended brief and obtain explicit user approval before
scaffolding frontend code, starting paid generation, or replacing assets.

## Read only what the request needs

- Read `references/media-led-site-language.md` before producing a background
  video, video-led hero, or media-led website direction.
- Read `references/interactive-experiences.md` before proposing or implementing
  scrollytelling, scroll-scrub, marketing 360 spin, or true 3D interaction.
- Read `references/website-patterns.md` before choosing pointer-driven or
  scroll-driven input, a scroll presentation, long-form bridge clips, and
  optional effects such as particle transformation.
- Read `references/scrollytelling-threejs.md` before implementing a
  scroll-driven React experience or connecting Three.js state to page progress.
- Read `references/website-delivery.md` before writing the implementation brief,
  editing frontend code, preparing metadata, or deploying.
- Run `scripts/prepare_web_video.sh` after a video take is approved and downloaded.
- Run `scripts/prepare_interactive_sequence.sh` when an approved video must drive
  scroll or pointer-controlled frames.
- Run `scripts/prepare_bridge_frames.sh` before creating a bridge video between
  two approved long-form shots.

## Choose the website workspace

1. Use an explicitly named or current frontend repository and its established
   framework, design system, commands, and deployment path.
2. If no frontend exists, create a local project in the requested work directory
   with the smallest appropriate stack available in the environment. Do not
   create or deploy it through another media platform's CLI.
3. Bind that work directory to the relevant ArtArch project and canvas. If none
   exists and generation is required, create it with `artarch_scope_options`, select it in the website directory, then create and select a
   canvas by visible name.
4. The current ArtArch MCP server has no website create, repository, or deployment
   subcommands. Never invent `the appropriate ArtArch MCP tool`. Deploy only through an
   existing repository-owned workflow; otherwise deliver a verified local URL.

Approved ArtArch outputs are project assets and take precedence over generated
replacements. If visitors need live AI generation, that application/backend
integration is outside this interaction-led marketing-site workflow and needs an
explicit product contract.

## Phase 1: Inspect and agree the design

1. Inspect the repository, current worktree, and local instructions.
2. Verify the ArtArch account. Inspect or bind the canvas, then list its structure
   and nodes:

   - Call `artarch_session_context` or `artarch_scope_options` with only their
     optional query fields; project/canvas scope is session-owned.
   - Call `artarch_project_select` with `name` and `confirmed: true` when
     reusing a project, then `artarch_canvas_select` with `name`.
   - Call `artarch_canvas_describe` with no arguments, then
     `artarch_node_kinds` with an optional `query`.

3. Read existing run results before starting paid work. Record the source node,
   run reference, artifact URL or path, dimensions, duration, and approval state for each
   candidate.
4. Maintain four decision lists during discovery: `confirmed`, `recommended`,
   `rejected`, and `open`. Do not ask for facts already available in the repository
   or canvas.
5. Reflect the user's intent, then propose two or three coherent page directions
   when design is genuinely open. Describe each direction across story, layout,
   typography, media, interaction, mobile behavior, and production cost. Recommend
   one and explain the tradeoff.
6. Discuss no more than three independent decisions per round. Resolve the
   audience response, primary action, exact copy, section/beat order, visual
   language, experience mode, **primary media type**, input model, copy-safe
   composition, mobile fallback, budget, and acceptance criteria only when they
   materially affect the result. Never infer that approving a visual direction
   also approves replacing video with still images.
7. For a product, device, or assembly, choose an honest asset route before the
   brief is approved: ArtArch video frames, supplied/generated 2D or 2.5D layers,
   or a real GLB/GLTF or programmatic Three.js model. Ask for suitable product
   images or model/part files when they would materially improve the result. An
   ArtArch image run still requires the paid-run authorization in Phase 3.
8. Produce one `Experience brief` using `references/website-delivery.md`. Include
   the narrative/interaction map and ArtArch asset plan, then ask the user to
   confirm it or correct specific decisions.

Treat approval as a hard gate. Before explicit confirmation, do not scaffold the
site, edit page code, start paid generation, or silently choose a direction. Safe
inspection and drafting the brief are allowed. Do not generate if an approved
artifact already satisfies the role, and do not use an asset whose content or
approval state cannot be verified.

Before accepting approval, run a media-coherence check. Scrollytelling,
scroll-scrub, and video-based Interactive 360 require planned ArtArch video
assets in the manifest. Still images may be start frames, composition references,
posters, chapter fallbacks, or reduced-motion states. A still-image/CSS-only page
is allowed only when the user explicitly chooses that lower-motion variant and
the brief records who approved the exception.

## Phase 2: Lock the experience and asset plan

Choose exactly one primary input mode in the approved brief:

- **Pointer-driven:** map bounded mouse/touch position to approved video time,
  extracted frames, or verified 3D state containing the required gaze, turn,
  follow, or local response. Keep video as the visual source when the user asks
  for a video-led result; use Canvas/WebGL as an optional interaction/effects
  layer rather than silently replacing the media plan.
- **Scroll-driven:** map wheel, trackpad, touch scroll, and keyboard navigation
  to one normalized reversible timeline. Choose either a product reveal from
  rotation through feature inspection to separation/exploded state, or a
  timelapse/landscape progression through time, light, weather, season, or place.

Under either input mode, choose an honest media route: pre-rendered video/frame
sequence, 2.5D layers, or verified true 3D. Treat ambient loops and feature clips
as supporting media, not additional input modes. Particle transformation and
other rendering treatments remain optional effects.

For scroll-driven long-form work, use one master video only when composition and
continuity remain stable. Otherwise plan separate shot videos plus a bridge video
node for each discontinuous boundary. Generate a bridge after both adjacent shots
are approved: extract the previous shot's final frame and the next shot's first
frame, assign them as opening and endpoint authorities through verified business
slots, and create one motivated transition that arrives cleanly at the next
shot. Record the bridge node, run, input frames, duration, timeline range, and
approval state. Do not use a frontend crossfade to disguise broken continuity.

Prefer image-to-video for a controlled hero: approve the still composition and
copy-safe area first, then connect that image as the video node's start frame.
Use text-to-video only when identity and composition continuity are not fragile.

Write one compact clip prompt in this order:

`subject + one visible beat + environment + one camera move + physical light + copy-safe area + endpoint/loop + exclusions`

Use the prompt construction and continuity rules from `artarch-video-prompt`.
For scrollytelling, give each clip one narrative job, explicit opening state, and
completed endpoint. For a marketing 360 spin, lock subject geometry, camera
height/distance, lighting, background, scale, and center; request exactly one
steady full rotation with compatible endpoints and no translation or deformation.
For ambient video, require one continuous shot, low-amplitude motion, no cuts,
stable copy space, and a native loop or planned masked reset. Keep prompts compact
and specific instead of adding generic quality adjectives.

For a bridge clip, treat the approved final frame of shot A as the exact opening
state and the approved first frame of shot B as the exact endpoint. Request one
continuous motivated transition with matched camera direction, subject position,
motion vector, horizon, lighting, exposure, and grade. Reject a bridge that merely
morphs, crossfades, introduces an unrelated spectacle, or fails to land on B.

Before applying it, confirm the actual node settings and connected references with
`artarch_node_kinds`. Give each input one authority such as composition, identity,
environment, style, start frame, or end frame.

For true 3D, inspect the actual model rather than assuming it is articulated.
Rotation needs valid geometry and pivots. Exploded or assembly motion needs
separate named parts plus recorded assembled and exploded transforms. Use supplied
images or ArtArch image outputs only as visual references, textures, environment
plates, or 2.5D layers unless a separate modeling step produces a verified model.

## Phase 3: Run, recover, and approve

Canvas, prompt, or creative-plan approval does not authorize generation.
Follow the [Studio generation approval rules](../artarch-studio/SKILL.md#generation)
for each node, including upstream dependencies: explain its purpose, disclose
expected credits, and wait for explicit approval. Apply the same rules to retries
and to the exception for explicitly authorized batch execution.

After authorization, start or continue the run:

- Call `artarch_node_configure` with `node`, optional `kind`/`name`, and verified
  `settings`; project and canvas come from the selected MCP session.
- Call `artarch_run` with `target`, `authorized`, and optional `wait`/
  `timeoutSeconds`; project and canvas come from the selected MCP session.

After a timeout, continue the existing run. Never submit a duplicate run just
because waiting was interrupted. Before another paid attempt, diagnose the first
result and change one variable. Keep a small explicit attempt budget.

Approve a take only after checking:

- subject, composition, grade, and copy-safe area match the intended page;
- motion is readable but does not compete with copy or controls;
- there are no cuts, flicker, geometry/identity drift, camera jolts, or surprise
  objects;
- every bridge visibly begins from its recorded A-final frame, arrives at its
  recorded B-first frame, and preserves the approved continuity dimensions;
- the first and last states loop cleanly, a masked reset hides the seam without
  a black flash, or the scrub has a meaningful payoff;
- the downloaded artifact reopens and matches the canvas result.

Before viewing AI-generated stills or extracted frames, create a compressed local
preview. Keep rejected takes and intermediates outside the website's public asset
directory.

## Phase 4: Prepare web media

Run:

```bash
scripts/prepare_web_video.sh <input-video> <output-dir> [asset-name]
```

The script creates H.264 MP4, VP9 WebM, a JPEG poster, a compressed JPEG contact
sheet, and metadata. Inspect the compressed contact sheet and both endpoints.
Place only the approved web variants in the site's public asset directory and
reference every copied file.

For scrollytelling, scroll-scrub, or marketing 360, additionally run:

```bash
scripts/prepare_interactive_sequence.sh \
  <input-video> <output-dir> <asset-name> [frame-count] [max-width]
```

Choose the frame budget in the approved brief, inspect the compressed contact
sheet before inspecting individual extracted frames, then verify the first,
middle, and last states. Paint frame 1 immediately, stage-load the rest, and
provide a static fallback for reduced motion and loading failure.

For every planned long-form bridge, run:

```bash
scripts/prepare_bridge_frames.sh \
  <previous-video> <next-video> <output-dir> <bridge-name>
```

Inspect the compressed side-by-side preview before inspecting the extracted
AI-generated endpoint frames. Upload or connect the full endpoint frames only
after their continuity role and lineage are recorded.

## Phase 5: Write the implementation contract

After approving the media, update the confirmed brief using the template in
`references/website-delivery.md`. Do not reopen settled design choices unless an
observed asset failure makes the original direction infeasible. It must lock:

- concept, audience, primary action, exact copy, and section order;
- asset manifest with canvas node/run lineage and the role of each file;
- pointer-driven or scroll-driven input ownership, plus the selected scroll
  presentation when applicable;
- long-form shot order and bridge manifest with A-final/B-first frame lineage;
- primary media type and any explicitly approved static-only exception;
- desktop and mobile composition, video crop, focal point, and copy-safe area;
- typography, palette, spacing, section families, controls, and interactions;
- motion timing, scroll or hover behavior, reduced-motion behavior, and poster;
- responsive breakpoints, loading/error states, metadata, and explicit non-goals;
- the progress-to-beat map for scrollytelling or frame/input contract for 360;
- transition clip ranges and media handoff behavior for long-form sequences;
- the scrollytelling engine, absolute timeline ranges, labels, and pinned-stage
  geometry; and, for Three.js, model source, part hierarchy, transforms, camera
  limits, interaction ownership, WebGL fallback, and disposal/performance budget;
- approval state, delegated assumptions, and any asset-driven amendment.

Write the implementation contract as a concrete specification: stack and fonts,
exact approved assets, ordered sections, section-level geometry and copy, named
components, motion implementation, responsive behavior, and the production
completion layer from `references/website-delivery.md`. User-provided assets and
the approved canvas direction remain authoritative.

## Phase 6: Implement the website

Build within the selected frontend architecture. Keep the actual subject as a
first-viewport signal and leave a hint of the next section visible. Use video to
reveal the product, place, work, or atmosphere, not as decorative noise.

Implement the approved primary interaction before decorative animation. Prefer
the repository's established, compatible scroll or motion library. Keep one
normalized timeline, explicit pinned-stage geometry, absolute progress ranges,
reversible waypoints, named labels, and ordered tracks. If no suitable library
exists, choose a maintained option that fits the current framework instead of
building scattered intersection-observer booleans.

Make the sticky stage, HTML copy, video/frame index, and Three.js state consume
the same normalized progress and named beat ranges. For a
marketing 360 spin, use stable canvas or image geometry with pointer capture,
touch drag, keyboard controls, bounded frame loading, and explicit drag affordance.
Do not label a pre-rendered spin as a freely orbitable 3D model.

For true 3D, render a full-bleed Three.js or React Three Fiber scene. Animate real
`Object3D` groups through position, quaternion, scale, or verified `AnimationClip`
state. Preserve explicit assembled transforms and interpolate toward explicit
exploded transforms; never derive an invented assembly from filenames or a single
image. Limit orbit/zoom to the approved inspection task, pause work offscreen,
cap pixel ratio, and dispose geometry, materials, textures, mixers, observers,
listeners, and render loops on teardown.

For a native-loop ambient video, use semantic HTML with a real poster and both
sources:

```html
<video autoplay muted loop playsinline preload="metadata" poster="/assets/hero-poster.jpg">
  <source src="/assets/hero.webm" type="video/webm" />
  <source src="/assets/hero.mp4" type="video/mp4" />
</video>
```

If approved endpoints are incompatible, remove native `loop` and implement the
brief's masked reset: fade the media layer out near the end, seek to zero, then
fade it back in after the seek. Keep the poster or a matching background behind
the video so the reset never exposes black. A masked reset is a deliberate
delivery behavior, not a reason to accept cuts, camera jolts, or subject drift.

Render copy, navigation, and controls as HTML above the media. Never bake website
text or buttons into generated video. Preserve focal points with deliberate
`object-position`; do not solve every crop with centered `object-cover`.

Provide a static poster for `prefers-reduced-motion`, failed autoplay, and slow
connections. Lazy-load below-fold video. Do not autoplay audio. Feature clips
need visible playback controls and captions when speech carries meaning.

## Phase 7: Verify and deliver

Run focused tests and the repository's build or typecheck when relevant. Start the
local server when the framework requires it, then verify desktop and mobile views:

- no text, control, or media overlap at target breakpoints;
- poster paints before video, sources return successfully, and playback is
  nonblank at two separated timestamps;
- crop and copy-safe area remain correct on wide and narrow screens;
- reduced-motion and no-autoplay fallbacks remain usable;
- every public asset is referenced and every canvas mapping resolves;
- exact copy, metadata, keyboard access, contrast, and primary interactions work;
- scrollytelling reaches the intended visual and copy state at 0%, 25%, 50%, 75%,
  and 100% progress without blank frames or sticky-layout jumps;
- a marketing 360 spin changes frames in both drag directions, supports keyboard
  operation, wraps or clamps as specified, and preserves subject geometry;
- the primary interaction remains usable on mobile, reduced motion, failed media,
  and slow loading according to the approved fallback;
- a Three.js stage renders nonblank pixels at desktop and mobile sizes, changes
  visibly at representative timeline states, preserves every part at assembled
  and exploded endpoints, and falls back without trapping scroll when WebGL or
  model loading fails.

Fill the framework's real metadata surface with a title, description, favicon,
canonical URL when known, and OG image. Generate a missing branded OG image
through an ArtArch image node only when needed, retain its node/run lineage, and
download it with `the accepted output URL` before integration.

Before deployment, inspect repository documentation, package scripts, and CI to
identify the existing release path. Run it only when deployment is requested and
the target is already configured. Read back the resulting URL and visible page.
If the repository has no deployment path, start the local development server and
return its URL; do not silently introduce a hosting provider or substitute a
non-ArtArch platform CLI.

Return the live or local URL, changed files, the canvas-to-website asset map,
video role and fallback behavior, and verification results. Keep missing or
unverified assets explicit.
