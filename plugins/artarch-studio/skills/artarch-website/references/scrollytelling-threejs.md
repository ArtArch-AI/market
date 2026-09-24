# Scrollytelling with Three.js

Read this reference before implementing scroll-driven React pages or connecting
Three.js to a narrative timeline.

## Contents

1. Adopt the architecture
2. Build one declarative timeline
3. Connect video and frame sequences
4. Connect Three.js product state
5. Define honest product assets
6. Control lifecycle and performance
7. Verify visible behavior

## 1. Adopt the architecture

Prefer the repository's established scrollytelling or motion library when it is
compatible with the framework and rendering architecture. Verify package peer
dependencies, maintenance state, license, SSR behavior, and cleanup semantics
before adding a new dependency.

When direct use is unsuitable, preserve its architecture with the existing stack:

- one root owns one GSAP/scroll timeline and its cleanup;
- the timeline spans an explicit `0..100` progress domain;
- one pin spacer establishes scroll distance and one sticky child establishes
  stable stage geometry;
- animation tracks declare absolute `start` and `end` ranges;
- waypoints add labels and reversible callbacks at exact progress;
- stagger divides one range across repeated targets with an explicit overlap;
- DOM, video, frame sequences, and Three.js consume the same progress source.

Do not rebuild this as many local `IntersectionObserver` booleans. Observers may
pause offscreen work, but they must not become competing narrative clocks.

## 2. Build one declarative timeline

Keep the root and pinned stage structurally obvious:

```tsx
<Scrollytelling.Root defaults={{ ease: "linear" }}>
  <Scrollytelling.Pin childHeight="100svh" pinSpacerHeight="400svh">
    <VisualStage />
    <Scrollytelling.Animation
      tween={{ start: 0, end: 24, fromTo: [{ opacity: 0 }, { opacity: 1 }] }}
    >
      <section>...</section>
    </Scrollytelling.Animation>
    <Scrollytelling.Waypoint at={58} label="exploded" />
  </Scrollytelling.Pin>
</Scrollytelling.Root>
```

Define ranges and labels in data before JSX. Reserve intervals for entry, hold,
transition, and exit; do not let incidental component order determine timing.
Use `Waypoint` callbacks only for discrete side effects that need a reverse path.
Use `Animation` for continuous visual state. Use `Stagger` for homogeneous lists
or part proxies, not as a substitute for a semantic part hierarchy.

Keep the pinned child height and spacer height explicit and responsive. Verify
the last timeline state releases cleanly into ordinary document flow.

## 3. Connect video and frame sequences

For an ArtArch video-derived sequence, map timeline progress to the manifest's
actual frame range:

```ts
const local = clamp((progress - rangeStart) / (rangeEnd - rangeStart), 0, 1);
const frame = Math.round(local * (frameCount - 1));
```

Draw through `requestAnimationFrame`, paint the poster or first frame before the
timeline becomes interactive, and keep the previous valid frame on load failure.
Use the approved sequence manifest rather than inferred filenames. Preload a
coarse spread first, then the current neighborhood, then the remaining frames.

Do not let a background video's independent playback clock compete with the
scroll clock when the video is supposed to scrub. Either seek the video from the
timeline with a tested strategy or use a derived frame sequence.

## 4. Connect Three.js product state

In React Three Fiber, read `timeline.scrollTrigger.progress` inside `useFrame`,
or have GSAP tween stable proxy objects and apply their values in `useFrame`.
Avoid per-frame React state updates.

Represent each animatable part explicitly:

```ts
type PartState = {
  nodeName: string;
  parentName?: string;
  assembled: { position: THREE.Vector3; quaternion: THREE.Quaternion; scale: THREE.Vector3 };
  exploded: { position: THREE.Vector3; quaternion: THREE.Quaternion; scale: THREE.Vector3 };
};
```

At runtime, clamp progress to the operation's range, interpolate position and
scale with `lerpVectors`, and interpolate rotation with
`slerpQuaternions`. Apply whole-product rotation to a parent group so it does not
destroy part-local assembly transforms. Use a verified `AnimationClip` when the
model already contains the desired authored motion.

Use `Stagger` on numeric part proxies when an ordered reveal is intentional.
Reset proxy and model state on reverse waypoints so rapid reverse scrolling
cannot leave stale opacity or transforms.

For a 2.5D assembly made from isolated product or part images, place each image
on a transparent `PlaneGeometry` inside a named group, preserve a recorded
assembled transform, and define an explicit separated transform for every plane.
Scroll may move, scale, fade, or rotate those planes around controlled axes to
show separation and recombination. Keep camera orbit and tilt within the angles
the supplied views support, and label the result as a layered illustration.

Choose one input owner at a time. If scroll owns assembly progress, pointer drag
may control only a bounded inspection orbit unless the brief explicitly defines
handoff behavior. Do not make vertical touch scroll fight an unbounded canvas
gesture.

## 5. Define honest product assets

Use inputs according to what they actually contain:

- one image: poster, texture, decal, environment plate, or one 2.5D plane;
- several isolated images: layered 2.5D depth, restrained tilt, or part sprites;
- turntable video: pre-rendered spin or scroll-scrub frames;
- one-piece GLB/GLTF: real arbitrary-view rotation, but no semantic disassembly;
- named multi-part GLB/GLTF: rotation, hotspots, exploded view, and assembly;
- known dimensions and topology: programmatic Three.js geometry when practical.

Ask the user for original product photography, orthographic views, part diagrams,
GLB/GLTF, CAD-derived exports, node naming, and an assembled reference when
needed. With explicit run authorization, use ArtArch image generation to create
missing art direction, textures, environmental plates, posters, or 2.5D layers.
ArtArch video generation remains the default source for cinematic scrollytelling
and pre-rendered motion.

A single generated image cannot establish a trustworthy backside, volume,
occluded fasteners, pivots, or internal structure. Never advertise a 2.5D result
as true 3D, and never invent an exploded hierarchy from visual guesswork.

## 6. Control lifecycle and performance

- Keep the primary 3D stage full-bleed or unframed, with semantic HTML above it.
- Lazy-load models below the fold and show the approved poster during loading.
- Cap device pixel ratio and choose antialiasing, shadows, postprocessing, and
  texture sizes from a measured mobile budget.
- Pause nonessential mixers and rendering when the stage is offscreen or the
  document is hidden.
- Reduce draw calls with shared geometry/materials, instancing, texture atlases,
  or LOD only when the scene warrants it.
- On teardown, remove listeners and observers, cancel animation work, stop and
  uncache mixers, and dispose owned geometry, materials, textures, render targets,
  controls, and renderer resources. Do not dispose shared cached assets twice.
- Treat model or WebGL failure as a normal state with a poster, video, or frame
  fallback that preserves copy and page scroll.

## 7. Verify visible behavior

Use Playwright at desktop and mobile viewports. At minimum capture 0%, 25%, 50%,
75%, and 100% timeline states after media settles. For every canvas state, sample
pixels or compare screenshots to prove the canvas is nonblank and visibly changes.

For product assembly, also assert:

- every required node resolves by exact name;
- the assembled state matches the approved reference;
- the exploded state retains every part and correct parent ownership;
- reverse scroll reconstructs the assembled state without drift;
- orbit, zoom, and pointer capture stay within the approved limits;
- resize preserves framing and stable stage geometry;
- reduced motion and forced model/WebGL failure show a usable fallback;
- cleanup does not leave render loops, ScrollTriggers, or duplicate canvases.

The reference implementation's changing numeric progress is not sufficient
evidence. Verify the pixels the user sees.
