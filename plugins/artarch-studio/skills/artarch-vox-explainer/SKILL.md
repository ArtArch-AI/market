---
name: artarch-vox-explainer
description: "Plan and build narrated Vox-style paper-collage explainer videos on ArtArch Studio. Use when turning a topic, mechanism, history, comparison, misconception, or short educational script into a beat map, collage keyframes, MiniMax H3 start-and-end-frame clips, Chinese or multilingual narration, captions, and an assembled video canvas."
---

# ArtArch Vox Explainer

Before any node execution, read and follow the [Studio generation approval
rules](../artarch-studio/SKILL.md#generation): explain the node's purpose and
expected credits, then wait for explicit approval for that node. Only an
explicit request to run the agreed workflow in one go waives per-node questions;
a creative brief or request for a finished result does not. Unknown cost and
retries require the handling specified there. These rules also apply to all
execution stages and examples below.

Turn one topic into a short narrated explainer whose story, paper-collage look,
motion, audio, and delivery remain separately reviewable on an ArtArch canvas.
Use `artarch` for every canvas operation and verify current business node
capabilities before choosing models or settings.

Read [references/beat-and-look.md](references/beat-and-look.md) before drafting a
beat map or prompt. Use `artarch-image-prompt` for individual image prompts and
`artarch-video-prompt` for individual motion prompts when those skills are
available.

## Establish the production contract

Inspect the target canvas, connected references, and live node catalog before making
changes. Confirm the topic, language, target duration, aspect ratio, audience,
disclaimer needs, and delivery format from existing context. Make the smallest
safe assumptions for missing operational values.

Choose one narrative arc from the reference. Draft the complete beat map before
creating generation nodes. Each beat must contain:

- one narrative job and one short on-screen headline;
- narration that advances the explanation instead of repeating the headline;
- two shots when pacing permits: a wide orientation and a detail cut-in;
- one camera move per shot, varied across adjacent shots;
- paper-native element motion, an explicit opening state, and an endpoint.

Present this draft as the first mandatory approval gate. Do not generate images,
audio, or video until the user approves or edits the beat map.

## Separate look from motion

Build the collage in the image stage. Keep one reusable style block across the
film while changing scene, background color, and headline per beat. Describe
distinct cut-paper layers with visible edges, tape, print texture, and physical
drop shadows; avoid smooth CGI or photoreal rendering unless a supplied subject
must remain photographic.

Propose three or four topic-appropriate looks. Configure only a low-cost visual
bake-off after beat approval, then state the exact image nodes, upstream scope,
and possible credit use and obtain generation authorization. Before inspecting
AI-generated images, download or otherwise obtain local copies and compress
preview derivatives; inspect the derivatives, not the full-size files. Let the
user select the look before producing all keyframes.

Treat text baked into a generated image as provisional. Prefer captions or a
post-production overlay for wording that must be exact. Check every visible
Chinese character before accepting a keyframe.

## Adapt the living poster to MiniMax H3

Use the visible first-and-last-frame video kind only if `artarch_node_kinds` still lists
`MiniMax-H3`. Verify its aspect ratios, resolution, duration, audio behavior, and
credits at execution time; never freeze those values into the skill as permanent
facts.

Provide both a first and last frame for each clip. The pair must depict the same
poster, layout, headline, palette, and semantic moment. Make the last frame a
small, physically plausible progression of the first: rigid paper pieces settle,
coins slide, an arrow advances, tape flutters, or layers shift in parallax. Do not
use unrelated posters as the pair and do not introduce a new story beat in the
last frame.

Write a compact motion prompt in this order:

`shot + one camera move + paper-element motion + physical light + collage locks + endpoint`

Keep the poster flat and the camera parallel. Protect layout and lettering;
forbid redrawing, morphing, perspective rotation, internal cuts, and newly
invented objects using wording supported by the verified model. Prefer multiple
short clips over one overloaded long clip.

## Build the canvas

Lay the project out left to right:

`brief and script -> keyframe pairs -> MiniMax H3 clips -> narration/music -> sequence -> delivery`

Group nodes by beat or production stage. Connect every dependency explicitly and
use exact business slots from `artarch_node_kinds`; node proximity is not a dependency.
Keep keyframe and clip lineage visible. If an accepted paid artifact must feed a
later run without regeneration, materialize it as an input node before connecting
it downstream.

Do not bind a source repository to the canvas unless the user asks. Use
select the project and canvas by visible name in a dedicated production directory.
After each change, read the canvas back and verify persisted node settings and
business connections.

## Generate in reviewable stages

Treat every `artarch_run` as credit-consuming. Canvas
creation, prompt approval, or the initial request to make a video is not final run
authorization. Before each uncovered submission:

1. State the canvas name, exact node names, upstream dependencies, attempt count, and
   current credit estimate from live business information.
2. Ask for explicit authorization for that submission and wait for a new reply.
3. Poll the submitted run with `artarch_run_status`; never resubmit
   merely because polling stopped.

Generate and review in this order: style bake-off, all keyframes, one representative
H3 clip, remaining clips, audio, final assembly. A standing authorization may
cover later stages only when the user explicitly grants it for that scope.

## Audio, assembly, and acceptance

Use one narrator voice throughout. Keep narration intelligible above instrumental
music and time captions to spoken beats. MiniMax H3 audio assumptions must come
from live node capabilities; create narration and music as separate assets when the video
node is silent. Verify the sequence node's actual Width and Height settings and use
matching upstream dimensions to avoid unnecessary scaling or bars.

Completion requires artifact evidence, not only a successful API response:

- read back terminal run state and persisted artifact URLs;
- download the final video and probe duration, streams, resolution, and audio;
- extract locally compressed review frames near the start, middle, beat cuts, and
  end, then inspect them for collage continuity and text integrity;
- listen to or otherwise verify narration, music balance, and caption timing;
- report failed or unreviewed beats honestly and keep them out of the accepted
  continuity chain.

Include a factual or financial disclaimer when the subject warrants one. Never
present an explainer as personalized financial advice.
