import { markdownToHtml } from './helpers/index.js';

const markdown = `# %d%.title

%d%.intro_paragraph

## %d%.key_features_heading
- **%d%.event_driven_model_bullet** %d%.event_driven_model_content
- **%d%.single_threaded_bullet** %d%.single_threaded_content
- **%d%.wide_range_packages_bullet** %d%.wide_range_packages_content`;

console.log('=== MARKDOWN ===');
console.log(markdown);
console.log('\n=== HTML OUTPUT ===');
console.log(markdownToHtml(markdown));
