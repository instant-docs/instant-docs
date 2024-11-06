const maskMap = {};
const mask = '%__masked_variable__%';

export function maskVariables(text) {
  if (!text) return text;
  const matchArray = text.match(/%\w+%/g);
  if (!matchArray || matchArray.length === 0) {
    return text; // No matches found, return the original text
  }
  const symbol = Symbol.for(text);
  maskMap[symbol] = matchArray;
  const maskedText = text.replaceAll(/%\w+%/g, mask);
  return maskedText;
}

export function unmaskVariables(text) {
  const symbol = Symbol.for(text);
  if (!text || !maskMap[symbol]) return text;
  const matches = maskMap[symbol];
  if (matches) {
    for (let i = 0; i < matches.length; i++) {
      text = text.replace(mask, matches[i]);
    }
    delete maskMap[symbol];
  }
  return text;
}
