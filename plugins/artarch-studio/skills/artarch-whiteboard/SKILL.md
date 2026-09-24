---
name: artarch-whiteboard
description: >-
  Organize ArtArch whiteboards through named projects, canvases, structured
  items, and document edges. Use when a user wants a visual reference board,
  comparison board, or production planning canvas.
---

# ArtArch Whiteboard

Before any node execution, read and follow the [Studio generation approval
rules](../artarch-studio/SKILL.md#generation): explain the node's purpose and
expected credits, then wait for explicit approval for that node. Only an
explicit request to run the agreed workflow in one go waives per-node questions;
a creative brief or request for a finished result does not. Unknown cost and
retries require the handling specified there. These rules also apply to all
execution stages and examples below.

Use a whiteboard for spatial organization, visual comparison, and production
relationships that can be reopened in ArtArch Studio. Work only with visible
names and business concepts; the MCP server owns persistence and collaboration details.

## Workflow

1. Select the parent project and canvas by visible name:

   - Call `artarch_scope_options` to inspect available projects and canvases.
   - Call `artarch_project_select` only after explicit approval to reuse a project.
   - Call `artarch_canvas_select` to select the existing whiteboard, or
     `artarch_whiteboard_create` to create one after explicit approval.

2. Inspect the selected whiteboard:

   - Call `artarch_whiteboard_nodes` to inspect visible items and kinds.
   - Call `artarch_canvas_link` when the user needs to inspect the board in Studio.
   - For an existing board, inventory its frames and items first. Propose the
     exact additions or replacements and obtain explicit authorization before
     changing anything; selection and inspection are not edit permission.
     Existing external HTTPS image/video URLs are not evidence of a completed
     CDN migration; do not replace them or reorganize unframed items on sight.

3. Prepare media and its organization before editing:

   - Draft a non-empty `data.description` for each new image, video, or audio item: what is
     visible, the relevant subject/action, and its intended reference role.
     Do not substitute a filename or the `title` for a content description.
   - Prefer bytes (`media.payload`, base64/data URL) for local media, or a
     public HTTPS `media.sourceUrl`, on a confirmed `canvas.edit` `addNode`.
     Provide `media.filename` with a supported extension when the name cannot
     be inferred; never put local file paths in `data.image`/`data.media`.
     The MCP server uploads before persisting the image's `data.image` or
     video/audio item's `data.media` and keeps payloads out of the board.
     External image URLs (even HTTPS) may block embedding or expire; upload
     the source instead of using its URL as `data.image`. If `sourceUrl`
     cannot be fetched by the server, supply the user's locally available
     original bytes as `media.payload`. Do not guess or reuse an unrelated
     source image.
   - `artarch_asset_upload` remains available for separate uploads: it accepts
     `contentBase64` or public HTTPS `sourceUrl` and returns a project CDN URL
     for a later confirmed edit. It is not required before `addNode.media`.
     Remote MCP cannot read the user's filesystem directly. An upload may
     survive a later canvas-edit failure; inspect the board before retrying.
   - Create separate `frame` items by media type (for example, Images and
     Videos) when organizing a board. A frame has `type: "frame"` and
     `data.kind: "frame"`; assign each child image/video its frame ID in
     `data.frameId`. Reuse suitable existing frames rather than duplicating
     them, and leave unrelated items and positions alone.

4. Edit the whiteboard document only through a confirmed `artarch_mutate` call
   with `operation: "canvas.edit"` and ordered flow operations:

   - In `input.operations`, add the frame first, then its image/video/audio
     children. Example child shape:
     `{"type":"addNode","node_id":"room-1","node":{"id":"room-1","type":"image","position":{"x":40,"y":80},"data":{"kind":"image","title":"Living room","description":"Sunlit living room, sofa and window; room reference","frameId":"rooms"}},"media":{"filename":"room.png","payload":"<base64 bytes>"}}`.
     For an existing public HTTPS asset, replace `payload` with `sourceUrl`.
     Do not set `data.image`/`data.media` alongside `media`.
   - Replace an item with `removeNode` followed by `addNode` using the same item ID.
   - Remove or add document edges with `removeEdge` and `addEdge`.
   - Never edit or remove `_toolcanvas_whiteboard_document_v1_`.
   - Read the whiteboard back with `artarch_whiteboard_nodes` after the edit.

5. Keep whiteboard layout under user control. Do not call
   `artarch_canvas_layout`, business DAG node tools, or generation tools while
   arranging or reviewing a whiteboard.

## Rules

- Use exact item references returned by `artarch_whiteboard_nodes`.
- Give every reference a clear role such as identity, wardrobe, environment,
  composition, motion, timing, audio, or style.
- Current MCP capability: `artarch_asset_upload` has no `description` input;
  set it on each media item's `node.data.description` in `canvas.edit` instead.
  The edit requires non-empty descriptions when using `addNode.media`, and
  `artarch_whiteboard_nodes` returns them for inspection (verify the connected
  server exposes this contract before relying on it). The current tool-canvas
  `WhiteboardNodeData` does not define
  `description`, and the image/video cards only render `title`, not `body` or
  `description`. Browse-readable does **not** mean visible in the whiteboard
  UI; do not promise a visible caption or rely on `data.body` for one.
- Do not run generation while arranging or reviewing a whiteboard. Apply the
  normal credit authorization gate before any run.

## Verification

After each meaningful change, use `artarch_whiteboard_nodes` to verify the
visible item changes. The MCP edit response also confirms that the submitted
node and edge operations survived a server read-back. Verify each uploaded
item's CDN URL, non-empty `description`, and `frameId` in browse results when
the connected server supports the fields. Report project, canvas, and item
names only, not raw payloads.
