import config from '../config.js';
import putVariables from './put-variables-to-text.js';

/**
 * @param {{
 *  page: { url: string, metas: Record<string, Record<string, string>> },
 *  lang: string | undefined,
 * }} param0
 */
export default function getLinkFor({ page, lang }) {
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
    text: format.replaceAll('%lang%', lang || ':lang').replaceAll('%path%', page.url).replaceAll('%slug%', slug),
    object: page.metas[lang] || page.metas[config.DEFAULT_LANG],
    prefix: 'meta_',
  });
  const lastChar = url.charAt(url.length - 1);
  if (lastChar === '/' && url.length > 1) {
    return url.slice(0, -1);
  }
  return url;
}
