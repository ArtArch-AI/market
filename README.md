# ArtArch Studio remote MCP

No ArtArch executable, local server, copied access token, or CLI command is needed.

Codex installation:

```sh
codex plugin marketplace add ArtArch-AI/market
codex plugin add artarch-studio@artarch
```

Claude Code installation:

```sh
claude plugin marketplace add ArtArch-AI/market
claude plugin install artarch-studio@artarch
```

Reload plugins and start a new task. In Codex Desktop, ask the new conversation to
use ArtArch Studio; the host may prompt for authorization or open the browser when
the first MCP tool is called. In Claude Code, use its native MCP connection flow.
Confirm access in the ArtArch browser page. Each client stores and refreshes its
own credentials securely.

WorkBuddy connector submission (requires WorkBuddy 4.24.0 or newer):

1. From the parent Sisyphus repository, run `python3 scripts/export-workbuddy-connector.py`.
   The parent exporter must stage `market/connectors/artarch-studio/` together with
   the canonical `market/plugins/artarch-studio/skills/` tree as
   `skills/{name}/SKILL.md` (including skill references) and generate the ZIP
   **outside** the repository. The ZIP is not tracked in `market/`; the connector
   directory contains metadata, MCP configuration, and the icon only.
2. Submit the generated ZIP to the WorkBuddy team for review. Do not describe it
   as downloadable or published before approval.

The connector leaves `auth_mode` unset for the standard MCP OAuth flow.
Reported read-only OAuth discovery checks returned HTTP 200; WorkBuddy dynamic client
registration and callback have **not** been verified end-to-end. Verify those
before claiming a working WorkBuddy sign-in. No local CLI fallback is provided.

This release connects to the production environment at `https://api.artarch.ai/sisyphus/mcp`.
Sign in with your ArtArch account at `https://www.artarch.ai`.

Default authorization lifetime: access tokens last one hour; refresh tokens have
180 days of sliding inactivity expiry and grants have a one-year absolute limit.
Revoke individual connections at https://www.artarch.ai/settings/connected-apps.
