export function toSnakeCase(str) {
  let result = '';
  for (let i = 0; i < str.length; i++) {
    if (str[i] === ' ') {
      result += '_';
    } else if (str[i] !== str[i].toLowerCase()) {
      result += '_' + str[i].toLowerCase();
    } else {
      result += str[i];
    }
  }
  return result;
}
