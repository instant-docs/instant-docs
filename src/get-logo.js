import { readdirSync, readFileSync } from 'fs';
import { dirname, join } from 'path';
import config from '../config.js';

export default function getLogo(dir, lang) {
  const logoFile = getLogoFileInDir(dir, lang);
  if (!logoFile) {
    return '';
  }

  const content = readFileSync(logoFile, config.ENCODING);
  return content;
}

function getLogoFileInDir(dir, lang, version) {
  if (!dir || dir === '.') {
    return undefined;
  }
  const files = readdirSync(dir);
  let logoFile = files.find((fileName) => fileName === `logo_${lang}.html`);
  logoFile = logoFile || files.find((fileName) => fileName === 'logo.html');
  if (!logoFile) {
    return getLogoFileInDir(dirname(dir));
  }
  return join(dir, logoFile);
}
