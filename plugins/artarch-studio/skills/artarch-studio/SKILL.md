---
name: artarch-studio
description: >-
  Create and edit AI images, videos, ads, and visual stories in ArtArch Studio
  through business-level MCP tools. Use for commercial advertising, product
  campaigns, image cleanup or object and person removal, themed creative short
  films, storyboards, media generation, and the canvas workflows behind them;
  connect through remote HTTP MCP with browser OAuth.
---

# ArtArch Studio

Use the remote ArtArch MCP server. No local ArtArch executable is required. Never ask the user for storage identifiers, connection
encodings, collaboration details, or raw canvas documents.

All creative actions must use the ArtArch MCP tools. Do not use Computer Use,
website controls, WebMCP, or the ArtArch website UI as a fallback for creating,
editing, or generating content. If ArtArch MCP tools are absent, report that the
plugin connection is unavailable and ask the user to reconnect the plugin; do
not continue by operating the website.

When a creative request is materially underspecified, offer Quick execution or
the opt-in `artarch-director` mode before building the canvas. Director mode is
ordinary conversation guidance and also works outside Plan mode: ask one to
three text-based choice questions per round, with a recommendation and a
free-form escape hatch. Confirm visual direction, pacing, duration, aspect
ratio, target-platform style, story beats, and per-shot camera movement in
stages, skipping decisions already present in the request. If the host provides
a native structured question interface, use it in the current mode; never try
to switch Codex modes from the skill or MCP server. Do not expose node schemas
or implementation details as questions, and do not silently enter the mode.

## Creative focus

Treat ArtArch as an AI creative studio first and a canvas editor second. Lead
with the requested visual result, then build the canvas needed to produce it.
Typical requests include:

- creating a commercial advertisement from a product, brand, audience, channel,
  and desired mood;
- removing a passerby or unwanted object from an image while preserving the
  main subject, composition, lighting, and believable background;
- producing a themed creative short film through visual direction, storyboard
  or keyframes, generated shots, sound, and final sequencing;
- generating or editing campaign images, product visuals, posters, storyboards,
  keyframes, videos, and reusable creative variants.

Ask only for missing creative constraints that materially change the result.
Do not make the user design nodes or explain the canvas implementation.

## Session scope

- Each client connection owns an independent remote ArtArch MCP session.
- Start with `artarch_session_context` or `artarch_scope_options`.
- Refer to projects and canvases by visible name.
- Start a new request in a new project by default. Reuse an existing project only
  when the user explicitly asks for reuse or the request clearly continues that
  project's work.
- When reuse is justified, show its name and get explicit approval before
  selecting it.
- Select one project for the session. Do not silently switch projects.
- Selecting a canvas automatically prepares persistence and live collaboration.

## Canvas work

1. Inspect the session with `artarch_session_context` or
   `artarch_scope_options`; project and canvas scope is session-owned.
2. Create a project with `artarch_project_create` (`name`, `confirmed: true`),
   or reuse one with `artarch_project_select` (`name`, `confirmed: true`).
3. Create a canvas with `artarch_canvas_create` (`name`, `confirmed: true`), or
   select one with `artarch_canvas_select` (`name`).
4. Call `artarch_node_kinds` to discover visible node kinds and settings.
5. Use `artarch_node_add`, `artarch_node_configure`, and
   `artarch_node_remove` with visible names.
6. Use `artarch_node_connect` with source name, target name, target slot, and
   optional 1-based list positions.
7. For several related node and connection changes, use `artarch_canvas_batch`
   instead of separate mutations. Review the operations with the user and pass
   `confirmed: true` only after explicit confirmation. Its ordered `addNode`,
   `configureNode`, `removeNode`, `connect`, and `disconnect` operations use visible
   names; nodes added earlier in the batch can be connected later in the same
   batch. Image/Video Input operations may include `media` as described below.
   The server validates the graph changes and persists one flow-ops batch; it
   does not run generation. Media uploads occur separately before graph
   persistence and may remain if a later operation fails, so verify scope and
   media before submitting and do not blindly retry a failed batch.
