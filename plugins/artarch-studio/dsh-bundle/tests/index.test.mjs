import assert from "node:assert/strict";
import test from "node:test";

import { apply } from "../index.js";

test("host bundle registers OAuth flow and authenticated proxy route", async () => {
  let flow;
  let route;
  const ctx = {
    inject(_services, callback) {
      callback({
        authorization: { registerFlow(value) { flow = value; return () => {}; } },
        credentials: { readRecord: async () => undefined, modifyRecord: async () => undefined },
        webServer: { register(value) { route = value; return () => {}; } },
        effect() {},
      });
    },
  };
  apply(ctx);
  assert.equal(flow.key, "artarch/account");
  assert.equal(flow.methods[0].id, "oauth");
  assert.equal(route.path, "/artarch-api/");

  const result = await new Promise((resolve) => {
    const res = {
      writeHead(status, headers) { this.status = status; this.headers = headers; },
      end(body) { resolve({ status: this.status, headers: this.headers, body }); },
    };
    route.handler({ method: "GET", url: "/artarch-api/status" }, res);
  });
  assert.equal(result.status, 200);
  assert.deepEqual(JSON.parse(result.body), { authenticated: false });
});
