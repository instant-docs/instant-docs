import config from '../config.js';
import { Marked } from 'marked';
import { markedHighlight } from 'marked-highlight';
import hljs from 'highlight.js';
import bash from 'highlight.js/lib/languages/bash';
import POPULAR_COMMANDS from './popular-commands.js';

const patchedBash = bash(hljs);
if (Array.isArray(patchedBash.keywords.built_in)) {
  patchedBash.keywords.built_in.push(...POPULAR_COMMANDS);
}

hljs.registerLanguage('bash', () => patchedBash);

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