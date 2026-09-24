# Website implementation and delivery contract

Read this reference before code changes. Write the brief in the repository's
existing documentation location. If the repository has no convention, use
`docs/design-brief.md`.

This contract has two explicit layers:

1. **Implementation specification:** stack, fonts/global CSS, approved asset
   sources, ordered sections, exact geometry/layering/copy, reusable components,
   motion implementation, responsive behavior, and required dependencies/files.
2. **ArtArch production completion:** asset lineage, posters, media loading and
   fallback, reduced motion, semantic/keyboard behavior, accessibility, SEO and
   metadata, security, error states, and final readback evidence.

Keep both layers in the implementation brief so the result can ship reliably.

The brief is the design approval artifact. Set its state to `draft` while
discussing and `user-approved` only after explicit confirmation. Do not scaffold
or edit page code and do not start paid ArtArch generation while it is a draft.

## Brief template

```markdown
# <Project name>

## Outcome
- Approval state: draft | user-approved | implementation-final
- Audience:
- Primary action:
- Emotional register:
- Concept spine:
- Input mode: pointer-driven | scroll-driven
- Scroll presentation: not applicable | product reveal/separation | timelapse/landscape
- Media route: video/frame sequence | 2.5D | verified true 3D | hybrid
- Primary media: ArtArch video | supplied/generated imagery | real 3D asset | user-approved static editorial
- Static-only exception: not applicable | approved by <user statement>
- Delivery path: existing repository | new local frontend

## Confirmed direction
- Recommended concept:
- Why this direction:
- Confirmed decisions:
- Delegated assumptions:
- Rejected directions:
- Remaining blocker:

## Exact copy
- Navigation:
- H1:
- Supporting copy:
- Primary CTA:
- Secondary CTA:
- Section copy:

## Information architecture
1. <section and layout family>
2. <section and layout family>

## Narrative and interaction map
| Progress/trigger | Story beat | Visual state | HTML copy/action | Input and transition |
| --- | --- | --- | --- | --- |
| 0-20% | | | | |

## Asset manifest
| Slot | Canvas node | Run ID | Local file | Role | Approval |
| --- | --- | --- | --- | --- | --- |
| Hero poster | | | | first paint/reduced motion | |
| Hero MP4 | | | | compatibility source | |
| Hero WebM | derived | derived | | preferred source | |
| Beat video(s) | | | | scrollytelling primary media | |
| Bridge video(s) | | | | A-final to B-first transition | |
| Bridge input frames | derived | derived | | opening/endpoint authority | |
| Interactive frames | derived | derived | | scroll/drag sequence | |
| Product image/layers | | | | reference/texture/2.5D | |
| GLB/GLTF model | supplied/verified | | | true 3D geometry | |

## Hero media contract
- Role: scrollytelling | scroll scrub | marketing 360 spin | ambient loop | feature clip
- Duration/aspect ratio:
- Focal point:
- Desktop crop/object-position:
- Mobile crop/object-position:
- Copy-safe region:
- Poster frame:
- Motion progression or loop strategy: beat sequence | scroll scrub | full turn | compatible endpoint loop | masked reset
- Reduced-motion fallback:

## Interactive experience contract
- Input owner: pointer | wheel/trackpad/touch scroll/keyboard
- Scroll presentation and ordered shot list:
- Scrollytelling engine/version:
- Sticky-stage geometry and scroll length:
- Absolute progress ranges and timeline labels:
- Progress-to-beat ranges and track owners:
- Frame count and filename manifest:
- Loading order and memory budget:
- Pointer/touch/keyboard behavior:
- Wrap, clamp, inertia, and sensitivity:
- Mobile interaction:
- Static and reduced-motion fallback:
- Marketing spin, 2.5D, or true 3D distinction:

## Long-form transition contract
- Shot order and durations:
- Boundary requiring bridge:
- Previous shot final-frame file/node/run:
- Next shot first-frame file/node/run:
- Bridge video node/run/output:
- Opening-state and endpoint connections verified from the node catalog:
- Camera direction, motion vector, subject position, horizon, light, and grade continuity:
- Bridge duration and normalized timeline range:
- Media handoff/crossfade used only for decoding:
- Approval and rejection notes:

## Three.js asset and scene contract
- Asset source and authority: user-supplied | ArtArch image reference | verified 3D model | programmatic geometry
- Model format/path and checksum:
- Scene/node and part hierarchy:
- Material, texture, and environment sources:
- Assembled transforms and approved reference:
- Exploded transforms and part order:
- Product rotation, orbit, zoom, and pointer limits:
- Scroll/pointer input ownership and handoff:
- Camera, lighting, framing, and resize behavior:
- Pixel ratio, draw-call, texture, and memory budget:
- Loading/error/WebGL/reduced-motion fallback:
- Disposal and render-loop ownership:

## Visual system
- Palette with exact values:
- Typefaces, weights, and scale:
- Spacing/grid:
- Corner and border language:
- Image/video grade:

## Components and interactions
- Header/navigation:
- Hero composition:
- Section-specific components:
- CTA identities:
- Hover/focus/active states:
- Loading/empty/error states:

## Motion
- Page-load behavior:
- Scroll-linked behavior:
- Hover behavior:
- Timing/easing:
- Reduced-motion behavior:

## Responsive behavior
- Wide desktop:
- Desktop/tablet:
- Mobile:
- Longest-copy handling:

## Metadata and delivery
- Title/description:
- Favicon/OG image:
- Structured data/robots/sitemap when applicable:
- Verification commands:
- Deploy command:

## Do not
- <project-specific exclusions>
```

