import axios from 'axios';
import { load } from 'cheerio';
import { writeFileSync } from "fs";
import { join } from 'path';
import config from '../config.js';
import { offMenuPages, onMenuPages } from '../index.js';
import projectDir from './get-project-dir.js';
import { emitter } from './event.js';

/**
 * 
 * @param {{
 * url: string;
 * metas: Record<string, object>;
 * }} page
 * @param {string} lang 
 */
async function getFullTextSearchIndex(page, lang) {
    const { data: html } = await axios.get(page.url, { 
        baseURL: `${config.PROTOCOL}://localhost:${config.PORT}`,
        headers: {
            'accept-language': lang
        }
    });
    const $ = load(html);
    $('nav, header, footer, aside, script, style, #table-of-contents, form').remove();
    const title = $('title').text().trim();
    const textContent = title + ' ' + $('.content').text();
    const cleanText = textContent
        .replace(/\n|\t/g, ' ')
        .replace(/\s/g, ' ')
        .replace(/\s{2,}/g, ' ')
        .trim();
    return { title, cleanText, url: page.url };
}

function isTrueStr(str){
    return str === "1"
}

export async function prepareSearchIndexes(lang){
    const includeOffmenu = isTrueStr(config.ALLOW_SEARCH_IN_OFF_MENU);
    const pagesToSearch = [...onMenuPages, ...(includeOffmenu ? offMenuPages : [])]; 
    const indexContent = await Promise.all(pagesToSearch.map(page => getFullTextSearchIndex(page, lang)));
    const indexFile = join(projectDir, `static/search_index_${lang}.json`);
    writeFileSync(indexFile, JSON.stringify(indexContent), { encoding: config.ENCODING });
    emitter.emit(`search-index-${lang}`);
}