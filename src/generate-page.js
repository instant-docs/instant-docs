// @ts-check
import { defaultMetaData } from '#helpers/index.js';
import { readFileSync } from 'fs';
import { minify } from 'htmlfy';
import config from '../config.js';
import applyBePlugins from './apply-be-plugins.js';
import generateTableOfContents from './genereate-toc.js';
import getTemplate from './get-template.js';
import getVarMap from './get-var-map.js';
import putVariables from './put-variables-to-text.js';

export default function generatePage({ dir = '', content = '', meta = defaultMetaData, lang = config.DEFAULT_LANG, version = 'latest', dictionaryMap = {}, dictionary = {} } = {}) {
  let html = readFileSync(getTemplate(dir), config.ENCODING);
  if (meta.replacePlaceholders) {
    html = html.replaceAll('%content%', content);
  }

  const varMap = getVarMap({ dir, lang, version, dictionaryMap: {}, dictionary });
  html = putVariables({ target: html, source: varMap, placeholderAlreadyWrapped: true });
  html = putVariables({ target: html, source: meta, prefix: 'meta_' });
  const toc = meta.generateTOC ? generateTableOfContents(content, lang) : '';
  html = html.replaceAll('%generated_table_of_contents%', toc);
  for (const key in dictionaryMap) {
    html = html.replace(new RegExp(`${key}(?!\\w)`, 'g'), dictionaryMap[key]);
  }

  if (!meta.replacePlaceholders) {
    html = html.replaceAll('%content%', content);
  }

  html = applyBePlugins({ html, dir, lang, meta });
  return minify(html, { ignore: ['pre'], checked_html: false });
}
