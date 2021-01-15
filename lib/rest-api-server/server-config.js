import { fileURLToPath } from "url"
import { join, dirname } from "path"

/**
 * @typedef {{
 * endpoints_path: string;
 * security_directory: string;
 * port: number;
 * host: string;
 * protocol: string;
 * startupTime: number;
 * }} ServerConfig
 */

/** @type {ServerConfig} */
export const config = {
  endpoints_path: ".",
  security_directory: join(
    dirname(fileURLToPath(import.meta.url)),
    "./.security"
  ),
  port: 5000,
  host: "",
  protocol: "https",
  /** Defines the maximum time the server will try to boot up before erroring out */
  startupTime: 3000,
}
