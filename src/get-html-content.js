import { readdirSync, readFileSync } from 'fs';
import { join } from 'path';
import config from '../config.js';
import { markdownToHtml } from '#helpers/index.js';
import getFilename from './get-filename.js';
import getDictionary from './get-dictionary.js';

export default function getHtmlContent(dir, lang) {
  const files = readdirSync(dir);
  let contentFile = files.find((f) => getFilename(f) === `content_${lang}`);
  if (!contentFile) {
    contentFile = files.find((f) => getFilename(f) === 'content');
  }
  let content = readFileSync(join(dir, contentFile), config.ENCODING);
  const dictionary = getDictionary({ dir, lang });
  const dictionaryMap = Object.fromEntries(Object.keys(dictionary).map(key => [`${config.DICTIONARY_VARIABLE}.${key}`, dictionary[key]]));
  for(const key in dictionaryMap){
    content = content.replace(new RegExp(`${key}\\b`, 'g'), dictionaryMap[key]);
  }

  if(contentFile.endsWith('.md') ){
    content = markdownToHtml(content);
  }
  return {
    content,
    lang,
    dictionaryMap
  };
}
