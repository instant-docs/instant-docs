import { load } from 'cheerio';
import config from '../../../config.js';

export default function setGlobals({ html, meta, lang, dir }) {
  const $ = load(html);
  function getLinkFor(slug, lang, version) {
    const linkFormat = config.LINK_FORMAT;
    return linkFormat
      .replaceAll('%lang%', lang)
      .replaceAll('%version%', version)
      .replaceAll('%slug%', slug)
      .replaceAll('//', '/')
      .replace(/\/$/, '');
  }
  const version = $('html').attr('x-version');

  const hardCodedGetLinkFor = getLinkFor.toString().replaceAll('config.LINK_FORMAT', `'${config.LINK_FORMAT}'`);

  $('head').append(
    `
    <script>
        window.globals = ${JSON.stringify({ meta, lang, dir, version })};
        window.getLinkFor = ${hardCodedGetLinkFor}
    </script>`.trim(),
  );

  // Get the updated HTML
  return $.html();
}
