import { readFileSync } from "fs";
import { resolve } from "path";
import config from "../config.js";
import projectDir from "./get-project-dir.js";

export default function getSearchForm(){
    try {
        const dir = resolve(projectDir, 'pages', 'search.html');
        return readFileSync(dir, { encoding: config.ENCODING });
    } catch(e){
        console.warn(`Couldn't setup search form\n${e.message}`);
        return '';
    }
}