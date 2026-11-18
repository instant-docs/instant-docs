import { expect, test } from 'vitest';
import config from '../config.js';
import { defaultMetaData, markdownToHtml } from '../helpers/index.js';
import generatePage from '../src/generate-page.js';
import getHtmlContent from '../src/get-html-content.js';
import { initializePageCollections } from '../src/get-pages.js';
import putVariables from '../src/put-variables-to-text.js';
import keptMeta from '../versions/latest/on-menu/placeholders/kept/meta.js';
import replacedMeta from '../versions/latest/on-menu/placeholders/replaced/meta.js';

initializePageCollections('latest');

function renderExample(dir, meta, lang = 'en') {
  const { content, dictionaryMap, dictionary } = getHtmlContent(dir, lang, { replacePlaceholders: meta.replacePlaceholders });
  return generatePage({ dir, content, meta, lang, version: 'latest', dictionaryMap, dictionary });
}

test('dictionary placeholder replacement - BUG.md scenario', async () => {
  // Wait for backend plugins to be ready

  // Start with the exact markdown from BUG.md
  const markdown = `# %d%.title

%d%.intro_paragraph

## %d%.key_features_heading
- **%d%.event_driven_model_bullet** %d%.event_driven_model_content
- **%d%.single_threaded_bullet** %d%.single_threaded_content
- **%d%.wide_range_packages_bullet** %d%.wide_range_packages_content`;

  const dictionary = {
    search: 'Search',
    title: 'What is Node.js?',
    intro_paragraph:
      "Node.js is a runtime environment that allows you to run JavaScript on the server side. It's built on Chrome's V8 JavaScript engine and it uses an event-driven, non-blocking I/O model which makes it lightweight and efficient.",
    key_features_heading: 'Key Features:',
    event_driven_model_bullet: 'Event-Driven Model:',
    event_driven_model_content: 'Node.js uses events to handle requests asynchronously, making it fast and scalable.',
    single_threaded_bullet: 'Single Threaded but Highly Concurrent:',
    single_threaded_content: 'It can handle multiple connections simultaneously with a single thread, thanks to its non-blocking I/O operations.',
    wide_range_packages_bullet: 'Wide Range of Packages:',
    wide_range_packages_content: 'With npm (Node Package Manager), you have access to millions of reusable packages to speed up development.',
  };

  const dictionaryMap = {
    '%d%.search': dictionary.search,
    '%d%.title': dictionary.title,
    '%d%.intro_paragraph': dictionary.intro_paragraph,
    '%d%.key_features_heading': dictionary.key_features_heading,
    '%d%.event_driven_model_bullet': dictionary.event_driven_model_bullet,
    '%d%.event_driven_model_content': dictionary.event_driven_model_content,
    '%d%.single_threaded_bullet': dictionary.single_threaded_bullet,
    '%d%.single_threaded_content': dictionary.single_threaded_content,
    '%d%.wide_range_packages_bullet': dictionary.wide_range_packages_bullet,
    '%d%.wide_range_packages_content': dictionary.wide_range_packages_content,
  };

  // Convert to HTML using the actual production markdownToHtml function
  const content = markdownToHtml(putVariables({ target: markdown, source: dictionaryMap, placeholderAlreadyWrapped: true, convertToSnakeCase: false }));

  // Test with minimal meta to avoid other processing
  const minimalMeta = { ...defaultMetaData, replacePlaceholders: true, generateTOC: false };

  // Call the actual generatePage function using existing template
  const result = generatePage({
    dir: './versions/latest',
    content,
    meta: minimalMeta,
    lang: config.DEFAULT_LANG,
    version: 'latest',
    dictionaryMap,
    dictionary,
  });

  // Verify the expected output matches BUG.md expected HTML
  expect(result).toContain('<h1 id=what-is-nodejs>What is Node.js?</h1>');
  expect(result).toContain(
    "<p>Node.js is a runtime environment that allows you to run JavaScript on the server side. It's built on Chrome's V8 JavaScript engine and it uses an event-driven, non-blocking I/O model which makes it lightweight and efficient.</p>",
  );
  expect(result).toContain('<h2 id=key-features>Key Features:</h2>');
  expect(result).not.toContain('%d%.');

  // Specifically check whitespace preservation after </strong> tags - this is the BUG.md issue
  expect(result).toContain('<li><strong>Event-Driven Model:</strong> Node.js uses events to handle requests asynchronously, making it fast and scalable.</li>');
  expect(result).toContain(
    '<li><strong>Single Threaded but Highly Concurrent:</strong> It can handle multiple connections simultaneously with a single thread, thanks to its non-blocking I/O operations.</li>',
  );
  expect(result).toContain(
    '<li><strong>Wide Range of Packages:</strong> With npm (Node Package Manager), you have access to millions of reusable packages to speed up development.</li>',
  );

  // Verify no extra spaces or missing spaces after </strong> tags
  expect(result).not.toContain('<strong>Event-Driven Model:</strong>Node.js');
  expect(result).not.toContain('<strong>Single Threaded but Highly Concurrent:</strong>It can');
  expect(result).not.toContain('<strong>Wide Range of Packages:</strong>With npm');
  expect(result).not.toContain('<strong>Event-Driven Model:</strong>  Node.js');
  expect(result).not.toContain('<strong>Single Threaded but Highly Concurrent:</strong>  It can');
  expect(result).not.toContain('<strong>Wide Range of Packages:</strong>  With npm');

  // Verify no remaining placeholders
  expect(result).not.toContain('%d%.title');
  expect(result).not.toContain('%d%.intro_paragraph');
  expect(result).not.toContain('%d%.key_features_heading');
  expect(result).not.toContain('%d%.event_driven_model_bullet');
  expect(result).not.toContain('%d%.event_driven_model_content');
  expect(result).not.toContain('%d%.single_threaded_bullet');
  expect(result).not.toContain('%d%.single_threaded_content');
  expect(result).not.toContain('%d%.wide_range_packages_bullet');
  expect(result).not.toContain('%d%.wide_range_packages_content');
});

