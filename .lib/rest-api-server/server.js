import {
  createServer,
  createSecureServer,
  constants as http2Constants,
} from "http2"
import { join } from "path"
import { lookup } from "dns"
import { hostname } from "os"

import { config } from "./server-config.js"
import { readFile } from "fs/promises"

/** @param {import('http2').IncomingHttpHeaders} headers */
function generate_request(headers) {
  const request_path = headers[":path"] || ""
  const queryOperatorIndex = request_path?.indexOf("?")

  return {
    method: headers[":method"],
    resource_path:
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

/** @param {String} file */
function get_content_type(file) {
  switch (file.split(".").pop()) {
    case "html":
      return "text/html"
    case "css":
      return "text/css"
    case "js":
      return "application/javascript"
    case "json":
      return "application/json"
    case "png":
      return "image/png"
    case "ico":
      return "image/x-icon"
    case "svg":
      return "image/svg+xml"
    case "xml":
      return "image/svg+xml"
    default:
      return "text/plain"
  }
}

/** @param {import('http2').ServerHttp2Stream} stream */
async function push_handler(stream) {
  /** @type {[string, import('http2').ServerHttp2Stream][]} */
  let mapped_pushes = []

  const push_promises = config.pushable_resources.map(
    (resource_path) =>
      new Promise((resolve, reject) => {
        stream.pushStream(
          { [http2Constants.HTTP2_HEADER_PATH]: resource_path },
          (err, pushStream) => {
            if (err) {
              reject(err)
            } else {
              resolve([resource_path, pushStream])
            }
          }
        )
      })
  )

  try {
    mapped_pushes = await Promise.all(push_promises)
  } catch (ex) {
    console.error(ex)
    return
  }

  for (const [each_resource_path, each_push_stream] of mapped_pushes) {
    respond(each_push_stream, each_resource_path)
  }
}

/** @param {import('http2').ServerHttp2Stream} stream */
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
 * @param {import('http2').ServerHttp2Stream} stream
 * @param {String} resource_path
 */
async function respond(stream, resource_path) {
  resource_path = `${config.serve_directory}${resource_path}`

  const response_headers = {
    [http2Constants.HTTP2_HEADER_STATUS]: http2Constants.HTTP_STATUS_OK,
    [http2Constants.HTTP2_HEADER_CONTENT_TYPE]: get_content_type(resource_path),
  }

  if (resource_path.includes("sw.js")) {
    response_headers["Service-Worker-Allowed"] = "/"
  }

  /** @type {String | Buffer} */
  let content = "<html><body>File not found!</body></html>"
  try {
    content = await readFile(resource_path)
  } catch (ex) {
    response_headers[http2Constants.HTTP2_HEADER_STATUS] =
      http2Constants.HTTP_STATUS_NOT_FOUND
    response_headers[http2Constants.HTTP2_HEADER_CONTENT_TYPE] = "text/html"
  }
  stream.respond(response_headers)
  stream.write(content)
  stream.end()
}

/**
 * @param {import('http2').ServerHttp2Stream} stream
 * @param {import('http2').IncomingHttpHeaders} headers
 */
async function on_stream(stream, headers) {
  stream.on("error", console.error)

  const request = generate_request(headers)

  let push_promise = null
  if (request.resource_path === "/") {
    request.resource_path = "/index.html"
    if (stream.pushAllowed) push_promise = push_handler(stream)
  }

  console.log(`[SERVER] Incoming request: ${JSON.stringify(request)}`)

  if (request.method === "POST") {
    request.payload = await extract_payload(stream)
    console.log(`Request payload: ${request.payload}`)
  }

  await respond(stream, request.resource_path)
  if (push_promise !== null) await push_promise
}

async function main() {
  /** @type {import('http2').Http2Server | null} */
  let server = null
  if (config.protocol === "https") {
    server = createSecureServer({
      cert: await readFile(join(config.security_directory, "cert.pem")),
      key: await readFile(join(config.security_directory, "key.pem")),
    })
  } else {
    server = createServer()
  }

  server.on("stream", on_stream)
  server.on("error", console.error)

  if (config.host === undefined) {
    const host = await new Promise((resolve, reject) =>
      lookup(hostname(), (err, address) =>
        err ? reject(err) : resolve(address)
      )
    )
    config.host = host
  } else if (config.host === "") {
    config.host = "localhost"
  }

  await new Promise((resolve) => {
    server?.listen(config.port, config.host, resolve)
  })
  if (!server.listening) {
    console.error(`Could not listen on: ${config.host}:${config.port}`)
    return
  }
  console.log(
    `Server listening on ${config.protocol}://${config.host}:${config.port}`
  )
}

main()
