---
name: artarch-video-prompt
description: "Write and refine production-ready prompts for ArtArch Studio video nodes. Use for text-to-video, image-to-video, video-reference, first-and-last-frame, continuation, dialogue, sound, camera, motion, or troubleshooting a video prompt on a canvas. Do not use for image-only prompts."
---

# ArtArch Video Prompt

Before any node execution, read and follow the [Studio generation approval
rules](../artarch-studio/SKILL.md#generation): explain the node's purpose and
expected credits, then wait for explicit approval for that node. Only an
explicit request to run the agreed workflow in one go waives per-node questions;
a creative brief or request for a finished result does not. Unknown cost and
retries require the handling specified there. These rules also apply to all
execution stages and examples below.

Produce a compact shooting brief for one video node. Keep model and provider claims
out of the prompt unless `artarch_node_kinds` verifies them for the selected node.

Hold the current story state across revisions: subject, look, references, decided
constraints, accepted footage, and prior failures. Change only what the user's
latest request requires.

## Route the request

Use the fast path for one standalone clip when the idea is clear and there is no
rights, likeness, safety, or platform-fact uncertainty. Write one visible beat, one
motivated camera move, one physical light source, sound intent, and preservation
constraints. Prefer roughly 40-110 words unless the selected node or user requires
a different budget.

Treat the request as a sequence project when it contains connected clips,
continuation, a long story, dense action or dialogue, a campaign, or more beats
than one generation can clearly hold. Before writing the current clip, establish:

- the story objective and final outcome;
- ordered major beats grouped into scenes;
- the available clip budget;
- the current clip's narrative job and felt intention;
- the opening state and required completed endpoint.

## Prepare

1. Identify the goal, production phase, target node, duration, aspect ratio,
   references, audio needs, deliverable, and safety or rights risks.
2. Inspect the canvas with `artarch_canvas_describe` and locate the target node with
   `artarch_canvas_describe`.
3. Run `artarch_node_kinds` and confirm the node's business slots, models, duration, aspect
   ratio, audio, and other exposed settings. Treat availability as node-specific;
   never infer a capability from a provider or model name.
4. Choose the mode from the actual connected inputs: text-to-video,
   image-to-video, video-reference, first-and-last-frame, edit, or continuation.
5. Assign each connected asset one primary role: identity, first frame, last frame,
   product, environment, motion, camera, timing, audio, or style.

### Multimodal reference runtime contract

For the visible multimodal reference-video node kind, the live generation
interface accepts exactly one authoritative reference video for the
action-reenactment pattern even when the node catalog advertises more video
references. Connect the Depth Video Analysis result as the first Reference Video.
Never also connect the original source segment or a second depth derivative. The
source segment only feeds the Depth node.

Connect reviewed character slots followed by the scene background slot at stable
one-based Reference Images positions. These Image Input nodes are replaceable;
after an asset update, read the canvas back before writing the prompt or running.
When the selected model supports audio, connect the matching source-audio segment
to the Audio slot as soundtrack timing authority.

When a reference video owns timing, probe its actual duration before configuring
the node. Select the matching supported model duration instead of leaving the
node default. Configure the visible Duration setting, then read the canvas back
and require it to match. If the model exposes only discrete
durations and the reference does not match one, first make a separate frame-aligned
reference derivative at a supported duration; never silently round while keeping
the original reference connected.

For Seedance 2.0 (`doubao-seedance-2-0-260128`) and Seedance 2.0 Fast
(`doubao-seedance-2-0-fast-260128`), add the durations of every connected
reference video before upload or connection and require a total of at most 15
seconds per generation node. Split or re-encode longer material first; do not wait
for the upload or generation request to reject it.

State honestly what can be inspected. Never claim to have viewed, watched, heard,
measured, or verified an attachment or result that is unavailable. Work from the
user's description and ask for a description only when the missing observation
blocks the prompt.

Use only the reference notation supported by the selected node. Do not assume a
universal reference-tag syntax. Preserve every binding exactly across rewrites,
translations, and sequence clips.

## Resolve reference authority

For each controlled dimension, select exactly one winning asset or mark the
dimension not applicable: identity, wardrobe, product, environment, composition,
motion, camera, timing, audio, and style. One asset may own several dimensions, but
no dimension may have two owners. Drop references that own nothing and explicitly
state what each retained reference must not transfer.

## Build the prompt

Use this order:

`Subject + visible action + scene + camera + lighting/style + audio + constraints`

- Keep one main subject, one visible beat, and one local endpoint per short clip.
- Write fragile action as an ordered chain: initial state, trigger, decisive change,
  response, follow-through, and endpoint.
- Use one motivated primary camera move and state its endpoint.
- Describe performance through visible gestures instead of abstract emotion words.
- Name physical light sources and make camera, light, performance, and sound serve
  one intention.
- Repeat spoken dialogue verbatim and identify the speaker. State ambience, sound
  effects, music intent, or silence when audio matters.
- Preserve connected-image identity and composition unless the requested change
  requires otherwise. Describe motion and change instead of redundantly
  redescribing a supplied frame.
- Remove generic quality boosters, duplicate style adjectives, secondary camera
  moves, and secondary actions before removing timing or preservation constraints.

## Resolve conflicts

Apply this priority order when constraints conflict:

1. Safety, rights, consent, and platform policy.
2. Capabilities verified for the selected ArtArch node operation.
3. Explicit user non-negotiables.
4. Reference roles and preservation contracts.
5. Identity, spatial, temporal, prop, and audio continuity.
6. Physical causality and action legibility.
7. Camera and editorial logic.
8. Style, palette, atmosphere, and decorative detail.
9. This skill's defaults.

Classify a constraint by what it controls, not who supplied it. Never drop a user
requirement silently when a higher-priority constraint wins; state the tradeoff.

## Preserve sequence continuity

For continuation, begin from the accepted clip's observed ending state. Accepted
observed state overrides planned state. Exclude rejected footage from continuity,
keep later prompts provisional until the preceding take is accepted, and do not
replay completed action or introduce a reserved later beat.

Keep clip lineage, continuity locks, exact reference bindings, the actual opening
state, completed-beat exclusions, and reserved beats in the working brief. Write
lineage into the canvas only when the selected node exposes suitable settings.

Stay within one scene for a seamless continuation. At a scene boundary, re-anchor
from canonical references instead of treating the new scene as an unbroken tail.

## Review and repair

Run a quality pass before applying the prompt:

- one main subject, one visible beat, and one completed local endpoint;
- camera, light, blocking, performance, and sound serve one intention;
- subject, prop, camera, and environmental motion have clear owners;
- dialogue and reference bindings remain verbatim;
- identity, space, time, prop ownership, and audio state remain continuous;
- no unsupported setting, capability, or observation is presented as fact;
- vague quality boosters and contradictory instructions are removed.

When a result is available, choose deliberately between keep, fix in post, edit,
rerun, or rewrite. Diagnose the failure before adding adjectives, change one
variable per attempt, and stay within an explicit attempt budget.

## Apply and run

Canvas, prompt, or creative-plan approval does not authorize generation.
Follow the [Studio generation approval rules](../artarch-studio/SKILL.md#generation)
for each node, including upstream dependencies: explain its purpose, disclose
expected credits, and wait for explicit approval. Apply the same rules to retries
and to the exception for explicitly authorized batch execution.

- Use `artarch_node_configure` with `node`, optional `kind`/`name`, and verified
  `settings`; project and canvas come from the selected MCP session.
- Use `artarch_run` with `target`, `authorized`, and optional `wait`/
  `timeoutSeconds`; project and canvas come from the selected MCP session.

Download accepted output URLs only when the user wants local artifacts. On timeout, continue
with the `artarch_run_status` for the existing run instead of starting another run.

## Return

Return:

1. `Mode`: the input and generation mode verified for the node.
2. `Reference authority`: each input, its owned dimensions, and exclusions.
3. `Prompt`: one copy-ready natural-language prompt for the current clip only.
4. `Node settings`: only settings verified for the selected node.
5. `Continuity`: opening state, endpoint, locks, completed beats, and reserved beats
   when the request belongs to a sequence.
6. `MCP tool call`: include only when a mutation or run was requested.
7. `Caveats`: unavailable observations, unresolved rights, or unverified node facts.
