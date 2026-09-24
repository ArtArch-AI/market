# Canvas-Depth Action Reenactment

## Purpose

Recreate a person-led source video while allowing users to replace any detected
character or scene background. Keep appearance, environment, motion, audio, and
delivery as separate authorities on the canvas.

## Topology

Prepare scene-aware segments no longer than 15 seconds and matching audio segments
outside the canvas. Build one lane per segment:

`source video -> Depth Video Analysis -> multimodal reference video -> Video sequence output`

Connect shared `character_NN` and `background_NN` image input nodes directly to
every lane that uses them. Connect the matching audio input when the selected live
model accepts it. Character and background inputs remain replaceable throughout
the workflow.

## Reference Authority

- Character image slots own identity, body appearance, wardrobe, and accessories.
- The background image slot owns environment, layout, viewpoint, and lighting.
- The canvas Depth output owns action order, timing, pose, screen position, camera
  motion, and relative spatial structure. It must not transfer grayscale styling.
- The matching extracted audio owns soundtrack timing. It is a reference, not
  proof of bit-identical preservation.
- The original source segment is only the input to Depth analysis. Do not also
  connect it to reference-video generation.

## Business Node Contract

Re-read `artarch_node_kinds` before construction. The currently observed pattern
uses:

- Video Input -> Depth Video Analysis through the Video slot;
- Depth Video Analysis -> multimodal reference video through the first Reference
  Video position;
- Image Input -> consecutive Reference Images positions for each character, then
  the background;
- optional Audio Input -> Audio for the matching source-audio segment;
- generated clips -> consecutive Videos positions on Video sequence output in
  source order.

Verify every business slot against the live node catalog. Use the exact prepared segment duration
only if the chosen model supports it. The runtime accepts one authoritative Depth
video reference for this pattern even when the node catalog advertises more video slots.
For Seedance 2.0 (`doubao-seedance-2-0-260128`) and Seedance 2.0 Fast
(`doubao-seedance-2-0-fast-260128`), the combined duration of every reference
video connected to one generation node must not exceed 15 seconds. Split or
re-encode source derivatives before upload and connection.

## Replaceable Slots

Create canonical character slots from visual review of compressed frames. Reuse a
slot across lanes only when evidence supports that it is the same intended role;
do not claim biometric identity. Create one background slot per distinct scene.

Replace a reference by updating its canonical Image Input node. Rely on business connections
and MCP downstream synchronization instead of copying URLs into generation nodes.
Read back every affected Reference Images position before running.

## Acceptance

Before a run require:

- every source lane is at most 15 seconds;
- one source-to-Depth connection per lane;
- exactly one Depth video connection into each reference-video node;
- reviewed character/background slots in deterministic order;
- matching audio duration when audio is connected;
- no direct source-video connection into reference-video generation;
- ordered fast-sequence indices with no gaps or duplicates;
- prompts whose reference numbering matches persisted business connections.

After a run, verify persisted terminal state and artifact URL, then inspect identity,
background, action, camera, limb integrity, audio alignment, and segment order. Only
accepted clips enter final delivery.
