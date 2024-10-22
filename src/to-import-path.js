import { sep } from 'path';

export function toImportPath(str) {
  if (!str.startsWith('.')) {
    str = './' + str;
  }
  return str.replaceAll(sep, '/');
}
