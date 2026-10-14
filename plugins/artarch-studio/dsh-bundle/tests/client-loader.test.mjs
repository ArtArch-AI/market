import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import vm from "node:vm";

test("client entry uses the DSH ModuleLoader contract", async () => {
  const source = await readFile(new URL("../client.js", import.meta.url), "utf8");
  let descriptor;
  vm.runInNewContext(source, {
    window: { __ModuleLoader__: { load(value) { descriptor = value; } } },
  });
  assert.equal(descriptor.id, "@artarch/dsh-studio");
  const exported = descriptor.factory((name) => {
    assert.equal(name, "react");
    return { createElement() {} };
  });
  assert.equal(exported.name, "artarch-studio");
  assert.deepEqual(Array.from(exported.inject), ["slots", "locale"]);
  assert.equal(typeof exported.apply, "function");
});
