import { readdirSync, readFileSync } from 'fs';
import { join } from 'path';
import config from '../config.js';
import { markdownToHtml } from '../helpers/index.js';

export default function getHtmlContent(dir, lang) {
  const files = readdirSync(dir);
  let contentFile = files.find((fileName) => fileName === `content_${lang}.md`);
  if (!contentFile) {
    lang = config.DEFAULT_LANG;
    contentFile = 'content.md';
  }
  return {
    content: markdownToHtml(readFileSync(join(dir, contentFile), config.ENCODING)),
    lang,
  };
}