8. Call `artarch_canvas_describe` to verify the business result.

Treat every returned `options` list as a closed enum already filtered for the
current membership. Pass the exact `option.value`; use `option.label` only for
display. Never invent or silently substitute a model, aspect ratio, resolution,
quality, duration, or mode. If validation rejects a value, show the specific
error and call `artarch_node_kinds` again before retrying.

For a selected model, inspect `option.constraints.inputLimits` before connecting
reference media. It may specify image, video, or audio counts, per-video and
total reference duration, accepted audio formats, or whether audio may be the
only reference. Model descriptions are retained when a registry has not yet
published a fully structured limit. Treat missing limits as unknown; never
guess a limit or add duplicate references just to satisfy an error. Run-time
validation rejects known count violations before submitting a credit-consuming
generation.

For a remote Image Input or Video Input, supply user-provided media directly in
the `media` object of `artarch_node_add`, `artarch_node_configure`, or an
`artarch_canvas_batch` `addNode`/`configureNode` operation. Use exactly one of
`media.payload` (base64 bytes or a data URL) for local media and
`media.sourceUrl` for a public HTTPS URL; include `media.filename` when the
payload's file type cannot be inferred. When configuring an existing node with
`media`, pass its visible `kind` as well, including inside a batch operation.
The MCP server uploads the media into
the project and writes the CDN URL to the input node before persisting it.
Do not also set the node's image/video setting when passing `media`. An
existing project-owned CDN URL can instead be supplied through the visible
business setting returned by `artarch_node_kinds` without reuploading.

`artarch_asset_upload` remains optional for Image/Video Input: use it when the
asset must be uploaded independently or reused across nodes. For local audio,
use `artarch_asset_upload` and configure the Audio Input with its returned URL
via the visible business setting; Audio Input does not accept the node's
`media` object. Never pass a local filesystem path as a setting: the remote MCP
server cannot read the caller's files. Uploads accept at most 100 MiB and
apply SSRF checks to public HTTPS source URLs. Do not bypass those checks.

Do not construct graph objects or synchronization messages. Do not infer a
setting name when `artarch_node_kinds` can return the supported business slots.

When the user wants a guided requirement-to-canvas flow, use
`artarch_render_canvas_brief` after selecting a canvas. The form sends one
state plus Jev's typed Choice, Score, and Noul questions to
`artarch_canvas_brief_prepare`, then shows probabilities, confidence, and a
MCP tool plan. Ask for confirmation before `artarch_canvas_brief_apply`; it
only creates and connects nodes and never starts generation. A live Jev call is performed by the authenticated MCP service. If the MCP
connection is unavailable, stop and report the connection error.

## Generation

Default to **one user approval per node submission**, including image, video,
audio, analysis, and assembly nodes, even when a node is expected to be free.
Creating a finished commercial, approving a storyboard or prompt, choosing Quick
execution, saying "try again" about a connection, or granting OAuth access is
not permission to run nodes. Never infer standing authorization from a request
for a complete deliverable.

Before each submission:

1. Link the selected canvas and name the next node. Explain in plain language
   what it will produce and why it is needed. Show the selected model and the
   settings that affect cost, such as duration, resolution, and output count.
2. Disclose every upstream node that the submission would also execute. Default
   to a single-node scope; do not run a whole canvas or silently generate missing
   dependencies under one node's approval. Obtain approval for each dependency
   first, unless the user explicitly grants the batch exception below.
3. Show the expected credit consumption for this submission using current
   service pricing or an available read-only estimate, identifying its source
   and whether it is an estimate or fixed quote. Never submit a generation to
   discover its cost. Never invent prices, treat unavailable pricing as zero,
   or present "may consume credits" as a numeric estimate. If pricing is
   unavailable through the current MCP tools, say "Expected credits: unknown;
   this connection does not provide a reliable pre-run estimate" and stop.
   Proceed only if the user explicitly accepts that unknown cost for this node;
   otherwise leave it prepared and unsubmitted.
