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
import getVersionOptions from './get-version-options.js';
import getStaticPath from './get-static-path.js';

export default function generatePage({ dir = '', content = '', meta = {}, lang = config.DEFAULT_LANG, version = 'latest' } = {}) {
  const searchForm = getSearchForm(version);
  let html = readFileSync(getTemplate(dir), { encoding: config.ENCODING });
  if (meta.replacePlaceholders) {
    html = html.replaceAll('%content%', content);
  }
  const varMap = {
    '%timestamp%': Date.now(),
    '%logo%': getLogo(dir, lang, version),
    '%lang%': lang,
    '%version%': version,
    '%header%': getHeader(dir, lang),
    '%footer%': getFooter(dir, lang),
    '%search%': searchForm,
    '%search_text%': dictionary.search[lang] || 'Search',
    '%encoding%': config.ENCODING,
    '%home_link%': getLinkFor({ lang, version, page: { url: `/`, metas: {} } }),
    '%nav%': generateNavigation(lang, version),
    '%version_options%': getVersionOptions(version),
    '%static_path%': getStaticPath({ version }),
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
