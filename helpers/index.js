import config from '../config.js';
import { marked } from 'marked';

marked.options({
  gfm: true,
  breaks: true,
});

export function metadata({
  title = '',
  description = '',
  keywords = [],
  image = '',
  icon = '',
  lang = config.DEFAULT_LANG,
  generateTOC = true,
  menuOrder = 0,
  replacePlaceholders = true,
} = {}) {
  return { title, description, keywords, image, icon, lang, generateTOC, menuOrder, replacePlaceholders };
}

export function markdownToHtml(text) {
  return marked.parse(text);
}

export const defaultMetaData = metadata({});