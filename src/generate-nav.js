import config from '../config.js';
import { onMenuPages } from '../index.js';
import getLinkFor from './get-link-for.js';

export default function generateNavigation(lang) {
  /**
   * @param {Array<{
   * url: string;
   * metas: Record<string, object>;
   * }>} pages
   * @param {string} parentUrl
   */
  function buildMenu(pages, parentUrl = '') {
    let menu = '';

    menu += pages
      .filter((page) => page.url.startsWith(parentUrl) && page.url.replace(parentUrl, '').split('/').length === 2) // Get child pages
      .sort((p1, p2) => {
        const meta1 = p1.metas[lang] ?? p1.metas[config.DEFAULT_LANG];
        const meta2 = p2.metas[lang] ?? p2.metas[config.DEFAULT_LANG];
        return meta1?.menuOrder - meta2?.menuOrder;
      })
      .map((page) => {
        const meta = page.metas[lang] ?? page.metas[config.DEFAULT_LANG];
        const title =
          meta.title ||
          page.url
            .split('/')
            .pop()
            .replace(/-/g, ' ')
            .replace(/\b\w/g, (c) => c.toUpperCase()); // Create title from URL
        const subPages = onMenuPages.filter((subPage) => subPage.url.startsWith(`${page.url}/`));
        const hasSubpages = subPages.length > 0;
        let li = '';

        // Find if there are subpages and recursively build the submenu
        if (hasSubpages) {
          li += '<li class="pure-menu-item" role="group">';
          li += `<div class="flex-menu-item" role="group"><a class="pure-menu-link grow" href="${getLinkFor({ page, lang })}">${title}</a>`;
          li += '<label><input type="checkbox" class="expand-button"/><div class="chevron"></div></label>';
          li += '</div>';
          li += '<ul>';
          li += buildMenu(subPages, page.url); // Add sub-menu inside the <li> if there are subpages
          li += '</ul>';
        } else {
          li += `<li class="pure-menu-item">`;
          li += `<a class="pure-menu-link" href="${getLinkFor({ page, lang })}">${title}</a>`;
        }

        li += '</li>';
        return li;
      })
      .join('');

    return menu;
  }

  // Get only top-level pages (without slashes beyond the root)
  const topLevelPages = onMenuPages.filter((page) => page.url.split('/').length === 2);
  return buildMenu(topLevelPages);
}
