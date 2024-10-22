import { readdirSync } from 'fs';
import { dirname, resolve } from 'path';

/**
 * @param {string} dir
 */
export default function getTemplate(dir) {
  if (!dir.includes('pages')) throw new Error('template.html not found');
  const dirs = readdirSync(dir);
  for (const f of dirs) {
    if (f === 'template.html') return resolve(dir, f);
  }
  return getTemplate(dirname(dir));
}
