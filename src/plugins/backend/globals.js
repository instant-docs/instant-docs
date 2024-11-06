import { load } from 'cheerio';

export default function setGlobals({ html, meta, lang, dir }) {
  const $ = load(html);

  $('head').append(
    `
    <script>
        window.globals = ${JSON.stringify({ meta, lang, dir })}
    </script>`.trim(),
  );

  // Get the updated HTML
  return $.html();
}
