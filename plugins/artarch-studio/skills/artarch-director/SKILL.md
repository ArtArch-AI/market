---
name: artarch-director
description: "Run an opt-in creative direction and brainstorming session for an ArtArch project. Offer it when an image, video, website, campaign, or canvas request is materially underspecified, and enter only after the user accepts."
---

# ArtArch Director

Before any node execution, read and follow the [Studio generation approval
rules](../artarch-studio/SKILL.md#generation): explain the node's purpose and
expected credits, then wait for explicit approval for that node. Only an
explicit request to run the agreed workflow in one go waives per-node questions;
a creative brief or request for a finished result does not. Unknown cost and
retries require the handling specified there. These rules also apply to all
execution stages and examples below.

Turn a rough feeling or incomplete idea into a coherent, confirmed director brief.
Translate intent into craft instead of handing parameter selection back to the
user. Do not mutate the canvas, generate assets, or start implementation during
the direction session unless the user explicitly ends discovery and requests it.

## Question interface

Director mode works in an ordinary Codex conversation. First detect whether the
current host exposes a structured question capability. If it does, use that
capability directly and stay in the current session; if another agent can ask
questions directly, use its native interface. In non-Plan mode, ask questions in
the assistant message with numbered or lettered choices. Do not attempt to
switch the Codex collaboration mode from a skill or MCP tool: mode switching is
host-controlled, and a Plan-only question tool is not guaranteed to exist in a
normal session. Structured choices are only a presentation convenience, not a
requirement. Always accept a free-form answer such as "use your recommendation"
or "skip this".

Keep each round small: one to three independent questions, two or three options
per question, and one clearly marked recommendation. Explain the visible effect
of each option in business language. Never expose node fields, storage IDs,
graph syntax, or service implementation details as choices.

## Entry contract

Do not silently enter director mode. If the request is materially underspecified,
first offer a single mode choice in the normal conversation:

1. **Quick execution**: use sensible defaults and start shaping the result.
2. **Director mode (recommended)**: answer short rounds of creative choices,
   then confirm one brief before implementation.
3. **Concept options**: compare two or three high-level directions first.

Proceed only after the user selects director mode or explicitly asks for the
same kind of guided discovery. If the request already fixes the deliverable,
audience, look, duration, format, and important constraints, skip the offer and
continue directly. If the user says "just do it", "surprise me", or delegates
the decisions, use Quick execution and record assumptions instead of opening an
interview.

After the user opts in, before asking questions:

1. Read the conversation and preserve every decision already made.
2. Inspect relevant repository files and the bound canvas with non-mutating
   commands such as `artarch_scope_options` and `artarch_canvas_describe`.
3. Use `artarch_node_kinds` only when available node capabilities affect a creative
   choice.
4. Mark references or results as observed, user-reported, or unavailable. Never
   claim to have inspected media that cannot actually be inspected.
5. Remove questions whose answers are already present in the environment.

Maintain one session state with four lists: `confirmed`, `recommended`, `rejected`,
and `open`. Never ask the user to repeat a settled decision.

## Conversation loop

Run short rounds until the brief is implementable:

1. Reflect the current intent in plain language, including any tension between
   desired outcomes.
2. When direction is genuinely open, propose two or three coherent creative
   directions. Give each a concise spine and explain its implications across story,
   image, motion, sound, and delivery. Avoid random mood-board lists.
3. Recommend one direction and explain the tradeoff using known context.
4. Ask no more than three independent decision questions in one round. Give two or
   three concrete options when useful, mark the recommended option, and always
   accept a free-form answer.
5. Update the session state after each answer. Briefly show what changed when it
   prevents ambiguity; do not restate the entire brief every round.
6. Skip irrelevant dimensions and stop asking once remaining uncertainty no longer
   changes implementation.

If the user says "surprise me" or delegates a choice, select the recommended
direction, record the assumption, and continue rather than forcing another
question.

For a video or other time-based deliverable, use this order unless the user has
already answered a phase. Do not ask every phase at once:

| Phase | Confirm through visible choices |
| --- | --- |
| 1. Outcome | Audience response, platform context, and what success looks like |
| 2. Format | Duration, aspect ratio, delivery format, and platform conventions |
| 3. Visual world | Overall visual style, realism or stylization, palette, texture, and reference authority |
| 4. Rhythm | Calm, balanced, or high-energy pacing; beat density; music, ambience, or silence |
| 5. Story beats | Opening image, escalation or transformation, and ending state |
| 6. Shot language | Shot size and viewpoint, then the camera movement for each beat or shot |
| 7. Performance | Blocking, gesture, continuity, and subject identity across shots |
| 8. Finish | Lighting, typography or overlays, safety and rights constraints, and acceptance criteria |

For shot language, first agree on the beat list. Then ask movement per shot in
plain terms such as locked-off, push-in, lateral track, orbit, handheld energy,
or a user-provided alternative, and explain how that changes attention and
continuity. Do not force a camera choice for a shot where a static frame is the
creative intent.

## Direction canvas

Cover only dimensions that materially affect the requested deliverable:

| Dimension | Clarify |
| ---- | ---- |
| Intent | Desired audience response, emotional core, single creative intention |
| Audience and context | Who will experience it, where, and what they should do next |
| Deliverable | Image, video, website, campaign, workflow, quantity, format, duration, aspect ratio |
| Narrative | Subject, world, central tension, visible beat, ending state, sequence scope |
| Art direction | Visual language, palette, materials, texture, typography, realism or stylization |
| Composition | Hierarchy, framing, spatial relationships, information density |
| Cinematography | Shot size, viewpoint, lens intent, camera movement, depth of field |
| Lighting | Motivated sources, contrast, color relationship, time and atmosphere |
| Performance and motion | Blocking, gesture, action chain, rhythm, continuity endpoint |
| Sound | Dialogue, voice, ambience, effects, music intent, silence |
| References | Role and authority of each asset, invariants, exclusions, conflict priority |
| Production | Available canvas nodes, technical limits, time, budget, iteration allowance |
| Rights and safety | Ownership, likeness, consent, brand limits, prohibited content |
| Acceptance | What must be visibly true for the result to be approved |

Translate feelings into testable craft choices. For example, interpret "make it
feel like home" as a proposed combination of blocking, camera distance, practical
light, sound, and pacing, then ask whether that interpretation matches the intent.
Do not ask the user to choose technical parameters without explaining their visible
effect.

## Resolve conflicts

Use this priority order:

1. Safety, rights, consent, and policy.
2. Capabilities verified for the selected ArtArch operation.
3. Explicit user non-negotiables.
4. Reference roles and preservation contracts.
5. Story, identity, space, time, prop, and audio continuity.
6. Physical causality and audience legibility.
7. Camera, interaction, and editorial logic.
8. Style, palette, atmosphere, and decorative detail.
9. Director defaults.

If a lower-priority choice must change, name the tradeoff. Do not silently drop a
user requirement.

## Close the session

When the decisions are sufficient, return a `Director brief` containing:

1. Objective, audience, and desired response.
2. Deliverable, scope, format, and technical constraints.
3. Core concept and recommended direction.
4. Story or experience structure with opening and ending states.
5. Art direction, composition, camera, lighting, performance, motion, and sound as
   applicable.
6. Reference authority map, invariants, and exclusions.
7. Rights, safety, budget, and production constraints.
8. Acceptance criteria.
9. Confirmed decisions, delegated assumptions, and any remaining open issue.
10. Recommended handoff: `artarch-image-prompt`, `artarch-video-prompt`,
    `artarch-website`, or `artarch-workflow-patterns`.

Ask the user to confirm the brief or correct specific decisions. After confirmation,
hand off the confirmed state without re-interviewing the user.
