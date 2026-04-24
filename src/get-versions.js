import { existsSync, lstatSync, mkdirSync, readdirSync } from "fs";
import { join } from "path";
import getStaticPath from "./get-static-path.js";
import { projectBuildDir } from "./get-project-dir.js";

export let versions = [];

if (existsSync('./versions')) {
    versions = readdirSync('./versions')
        .filter((dir) => lstatSync(`./versions/${dir}`).isDirectory())
        .sort()
        .reverse();
    versions.forEach(version => {
        mkdirSync(join(projectBuildDir, getStaticPath({ version })), { recursive: true })
    });
}