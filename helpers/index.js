import config from '../config.js';
import { Marked } from 'marked';
import { markedHighlight } from 'marked-highlight';
import hljs from 'highlight.js';

const marked = new Marked(markedHighlight({
  langPrefix: 'hljs language-',
  highlight(code, lang) {
    const language = hljs.getLanguage(lang) ? lang : 'plaintext';
    return hljs.highlight(code, { language }).value;
  }
}));

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