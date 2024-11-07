import { readdirSync, readFileSync } from 'fs';
import { join } from 'path';
import config from '../config.js';
import { markdownToHtml } from '../helpers/index.js';
import getFilename from './get-filename.js';

export default function getHtmlContent(dir, lang) {
  const files = readdirSync(dir);
  let contentFile = files.find((f) => getFilename(f) === `content_${lang}`);
  if (!contentFile) {
    lang = config.DEFAULT_LANG;
    contentFile = files.find((f) => getFilename(f) === 'content');
  }
  let content = readFileSync(join(dir, contentFile), config.ENCODING);
  if(contentFile.endsWith('.md') ){
    content = markdownToHtml(content);
  }
  return {
    content,
    lang,
  };
}
