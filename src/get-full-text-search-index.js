import axios from 'axios';
import { load } from 'cheerio';
import { Router } from 'express';
import { writeFileSync } from 'fs';
import { join } from 'path';
import config from '../config.js';
import { offMenuPagesByVersion, onMenuPagesByVersion } from '../index.js';
import { emitter } from './events.js';
import getLinkFor from './get-link-for.js';
import getStaticPath from './get-static-path.js';
import projectDir from './get-project-dir.js';

export const searchIndexRouter = Router();

/**
 *
 * @param {{
 * url: string;
 * metas: Record<string, object>;
 * }} page
 * @param {string} lang
 */
async function getFullTextSearchIndex(page, lang, version) {
  const { data: html } = await axios.get(getLinkFor({ page, lang, version }), { baseURL: `${config.PROTOCOL}://localhost:${config.PORT}` });
  const $ = load(html);
  $('nav, header, footer, aside, script, style, #table-of-contents, form').remove();
  const title = $('title').text().trim();
  const textContent = title + ' ' + $('.content').text();
  const cleanText = textContent
    .replace(/\n|\t/g, ' ')
    .replace(/\s/g, ' ')
    .replace(/\s{2,}/g, ' ')
    .trim();
  return { title, cleanText, url: `${page.url}/${lang}` };
}

function isTrueStr(str) {
  return ['1', 'true'].includes(str);
}

export async function prepareSearchIndexes({ lang, version }) {
  const includeOffmenu = isTrueStr(config.ALLOW_SEARCH_IN_OFF_MENU);
  const pagesToSearch = [...onMenuPagesByVersion[version], ...(includeOffmenu ? offMenuPagesByVersion[version] : [])];
  const indexContent = await Promise.all(pagesToSearch.map((page) => getFullTextSearchIndex(page, lang, version)));
  const indexPath = join(getStaticPath({ version }), `/search_index_${lang}.json`);
  searchIndexRouter.get(indexPath, (_req, res) => res.send(indexContent));
  const indexFile = join(projectDir, config.BUILD_DIR, indexPath);
  writeFileSync(indexFile, JSON.stringify(indexContent), { encoding: config.ENCODING });
  emitter.emit(`search-index-${lang}-${version}`);
}
