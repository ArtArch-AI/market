# Shared Canvas Contract

Apply these rules to every maintained AIGC pattern.

## Topology

Use this stage order:

`brief and prompt contracts -> canonical assets -> derived assets or storyboard -> clips or variants -> delivery`

- Lay stages out left to right with stable x coordinates.
- Stack parallel nodes vertically inside a stage.
- Use groups for ownership and review scope, not decoration.
- Connect every runtime dependency. Nearby nodes and group membership are not
  implicit inputs.

## Reference authority

Give each connected asset one primary role: product truth, identity, wardrobe,
environment, composition, style, first frame, last frame, motion, timing, or
audio. For each controlled dimension, choose one winning source. State what must
not transfer when references can leak into each other.

Canonical assets are append-only during an approved production pass. Create a
new version when product geometry, packaging, face, costume, or location changes.
Do not silently replace an accepted upstream asset.

## Generation units

- One still node owns one deliverable or one coherent set.
- One short video node owns one visible beat, one primary camera move, and one
  completed local endpoint.
- Put exact dialogue in both the governing storyboard and clip prompt.
- Record the previous accepted endpoint before writing a continuation prompt.
- Change one variable per retake and keep rejected footage out of continuity.

## Prompt placement

Keep operational prompts on the executable node. Use the visible Text Input kind for the
human brief, copy hierarchy, consent gate, or production contract that should
remain visible on the canvas. Connect a text node to a prompt input only when it
is the actual runtime prompt source.

## Model and setting verification

Before adding or updating nodes, inspect `artarch_node_kinds`. As of the maintained
examples, the verified core types are:

- Text Input for visible prompt contracts;
- Text to Image for canonical stills;
- Image to Image and multi-reference image generation for controlled derivatives;
- reference-video generation for image-reference clips;
- Video sequence output for ordered clip delivery through one-based Videos
  positions.

Treat this list as an example, not a permanent allowlist. Re-read the node catalog
before every new canvas because models and settings can change.

For final-frame extraction, configure the visible Frame setting as numeric `-1`.
For Seedance 2.0 and
Seedance 2.0 Fast reference-video nodes, require the combined duration of all
connected reference videos to be at most 15 seconds. Split or re-encode longer
source media before upload and connection.

## Approval gates

Require explicit approval between:

1. brief and canonical assets;
2. canonical assets and derivatives or storyboards;
3. storyboards and video runs;
4. generated takes and final assembly.

Canvas construction does not authorize generation.

## Persistence and recovery

After writes, run:

- Use `artarch_canvas_describe` with no arguments; project and canvas scope are
  already selected in the MCP session.

Verify project name, visible node names and kinds, groups, and business connections. After a
run, verify the persisted terminal status and artifact URL. Resume timed-out runs
with `artarch_run_status`; do not create a duplicate run.

## Quality gates

- Product: geometry, materials, packaging, label, logo, and color remain stable.
- Person: consent is known; face, age, hair, body proportions, and costume version
  remain stable.
- Story: dialogue, prop ownership, spatial direction, reveal order, and endpoints
  remain continuous.
- Poster: copy is exact, hierarchy is legible, and deterministic layout remains a
  separate handoff when generated text is not acceptable.
- Delivery: requested ratio, duration, audio state, channel crop, and file result
  are verified from persisted output.
