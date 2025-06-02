import { toSnakeCase } from './to-snakecase.js';

/**
 * @template T
 * @param {{
 *   target: T,
 *   source: Record<string, any>,
 *   prefix?: string,
 *   suffix?: string,
 *   placeholderAlreadyWrapped?: boolean,
 *   convertToSnakeCase?: boolean,
 * }} options
 * @returns {T} The object/text with variables replaced.
 */
export default function putVariables({ target = '', source = {}, prefix = '', suffix = '', placeholderAlreadyWrapped = false, convertToSnakeCase = true }) {
  if (typeof target === "string") {
    return Object.keys(source || {}).reduce((result, key) => {
      let value = source[key];
      if(Array.isArray(value)){
        value = value.join(', ');
      }
      key = convertToSnakeCase ? toSnakeCase(key) : key;
      const placeholderSymbol = placeholderAlreadyWrapped ? '' : '%';
      const placeholder = `${placeholderSymbol}${prefix}${key}${suffix}${placeholderSymbol}`;
      result = result.replaceAll(placeholder, value);
      return result;
    }, target);
  }
  else if(Array.isArray(target)){
    return target.map(item => putVariables({ target: item, source, prefix, suffix, placeholderAlreadyWrapped, convertToSnakeCase }));
  }
  else if (typeof target === "object") {
    return Object.fromEntries(Object.keys(target).map(key =>
      [key, putVariables({ target: target[key], source, prefix, suffix, placeholderAlreadyWrapped, convertToSnakeCase })]
    ));
  }
  return target;
}
