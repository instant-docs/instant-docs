import { toSnakeCase } from './to-snakecase.js';

export default function putVariables({ text, object, prefix = '', suffix = '', placeholderAlreadyWrapped = false, convertToSnakeCase = true }) {
  Object.keys(object || {}).forEach((key) => {
    key = convertToSnakeCase ? toSnakeCase(key) : key;
    const placeholderSymbol = placeholderAlreadyWrapped ? '' : '%';
    const placeholder = `${placeholderSymbol}${prefix}${key}${suffix}${placeholderSymbol}`;
    text = text.replaceAll(placeholder, object[key]);
  });
  return text;
}
