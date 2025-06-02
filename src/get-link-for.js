import config from '../config.js';
import putVariables from './put-variables-to-text.js';

/**
 * @param {{
 *  page: { url: string, metas: Record<string, Record<string, string>> },
 *  lang: string | undefined,
 *  version: string
 * }} param0
 */
export default function getLinkFor({ page, lang, version }) {
  if (!page || !page.url || typeof page.url !== 'string' || !page.metas || typeof page.metas !== 'object') {
    throw new Error('Invalid page object');
  }
  if (lang && lang.trim() === '') {
    throw new Error('Invalid language code');
  }

  const format = config.LINK_FORMAT;
  if (!format) {
    throw new Error('Missing link format configuration');
  }

  const slug = page.url.startsWith('/') ? page.url.slice(1) : page.url;
  const url = putVariables({
    target: format
      .replaceAll('%lang%', lang || ':lang')
      .replaceAll('%path%', page.url)
      .replaceAll('%slug%', slug)
      .replaceAll('%version%', version)
      .replace(/\/$/,''),
    source: page.metas[lang] || page.metas[config.DEFAULT_LANG],
    prefix: 'meta_',
  });
  return url;
}
