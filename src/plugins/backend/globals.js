import { load } from 'cheerio';
import config from '../../../config.js';

export default function setGlobals({ html, meta, lang, dir }) {
  const $ = load(html);
  const version = $('html').attr('x-version');

  function getLink({ slug, lang, version } = {}) {
    lang = lang ?? window.lang;
    version = version ?? window.version ?? backend.version;
    return config.LINK_FORMAT
      .replaceAll('%lang%', lang)
      .replaceAll('%version%', version)
      .replaceAll('%slug%', slug)
      .replaceAll('//', '/')
      .replace(/\/$/, '');
  }

  const hardCodedGetLink = getLink.toString()
    .replaceAll('config.LINK_FORMAT', `'${config.LINK_FORMAT}'`)
    .replaceAll('backend.version', `'${version}'`);


  $('head').append(
    `
    <script>
        window.globals = ${JSON.stringify({ meta, lang, dir, version })};
        window.getLink = ${hardCodedGetLink}
    </script>`.trim(),
  );

  // Get the updated HTML
  return $.html();
}
