import dynamicImportVars from "@rollup/plugin-dynamic-import-vars"
import resolve from "@rollup/plugin-node-resolve"
import autoPrefixer from "autoprefixer"
import del from "rollup-plugin-delete"
import scss from "rollup-plugin-scss"
import svelte from "rollup-plugin-svelte"
import { terser } from "rollup-plugin-terser"
import sass from "sass"
import { sveltePreprocess } from "svelte-preprocess/dist/autoProcess"

const production = process.env.PRODUCTION === "true"

const publicDir = process.env.PUBLIC
const outputDir = `${publicDir}/build`

export default {
  input: "src/main.js",
  output: {
    sourcemap: !production,
    format: "es",
    file: `${outputDir}/main.js`,
    inlineDynamicImports: true,
  },
  plugins: [
    del({ targets: outputDir, force: true }),

    svelte({
      preprocess: [
        sveltePreprocess({
          sourceMap: !production,
          postcss: {
            plugins: [
              autoPrefixer({
                overrideBrowserslist: ["last 1 version", "ie >= 11"],
              }),
            ],
          },
        }),
      ],
      compilerOptions: {
        dev: !production,
        css: false,
      },
    }),

    scss({
      output: `${outputDir}/bundle.css`,
      outputStyle: "compressed",
      sass: sass,
    }),

    resolve({
      browser: true,
      dedupe: ["svelte"],
    }),

    // Watch the `public` directory and refresh the
    // browser on changes when not in production
    // !production && livereload(publicDir),

    production && terser(),

    // https://www.npmjs.com/package/@rollup/plugin-dynamic-import-vars
    dynamicImportVars(),
  ],
}
