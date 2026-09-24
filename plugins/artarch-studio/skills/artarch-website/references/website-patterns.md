# Website interaction patterns

Classify every interaction-led website into one primary input mode before
planning assets. Use only two top-level modes: pointer-driven or scroll-driven.
Treat visual treatments such as particles as optional effects, not input modes.

## 1. Pointer-driven

Use when mouse or touch position directly controls the visible subject. Suitable
responses include gaze, head turns, bounded rotation, following, parallax, light
direction, and local state changes.

```text
approved identity/composition still
  -> approved multi-angle, turn, or state-transition video
  -> compressed video, poster, and bounded frame sequence
  -> normalized pointer-to-time or pointer-to-frame mapping
  -> optional realtime visual effects
```

Specify the available horizontal and vertical response ranges. Map pointer input
only to states present in approved media. Preserve identity and continuity when
the pointer reverses direction, crosses the center, exits the viewport, or moves
quickly.

When the user requests a video-led result, do not replace it with CSS-only or
Canvas-only motion. Keep approved video frames as the visual source and use
Canvas/WebGL for interaction or effects. True realtime 3D is valid only when an
approved model exists; otherwise describe the result as video-driven,
pre-rendered, or 2.5D.

## 2. Scroll-driven

Use wheel, trackpad, touch scroll, and keyboard page navigation as one normalized
`0..1` timeline. The visual stage, video time/frame, copy, lighting, and optional
3D state must consume that same progress source and remain reversible.

Choose one scroll presentation.

### Product reveal, rotation, and separation

Use a pinned product stage that progresses from introduction to inspection:

```text
hero reveal
  -> controlled product rotation
  -> feature close-ups or material changes
  -> component separation/exploded state
  -> resolved final product and action
```

Produce an approved product video and derive its frame sequence when the result
is pre-rendered. Keep camera, scale, axis, lighting, background, geometry, and
part count stable. A video may show an authored separation, but it is not a true
interactive assembly. Promise arbitrary orbit or individually controllable parts
only when a verified model contains named geometry, valid pivots, and explicit
assembled/exploded transforms.

### Timelapse and landscape progression

Use for authored changes in time, weather, light, season, location, or
atmosphere. Examples include sunrise to night, cloud movement, growing shadows,
changing tides, weather fronts, and travel through connected landscapes.

Plan three to seven named beats. Each beat must define:

- its timeline range and narrative job;
- opening and completed visual states;
- camera direction, speed, horizon, light, weather, and color continuity;
- HTML copy and action state;
- reverse-scroll and reduced-motion behavior.

Create one master video only when the whole progression shares composition and
continuity. Otherwise create separate shot videos and explicit bridge clips.

### Long-form bridge clips

For every adjacent pair of long-form shots, inspect a compressed preview of the
previous shot's final frame and the next shot's first frame. If they do not join
naturally, create one dedicated ArtArch video node for the transition:

```text
shot A video -> extracted final frame --\
                                         -> bridge video node -> transition clip
shot B video -> extracted first frame ---/
```

Assign the previous final frame as the bridge opening-state authority and the
next first frame as the bridge endpoint authority, using only business slots and
connections verified by `artarch_node_kinds`. Prompt one motivated transition
with continuous camera direction, motion vector, subject position, lighting,
horizon, and color. The bridge must visibly leave A and arrive at B; it must not
be a disguised crossfade, morphing accident, or unrelated spectacle.

Plan transition duration and scroll range before generation. Record every bridge
node, run, input frame, output clip, and approval state in the asset manifest.
Generate bridge clips only after both neighboring shots are approved. A bridge is
a separate credit-consuming run and follows the normal authorization gate.

Use frontend crossfades only to hide decoding or playback handoff after the
visual transition is already coherent. Do not use CSS opacity to repair a broken
camera, subject, geometry, lighting, or landscape match.

## Optional visual effects

Effects may accompany either input mode but do not replace its media contract.

### Particle transformation

Apply particles to the current video frame, extracted frame, still, or rendered
model only when the brief calls for it:

```text
current visual state
  -> alpha, silhouette, luminance, color, or depth sampling
  -> stable identity mask and particle positions
  -> controlled gather, dissolve, trail, or input disturbance
  -> return to the same underlying visual state
```

Record particle count, sampling rule, transition timing, input influence, mobile
budget, and reduced-motion fallback. Preserve the subject silhouette and frame
continuity. Particle transformation is never required merely because another
interaction used it.

Other optional effects include restrained parallax, light sweeps, trails, depth
separation, bloom, and atmospheric overlays. Give each effect one narrative job
and a measurable performance budget.

## Selection record

Write these decisions into the experience brief:

- Input mode: pointer-driven | scroll-driven
- Scroll presentation, when applicable: product reveal/separation | timelapse/landscape
- Primary ArtArch video or shot list:
- Bridge clips required between shots:
- Optional effects:
- Mobile and reduced-motion fallback:

The input mode determines the ArtArch media plan, frontend state machine,
acceptance matrix, and fallback behavior.
