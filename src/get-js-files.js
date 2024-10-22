import { readdirSync, statSync } from 'fs';
import { extname, join } from 'path';

export default function getJSFiles(dir) {
  let results = [];

  const files = readdirSync(dir);
  files.forEach((file) => {
    const filePath = join(dir, file);
    const stat = statSync(filePath);

    if (stat && stat.isDirectory()) {
      results = results.concat(getJSFiles(filePath));
    } else if (extname(filePath) === '.js') {
      results.push(filePath);
    }
  });

  return results;
}
