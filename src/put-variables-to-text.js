export default function putVariables({ text, object, prefix = '', suffix = '', placeholderAlreadyWrapped = false }) {
  Object.keys(object || {}).forEach((key) => {
    const placeholderSymbol = placeholderAlreadyWrapped ? '' : '%';
    const placeholder = `${placeholderSymbol}${prefix}${key}${suffix}${placeholderSymbol}`;
    text = text.replaceAll(placeholder, object[key]);
  });
  return text;
}
