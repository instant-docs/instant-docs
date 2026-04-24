// @ts-check

/**@type {Record<string, Array<{url: string, metas: Record<string, object>}>>} */
export const onMenuPagesByVersion = {};
/**@type {Record<string, Array<{url: string, metas: Record<string, object>}>>} */
export const offMenuPagesByVersion = {};

/**
 * Initialize page collections for a version if they don't exist
 * @param {string} version 
 */
export function initializePageCollections(version) {
  if (!onMenuPagesByVersion[version]) {
    onMenuPagesByVersion[version] = [];
  }
  if (!offMenuPagesByVersion[version]) {
    offMenuPagesByVersion[version] = [];
  }
}

/**
 * Add a page to the appropriate collection
 * @param {string} version 
 * @param {{url: string, metas: Record<string, object>}} page 
 * @param {'on-menu' | 'off-menu'} dirType 
 */
export function addPageToCollection(version, page, dirType) {
  if (dirType === 'on-menu') {
    onMenuPagesByVersion[version].push(page);
  } else {
    offMenuPagesByVersion[version].push(page);
  }
}
