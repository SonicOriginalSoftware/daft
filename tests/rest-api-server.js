import { strict as assert } from "assert"

import { serve, stop } from "../lib/rest-api-server/server.js"
import { config } from "../lib/rest-api-server/server-config.js"
import { resolve } from "path"

export const id = "REST API Server"

export const assertions = {
  "Should be able to start and stop the server": {
    function: async () => {
      const conf = config
      conf.endpoints_path = resolve(".")

      /** @type {import("http2").Http2SecureServer | import("http2").Http2Server | undefined} */
      let server

      await assert.doesNotReject(async () => server = await serve(conf))
      assert.notDeepStrictEqual(server, undefined)
      await assert.doesNotReject(async () => await stop(server))
    },
    skip: false
    // skip: true
  },
  "Should be able to send a request to an endpoint": {
    function: () => {
      const conf = config
      conf.endpoints_path = resolve(".")
      /** @type {import("http2").Http2SecureServer | import("http2").Http2Server | undefined} */
      let server

      assert.doesNotReject(async () => server = await serve(conf))
      assert.notDeepStrictEqual(server, undefined)
      assert.doesNotReject(async () => await stop(server))
    },
    // skip: false
    skip: true
  },
}
