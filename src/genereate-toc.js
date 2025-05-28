import { load } from 'cheerio';
import config from '../config.js';

export default function generateTableOfContents(html, lang, level = config.DEFAULT_CONTENT_HEADING_LEVEL, parent = null, parentLevel = null) {
  const $ = load(html);
  if (parent) {
    return generateSubTableOfContents($, lang, level, parent, parentLevel);
  }
  let toc = '';
  $(`h${level}[id]`).each(function () {
    const text = $(this).text();
    const id = $(this).attr('id');
    toc += `<li><a href="#${id}">${text}</a>`;
    toc += generateTableOfContents(html, lang, level + 1, $(this), level);
    toc += '</li>';
  });
  if (toc.length > 0) {
    toc = `<h2>${config.DICTIONARY_VARIABLE}.ToC</h2><ol>${toc}</ol>`;
  }
  return toc;
}

/**
 *
 * @param {import("cheerio").CheerioAPI} $
 * @param {string} lang
 * @param {number} level
 * @param {import("cheerio").Cheerio<Element>} parent
 * @param {number} parentLevel
 */
function generateSubTableOfContents($, lang, level, parent, parentLevel) {
  let nextElement = parent.next();
  let toc = '<ol>';
  while (nextElement.length) {
    if (nextElement.is(`h${parentLevel}`)) {
      break;
    }
    if (nextElement.is(`h${level}[id]`)) {
      const text = nextElement.text();
      const id = nextElement.attr('id');
      toc += `<li><a href="#${id}">${text}</a>`;
      toc += generateSubTableOfContents($, lang, level + 1, nextElement, parentLevel + 1);
      toc += '</li>';
    }
    nextElement = nextElement.next();
  }
  return toc + '</ol>';
}
