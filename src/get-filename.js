import { basename, extname } from "path";

/**
 * @param {string} path 
 */
export default function getFilename(path){
    return basename(path, extname(path));
}