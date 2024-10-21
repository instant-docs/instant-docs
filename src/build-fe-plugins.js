// @ts-check
import esbuild from "esbuild";
import { join } from 'path';
import getJSFiles from './get-js-files.js';
import projectDir from "./get-project-dir.js";

export function buildFePlugins() {
    try {
        const files = getJSFiles(join(projectDir, "src/plugins/frontend"));
        esbuild.buildSync({
            entryPoints: files,
            bundle: true,
            outfile: join(projectDir, "static/bundle.js"),
            minify: true,
            platform: "browser"
        })
        console.log("Built fe plugins");
    } catch(e){
        console.warn(`Couldn't setup FE plugins\n${e.message}`)
    }
}