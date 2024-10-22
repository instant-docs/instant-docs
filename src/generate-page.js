import { readFileSync } from "fs";
import config from "../config.js";
import dictionary from "../dictionary.js";
import generateNavigation from "./generate-nav.js";
import generateTableOfContents from "./genereate-toc.js";
import getFooter from "./get-footer.js";
import getHeader from "./get-header.js";
import getLogo from "./get-logo.js";
import getTemplate from "./get-template.js";
import getSearchForm from "./get-search-form.js";
import applyBePlugins from "./apply-be-plugins.js";

const searchForm = getSearchForm();

export default function generatePage({ dir, content = '', meta = {}, lang = config.DEFAULT_LANG } = {}){
    const templateHtml = readFileSync(getTemplate(dir), { encoding: config.ENCODING });
    const htmlWithContentOnly = templateHtml.replace('%content%', content);
    const logo = getLogo(dir, lang);
    const header = getHeader(dir, lang);
    const footer = getFooter(dir, lang);
    const searchText = dictionary.search[lang];
    const toc = meta.generateTOC ? generateTableOfContents(htmlWithContentOnly, lang) : "";
    const html = htmlWithContentOnly
        .replaceAll('%logo%', logo ?? '%logo%')
        .replaceAll('%header%', header ?? '%header%')
        .replaceAll('%lang%', lang ?? '%lang%')
        .replaceAll('%encoding%', config.ENCODING ?? '%encoding%')
        .replaceAll('%page_title%', meta.title ?? '%page_title%')
        .replaceAll('%table_of_contents%', toc ?? '%table_of_contents%')
        .replaceAll('%search%', searchForm ?? '%search%')
        .replaceAll('%search_text%', searchText ?? '%search_text%')
        .replaceAll('%nav%', generateNavigation(lang) ?? '%nav%')
        .replaceAll('%footer%', footer) ?? '%footer%';
    return applyBePlugins({ html, dir, lang, meta });
}