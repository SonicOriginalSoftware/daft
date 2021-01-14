import { fileURLToPath } from "url"
import { join, dirname } from "path"

export const config = {
  serve_directory: ".",
  security_directory: join(
    dirname(fileURLToPath(import.meta.url)),
    "./.security"
  ),
  port: 5000,
  host: "",
  pushable_resources: [],
  endpoints: ["create"],
  protocol: "https",
  startupTime: 3000,
}
