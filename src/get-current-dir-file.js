import { fileURLToPath } from 'url';
import { dirname as pathDirname } from 'path';

export function __dir(importMeta) {
  const filePath = __file(importMeta);
  if (!filePath) return '';
  return pathDirname(filePath);
}

export function __file(importMeta) {
  return importMeta.url ? fileURLToPath(importMeta.url) : '';
}
