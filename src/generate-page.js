import { readFileSync } from 'fs';
import config from '../config.js';
import dictionary from '../dictionary.js';
import generateNavigation from './generate-nav.js';
import generateTableOfContents from './genereate-toc.js';
import getFooter from './get-footer.js';
import getHeader from './get-header.js';
import getLogo from './get-logo.js';
import getTemplate from './get-template.js';
import getSearchForm from './get-search-form.js';
import applyBePlugins from './apply-be-plugins.js';
import putVariables from './put-variables-to-text.js';
import getLinkFor from './get-link-for.js';

const searchForm = getSearchForm();

export default function generatePage({ dir, content = '', meta = {}, lang = config.DEFAULT_LANG } = {}) {
  let html = readFileSync(getTemplate(dir), { encoding: config.ENCODING });
  if (meta.replacePlaceholders) {
    html = html.replaceAll('%content%', content);
  }
  const varMap = {
    '%timestamp%': Date.now(),
    '%logo%': getLogo(dir, lang),
    '%lang%': lang,
    '%header%': getHeader(dir, lang),
    '%footer%': getFooter(dir, lang),
    '%search%': searchForm,
    '%search_text%': dictionary.search[lang] || 'Search',
    '%encoding%': config.ENCODING,
    '%home_link%': getLinkFor({ lang, page: { url: '/', metas: {} } }),
    '%nav%': generateNavigation(lang),
  };
  html = putVariables({ text: html, object: varMap, placeholderAlreadyWrapped: true });
  html = putVariables({ text: html, object: meta, prefix: 'meta_' });
  const toc = meta.generateTOC ? generateTableOfContents(content, lang) : '';
  html = html.replaceAll('%table_of_contents%', toc ?? '%table_of_contents%');

  if (!meta.replacePlaceholders) {
    html = html.replaceAll('%content%', content);
  }

  return applyBePlugins({ html, dir, lang, meta });
}
