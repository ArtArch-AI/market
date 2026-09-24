# Motion-led website language

Use this reference to art-direct website video and turn an approved visual
direction into an implementation-ready prompt.

## 1. Ambient background grammar

Use this production grammar for restrained background media:

- one continuous composition rather than an edited montage;
- roughly 8-14 seconds for ambient loops;
- muted autoplay, inline playback, and repeated playback;
- a single strong subject, horizon, or material event;
- slow push, drift, orbit, light sweep, particle fall, flutter, or restrained
  environmental motion;
- large stable regions where HTML copy can remain legible;
- cinematic CG, surreal landscape, luminous abstraction, or tactile organic
  macro imagery;
- high visual clarity with low temporal complexity.

Common compositions include a specimen isolated in darkness, a lone figure or
object in a vast landscape, a floating island above clouds or isolated in black,
a macro organic world, a meditating or reclining figure in a dreamlike scene, a
city or weather progression, a luminous portal, and a translucent or iridescent
material study. Movement changes the atmosphere without changing the page's
information hierarchy.

The source media is not locked to 16:9. Lock the focal point and copy-safe region
before generation, then specify `object-position` or alternate mobile media
instead of assuming a centered crop will work.

Use these as selection criteria, not a mandatory house style. The subject and
brand determine which archetype fits.

## 2. Website-background video prompt template

Replace every bracketed value. Remove a clause when it is not applicable.

```text
Create a [8-14]-second website background video in one continuous shot.
[Primary subject] occupies [focal area] in [specific environment]. The only
subject action is [one restrained visible beat]. The camera [one slow motivated
move] and finishes at [endpoint]. [Physical light source] creates [specific
contrast/color behavior]. Keep [copy-safe region] visually calm and stable for
HTML headline and navigation. Use [compatible first and last states for native
looping | a stable end state that can be hidden by a short masked reset]. No
cuts, camera shake, rapid action, text, logos, watermark, flicker, geometry
drift, or new objects crossing the copy-safe region.
```

For image-to-video, do not redescribe the approved image. Lead with preservation:

```text
Preserve the supplied frame's subject identity, composition, crop, palette, and
copy-safe region. Animate only [owned motion]. [Continue with camera, light,
endpoint, and exclusions.]
```

## 3. Scroll-scrub variation

A scrub clip is an optional interactive ArtArch treatment. Use it only when the
brief needs input-responsive progression rather than passive atmosphere. Use a
stable, cut-free shot of about five seconds with visibly different endpoints:

- soft focus to sharp detail;
- shadow to a controlled light reveal;
- separated parts to an assembled object;
- distant subject to close product detail;
- neutral pose to one deliberate gaze or turn.

Prompt `start state -> progression -> completed end state`. Add `slow steady motion,
no cuts, no camera shake`. Do not ask for a perfect loop because the end state is
the payoff.

## 4. Loop strategies

Choose one strategy in the brief and verify it in the real page:

1. **Compatible endpoint loop:** keep camera and subject motion cyclic or nearly
   stationary, then use the native video loop. Inspect frames near both ends and
   reject a visible jump.
2. **Masked reset:** use when a useful one-way camera or environment progression
   cannot return naturally. Near the end, fade the video layer out over roughly
   250 ms, seek to zero, wait for the seek to settle, and fade in over roughly
   250 ms. Hold a matching poster or background underneath so no black frame is
   exposed. This hides a reset; it does not repair a cut or unstable subject.

Do not claim every source clip is frame-perfect. Repeated playback is common;
the implementation determines whether the seam is natively compatible or
deliberately masked.

## 5. Failure diagnosis

| Failure | Repair |
| --- | --- |
| Copy becomes unreadable | Reduce motion in the copy-safe region; move the focal point; strengthen the poster grade or HTML scrim. |
| Loop jumps | Make first and last states compatible, or use a masked fade-reset for useful one-way travel. Do not blend mismatched subject poses into a ghosted frame. |
| Subject drifts or mutates | Use an approved start frame; narrow the owned motion; repeat identity and geometry locks. |
| Video feels static | Add one visible environmental beat or a restrained light/camera progression, not several actions. |
| Video competes with the interface | Lower temporal frequency, slow the camera, or move the subject away from navigation and copy. |
| Re-roll changes the whole scene | Keep the better take and color-grade it; change one prompt variable per new attempt. |

## 6. Website implementation prompt core

Write website prompts as implementation specifications with this stable core:

1. Deliverable and exact stack.
2. Fonts and global CSS or design tokens.
3. Exact asset and video sources with a role for each.
4. Ordered sections.
5. Per-section geometry, layering, visible copy, and responsive sizes.
6. Named reusable components when behavior or styling repeats.
7. Precise animation implementation, timing, easing, and triggers.
8. Responsive breakpoints and behavior changes.
9. Dependencies and file structure when the build needs them.

The level of detail scales with the page: a single-screen hero may be a compact
spec, while a portfolio can enumerate every section, component, asset, and
animation. Preserve this ordering and concreteness.

## 7. ArtArch production completion layer

Include the requirements needed to ship a real site: approved local asset
lineage, posters and playback fallback, media formats and loading, reduced
motion, semantic and keyboard behavior, responsive crop verification,
metadata/SEO, security, loading/error states, and visible readback after
deployment. See `website-delivery.md` for the contract.

Apply the structure to original work. Do not write "recreate exactly" unless the
user owns the reference and explicitly requests faithful reproduction. Never
carry third-party asset URLs, names, or copy from a reference into the result.

## 8. Video-to-page composition rules

- Decide the HTML copy position before video generation.
- Treat copy-safe space as a generation constraint and a responsive crop
  constraint.
- Keep type and controls out of video pixels.
- Use a poster derived from the approved, graded video.
- Provide MP4 and WebM from same-origin paths.
- Treat the passive ambient loop as an option, not the automatic delivery choice.
  When the approved experience is interaction-led, implement its
  scrollytelling or 360 mechanic as the primary behavior and use ambient motion
  only as support.
- On mobile, prefer a deliberate alternate crop or poster over shrinking an
  unreadable desktop composition.
- Keep motion optional. The static experience must retain the same hierarchy and
  primary action.
