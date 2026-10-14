export function supportsReferenceInput(model) {
  if (!model || typeof model !== "object") return false;
  if (model.supportsReferences === true || model.supports_references === true) return true;
  const modalities = Array.isArray(model.inputModalities)
    ? model.inputModalities
    : Array.isArray(model.input_modalities)
      ? model.input_modalities
      : [];
  return modalities.some((value) => /image|video|audio|document/i.test(String(value)));
}

export function filterModelsForInput(models, { kind, referenceCount = 0 } = {}) {
  const source = Array.isArray(models) ? models : [];
  return source.filter((model) => {
    if (kind && model.kind && model.kind !== kind) return false;
    if (referenceCount > 0 && !supportsReferenceInput(model)) return false;
    return true;
  });
}

export function availableParameterFields(model) {
  if (!model || typeof model !== "object") return [];
  const fields = [];
  if (Array.isArray(model.aspectRatios) && model.aspectRatios.length) fields.push("aspectRatio");
  if (Array.isArray(model.resolutions) && model.resolutions.length) fields.push("resolution");
  if (Array.isArray(model.qualities) && model.qualities.length) fields.push("quality");
  if (Array.isArray(model.durations) && model.durations.length) fields.push("duration");
  if (model.supportsAudio === true) fields.push("generateAudio");
  return fields;
}
