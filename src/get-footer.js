import { readdirSync, readFileSync } from 'fs';
import { dirname, join } from 'path';
import config from '../config.js';
import { markdownToHtml } from '../helpers/index.js';

export default function getfooter(dir, lang) {
  const footerFile = getfooterFileInDir(dir, lang);
  if (!footerFile) {
    return '';
  }

  const content = readFileSync(footerFile, config.ENCODING);
  if (footerFile.endsWith('md')) {
    return `<footer class="footer">${markdownToHtml(content)}</footer>`;
  }
  return content;
}

function getfooterFileInDir(dir, lang) {
  if (dir === '.' || !dir.includes('pages')) {
    return undefined;
  }
  const files = readdirSync(dir);
  let footerFile = files.find((fileName) => fileName.startsWith(`footer_${lang}`));
  footerFile = footerFile || files.find((fileName) => fileName.startsWith('footer'));
  if (!footerFile) {
    return getfooterFileInDir(dirname(dir));
  }
  return join(dir, footerFile);
}
