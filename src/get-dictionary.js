import { readdirSync, readFileSync } from 'fs';
import { dirname, relative, resolve } from 'path';
import { pathToFileURL } from 'url';

/**
 * @param {{ dir: string, lang: string }} options
 * @returns {Record<string, string>} path to dictionary file
 */
export default function getDictionary({ dir, lang, result = {} }) {
    if (!dir || dir === '.') return result;
    const dirs = readdirSync(dir).sort().reverse();
    const getJson = (path) => JSON.parse(readFileSync(path));

    for (const f of dirs) {
        if (f === 'dictionary.json') {
            result = { ...(getJson(resolve(dir, f))[lang]), ...result };
        }
        else if (f === `dictionary_${lang}.json`) {
            result = { ...getJson(resolve(dir, f)), ...result }
        }
    }
    return getDictionary({ dir: dirname(dir), lang, result });
}