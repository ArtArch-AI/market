---
name: artarch-image-prompt
description: "Write and refine prompts for ArtArch Studio image nodes. Use for image generation, reference edits, inpainting, multi-reference composition, identity or style anchoring, character sheets, storyboards, keyframes, posters, typography, diagrams, UI mockups, and image-prompt troubleshooting. Do not use for video prompts."
---

# ArtArch Image Prompt

Before any node execution, read and follow the [Studio generation approval
rules](../artarch-studio/SKILL.md#generation): explain the node's purpose and
expected credits, then wait for explicit approval for that node. Only an
explicit request to run the agreed workflow in one go waives per-node questions;
a creative brief or request for a finished result does not. Unknown cost and
retries require the handling specified there. These rules also apply to all
execution stages and examples below.

Produce one copy-ready prompt for an image node, then apply it through the
ArtArch MCP tools only when the user requests a canvas change.

## Prepare

1. Inspect the bound canvas with `artarch_canvas_describe` and locate the target
   from the returned visible node names.
2. Run `artarch_node_kinds` to confirm the selected image node's models, settings,
   aspect ratios, quality options, and accepted inputs. Never invent an option.
3. Classify the task as generation, reference edit, inpaint instruction, or
   multi-reference composition.
4. Identify the asset type, aspect ratio, output size, quality intent, references,
   exact text, permitted changes, and invariants.

## Choose the asset paradigm

| Asset | Prompt priority |
| ---- | ---- |
| New image | Subject, composition, visible action, camera, light, style, text, exclusions |
| Reference edit | Edit source, required change, precise change area, invariants |
| Inpaint | Masked or named region, replacement content, boundary integration, untouched areas |
| Multi-reference composition | One role per reference, conflict priority, target composition |
| Character or identity sheet | Identity anchors, consistent costume and proportions, required views or poses |
| Storyboard or keyframe | Production timing, framing, action, performance, dialogue, sound, camera, endpoint |
| Poster or typography | Exact copy, hierarchy, placement, spacing, legibility, background relationship |
| Diagram or UI mockup | Information structure, labels, alignment, component states, readable text |

## Build the prompt

Order the prompt by production priority:

1. State the deliverable and primary subject.
2. Describe composition, framing, viewpoint, and spatial relationships.
3. Describe visible action or pose.
4. Name the physical light sources and intended contrast.
5. Specify visual treatment, materials, and finish without stacking vague quality
   adjectives.
6. Quote required text exactly and state its placement and hierarchy.
7. End with preservation rules and exclusions.

Give each reference one role: identity, wardrobe, prop, environment, style,
composition, or edit source. For edits, separate what must change from what must
remain unchanged. For multiple references, state a priority when their roles can
conflict.

Preserve identity anchors explicitly when relevant: face structure, hair, age,
body proportions, costume version, stable accessories, product shape, logo, and
label. Treat an existing canvas character node as the identity and style anchor
when the requested output must match it. Do not invent conflicting traits or infer
a reference role from upload order or filename.

For dense text, diagrams, and UI, specify the full content before appearance. State
the reading order, grouping, hierarchy, alignment, component states, and exact
labels. Keep decorative treatment subordinate to legibility.

Treat storyboards as production artifacts rather than posters. Cover one scene or a
continuous event lasting no more than 60 represented seconds. Keep every panel at
the target video's aspect ratio. Label panels in reading order with their time
range, framing, subject action, performance, exact dialogue, sound intent, camera
movement in words, lens or depth-of-field intent, and the ending state needed by
the next video node. Describe pans, pushes, tracking, tilts, focus changes, and lens
changes in text. Avoid UI controls, decorative arrows, and annotations that could
be mistaken for scene content.

## Quality pass

Before returning the prompt, verify that:

- every reference has one explicit role and conflicts have a priority;
- edits separate required changes from invariants;
- identity, product, logo, and text locks are explicit where relevant;
- composition and spatial relationships are operational rather than atmospheric;
- exact text appears verbatim with placement and hierarchy;
- exclusions prevent only likely failure modes and do not contradict the request;
- settings are supported by the selected ArtArch node.

## Apply to a node

Update an existing node after confirming its business settings:

- Use `artarch_node_configure` with `node`, optional `kind`/`name`, and the
  verified `settings`; project and canvas come from the selected MCP session.

Use only the configuration fields and values returned by `artarch_node_kinds`.

## Return

Return:

1. `Prompt`: one copy-ready prompt.
2. `Node settings`: model, quality, aspect ratio, output size, and other settings only
   when verified for the selected node.
3. `Reference map`: each reference and its role.
4. `MCP tool call`: include only when a visible node name and requested canvas change are
   available.
5. `Open assumptions`: only unresolved details that materially affect the image.

Do not call an image API, inspect credentials, or claim an image was generated.
