import { dirname } from "path"
import { strict as assert } from "assert"

import { fetch } from "@sonicoriginalsoftware/fetcher/fetch.js"

import { serve, stop } from "@sonicoriginalsoftware/rest-api-server/server.js"
import {
  REST_API_SERVER_ENDPOINTS_PATH,
  REST_API_SERVER_HOST,
  REST_API_SERVER_PORT,
  REST_API_SERVER_PROTOCOL,
} from "@sonicoriginalsoftware/rest-api-server//server-config.js"

export const id = "Git REST API Server"

export const assertions = {
  "Should be able to get information from the server": {
    function: async () => {
      process.env[REST_API_SERVER_ENDPOINTS_PATH] = dirname(import.meta.url)
      process.env[REST_API_SERVER_PROTOCOL] = "https"
      process.env[REST_API_SERVER_HOST] = "localhost"
      process.env[REST_API_SERVER_PORT] = "10100"

      /** @type {import("http2").Http2SecureServer | import("http2").Http2Server | undefined} */
      let server
      try {
        server = await serve()
      } catch (error) {
        console.error(error)
        await stop(server)
        assert.fail("Could not start server!")
      }
      assert.notDeepStrictEqual(server, undefined)

      let error_encountered
      const url = `${process.env[REST_API_SERVER_PROTOCOL]}://${process.env[REST_API_SERVER_HOST]}:${process.env[REST_API_SERVER_PORT]}/get`

      process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = "0"

      /** @type {import('@sonicoriginalsoftware/fetcher/fetch.js').Response | undefined} */
      let response
      try {
        response = await fetch(url)
      } catch (error) {
        error_encountered = error
      } finally {
        await stop(server)
      }

      process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = undefined

      if (error_encountered !== undefined) {
        assert.fail(error_encountered)
      }

      if (response === undefined) {
        assert.fail("No response data was obtained!")
      }
      assert.deepStrictEqual(
        response.data.toString("utf-8"),
        JSON.stringify({ message: "Hello, world!" })
      )
    },
    skip: false,
  },
}
