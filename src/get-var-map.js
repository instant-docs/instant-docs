// @ts-check
import config from "../config.js";
import generateNavigation from "./generate-nav.js";
import getfooter from "./get-footer.js";
import getHeader from "./get-header.js";
import getLinkFor from "./get-link-for.js";
import getLogo from "./get-logo.js";
import getSearchForm from "./get-search-form.js";
import getStaticPath from "./get-static-path.js";
import getVersionOptions from "./get-version-options.js";

export default function getVarMap({ dir = '', lang = '', version = '', dictionaryMap = {} } = {}) {
    return {
        '%timestamp%': Date.now(),
        '%logo%': getLogo(dir, lang),
        '%lang%': lang,
        '%version%': version,
        '%header%': getHeader(dir, lang),
        '%footer%': getfooter(dir, lang),
        '%search%': getSearchForm(version),
        '%encoding%': config.ENCODING,
        '%home_link%': getLinkFor({ lang, version, page: { url: `/`, metas: {} } }),
        '%nav%': generateNavigation(lang, version),
        '%version_options%': getVersionOptions(version),
        '%static_path%': getStaticPath({ version }),
        ...dictionaryMap
    };
}