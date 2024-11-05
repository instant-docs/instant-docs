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
import { maskVariables, unmaskVariables } from './mask-variables.js';

const searchForm = getSearchForm();

export default function generatePage({ dir, content = '', meta = {}, lang = config.DEFAULT_LANG } = {}) {
  let html = readFileSync(getTemplate(dir), { encoding: config.ENCODING });
  if (meta.replacePlacholders) {
    html = html.replaceAll('%content%', content);
  }
  const varMap = {
    '%logo%': getLogo(dir, lang) || getLogo(dir, config.DEFAULT_LANG),
    '%lang%': lang,
    '%header%': getHeader(dir, lang) || getHeader(dir, config.DEFAULT_LANG),
    '%footer%': getFooter(dir, lang) || getFooter(dir, config.DEFAULT_LANG),
    '%search%': searchForm,
    '%search_text%': dictionary.search[lang] || dictionary.searchp[config.DEFAULT_LANG] || 'Search',
    '%encoding%': config.ENCODING,
    '%home_link%': getLinkFor({ lang, page: { url: '/', metas: {} } }),
    '%nav%': generateNavigation(lang),
    '%content%': meta.replacePlaceholders ? content : maskVariables(content),
  };
  html = putVariables({ text: html, object: varMap, placeholderAlreadyWrapped: true });
  html = putVariables({ text: html, object: meta, prefix: 'meta_' });

  const toc = meta.generateTOC ? generateTableOfContents(html, lang) : '';
  html = html.replaceAll('%table_of_contents%', toc ?? '%table_of_contents%');

  if (!meta.replacePlaceholders) {
    html = html.replaceAll(content, unmaskVariables(content));
  }
  return applyBePlugins({ html, dir, lang, meta });
}
