const maskMap = {};

export function maskVariables(text) {
  if (!text) return text;
  const maskedText = text.replace(/%\w+%/g, '%__masked_variable__%');
  const symbol = Symbol.for(maskedText);
  maskMap[symbol] = text;
  return maskedText;
}

export function unmaskVariables(maskedText) {
  const symbol = Symbol.for(maskedText);
  if (!maskedText || !maskMap[symbol]) return maskedText;
  const result = maskMap[symbol];
  if (result) delete maskMap[symbol];
  return result;
}