4. Ask whether to run this node and **wait for a new user reply**. An announcement
   is not consent. Use the host's question tool when available or end the turn
   with the question; never submit while the question is pending. Only then set
   `authorized: true`. That flag records the user's decision; setting it yourself
   is not evidence that the user agreed.

For example: "Next: Hero Visual — generate the perfume bottle image used as the
video's first frame. Model/settings: [current values]. Expected consumption:
[live estimate and source, or explicitly unknown]. Run this node?" After it
finishes, explain and request approval for the video node separately.

**Batch exception:** skip individual questions only when the user explicitly
asks to run the whole agreed workflow in one go or explicitly waives per-node
confirmation, such as "一口气跑完" or "run all these nodes without asking again".
Show the included nodes, their purposes, per-node estimates and total before
starting. If that informed batch approval was already given, do not ask again.
If the scope or cost was not yet disclosed, obtain one approval for the summary;
unknown costs require explicit acceptance. Keep the grant within the stated
canvas, nodes, settings, and budget. New nodes, materially changed settings,
higher estimates, or revocation require fresh approval. A normal "yes" to one
node never authorizes the remaining workflow. Creative-adjustment permission
and an active goal do not waive this execution gate.

After informed batch authorization covering **every runnable node on the
selected canvas**, if the user permits parallel execution or explicitly prefers
speed, call `artarch_run` once with `target` omitted, `authorized: true`, and
`wait: false`. Canvas scope submits in `multi` mode; when the downstream
scheduler supports dependency-aware concurrency, it can run dependency-ready
nodes together and wait for their prerequisites. Verify the canvas matches the
approved requirements and scope before submitting: a speed preference alone is
not batch authorization, and a canvas-wide run cannot be used when it includes
unapproved nodes or costs. Do not emulate parallelism with separate targeted
`artarch_run` calls, which can rerun shared paid dependencies. If approval only
covers a subset, retain per-node approval and run targeted nodes without
overlapping shared dependencies. Track the returned `runReference` for recovery
and result review.

**Retries:** approval covers one submission, not unlimited attempts. After a
failure, explain the failed node, the reason, and expected additional credits,
then get fresh approval unless an explicit batch grant includes that retry and
its budget. On a timeout or transport error, first check the existing run and
canvas status; the request may already have been accepted. If acceptance cannot
be determined, disclose the possible duplicate charge and stop for a decision.
Do not resubmit merely to switch from synchronous to asynchronous mode.

`artarch_run` waits inside the MCP process by default until the run reaches a
terminal state; prefer this for a single synchronous run. For an approved
canvas-wide batch or an explicit request for asynchronous progress, use
`wait: false` and track the returned run ID (`runReference`). For a previously
interrupted run, recover its existing `runReference` instead of calling
`artarch_run` again. Poll `artarch_run_status` with that same `runReference`;
never resubmit merely because generation is queued or running. When
polling is feasible, sleep or schedule a wait of about 15 seconds before each
video status check, or about 5 seconds before each image status check; use a
host-provided timer or wait tool rather than rapid repeated calls. If the host
cannot wait or poll in the background, do
not busy-wait or spend repeated conversation turns polling; retain the run
references and check again when the host permits. If the MCP server exposes
`artarch_canvas_run_progress`, use it to list the selected canvas's running
nodes and progress; otherwise rely on per-run `artarch_run_status` and do not
claim a canvas-wide progress listing is available. Show only assets with a
non-empty HTTP(S) URL; pending or empty results must not be rendered as media.
Run and status calls synchronize execution state, completed outputs, downstream
inputs, history cards, and resumable canvas metadata back to the selected canvas;
do not recreate that write-back manually.

