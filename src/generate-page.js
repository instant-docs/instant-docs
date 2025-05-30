// @ts-check
import { readFileSync } from 'fs';
import config from '../config.js';
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
import { defaultMetaData } from '#helpers/index.js';

export default function generatePage({ dir = '', content = '', meta = defaultMetaData, lang = config.DEFAULT_LANG, version = 'latest', dictionaryMap = {} } = {}) {
  const searchForm = getSearchForm(version);
  let html = readFileSync(getTemplate(dir), config.ENCODING);
  if (meta.replacePlaceholders) {
    html = html.replaceAll('%content%', content);
  }

  const varMap = {
    '%timestamp%': Date.now(),
    '%logo%': getLogo(dir, lang),
    '%lang%': lang,
    '%version%': version,
    '%header%': getHeader(dir, lang),
    '%footer%': getFooter(dir, lang),
    '%search%': searchForm,
    '%encoding%': config.ENCODING,
    '%home_link%': getLinkFor({ lang, version, page: { url: `/`, metas: {} } }),
    '%nav%': generateNavigation(lang, version),
    '%version_options%': getVersionOptions(version),
    '%static_path%': getStaticPath({ version }),
  };
  html = putVariables({ text: html, object: varMap, placeholderAlreadyWrapped: true });
  html = putVariables({ text: html, object: meta, prefix: 'meta_' });
  if(meta.generateTOC){
    const toc = generateTableOfContents(content, lang);
    html = html.replaceAll('%generated_table_of_contents%', toc);
  }
  html = putVariables({ text: html, object: dictionaryMap, placeholderAlreadyWrapped: true, convertToSnakeCase: false });

  if (!meta.replacePlaceholders) {
    html = html.replaceAll('%content%', content);
  }

  return applyBePlugins({ html, dir, lang, meta });
}
