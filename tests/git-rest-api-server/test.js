import { dirname } from 'path'
import { strict as assert } from 'assert'

// import { fetch } from '@sonicoriginalsoftware/fetcher/fetch.js'

import { serve, stop } from '@sonicoriginalsoftware/rest-api-server/server.js'
import {
  REST_API_SERVER_ENDPOINTS_PATH,
  REST_API_SERVER_HOST,
  REST_API_SERVER_PORT,
  REST_API_SERVER_PROTOCOL,
} from "@sonicoriginalsoftware/rest-api-server//server-config.js"

export const id = "Git REST API Server"

export const assertions = {
  'Should be able to get information from the server': {
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
        assert.fail("Could not start server!")
      }

      assert.notDeepStrictEqual(server, undefined)

      await assert.doesNotReject(async () => await stop(server))
    },
    skip: false
  },
}
