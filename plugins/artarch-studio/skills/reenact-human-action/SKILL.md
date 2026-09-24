---
name: reenact-human-action
description: Build an ArtArch Studio canvas that reenacts a person-led source video with replaceable character and background slots. Prepare scene-aware source and audio segments no longer than 15 seconds, inspect compressed frames, create one canvas Depth Video Analysis and multimodal reference-video branch per segment, then assemble accepted clips in order. Use for recreating, imitating, transferring, or replacing people and environments in dances, gestures, performances, sports, demonstrations, or other human-action videos.
---

# Canvas Human-Action Reenactment

Before any node execution, read and follow the [Studio generation approval
rules](../artarch-studio/SKILL.md#generation): explain the node's purpose and
expected credits, then wait for explicit approval for that node. Only an
explicit request to run the agreed workflow in one go waives per-node questions;
a creative brief or request for a finished result does not. Unknown cost and
retries require the handling specified there. These rules also apply to all
execution stages and examples below.

Build a reviewable ArtArch canvas. Local processing only prepares deterministic
source, audio, and compressed inspection assets. Depth analysis and reference
video generation belong to canvas nodes; do not install or run a local depth or
tracking model.

## Prepare The Source

1. Resolve the exact local source video and a new output directory. Never replace
   the source.
2. Run the bundled script by absolute path:

   ```bash
   python3 <skill-directory>/scripts/prepare_canvas_reenactment.py \
     --input /absolute/path/input.mp4 \
     --output-dir /absolute/path/reenactment-prep
   ```

   The default maximum is 15 seconds. It detects strong scene cuts, rejects cuts
   that create fragments shorter than 4 seconds, splits longer scenes evenly, and
   re-encodes on exact time boundaries. It also writes a WAV segment from the
   original mixed audio track and three compressed review frames per segment.
   This is soundtrack extraction, not dialogue/music stem separation.
3. Read `manifest.json`. Require `status: prepared`, every segment verification
   to pass, and every referenced file to exist. Do not treat exit code alone as
   proof.
4. Inspect every compressed review frame. Record stable people across segments as
   canonical character slots (`character_01`, `character_02`, and so on). Record
   one background slot per distinct scene. Do not claim face identity from visual
   similarity alone. If a person or background cannot be seen clearly enough,
   mark the slot unresolved instead of inventing it.
5. Choose the clearest source-derived still for each initial slot. Character and
   background slot nodes are user-replaceable inputs, not immutable observations.

## Verify The Live Node Catalog

Run `artarch_node_kinds` immediately before construction. Verify the selected
node kinds, business slots, durations, aspect ratio, resolution, audio support, and model
options. The currently observed topology uses:

- Video Input for each prepared source segment;
- Audio Input for each matching WAV segment when the chosen model accepts audio;
- Image Input for every canonical character and background reference;
- Depth Video Analysis for canvas-generated depth video;
- the visible multimodal reference-video kind for the replacement clip;
- Video sequence output for ordered delivery.

Treat these names as live observations, not a permanent allowlist.

## Build The Canvas

Use one left-to-right lane per prepared segment:

`source video -> depth video -> reference video -> fast sequence edit`

For each lane:

1. Create a Video Input with the prepared MP4 in `media.payload` (base64/data
   URL), or use `media.sourceUrl` for a public HTTPS source. An independently
   uploaded project CDN URL can instead be set through the verified Video
   business slot. Connect the input node's Video output to the Depth Video
   Analysis node's Video slot.
2. Connect the Depth output as the only video reference at
   first Reference Video position on the multimodal reference-video node. Never connect both
   the original source segment and its depth result to that node.
3. Connect every visible character slot in deterministic on-screen order, followed
   by the scene background, to consecutive Reference Images positions. Share the same canonical
   character or background input node across lanes when it is the same approved
   slot.
4. When supported by the chosen model, upload the matching WAV with
   `artarch_asset_upload`, set the Audio Input's verified business slot to its
   project CDN URL, and connect that node to the Audio slot. Its role is timing
   and soundtrack reference; do not promise bit-identical preservation unless
   the final artifact is independently verified.
5. Set the reference-video duration to the prepared segment duration only when the
   live model exposes that exact value. If the value is unsupported, adjust the
   prepared segment or select another verified model; never silently round.
   For Seedance 2.0 (`doubao-seedance-2-0-260128`) and Seedance 2.0 Fast
   (`doubao-seedance-2-0-fast-260128`), all reference-video inputs connected to
   one generation node must total no more than 15 seconds. Split or re-encode the
   source derivatives before upload and connection; do not rely on upload or run
   failure to discover an oversized reference set.
6. Connect each generated clip to consecutive Videos positions on Video Sequence
   Edit Fast in manifest order. The
   sequence must contain no gaps or duplicate indices.

Recommended groups are `00 Source contract`, one `Scene NN` group per lane,
`Canonical character slots`, `Canonical background slots`, and `Final assembly`.

## Replacement Contract

Character and background replacements happen by updating their canonical
Image Input nodes. Do not duplicate a replacement into every generation node.
The MCP server synchronizes changed input assets through business connections; read the
canvas back and verify every affected reference position before a run.

Each prompt must name the actual connected image slots and assign one authority:

- character slots own identity, body appearance, wardrobe, and accessories;
- the background slot owns environment, layout, viewpoint, and lighting;
- the depth video owns action order, timing, pose, screen position, camera motion,
  and relative spatial structure;
- the audio segment owns soundtrack timing only.

Explicitly forbid source-person identity, source wardrobe, grayscale/depth styling,
captions, watermarks, UI, extra people, and duplicated limbs unless requested.

## Run Gates And Acceptance

Canvas, prompt, or creative-plan approval does not authorize generation.
Follow the [Studio generation approval rules](../artarch-studio/SKILL.md#generation)
for each node, including upstream dependencies: explain its purpose, disclose
expected credits, and wait for explicit approval. Apply the same rules to retries
and to the exception for explicitly authorized batch execution.

After every change, read back the named nodes and connections. Before a run require:

- every prepared segment is at most 15 seconds and has a matching lane;
- each lane has one source-to-Depth connection and exactly one
  Depth-to-reference-video connection;
- character/background image slots match the reviewed slot manifest;
- audio segment timing matches its video segment when audio is connected;
- reference-video nodes use supported exact durations and models;
- fast-sequence indices match manifest order.

After a run, verify persisted terminal status and artifact URLs. Inspect each clip
for identity or background drift, source-person leakage, depth styling, extra or
missing people, limb errors, motion discontinuity, audio mismatch, and cut order.
Only accepted clips enter the final sequence edit. Use the existing run’s status
command after a timeout; never submit a duplicate merely because polling timed out.

## Recovery

The preprocessing manifest is the recovery identity. Reuse it only when the source
SHA-256 and segmentation settings match. Use `--overwrite` explicitly to replace
prepared outputs. Keep failed generated clips out of the ordered sequence and retain
their run references for diagnosis.