test('replaced example replaces content placeholders', () => {
  const result = renderExample('./versions/latest/on-menu/placeholders/replaced', replacedMeta);

  expect(result).toContain('<h2 id=replaced-variables-sample>Replaced variables sample</h2>');
  expect(result).toContain('Here is lang: <code>en</code>');
  expect(result).toContain('Here is meta_title: <code>Placeholder Replaced Example</code>');
  expect(result).toContain('Here is meta_menu_order: <code>2</code>');
  expect(result).not.toContain('<code>%lang%</code>');
  expect(result).not.toContain('%meta_title%');
  expect(result).not.toContain('%meta_menu_order%');

  expect(result.match(/<section id=table-of-contents>/g)).toHaveLength(1);
  expect(result).toContain('<h2>Table of Contents</h2>');
  expect(result).toContain('href=#replaced-variables-sample');
  expect(result).not.toContain('<ol></ol>');
});

test('kept example keeps content placeholders', () => {
  const result = renderExample('./versions/latest/on-menu/placeholders/kept', keptMeta);

  expect(result).toContain('<h2 id=kept-variables-sample>Kept variables sample</h2>');
  expect(result).toContain('Here is lang: <code>%lang%</code>');
  expect(result).toContain('Here is meta_title: <code>%meta_title%</code>');
  expect(result).toContain('Here is meta menu_order: <code>%meta_menu_order%</code>');

  expect(result.match(/<section id=table-of-contents>/g)).toHaveLength(1);
  expect(result).toContain('<h2>Table of Contents</h2>');
  expect(result).toContain('href=#kept-variables-sample');
  expect(result).not.toContain('<ol></ol>');
});

test('dictionary placeholders in markdown respect replacePlaceholders', () => {
  const replaced = getHtmlContent('./versions/latest/on-menu/placeholders', 'en');
  expect(replaced.content).toContain('<h1 id="placeholders">Placeholders</h1>');
  expect(replaced.content).not.toContain('%d%.');

  const kept = getHtmlContent('./versions/latest/on-menu/placeholders', 'en', { replacePlaceholders: false });
  expect(kept.content).toContain('%d%.placeholders');
});

test('dictionary placeholders in page content respect replacePlaceholders', () => {
  const dir = './versions/latest/on-menu/placeholders';
  const meta = { ...keptMeta, replacePlaceholders: false };
  const { content, dictionaryMap, dictionary } = getHtmlContent(dir, 'en', { replacePlaceholders: false });
  const result = generatePage({ dir, content, meta, lang: 'en', version: 'latest', dictionaryMap, dictionary });

  expect(result).toContain('%d%.placeholders');
  expect(result).toContain('%d%.placeholders_visit_sub_pages');
});
