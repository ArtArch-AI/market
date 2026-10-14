# ArtArch Studio DSH bundle

This directory is an installable DeepSeek Harness bundle. It adds an ArtArch panel to the Harness sidebar and stores the ArtArch OAuth grant in the Host credential store under `artarch/account`.

The panel provides:

- OAuth sign-in against the ArtArch test-zone login and token endpoint.
- Same-origin Host proxy routes for authenticated `/api/me`, entitled agent/media models, Discover/Skill items, and agent assets.
- Studio links for image, video, and canvas workflows.
- A capability-aware image/video playground that hides models which cannot accept supplied references and only renders parameters exposed by the selected model.
- Discover and asset browsing.
- An administrator-only catalog view for the Sisyphus provider/model endpoints. A refresh reads the live test-zone catalog; credentials and API keys are never sent to the browser.

Install it with the Harness Plugin Manager using this directory as the bundle target. The default configuration points to the ArtArch test environment (`apit.artarch.ai` / `appt.artarch.ai`); deployment patches can override the API, OAuth, callback, and Studio URLs in `cordis.patch.yml`.

The remote MCP tool surface remains provided by the sibling `mcp.json`/`.mcp.json` configuration and uses native MCP OAuth. The DSH bundle's account flow is for the panel's API proxy and entitlement-aware catalog.