## Build rules

1. Follow existing repository architecture and local instructions.
2. Require `Approval state: user-approved` before implementation. Build to the
   approved brief and asset manifest. Update the brief before making
   a material directional change.
3. Place only approved, referenced assets in public output. Keep source renders,
   rejected takes, and contact sheets in a private work/reference directory.
4. Use semantic HTML for copy and controls. Generated media never replaces
   accessible content or interaction.
5. Use a video poster and reduced-motion fallback. Avoid opacity-gated content
   that stays invisible in screenshots or without JavaScript.
6. Keep browser-only APIs out of SSR render and module initialization.
7. Preserve a hint of the next section in the first viewport for branded,
   portfolio, and product pages.

## Media-coherence gate

- For scrollytelling, require at least one planned or approved ArtArch video per
  beat, or one master ArtArch video with explicit beat ranges.
- For scroll-scrub, require an approved ArtArch video and its derived frame
  sequence manifest.
- For video-based Interactive 360, require an approved full-turn ArtArch video
  and its derived frame sequence manifest.
- For multi-shot scroll-driven work, require an ordered shot list. At every
  discontinuous boundary, require approved A-final and B-first frames plus a
  planned or approved bridge video node. Generate bridges only after both
  neighboring shots are approved and preserve their node/run lineage.
- For 2.5D, record every source image and the exact plane/layer authority. Do not
  claim arbitrary viewpoints or hidden geometry.
- For true 3D rotation, require verified geometry. For exploded or assembly
  motion, additionally require named parts, valid pivots, parent ownership, and
  explicit assembled/exploded transforms.
- Treat generated images as start frames, references, posters, or fallbacks by
  default. They are not a substitute for required video.
- Permit still images as primary media only when `Primary media` and
  `Static-only exception` record explicit user approval. Approval of a concept,
  visual style, or numbered direction alone is not approval of this downgrade.

## Video integration checklist

- Use `<source type="video/webm">` before MP4 so capable browsers take the
  smaller preferred source.
- Include `autoplay muted loop playsinline preload="metadata"` only for a native
  compatible-endpoint ambient loop. For a masked reset, omit `loop` and control
  the fade, seek, and resume deliberately.
- Include controls for feature clips. Do not autoplay audio.
- Use a meaningful poster, not a black first frame.
- For a masked reset, keep the poster or a matching background behind the video
  and verify that the seek never exposes a black frame.
- For bridge handoff, preload the next media segment and verify that the browser
  transition does not add a black frame, duplicate the visual bridge, or hide a
  continuity failure behind opacity.
- Set an explicit media aspect ratio or stable viewport geometry to prevent
  layout shift.
- Set `object-position` from the brief's focal point and verify both axes at each
  breakpoint.
- Pause nonessential below-fold video when it is offscreen or the document is
  hidden when the framework already has an appropriate lifecycle pattern.
- Do not load several full-resolution autoplay videos in the first viewport.
- Keep overlays restrained; fix the source grade or composition before hiding it
  under heavy blur or darkness.

## Verification evidence

Capture evidence from the actual implementation:

1. Focused tests and build/typecheck relevant to changed modules.
2. Desktop and mobile screenshots after fonts and media settle.
3. Video `currentSrc`, `readyState`, `videoWidth`, `videoHeight`, and duration.
4. Nonblank frames at two separated timestamps and the visible poster before
   playback.
5. Reduced-motion rendering and an autoplay-blocked/static fallback.
6. Keyboard operation, visible focus, contrast, and no overlap.
7. Canvas artifact readback and final local file checksum or dimensions.
8. Local or live URL readback after the final update.
9. Scrollytelling screenshots and active beat/frame IDs at 0%, 25%, 50%, 75%,
   and 100% normalized progress.
10. Marketing 360 pointer drag in both directions, touch-equivalent behavior,
    keyboard operation, frame wrap/clamp, and nonblank canvas/image pixels.
11. Three.js canvas pixels and screenshots at assembled, intermediate, and
    exploded states on desktop and mobile, plus forced model/WebGL fallback and
    teardown without duplicate render loops.

An HTTP 200 or successful deploy command is not enough. Confirm the visible page,
the persisted metadata, the media source, and the URL the user will reopen.

## ArtArch and repository delivery

Use `artarch` for account verification, canvas binding, node discovery,
generation, run recovery, and artifact download. Treat every approved output as
a project-provided asset with node/run lineage. Generate only missing visual
roles, and do not overwrite a supplied logo, product image, or approved hero.

The current ArtArch MCP server does not create, host, deploy, or publish websites. Do
not invent an `the appropriate ArtArch MCP tool` command and do not substitute another media
platform's CLI. Website implementation uses the local frontend toolchain;
deployment uses only the target already documented or configured by that
repository.

Before deployment, confirm no placeholders or empty media URLs remain; all
assets are referenced; SSR or static-render guards are appropriate to the stack;
reduced-motion behavior exists; favicon, manifest, and OG metadata are complete;
and relevant security/SEO checks pass. Run deployment only when requested, then
read back the actual URL and visible result.

If no deployment target exists, start the local server and return its URL. If the
user requires hosting, ask for the target rather than choosing or provisioning a
provider implicitly.
