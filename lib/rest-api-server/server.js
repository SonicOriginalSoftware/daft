import {
  createServer,
  createSecureServer,
  constants as http2Constants,
} from "http2"
import { join } from "path"
import { lookup } from "dns"
import { hostname } from "os"

import { readFile } from "fs/promises"

/** @typedef {{
 *  method?: string,
 *  endpoint?: string,
 *  query?: string,
 *  referer?: string,
 *  payload: any
 * }} Request
 */

/** @typedef {import('http2').ServerHttp2Stream} Stream */
/** @typedef {import('http2').IncomingHttpHeaders} Headers */

/**
 * @param {Headers} headers
 *
 * @returns {Request}
 */
function generate_request(headers) {
  const request_path = headers[":path"]
  console.log(`Raw request path: ${request_path}`)
  const queryOperatorIndex = request_path?.indexOf("?")

  return {
    method: headers[":method"],
    endpoint:
      queryOperatorIndex !== -1
        ? request_path?.slice(0, queryOperatorIndex)
        : request_path,
    query:
      queryOperatorIndex !== -1 && queryOperatorIndex !== undefined
        ? request_path?.slice(queryOperatorIndex + 1)
        : "",
    referer: headers["referer"],
    payload: null,
  }
}

/** @param {Stream} stream */
async function extract_payload(stream) {
  return stream.readable
    ? stream.read()
    : await new Promise((resolve, reject) => {
        stream.on("readable", (err) => {
          err ? reject(err) : resolve(stream.read())
        })
      })
}

/**
 * @param {Stream} stream
 * @param {Request} request
 * @param {String} endpoints_path
 */
async function respond(stream, request, endpoints_path) {
  const response_headers = {
    [http2Constants.HTTP2_HEADER_STATUS]: http2Constants.HTTP_STATUS_NOT_FOUND,
    [http2Constants.HTTP2_HEADER_CONTENT_TYPE]: "application/json",
  }

  /** @type {Object} */
  let response_data = '{ "message": "Not Found", "code": 404 }'
  let endpoint_module = null
  let encountered_error = false

  try {
    endpoint_module = await import(
      `${endpoints_path}/${request.endpoint}/handler.js`
    )
  } catch (ex) {
    console.error(`Couldn't import endpoint handler: ${request.endpoint}`)
    encountered_error = true
  }

  if (!encountered_error) {
    try {
      response_data = await endpoint_module.handle(request)
    } catch (ex) {
      console.error(ex)
      encountered_error = true
    }
  }

  if (!encountered_error)
    response_headers[http2Constants.HTTP2_HEADER_STATUS] =
      http2Constants.HTTP_STATUS_OK

  stream.respond(response_headers)
  stream.write(response_data)
}

/**
 * @param {import('./server-config').ServerConfig} config
 *
 * @returns {Promise<import('http2').Http2Server | import('http2').Http2SecureServer | undefined>}
 */
export async function serve(config) {
  /** @type {import('http2').Http2Server | import('http2').Http2SecureServer | null} */
  let server = null
  if (config.protocol === "https") {
    server = createSecureServer({
      cert: await readFile(join(config.security_directory, "cert.pem")),
      key: await readFile(join(config.security_directory, "key.pem")),
    })
  } else {
    server = createServer()
  }

  if (server === null) {
    console.error(`Could not create the server!`)
    return
  }

  server.on("stream", async (stream, headers) => {
    stream.on("error", console.error)

    const request = generate_request(headers)

    console.log(`[SERVER] Incoming request: ${JSON.stringify(request)}`)

    if (request.method === "POST") {
      request.payload = await extract_payload(stream)
      console.log(`Request payload: ${request.payload}`)
    }

    await respond(stream, request, config.endpoints_path)
    stream.end()
  })
  server.on("error", console.error)
  server.on("close", () =>
    console.log(
      `Server stopped listening on ${config.protocol}://${config.host}:${config.port}!`
    )
  )

  if (config.host === undefined) {
    config.host = await new Promise((resolve, reject) =>
      lookup(hostname(), (err, address) =>
        err ? reject(err) : resolve(address)
      )
    )
  } else if (config.host === "") {
    config.host = "localhost"
  }

  await Promise.race([
    new Promise((_resolve, reject) => {
      setTimeout(reject, config.startupTime)
    }),
    new Promise((resolve, reject) => {
      server?.on("listening", () => resolve(null))
      try {
        server?.listen(config.port, config.host)
      } catch (error) {
        console.error(error)
        reject()
      }
    }),
  ])

  if (!server.listening) {
    console.error(`Could not listen on: ${config.host}:${config.port}`)
    return
  }
  console.log(
    `Server listening on ${config.protocol}://${config.host}:${config.port}`
  )

  return server
}

/** @param {import('http2').Http2Server | import('http2').Http2SecureServer | undefined} server */
export async function stop(server) {
  return new Promise((resolve, reject) => {
    server?.close((err) => {
      if (err) {
        console.error(err)
        reject(err)
      } else {
        resolve(null)
      }
    })
  })
}
