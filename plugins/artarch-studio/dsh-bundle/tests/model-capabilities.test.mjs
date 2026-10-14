import assert from "node:assert/strict";
import test from "node:test";

import {
  availableParameterFields,
  filterModelsForInput,
  supportsReferenceInput,
} from "../model-capabilities.mjs";

test("reference capable models are detected from explicit and modality metadata", () => {
  assert.equal(supportsReferenceInput({ supportsReferences: true }), true);
  assert.equal(supportsReferenceInput({ inputModalities: ["text", "image"] }), true);
  assert.equal(supportsReferenceInput({ inputModalities: ["text"] }), false);
});

test("playground filters by media kind and multimodal references", () => {
  const models = [
    { id: "image-text", kind: "image", supportsReferences: false },
    { id: "image-ref", kind: "image", supportsReferences: true },
    { id: "video-ref", kind: "video", inputModalities: ["image"] },
  ];
  assert.deepEqual(
    filterModelsForInput(models, { kind: "image", referenceCount: 1 }).map((item) => item.id),
    ["image-ref"],
  );
  assert.deepEqual(
    filterModelsForInput(models, { kind: "video", referenceCount: 0 }).map((item) => item.id),
    ["video-ref"],
  );
});

test("parameter controls are derived from model capabilities", () => {
  assert.deepEqual(
    availableParameterFields({
      aspectRatios: ["1:1"],
      resolutions: ["2K"],
      qualities: [],
      durations: [5],
      supportsAudio: true,
    }),
    ["aspectRatio", "resolution", "duration", "generateAudio"],
  );
});
