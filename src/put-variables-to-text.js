import { toSnakeCase } from './to-snakecase.js';

/**
 * @param {{
 *   text: string,
 *   object: Record<string, any>,
 *   prefix?: string,
 *   suffix?: string,
 *   placeholderAlreadyWrapped?: boolean,
 *   convertToSnakeCase?: boolean,
 * }} options
 * @returns {string} - The text with variables replaced.}
 */
export default function putVariables({ text, object, prefix = '', suffix = '', placeholderAlreadyWrapped = false, convertToSnakeCase = true }) {
  Object.keys(object || {}).forEach((key) => {
    const value = object[key];
    key = convertToSnakeCase ? toSnakeCase(key) : key;
    const placeholderSymbol = placeholderAlreadyWrapped ? '' : '%';
    const placeholder = `${placeholderSymbol}${prefix}${key}${suffix}${placeholderSymbol}`;
    text = text.replaceAll(placeholder, value);
  });
  return text;
}
