import { serve, stop } from "@sonicoriginalsoftware/rest-api-server/server.js"

import { resolve } from "path"

import { config as rest_api_config } from "@sonicoriginalsoftware/rest-api-server/server-config.js"

/** @param {import('@sonicoriginalsoftware/rest-api-server/server-config.js').ServerConfig} [config] */
export async function start_server(config) {
  if (config === undefined) {
    config = rest_api_config
    config.endpoints_path = resolve(".")
    config.port = 5030
  }

  const server = await serve(config)
  if (server === undefined) throw new ReferenceError()

  process.on("SIGINT", async (signal) => await stop(server))
  process.on("SIGABRT", async (signal) => await stop(server))
  process.on("SIGHUP", async (signal) => await stop(server))
  process.on("SIGKILL", async (signal) => await stop(server))

  return server
}

start_server()
