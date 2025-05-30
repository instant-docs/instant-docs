import { join, relative } from 'path';
import { __dir } from './get-current-dir-file.js';
import getJSFiles from './get-js-files.js';
import projectDir from './get-project-dir.js';
import { toImportPath } from './to-import-path.js';
import { emitter } from './events.js';

let plugins = null;

async function initPlugins() {
  if(plugins !== null) return;
  try {
    const srcDir = join(projectDir, 'src');
    const bePluginsDir = join(srcDir, 'plugins', 'backend');
    const files = getJSFiles(bePluginsDir);
    const scriptDir = __dir(import.meta);
    plugins = await Promise.all(
      files.map(async (file) => {
        const m = await import(toImportPath(relative(scriptDir, file)));
        return m.default;
      }),
    );
  } catch (e) {
    console.warn(`Couldn't read backend plugins\n\t${e.message}`);
    plugins = [];
  }
  emitter.emit('be-plugins-ready');
}

initPlugins();

export default function applyBePlugins({ html, meta, lang, dir }) {
  return plugins.reduce((acc, f) => f({ html: acc, meta, lang, dir }), html);
}
