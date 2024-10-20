// @ts-check
import { readdirSync, statSync } from 'fs';
import { join, extname } from 'path';
import esbuild from "esbuild";
import { packageDirectorySync } from 'pkg-dir';

function listJSFiles(dir) {
    let results = [];

    const files = readdirSync(dir);
    files.forEach(file => {
        const filePath = join(dir, file);
        const stat = statSync(filePath);

        if (stat && stat.isDirectory()) {
            results = results.concat(listJSFiles(filePath)); // Recursively list JS files in subdirectories
        } else if (extname(filePath) === '.js') {
            results.push(filePath); // Add the .js file to the results
        }
    });

    return results;
}

export function buildFePlugins() {
    try {
        const files = listJSFiles(join(packageDirectorySync() || "", "./src/plugins/frontend"));
        esbuild.buildSync({
            entryPoints: files,
            bundle: true,
            outfile: join(packageDirectorySync() || "", "./static/bundle.js"),
            minify: true,
            platform: "browser"
        })
        console.log("Built fe plugins");
    } catch(e){
        console.warn(`Couldn't setup FE plugins\n${e.message}`)
    }
}