When a run fails, report the exact business step, error code, and message from
`errors`; never reduce it to a generic generation failure. When a result
contains `pricingUrl`, show “充值或升级” as a Markdown link and immediately open
that URL in the Codex right sidebar when available. Never open the system
browser for this workflow.

For policy, sensitive-content, copyright, or safety rejections (such as
`OutputImageSensitiveContentDetected.PolicyViolation`), do not silently change
the character, wardrobe, logos, weapon silhouette, reference, or other
creative direction and retry. Explain the rejection and the material design
changes, then ask the user whether to proceed. Autonomous fallback decisions
are allowed only when the session has an active goal or the user explicitly
says they only need a final result and authorizes creative adjustments. Never
describe the fallback as the original character or a faithful reproduction.

After selecting or creating a canvas, present its visible name as a Markdown
link using `canvasUrl`, and open that URL in the Codex right sidebar when the
host provides a sidebar browser capability. Before asking for generation
authorization, link the canvas name again so the user can inspect it. Never open
the system browser for this workflow.

Canvas links are session-scoped. After any project or canvas selection, discard
all earlier canvas URLs and call `artarch_canvas_link` (or use the URL from the
immediately preceding canvas tool result). Never copy a URL from the user
message, an older turn, another thread, or a different project. Before sharing
the link, verify its returned project and canvas names match the current task.

## Remote media upload

`artarch_asset_upload` uploads user-provided media independently of node
creation and returns a project CDN URL. It is not a prerequisite for Image or
Video Input nodes that use `media.payload` or `media.sourceUrl`. Use exactly one
upload transport:
`contentBase64` for local bytes (a data URL is also accepted), or `sourceUrl` for
a public HTTPS media URL. Both image, video, and audio uploads are bounded to
100 MiB. The service applies SSRF protection to `sourceUrl`, does not read local
paths, and does not start generation. Uploading does not replace the per-node
generation approval gate. Keep filenames and media types accurate; set the
appropriate input node's verified business slot to the returned URL, connect
the node to its consumer, and read the canvas back.

## Whiteboards

Use `artarch_whiteboard_create` to create a blank tool-canvas whiteboard and
`artarch_whiteboard_nodes` to inspect its visible items. Whiteboards use the
MCP's versioned flow operation contract: updates are applied as
ordered `removeNode`/`addNode` or `removeEdge`/`addEdge` pairs, and the reserved
`_toolcanvas_whiteboard_document_v1_` metadata node must never be edited or
removed. Use the confirmed `artarch_mutate` `canvas.edit` operation for an
explicit whiteboard edit when a structured whiteboard item is required; read
the whiteboard back afterward. Do not run `artarch_node_add` or automatic DAG
layout against a whiteboard document.

## Authentication

This plugin release uses the production environment: MCP at
https://api.artarch.ai/sisyphus/mcp and browser login at https://www.artarch.ai.

Use the host client's native MCP connection flow. In Codex Desktop, install the
plugin, start a new conversation, and ask to use ArtArch Studio. If the connection
is not authorized, the host prompts for authorization or opens the browser during
the first MCP tool call. Sign in at `https://www.artarch.ai` and approve the requested
access; the host stores and refreshes credentials securely. Never ask the user to
copy a key or token, install an ArtArch binary, or run a CLI command. If OAuth
fails, show the connection error and retry the host's connection flow.
Manage and revoke grants at https://www.artarch.ai/settings/connected-apps.

## Plugin installation

Codex:

```sh
codex plugin marketplace add ArtArch-AI/market
codex plugin add artarch-studio@artarch
```

Claude Code:

```sh
claude plugin marketplace add ArtArch-AI/market
claude plugin install artarch-studio@artarch
```

Start a new task or reload the plugin after installation. Other clients may add
https://api.artarch.ai/sisyphus/mcp as a remote HTTP MCP server and complete native
OAuth. Do not claim compatibility until that client's OAuth flow succeeds.
