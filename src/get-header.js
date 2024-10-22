import { readdirSync, readFileSync } from 'fs';
import { dirname, join } from 'path';
import config from '../config.js';
import { markdownToHtml } from '../helpers/index.js';

export default function getHeader(dir, lang) {
  const headerFile = getHeaderFileInDir(dir, lang);
  if (!headerFile) {
    return '';
  }

  const content = readFileSync(headerFile, config.ENCODING);
  if (headerFile.endsWith('md')) {
    return `<header class="header">${markdownToHtml(content)}</header>`;
  }
  return content;
}

function getHeaderFileInDir(dir, lang) {
  if (dir === '.' || !dir.includes('pages')) {
    return undefined;
  }
  const files = readdirSync(dir);
  let headerFile = files.find((fileName) => fileName.startsWith(`header_${lang}`));
  headerFile = headerFile || files.find((fileName) => fileName.startsWith('header'));
  if (!headerFile) {
    return getHeaderFileInDir(dirname(dir));
  }
  return join(dir, headerFile);
}
