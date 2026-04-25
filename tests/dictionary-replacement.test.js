import { test, expect } from 'vitest';
import { markdownToHtml, defaultMetaData } from '../helpers/index.js';
import generatePage from '../src/generate-page.js';
import config from '../config.js';
import { initializePageCollections } from '../src/get-pages.js';
import { emitter } from '../src/events.js';

initializePageCollections('latest');
await new Promise(resolve => emitter.once('be-plugins-ready', resolve));

test('dictionary placeholder replacement - BUG.md scenario', async () => {
    // Wait for backend plugins to be ready

    // Start with the exact markdown from BUG.md
    const markdown = `# %d%.title

%d%.intro_paragraph

## %d%.key_features_heading
- **%d%.event_driven_model_bullet** %d%.event_driven_model_content
- **%d%.single_threaded_bullet** %d%.single_threaded_content
- **%d%.wide_range_packages_bullet** %d%.wide_range_packages_content`;

    // Convert to HTML using the actual production markdownToHtml function
    const content = markdownToHtml(markdown);

    const dictionary = {
        title: 'What is Node.js?',
        intro_paragraph: 'Node.js is a runtime environment that allows you to run JavaScript on the server side. It\'s built on Chrome\'s V8 JavaScript engine and it uses an event-driven, non-blocking I/O model which makes it lightweight and efficient.',
        key_features_heading: 'Key Features:',
        event_driven_model_bullet: 'Event-Driven Model:',
        event_driven_model_content: 'Node.js uses events to handle requests asynchronously, making it fast and scalable.',
        single_threaded_bullet: 'Single Threaded but Highly Concurrent:',
        single_threaded_content: 'It can handle multiple connections simultaneously with a single thread, thanks to its non-blocking I/O operations.',
        wide_range_packages_bullet: 'Wide Range of Packages:',
        wide_range_packages_content: 'With npm (Node Package Manager), you have access to millions of reusable packages to speed up development.'
    };

    const dictionaryMap = {
        '%d%.title': dictionary.title,
        '%d%.intro_paragraph': dictionary.intro_paragraph,
        '%d%.key_features_heading': dictionary.key_features_heading,
        '%d%.event_driven_model_bullet': dictionary.event_driven_model_bullet,
        '%d%.event_driven_model_content': dictionary.event_driven_model_content,
        '%d%.single_threaded_bullet': dictionary.single_threaded_bullet,
        '%d%.single_threaded_content': dictionary.single_threaded_content,
        '%d%.wide_range_packages_bullet': dictionary.wide_range_packages_bullet,
        '%d%.wide_range_packages_content': dictionary.wide_range_packages_content
    };

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
        dictionary
    })

    // Verify the expected output matches BUG.md expected HTML
    expect(result).toContain('<h1>What is Node.js?</h1>');
    expect(result).toContain('<p>Node.js is a runtime environment that allows you to run JavaScript on the server side. It\'s built on Chrome\'s V8 JavaScript engine and it uses an event-driven, non-blocking I/O model which makes it lightweight and efficient.</p>');
    expect(result).toContain('<h2>Key Features:</h2>');

    // Specifically check whitespace preservation after </strong> tags - this is the BUG.md issue
    expect(result).toContain('<li><strong>Event-Driven Model:</strong> Node.js uses events to handle requests asynchronously, making it fast and scalable.</li>');
    expect(result).toContain('<li><strong>Single Threaded but Highly Concurrent:</strong> It can handle multiple connections simultaneously with a single thread, thanks to its non-blocking I/O operations.</li>');
    expect(result).toContain('<li><strong>Wide Range of Packages:</strong> With npm (Node Package Manager), you have access to millions of reusable packages to speed up development.</li>');

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
})