window.__ModuleLoader__.load({ id: "@artarch/dsh-studio", factory: (require) => {
  const module = { exports: {} };
  const exports = module.exports;

/* ArtArch Studio browser bundle. Keep this file plain JavaScript: the DSH
 * ModuleLoader provides React and the host UI slot API at runtime. */

const React = require("react");
const h = React.createElement;
const { useEffect, useMemo, useState } = React;
const NS = "artarch-studio";
const API = "/artarch-api";
const ARTARCH_LIME = "#d8ff49";
const STUDIO = "https://appt.artarch.ai/products/studio";

const dictionaries = {
  en: {
    nav: "ArtArch Studio",
    title: "ArtArch creative workspace",
    subtitle: "Generate, explore, and move ideas into Studio.",
    signIn: "Sign in with ArtArch",
    signInHint: "Your ArtArch account is required to load entitled models and assets.",
    studio: "Studio",
    playground: "Playground",
    discover: "Discover",
    assets: "Assets",
    admin: "Admin setup",
    openStudio: "Open Studio",
    openImage: "Image studio",
    openVideo: "Video studio",
    refresh: "Refresh",
    syncing: "Syncing…",
    syncCatalog: "Sync provider catalog",
    prompt: "Prompt",
    references: "Reference URLs (one per line)",
    model: "Model",
    run: "Open generation in Studio",
    noModels: "No entitled models are available yet.",
    adminOnly: "Only ArtArch administrators can view provider configuration.",
    providers: "Providers",
    models: "Models",
    mediaModels: "Media models",
    noItems: "Nothing to show yet.",
    loadFailed: "Could not load ArtArch data.",
    capability: "Capabilities",
    referencesSupported: "Reference input",
    audio: "Audio",
  },
  zh: {
    nav: "ArtArch Studio",
    title: "ArtArch 创意工作区",
    subtitle: "生成、探索，并把想法带入 Studio。",
    signIn: "使用 ArtArch 登录",
    signInHint: "需要 ArtArch 账号才能加载你有权限使用的模型和资产。",
    studio: "Studio",
    playground: "Playground",
    discover: "发现",
    assets: "资产",
    admin: "管理员配置",
    openStudio: "打开 Studio",
    openImage: "图片 Studio",
    openVideo: "视频 Studio",
    refresh: "刷新",
    syncing: "同步中…",
    syncCatalog: "同步供应商目录",
    prompt: "提示词",
    references: "参考 URL（每行一个）",
    model: "模型",
    run: "在 Studio 中开始生成",
    noModels: "暂时没有可用的授权模型。",
    adminOnly: "只有 ArtArch 管理员可以查看供应商配置。",
    providers: "供应商",
    models: "模型",
    mediaModels: "媒体模型",
    noItems: "暂时没有内容。",
    loadFailed: "ArtArch 数据加载失败。",
    capability: "能力",
    referencesSupported: "支持参考输入",
    audio: "音频",
  },
};

function text(locale, key) {
  const lang = String(locale || "en").toLowerCase().startsWith("zh") ? "zh" : "en";
  return dictionaries[lang][key] || dictionaries.en[key] || key;
}

function record(value) {
  return value && typeof value === "object" && !Array.isArray(value) ? value : null;
}

function asString(value) {
  return typeof value === "string" ? value.trim() : "";
}

function list(value) {
  return Array.isArray(value) ? value : [];
}

function optionValues(value) {
  return list(value).map((item) => {
    const row = record(item);
    return row ? asString(row.value || row.id || row.name || row.label) : asString(item);
  }).filter(Boolean);
}

function collectModels(value, kind, out = [], seen = new Set()) {
  if (Array.isArray(value)) {
    value.forEach((item) => collectModels(item, kind, out, seen));
    return out;
  }
  const row = record(value);
  if (!row) return out;
  const id = asString(row.id || row.model || row.model_id || row.modelId);
  const name = asString(row.name || row.label || row.show_name || row.display_name) || id;
  if (id && name && !seen.has(`${kind}:${id}`)) {
    const ratios = optionValues(row.aspect_ratios || row.aspect_ratio_options || row.aspectRatioOptions);
    const resolutions = optionValues(row.resolutions || row.resolution_options || row.resolutionOptions);
    const qualities = optionValues(row.qualities || row.quality_options || row.qualityOptions);
    const durations = list(row.durations || row.duration_options || row.durationOptions).map(Number).filter(Number.isFinite);
    const modalities = optionValues(row.input_modalities || row.inputModalities);
    const supportsReferences = Boolean(
      row.supports_references || row.supportsReferences || row.reference_input || row.referenceInput ||
      modalities.some((item) => /image|video|audio/i.test(item)),
    );
    seen.add(`${kind}:${id}`);
    out.push({
      id,
      name,
      kind,
      description: asString(row.description),
      aspectRatios: ratios,
      resolutions,
      qualities,
      durations,
      supportsAudio: Boolean(row.supports_audio || row.supportsAudio || row.show_generate_audio),
      supportsReferences,
      inputModalities: modalities,
      outputModalities: optionValues(row.output_modalities || row.outputModalities),
    });
  }
  Object.keys(row).forEach((key) => {
    if (!/model|option|image|video|media|dag|input|output|catalog/i.test(key)) return;
    collectModels(row[key], kind, out, seen);
  });
  return out;
}

function normalizeMediaCatalog(value) {
  const root = record(value) || {};
  const image = collectModels(root.image || root.images || root.image_models || root.imageModels, "image");
  const video = collectModels(root.video || root.videos || root.video_models || root.videoModels, "video");
  if (!image.length && !video.length) {
    const all = collectModels(root, "image");
    all.forEach((item) => { if (/video|animate|motion/i.test(`${item.id} ${item.name}`)) item.kind = "video"; });
    return { image: all.filter((item) => item.kind === "image"), video: all.filter((item) => item.kind === "video") };
  }
  return { image, video };
}

function Icon({ kind, size = 18 }) {
  const paths = {
    mark: h("path", { d: "M4 4h16v16H4z M8 8l8 8 M16 8l-8 8", fill: "none", stroke: "currentColor", strokeWidth: 1.8, strokeLinecap: "round" }),
    studio: h("path", { d: "M5 5h14v14H5z M8 15l3-4 2 2 2-3", fill: "none", stroke: "currentColor", strokeWidth: 1.8, strokeLinejoin: "round" }),
    play: h("path", { d: "M8 5l11 7-11 7z", fill: "none", stroke: "currentColor", strokeWidth: 1.8, strokeLinejoin: "round" }),
    compass: h("path", { d: "M12 4a8 8 0 1 0 0 16 8 8 0 0 0 0-16zm3 5-2 4-4 2 2-4 4-2z", fill: "none", stroke: "currentColor", strokeWidth: 1.5, strokeLinejoin: "round" }),
    grid: h("path", { d: "M5 5h6v6H5z M13 5h6v6h-6z M5 13h6v6H5z M13 13h6v6h-6z", fill: "none", stroke: "currentColor", strokeWidth: 1.5 }),
    lock: h("path", { d: "M7 10V8a5 5 0 0 1 10 0v2m-11 0h12v9H6z", fill: "none", stroke: "currentColor", strokeWidth: 1.5, strokeLinejoin: "round" }),
  };
  return h("svg", { width: size, height: size, viewBox: "0 0 24 24", ariaHidden: true }, paths[kind] || paths.mark);
}

const styles = `
.artarch-root{height:100%;min-height:100%;display:flex;flex-direction:column;background:var(--dsw-alias-bg-base);color:var(--dsw-alias-label-primary);font:13px/1.45 Inter,ui-sans-serif,system-ui,sans-serif}
.artarch-root *{box-sizing:border-box}.artarch-header{display:flex;align-items:center;gap:12px;padding:22px 28px 16px;border-bottom:1px solid var(--dsw-alias-border-l1)}
.artarch-brand{display:flex;align-items:center;gap:10px}.artarch-brandmark{display:grid;place-items:center;width:34px;height:34px;border-radius:10px;background:#7862ed;color:#fff}.artarch-title{font-size:18px;font-weight:650;letter-spacing:-.02em}.artarch-subtitle{margin:3px 0 0;color:var(--dsw-alias-label-secondary)}
.artarch-tabs{display:flex;gap:6px;padding:12px 28px;border-bottom:1px solid var(--dsw-alias-border-l1);overflow:auto}.artarch-tab{border:0;border-radius:8px;background:transparent;color:var(--dsw-alias-label-secondary);padding:8px 11px;cursor:pointer;white-space:nowrap}.artarch-tab:hover{background:var(--dsw-alias-bg-layer-1);color:var(--dsw-alias-label-primary)}.artarch-tab.active{background:var(--dsw-alias-bg-layer-2);color:var(--dsw-alias-label-primary);box-shadow:inset 0 0 0 1px var(--dsw-alias-border-l2)}
.artarch-body{flex:1;overflow:auto;padding:24px 28px 36px}.artarch-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:12px}.artarch-card{border:1px solid var(--dsw-alias-border-l1);border-radius:12px;background:var(--dsw-alias-bg-layer-1);padding:16px}.artarch-card strong{display:block;font-weight:600}.artarch-muted{color:var(--dsw-alias-label-secondary)}.artarch-kicker{font-size:11px;letter-spacing:.12em;text-transform:uppercase;color:var(--dsw-alias-label-secondary);margin-bottom:7px}.artarch-actions{display:flex;flex-wrap:wrap;gap:9px;margin-top:16px}.artarch-button{display:inline-flex;align-items:center;gap:7px;border:1px solid var(--dsw-alias-border-l2);border-radius:8px;padding:8px 12px;background:var(--dsw-alias-bg-layer-2);color:var(--dsw-alias-label-primary);cursor:pointer;text-decoration:none}.artarch-button:hover{border-color:var(--dsw-alias-brand-primary)}.artarch-button.primary{background:${ARTARCH_LIME};border-color:${ARTARCH_LIME};color:#151515;font-weight:650}.artarch-button.small{padding:6px 9px;font-size:12px}.artarch-field{display:grid;gap:6px;margin-top:13px}.artarch-field label{font-size:12px;color:var(--dsw-alias-label-secondary)}.artarch-input,.artarch-select{width:100%;border:1px solid var(--dsw-alias-border-l2);border-radius:8px;background:var(--dsw-alias-bg-overlay);color:var(--dsw-alias-label-primary);padding:9px 10px;outline:none}.artarch-input:focus,.artarch-select:focus{border-color:var(--dsw-alias-brand-primary)}.artarch-textarea{min-height:100px;resize:vertical}.artarch-pill{display:inline-flex;align-items:center;gap:5px;border-radius:999px;padding:4px 8px;background:var(--dsw-alias-bg-layer-2);color:var(--dsw-alias-label-secondary);font-size:11px}.artarch-pills{display:flex;flex-wrap:wrap;gap:6px;margin-top:10px}.artarch-login{max-width:560px;margin:10vh auto;padding:26px;border:1px solid var(--dsw-alias-border-l1);border-radius:16px;background:var(--dsw-alias-bg-layer-1)}.artarch-error{margin:10px 0;padding:9px 11px;border-radius:8px;background:color-mix(in srgb,var(--dsw-alias-state-error-primary) 15%,transparent);color:var(--dsw-alias-state-error-primary)}.artarch-empty{padding:30px 12px;color:var(--dsw-alias-label-secondary);text-align:center}.artarch-stat{font-size:25px;font-weight:650;letter-spacing:-.04em}.artarch-toolbar{display:flex;align-items:center;justify-content:space-between;gap:12px;margin-bottom:16px}.artarch-list{display:grid;gap:8px}.artarch-row{display:flex;justify-content:space-between;gap:14px;align-items:center;padding:11px 12px;border-radius:8px;background:var(--dsw-alias-bg-layer-1);border:1px solid var(--dsw-alias-border-l1)}
`;

function Login({ locale }) {
  return h("div", { className: "artarch-login" },
    h("div", { className: "artarch-kicker" }, "ARTARCH / ACCOUNT"),
    h("h2", { style: { margin: "0 0 8px", fontSize: 22 } }, text(locale, "title")),
    h("p", { className: "artarch-muted" }, text(locale, "signInHint")),
    h("div", { className: "artarch-actions" }, h("a", { className: "artarch-button primary", href: `${API}/login` }, text(locale, "signIn"))),
  );
}

function StudioTab({ locale }) {
  const links = [
    ["studio", text(locale, "openStudio"), STUDIO],
    ["play", text(locale, "openImage"), `${STUDIO}/image`],
    ["play", text(locale, "openVideo"), `${STUDIO}/video`],
  ];
  return h("div", null,
    h("div", { className: "artarch-kicker" }, "ARTARCH / STUDIO"),
    h("h2", { style: { margin: "0 0 7px", fontSize: 22 } }, text(locale, "studio")),
    h("p", { className: "artarch-muted" }, text(locale, "subtitle")),
    h("div", { className: "artarch-grid", style: { marginTop: 18 } }, links.map(([icon, label, href]) =>
      h("div", { className: "artarch-card", key: href },
        h(Icon, { kind: icon }),
        h("strong", { style: { marginTop: 12 } }, label),
        h("p", { className: "artarch-muted" }, "OAuth-protected Studio canvas and built-in ArtArch tools."),
        h("div", { className: "artarch-actions" },
          h("a", { className: "artarch-button primary", href, target: "_blank", rel: "noreferrer" }, text(locale, "openStudio")),
        ),
      ),
    )),
  );
}

function PlaygroundTab({ locale }) {
  const [kind, setKind] = useState("image");
  const [catalog, setCatalog] = useState({ image: [], video: [] });
  const [modelId, setModelId] = useState("");
  const [prompt, setPrompt] = useState("");
  const [refs, setRefs] = useState("");
  const [ratio, setRatio] = useState("");
  const [resolution, setResolution] = useState("");
  const [quality, setQuality] = useState("");
  const [duration, setDuration] = useState("");
  const [audio, setAudio] = useState(false);
  const [error, setError] = useState("");
  useEffect(() => { fetch(`${API}/api/media-models`).then((r) => r.ok ? r.json() : Promise.reject(new Error("catalog"))).then((data) => setCatalog(normalizeMediaCatalog(data))).catch(() => setError(text(locale, "loadFailed"))); }, [locale]);
  const references = refs.split(/\r?\n/).map((item) => item.trim()).filter(Boolean);
  const models = (catalog[kind] || []).filter((item) => !references.length || item.supportsReferences);
  const selected = models.find((item) => item.id === modelId) || models[0];
  useEffect(() => { if (selected && selected.id !== modelId) setModelId(selected.id); }, [selected, modelId]);
  useEffect(() => { setRatio(selected?.aspectRatios?.[0] || ""); setResolution(selected?.resolutions?.[0] || ""); setQuality(selected?.qualities?.[0] || ""); setDuration(selected?.durations?.[0] ? String(selected.durations[0]) : ""); }, [selected?.id]);
  const openStudio = () => {
    if (!selected) return;
    const url = new URL(`${STUDIO}/${kind}`);
    url.searchParams.set("model", selected.id);
    if (prompt.trim()) url.searchParams.set("prompt", prompt.trim());
    if (references.length) url.searchParams.set("references", references.join(","));
    if (ratio) url.searchParams.set("aspect_ratio", ratio);
    if (resolution) url.searchParams.set("resolution", resolution);
    if (quality) url.searchParams.set("quality", quality);
    if (duration) url.searchParams.set("duration", duration);
    if (selected.supportsAudio && audio) url.searchParams.set("audio", "true");
    window.open(url.toString(), "_blank", "noopener,noreferrer");
  };
  return h("div", null,
    h("div", { className: "artarch-toolbar" }, h("div", null, h("div", { className: "artarch-kicker" }, "ARTARCH / PLAYGROUND"), h("h2", { style: { margin: 0, fontSize: 22 } }, text(locale, "playground"))), h("div", { className: "artarch-actions", style: { marginTop: 0 } }, h("button", { className: `artarch-tab ${kind === "image" ? "active" : ""}`, onClick: () => setKind("image") }, "Image"), h("button", { className: `artarch-tab ${kind === "video" ? "active" : ""}`, onClick: () => setKind("video") }, "Video"))),
    error ? h("div", { className: "artarch-error" }, error) : null,
    h("div", { className: "artarch-card" },
      h("div", { className: "artarch-field" }, h("label", null, text(locale, "model")), h("select", { className: "artarch-select", value: selected?.id || "", onChange: (event) => setModelId(event.target.value) }, models.map((item) => h("option", { key: item.id, value: item.id }, item.name)))),
      h("div", { className: "artarch-field" }, h("label", null, text(locale, "prompt")), h("textarea", { className: "artarch-input artarch-textarea", value: prompt, onChange: (event) => setPrompt(event.target.value), placeholder: "Describe the visual direction…" })),
      h("div", { className: "artarch-field" }, h("label", null, text(locale, "references")), h("textarea", { className: "artarch-input", value: refs, onChange: (event) => setRefs(event.target.value), placeholder: "https://…" })),
      h("div", { className: "artarch-grid", style: { marginTop: 4 } },
        selected?.aspectRatios?.length ? h("div", { className: "artarch-field" }, h("label", null, "Aspect ratio"), h("select", { className: "artarch-select", value: ratio, onChange: (event) => setRatio(event.target.value) }, selected.aspectRatios.map((item) => h("option", { key: item }, item)))) : null,
        selected?.resolutions?.length ? h("div", { className: "artarch-field" }, h("label", null, "Resolution"), h("select", { className: "artarch-select", value: resolution, onChange: (event) => setResolution(event.target.value) }, selected.resolutions.map((item) => h("option", { key: item }, item)))) : null,
        selected?.qualities?.length ? h("div", { className: "artarch-field" }, h("label", null, "Quality"), h("select", { className: "artarch-select", value: quality, onChange: (event) => setQuality(event.target.value) }, selected.qualities.map((item) => h("option", { key: item }, item)))) : null,
        selected?.durations?.length ? h("div", { className: "artarch-field" }, h("label", null, "Duration"), h("select", { className: "artarch-select", value: duration, onChange: (event) => setDuration(event.target.value) }, selected.durations.map((item) => h("option", { key: item, value: String(item) }, `${item}s`)))) : null,
      ),
      selected?.supportsAudio ? h("label", { className: "artarch-row", style: { marginTop: 14, cursor: "pointer" } }, h("span", null, text(locale, "audio")), h("input", { type: "checkbox", checked: audio, onChange: (event) => setAudio(event.target.checked) })) : null,
      selected ? h("div", { className: "artarch-pills" }, h("span", { className: "artarch-pill" }, selected.supportsReferences ? `✓ ${text(locale, "referencesSupported")}` : "Text prompt"), ...(selected.outputModalities || []).map((item) => h("span", { className: "artarch-pill", key: item }, item))) : null,
      h("div", { className: "artarch-actions" }, h("button", { className: "artarch-button primary", disabled: !selected, onClick: openStudio }, text(locale, "run"))),
    ),
    !models.length ? h("div", { className: "artarch-empty" }, text(locale, "noModels")) : null,
  );
}

function DiscoverTab({ locale }) {
  const [items, setItems] = useState([]); const [error, setError] = useState("");
  useEffect(() => { fetch(`${API}/api/discovery?scope=public&limit=12`).then((r) => r.ok ? r.json() : Promise.reject(new Error("discover"))).then((data) => setItems(list(data.items))).catch(() => setError(text(locale, "loadFailed"))); }, [locale]);
  return h("div", null, h("div", { className: "artarch-kicker" }, "ARTARCH / DISCOVER"), h("h2", { style: { margin: "0 0 16px", fontSize: 22 } }, text(locale, "discover")), error ? h("div", { className: "artarch-error" }, error) : null, items.length ? h("div", { className: "artarch-grid" }, items.map((item) => h("article", { className: "artarch-card", key: item.id }, h("strong", null, asString(item.title) || "Untitled"), h("p", { className: "artarch-muted" }, asString(item.description) || asString(item.content_markdown).slice(0, 130)), h("div", { className: "artarch-pills" }, h("span", { className: "artarch-pill" }, asString(item.media_kind) || "creative"), ...(list(item.tags).slice(0, 3).map((tag) => h("span", { className: "artarch-pill", key: tag }, tag))))))) : h("div", { className: "artarch-empty" }, text(locale, "noItems")));
}

function AssetsTab({ locale }) {
  const [items, setItems] = useState([]); const [error, setError] = useState("");
  useEffect(() => { fetch(`${API}/api/agent/assets?limit=24`).then((r) => r.ok ? r.json() : Promise.reject(new Error("assets"))).then((data) => setItems(list(data.items))).catch(() => setError(text(locale, "loadFailed"))); }, [locale]);
  return h("div", null, h("div", { className: "artarch-kicker" }, "ARTARCH / ASSETS"), h("h2", { style: { margin: "0 0 16px", fontSize: 22 } }, text(locale, "assets")), error ? h("div", { className: "artarch-error" }, error) : null, items.length ? h("div", { className: "artarch-grid" }, items.map((item) => h("article", { className: "artarch-card", key: item.id }, item.media_url ? h("img", { src: item.media_url, alt: asString(item.title), style: { width: "100%", aspectRatio: "16/10", objectFit: "cover", borderRadius: 8, marginBottom: 10 } }) : null, h("strong", null, asString(item.title) || asString(item.model_name) || "Asset"), h("p", { className: "artarch-muted" }, asString(item.prompt).slice(0, 120))))) : h("div", { className: "artarch-empty" }, text(locale, "noItems")));
}

function AdminTab({ locale }) {
  const [state, setState] = useState({ loading: true, admin: true, providers: [], models: [], media: { image: [], video: [] }, error: "" });
  const load = () => { setState((old) => ({ ...old, loading: true, error: "" })); Promise.all([fetch(`${API}/api/admin/model-providers`).then((r) => r.ok ? r.json() : Promise.reject(new Error(String(r.status)))), fetch(`${API}/api/admin/models?include_disabled=true`).then((r) => r.ok ? r.json() : Promise.reject(new Error(String(r.status)))), fetch(`${API}/api/media-models`).then((r) => r.ok ? r.json() : Promise.reject(new Error(String(r.status))))]).then(([providers, models, media]) => setState({ loading: false, admin: true, providers: list(providers.items), models: list(models.items), media: normalizeMediaCatalog(media), error: "" })).catch((error) => setState((old) => ({ ...old, loading: false, admin: error.message !== "401" && error.message !== "403", error: error.message === "401" || error.message === "403" ? "" : text(locale, "loadFailed") }))); };
  useEffect(load, [locale]);
  if (!state.admin) return h("div", { className: "artarch-card" }, h(Icon, { kind: "lock", size: 22 }), h("h2", { style: { margin: "12px 0 6px", fontSize: 20 } }, text(locale, "admin")), h("p", { className: "artarch-muted" }, text(locale, "adminOnly")));
  return h("div", null, h("div", { className: "artarch-toolbar" }, h("div", null, h("div", { className: "artarch-kicker" }, "ARTARCH / ADMIN"), h("h2", { style: { margin: 0, fontSize: 22 } }, text(locale, "admin"))), h("button", { className: "artarch-button small", onClick: load, disabled: state.loading }, state.loading ? text(locale, "syncing") : text(locale, "syncCatalog"))), state.error ? h("div", { className: "artarch-error" }, state.error) : null, h("div", { className: "artarch-grid" }, h("div", { className: "artarch-card" }, h("div", { className: "artarch-kicker" }, text(locale, "providers")), h("div", { className: "artarch-stat" }, state.providers.length)), h("div", { className: "artarch-card" }, h("div", { className: "artarch-kicker" }, text(locale, "models")), h("div", { className: "artarch-stat" }, state.models.length)), h("div", { className: "artarch-card" }, h("div", { className: "artarch-kicker" }, text(locale, "mediaModels")), h("div", { className: "artarch-stat" }, state.media.image.length + state.media.video.length))), h("div", { className: "artarch-list", style: { marginTop: 18 } }, state.providers.map((provider) => h("div", { className: "artarch-row", key: provider.id }, h("span", null, h("strong", null, provider.name || provider.slug), h("span", { className: "artarch-muted" }, ` ${provider.provider_type || "provider"}`)), h("span", { className: "artarch-pill" }, provider.disabled ? "disabled" : "ready")))));
}

function App() {
  const locale = (window.__DSH_LOCALE__ && window.__DSH_LOCALE__.active) || "en";
  const [authenticated, setAuthenticated] = useState(null);
  const [tab, setTab] = useState("studio");
  useEffect(() => { fetch(`${API}/status`).then((r) => r.json()).then((data) => setAuthenticated(Boolean(data.authenticated))).catch(() => setAuthenticated(false)); }, []);
  const choose = (next) => { setTab(next); try { window.history.replaceState({}, "", `#artarch/${next}`); } catch {} };
  if (authenticated === false) return h("div", { className: "artarch-root" }, h("style", null, styles), h(Login, { locale }));
  if (authenticated === null) return h("div", { className: "artarch-root" }, h("style", null, styles), h("div", { className: "artarch-empty" }, "Connecting to ArtArch…"));
  const tabs = [["studio", "studio", "studio"], ["playground", "play", "playground"], ["discover", "compass", "discover"], ["assets", "grid", "assets"], ["admin", "lock", "admin"]];
  return h("div", { className: "artarch-root" }, h("style", null, styles), h("header", { className: "artarch-header" }, h("div", { className: "artarch-brandmark" }, h(Icon, { kind: "mark", size: 21 })), h("div", null, h("div", { className: "artarch-title" }, text(locale, "title")), h("p", { className: "artarch-subtitle" }, text(locale, "subtitle")))), h("nav", { className: "artarch-tabs", "aria-label": text(locale, "nav") }, tabs.map(([id, icon, label]) => h("button", { className: `artarch-tab ${tab === id ? "active" : ""}`, key: id, onClick: () => choose(id) }, h(Icon, { kind: icon, size: 15 }), " ", text(locale, label)))), h("main", { className: "artarch-body" }, tab === "studio" ? h(StudioTab, { locale }) : tab === "playground" ? h(PlaygroundTab, { locale }) : tab === "discover" ? h(DiscoverTab, { locale }) : tab === "assets" ? h(AssetsTab, { locale }) : h(AdminTab, { locale })));
}

const name = NS;
const inject = ["slots", "locale"];

function apply(ctx) {
  ctx.effect(() => ctx.locale.register(NS, { en: dictionaries.en, zh: dictionaries.zh }), `${NS}: dictionaries`);
  const brandMark = ({ size = 24 } = {}) => h("span", { style: { display: "grid", placeItems: "center", width: size, height: size, borderRadius: Math.round(size * 0.28), background: "#7862ed", color: "#fff", boxShadow: `inset 0 0 0 1px ${ARTARCH_LIME}` } }, h(Icon, { kind: "mark", size: Math.max(14, Math.round(size * 0.62)) }));
  ctx.slots.inject("sidebar.brand.mark", () => ctx.slots.register({ name: "sidebar.brand.mark" }, brandMark));
  ctx.slots.inject("sidebar.brand.name", () => ctx.slots.register({ name: "sidebar.brand.name" }, () => h("span", { style: { fontWeight: 700, letterSpacing: "0.08em", color: "var(--dsw-alias-label-primary)" } }, "ARTARCH")));
  ctx.slots.inject("conversation.hero.brand.mark", () => ctx.slots.register({ name: "conversation.hero.brand.mark" }, brandMark));
  ctx.slots.inject("sidebar.panellist", () => ctx.slots.register({ name: "sidebar.panellist", id: NS, order: 60, label: () => text((ctx.locale.getLocale() || {}).active, "nav") }, ({ size = 20, active = false } = {}) => h("span", { style: { display: "grid", placeItems: "center", color: active ? ARTARCH_LIME : "currentColor" } }, h(Icon, { kind: "mark", size }))));
  ctx.slots.inject("main", () => ctx.slots.register({ name: "main", key: NS }, () => h(App)));
}

exports.apply = apply;
exports.inject = inject;
exports.name = name;
return module.exports;
  }
});
