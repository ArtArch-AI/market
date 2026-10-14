import { createHash, randomBytes } from "node:crypto";

export const name = "artarch-studio";
export const inject = ["webServer", "credentials", "authorization"];

const DEFAULTS = {
  apiBaseUrl: "https://apit.artarch.ai/sisyphus",
  authorizeUrl: "https://appt.artarch.ai/login",
  tokenUrl: "https://apit.artarch.ai/avatar/api/v1/oauth/cli/token",
  clientId: "sisyphus",
  callbackPath: "/artarch-api/oauth/callback",
  studioUrl: "https://appt.artarch.ai/products/studio",
};
const CREDENTIAL_KEY = "artarch/account";
const CALLBACK_PORT = 19387;
const pending = new Map();

function configValue(config, key) {
  const value = config && config[key];
  return typeof value === "string" && value.trim() ? value.trim() : DEFAULTS[key];
}

function effectiveConfig(config) {
  return Object.fromEntries(Object.keys(DEFAULTS).map((key) => [key, configValue(config, key)]));
}

function randomString(bytes = 32) {
  return randomBytes(bytes).toString("base64url");
}

function challenge(verifier) {
  return createHash("sha256").update(verifier).digest("base64url");
}

function callbackUrl(config) {
  return `http://127.0.0.1:${CALLBACK_PORT}${config.callbackPath}`;
}

function authorizeUrl(config, state, verifier) {
  const url = new URL(config.authorizeUrl);
  url.searchParams.set("client_id", config.clientId);
  url.searchParams.set("response_type", "code");
  url.searchParams.set("redirect_uri", callbackUrl(config));
  url.searchParams.set("state", state);
  url.searchParams.set("code_challenge", challenge(verifier));
  url.searchParams.set("code_challenge_method", "S256");
  return url.toString();
}

async function exchange(config, code, verifier) {
  const response = await fetch(config.tokenUrl, {
    method: "POST",
    headers: { "content-type": "application/json", accept: "application/json" },
    body: JSON.stringify({
      grant_type: "authorization_code",
      client_id: config.clientId,
      code,
      code_verifier: verifier,
      redirect_uri: callbackUrl(config),
    }),
  });
  const body = await response.json().catch(() => ({}));
  const data = body && body.data && typeof body.data === "object" ? body.data : body;
  if (!response.ok || !data || typeof data.access_token !== "string") {
    throw new Error(`ArtArch OAuth exchange failed (${response.status})`);
  }
  return {
    accessToken: data.access_token,
    refreshToken: typeof data.refresh_token === "string" ? data.refresh_token : undefined,
    expiresIn: typeof data.expires_in === "number" ? data.expires_in : undefined,
  };
}

function finishPending(state, result) {
  const item = pending.get(state);
  if (!item) return false;
  pending.delete(state);
  clearTimeout(item.timer);
  item.resolve(result);
  return true;
}

async function storeGrant(credentials, token) {
  await credentials.modifyRecord(CREDENTIAL_KEY, async () => ({
    kind: "grant",
    payload: { ...token, savedAt: Date.now() },
  }));
}

function response(res, status, body, headers = {}) {
  const payload = typeof body === "string" ? body : JSON.stringify(body);
  res.writeHead(status, {
    "content-type": "application/json; charset=utf-8",
    "cache-control": "no-store",
    ...headers,
  });
  res.end(payload);
}

async function readToken(credentials) {
  const record = await credentials.readRecord(CREDENTIAL_KEY);
  const token = record && record.kind === "grant" && record.payload && record.payload.accessToken;
  return typeof token === "string" && token ? token : undefined;
}

function allowedProxyPath(pathname) {
  return pathname === "/api/me" ||
    pathname === "/api/discovery" ||
    pathname.startsWith("/api/agent/assets") ||
    pathname === "/api/media/models" ||
    pathname === "/api/agent/artarch-web/versions/latest/models" ||
    pathname === "/api/admin/model-providers" ||
    pathname === "/api/admin/models";
}

