import { load } from "cheerio";
import { versions } from "../index.js";

export default function getVersionOptions(version) {
  const $ = load('<div class="dropdown"><select title="version" id="version-options"></select></div>');
  const options = versions.map((v) => `<option ${version === v ? 'selected ' : ''}value="${v}">${v}</option>`);
  $('#version-options').append(...options);
  return $.html();
}