async function proxyApi(req, res, config, credentials, url) {
  const token = await readToken(credentials);
  if (!token) {
    response(res, 401, { code: "artarch_auth_required", message: "Sign in with ArtArch to continue." });
    return;
  }
  const upstream = new URL(url.pathname.replace("/artarch-api", "") || "/", config.apiBaseUrl);
  upstream.search = url.search;
  if (!allowedProxyPath(upstream.pathname)) {
    response(res, 404, { code: "artarch_route_not_found", message: "Unsupported ArtArch route." });
    return;
  }
  const upstreamResponse = await fetch(upstream, {
    method: req.method || "GET",
    headers: { accept: "application/json", authorization: `Bearer ${token}` },
  });
  const text = await upstreamResponse.text();
  res.writeHead(upstreamResponse.status, {
    "content-type": upstreamResponse.headers.get("content-type") || "application/json",
    "cache-control": "no-store",
  });
  res.end(text);
}

async function handle(req, res, config, credentials) {
  const url = new URL(req.url || "/", `http://127.0.0.1:${CALLBACK_PORT}`);
  if (req.method === "OPTIONS") {
    response(res, 204, "", { "access-control-allow-methods": "GET,OPTIONS", "access-control-allow-origin": "*" });
    return;
  }
  if (url.pathname === "/artarch-api/login") {
    const state = randomString(24);
    const verifier = randomString(48);
    const loginUrl = authorizeUrl(config, state, verifier);
    response(res, 302, "", { location: loginUrl, "content-type": "text/plain" });
    pending.set(state, {
      verifier,
      resolve: () => undefined,
      timer: setTimeout(() => pending.delete(state), 10 * 60 * 1000),
    });
    return;
  }
  if (url.pathname === config.callbackPath) {
    const state = url.searchParams.get("state") || "";
    const code = url.searchParams.get("code") || "";
    const item = pending.get(state);
    if (!item || !code) {
      response(res, 400, { code: "artarch_oauth_callback_invalid", message: "The ArtArch sign-in callback is invalid or expired." });
      return;
    }
    try {
      const token = await exchange(config, code, item.verifier);
      await storeGrant(credentials, token);
      finishPending(state, token);
      response(res, 302, "", { location: "/?artarch=connected", "content-type": "text/plain" });
    } catch (error) {
      finishPending(state, undefined);
      response(res, 502, { code: "artarch_oauth_exchange_failed", message: "ArtArch sign-in could not be completed." });
    }
    return;
  }
  if (url.pathname === "/artarch-api/status") {
    const token = await readToken(credentials);
    response(res, 200, { authenticated: Boolean(token) });
    return;
  }
  if (url.pathname.startsWith("/artarch-api/")) {
    try {
      await proxyApi(req, res, config, credentials, url);
    } catch (error) {
      response(res, 502, { code: "artarch_upstream_unavailable", message: "ArtArch service is temporarily unavailable." });
    }
    return;
  }
  response(res, 404, { code: "not_found", message: "Not found." });
}

export function apply(ctx, rawConfig = {}) {
  const config = effectiveConfig(rawConfig);
  ctx.inject(["webServer", "credentials", "authorization"], (host) => {
    const flow = {
      key: CREDENTIAL_KEY,
      label: "ArtArch account",
      methods: [{ id: "oauth", label: "Sign in with ArtArch" }],
      async run(session) {
        const state = randomString(24);
        const verifier = randomString(48);
        const url = authorizeUrl(config, state, verifier);
        session.notify({ message: "Open ArtArch to sign in", url });
        const result = await new Promise((resolve, reject) => {
          const timer = setTimeout(() => { pending.delete(state); reject(new Error("ArtArch OAuth timed out")); }, 10 * 60 * 1000);
          pending.set(state, { verifier, resolve, reject, timer });
          session.signal.addEventListener("abort", () => { clearTimeout(timer); pending.delete(state); reject(session.signal.reason || new Error("cancelled")); }, { once: true });
        });
        if (!result) throw new Error("ArtArch OAuth was cancelled");
        await session.commit({ kind: "grant", payload: { ...result, savedAt: Date.now() } });
        session.notify({ message: "ArtArch account connected" });
      },
    };
    const disposeFlow = host.authorization.registerFlow(flow);
    const disposeRoute = host.webServer.register({ kind: "prefix", path: "/artarch-api/", handler: (req, res) => handle(req, res, config, host.credentials) });
    host.effect(() => { disposeFlow(); disposeRoute(); }, "artarch-studio: OAuth and API routes");
  });
}
